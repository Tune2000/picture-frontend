<template>
  <div id="userManagePage">
    <a-form layout="inline" :model="searchParams" @finish="doSearch">
      <a-form-item
        :rules="[
            { max: 16, message: '查找账号过长' },
          ]"
      >
        <a-input placeholder="请输入账号" v-model:value="searchParams.userAccount" />
      </a-form-item>
      <a-form-item
        :rules="[
            { max: 16, message: '查找昵称过长' },
          ]"
      >
        <a-input placeholder="请输入昵称" v-model:value="searchParams.userName" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">搜索</a-button>
      </a-form-item>
    </a-form>
    <!-- 表格 -->
    <a-table
      :columns="columns"
      :data-source="dataList"
      :pagination="pagination"
      @change="doTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'userAvatar'">
          <a-image :src="record.userAvatar " style="border-radius: 50%;"/>
        </template>
        <template v-else-if="column.dataIndex === 'userRole'">
          <div v-if="record.userRole === 'admin'">
            <a-tag color="green">管理员</a-tag>
          </div>
          <div v-else>
            <a-tag color="blue">普通用户</a-tag>
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'createTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.dataIndex === 'updateTime'">
          {{ dayjs(record.updateTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.key === 'action'">
          <ASpace>
          <a-button type="primary" @click="showEditConfirm(record.id)">修改</a-button>
          <a-button danger @click="showDeleteConfirm(record.id)">删除</a-button>
          </ASpace>
        </template>
      </template>
    </a-table>

    <a-modal v-model:open="editModalInfo.open" title="用户修改" ok-text="确认" cancel-text="取消" @ok="doEdit">
      <a-form :model="editFormInfo">
        <a-form-item :wrapperCols="{ span: 24 }" name="userName" label="昵称">
          <a-input placeholder="昵称" v-model:value="editFormInfo.userName" />
        </a-form-item>
        <a-form-item name="userAvatar" label="头像">
          <!--todo 后期改成上传头像 -->
          <a-input placeholder="头像链接" v-model:value="editFormInfo.userAvatar"/>
        </a-form-item >
        <a-form-item name="userProfile"  label="简介">
          <a-input placeholder="简介" v-model:value="editFormInfo.userProfile" />
        </a-form-item>
        <a-form-item name="userRole" label="权限">
          <a-radio-group v-model:value="editFormInfo.userRole">
            <a-radio value="user">普通用户</a-radio>
            <a-radio value="admin">管理员</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal v-model:open="deleteModalInfo.open" title="用户删除" ok-text="确认" cancel-text="取消" @ok="doDelete">
      <p>是否确认删除？</p>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import {
  deleteUserUsingPost,
  getUserByIdUsingGet,
  listUserVoByPageUsingPost,
  updateUserUsingPost
} from '@/api/userController'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
const columns = [
  {
    title: '用户账号',
    dataIndex: 'userAccount',
    width: 120,
    align: 'center'
  },
  {
    title: '用户昵称',
    dataIndex: 'userName',
    width: 120,
    align: 'center'
  },
  {
    title: '头像',
    dataIndex: 'userAvatar',
    width: 45,
    height: 45,
    align: 'center',
  },
  {
    title: '简介',
    dataIndex: 'userProfile',
    width: 120,
    align: 'center'
  },
  {
    title: '用户角色',
    dataIndex: 'userRole',
    width: 80,
    align: 'center'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 100,
    align: 'center'
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    width: 100,
    align: 'center'
  },
  {
    title: '操作',
    key: 'action',
    width: 120,
    align: 'center'
  },
]

const dataList = ref<any>([])
const total = ref(0)
// 分页参数
const pagination = computed(() => {
  return {
    current: searchParams.current ?? 1,
    pageSize: searchParams.pageSize ?? 10,
    total: total.value,
    showSizeChanger:true,
    showTotal: (total:number) => `共 ${total} 条`,
  }
})
// 表格变化处理
const doTableChange = (page: any) => {
  searchParams.current = page.current
  searchParams.pageSize = page.pageSize
  fetchData()
}

// 获取数据
const doSearch = () => {
  // 重置页码
  searchParams.current = 1
  fetchData()
}

// 搜索条件
const searchParams = reactive<API.UserQueryRequest>( {
  current: 1,
  pageSize: 10,
})
// 获取数据
const fetchData = async () => {
  const res = await listUserVoByPageUsingPost({
    ...searchParams
  })
  console.log(res);
  if (res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = Number(res.data.data.total) ?? 0
    // 浏览器报类型不匹配警告。判断res.data.data.total 的类型
    // console.log(Object.prototype.toString.call(res.data.data.total));
  }else {
    message.error('获取数据失败，' + res.data.message)
  }
}

// 页面加载时获取数据，请求一次
onMounted(() => {
  fetchData()
})

// 定义editFormInfo为响应式对象，用于存储修改表单数据
const editFormInfo = reactive({
  userAccount: '',
  userName: '',
  userAvatar: '',
  userProfile: '',
  userRole: '',
});
// 获取修改操作对应当前id的用户信息
const fetchUserInfo = async (id: number) => {
  const res = await getUserByIdUsingGet({ id })
  if (res.data.data) {
    // 将获取到的用户信息赋值给editFormInfo，用于填充表单
    editFormInfo.userAccount = res.data.data.userAccount as any;
    editFormInfo.userName = res.data.data.userName as any;
    editFormInfo.userAvatar = res.data.data.userAvatar as any;
    editFormInfo.userProfile = res.data.data.userProfile as any;
    editFormInfo.userRole = res.data.data.userRole as any;
  }
}
// 修改数据
// 存储删除提示框相关信息的响应式对象
const editModalInfo = reactive({
  open: false,
  userId: ''
});
const showEditConfirm = (id: string) => {
  editModalInfo.open = true;
  editModalInfo.userId= id
  const idAny = editModalInfo.userId as any
  fetchUserInfo(idAny)
}
const doEdit = async () => {
  editModalInfo.open = false;
  const id = editModalInfo.userId as any;
  if (!id) {
    message.error('无效的用户 ID');
    return;
  }
  // 构造请求参数，根据UserUpdateRequest类型要求
  const updateUserRequest: API.UserUpdateRequest = {
    id: id,
    userAvatar: editFormInfo.userAvatar,
    userName: editFormInfo.userName,
    userProfile: editFormInfo.userProfile,
    userRole: editFormInfo.userRole,
  };
  try {
    const res = await updateUserUsingPost(updateUserRequest);
    if (res.data.code === 0) {
      message.success('修改成功');
      await fetchData();
      console.log()
    } else {
      message.error('修改失败，' + res.data.message);
    }
  } catch (error) {
    message.error('修改用户信息出现错误，请稍后重试');
  }
}

// 删除数据
// 存储删除提示框相关信息的响应式对象
const deleteModalInfo = reactive({
  open: false,
  userId: ''
});
const showDeleteConfirm = (id: string) => {
  deleteModalInfo.open = true;
  deleteModalInfo.userId = id;
}
// 删除弹框点击确认删除
const doDelete = async () => {
  deleteModalInfo.open = false;
  const id = deleteModalInfo.userId as any;
  if (!id) {
    message.error('无效的用户ID');
    return;
  }
  const res = await deleteUserUsingPost({ id })
  if (res.data.code === 0) {
    message.success('删除成功')
    await fetchData()
  } else {
    message.error('删除失败，' + res.data.message)
  }
}
</script>

