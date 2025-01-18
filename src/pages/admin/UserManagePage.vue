<template>
  <div id="userManagePage">
    <div class="search-add-box">
      <a-form layout="inline" :model="searchParams">
        <a-form-item>
          <a-input placeholder="请输入账号" v-model:value="searchParams.userAccount" />
        </a-form-item>
        <a-form-item>
          <a-input placeholder="请输入昵称" v-model:value="searchParams.userName" />
        </a-form-item>
        <a-form-item>
          <a-select
            ref="select"
            v-model:value="searchParams.gender"
            :style="{ minWidth: '70px' }"
            placeholder="性别"
          >
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="0">未知</a-select-option>
            <a-select-option value="1">男</a-select-option>
            <a-select-option value="2">女</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-select
            ref="select"
            v-model:value="searchParams.userStatus"
            :style="{ minWidth: '70px' }"
            placeholder="状态"
          >
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="0">正常</a-select-option>
            <a-select-option value="1">封禁</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-select
            ref="select"
            v-model:value="searchParams.userRole"
            :style="{ minWidth: '80px' }"
            placeholder="权限"
          >
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="user">普通用户</a-select-option>
            <a-select-option value="admin">管理员</a-select-option>
            <a-select-option value="root">超级管理员</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" @click="doSearch">搜索</a-button>
        </a-form-item>
      </a-form>
      <a-button type="default" html-type="submit" @click="showAddConfirm()">新增</a-button>
    </div>

    <!-- 表格 -->
    <a-table
      :columns="columns"
      :data-source="dataList"
      :scroll="{ x: 800 }"
      :pagination="pagination"
      @change="doTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'userAvatar'">
          <a-image :src="record.userAvatar " style="border-radius: 50%;" />
        </template>
        <template v-else-if="column.dataIndex === 'gender'">
          <div v-if="record.gender === 0">
            <a-tag color="gray">未知</a-tag>
          </div>
          <div v-else-if="record.gender === 1">
            <a-tag color="blue">男</a-tag>
          </div>
          <div v-else>
            <a-tag color="pink">女</a-tag>
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'userStatus'">
          <div v-if="record.userStatus === 0">
            <a-tag color="green">正常</a-tag>
          </div>
          <div v-else>
            <a-tag color="red">封禁</a-tag>
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'userRole'">
          <div v-if="record.userRole === 'root'">
            <a-tag color="red">超级管理员</a-tag>
          </div>
          <div v-else-if="record.userRole === 'admin'">
            <a-tag color="orange">管理员</a-tag>
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
            <a-button type="primary" @click="showEditConfirm(record)">修改</a-button>
            <a-button danger @click="showDeleteConfirm(record.id)">删除</a-button>
          </ASpace>
        </template>
      </template>
    </a-table>

    <!--新增弹出框-->
    <a-modal v-model:open="addVisible" title="用户新增" ok-text="确认" cancel-text="取消" @ok="doAdd">
      <a-form :model="addInfo" :rules="addRules" ref="addForm">
        <a-form-item :wrapperCols="{ span: 24 }" name="userAccount" label="账号">
          <a-input placeholder="账号" v-model:value="addInfo.userAccount" />
        </a-form-item>
        <a-form-item name="userPassword" label="密码">
          <a-input-password type="password" placeholder="密码" v-model:value="addInfo.userPassword" />
        </a-form-item>
        <a-form-item name="userName" label="昵称">
          <a-input placeholder="昵称" v-model:value="addInfo.userName" />
        </a-form-item>
        <a-form-item name="userProfile" label="简介">
          <a-input placeholder="简介" v-model:value="addInfo.userProfile" />
        </a-form-item>
        <a-form-item name="gender" label="性别">
          <a-radio-group v-model:value="addInfo.gender">
            <a-radio value="0">未知</a-radio>
            <a-radio value="1">男</a-radio>
            <a-radio value="2">女</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item name="phone" label="电话">
          <a-input placeholder="电话" v-model:value="addInfo.phone" />
        </a-form-item>
        <a-form-item name="email" label="邮箱">
          <a-input placeholder="邮箱" v-model:value="addInfo.email" />
        </a-form-item>
        <a-form-item name="userRole" label="权限" >
          <a-radio-group v-model:value="addInfo.userRole" :disabled="!roleAddAuthCheck">
            <a-radio value="user">普通用户</a-radio>
            <a-radio value="admin">管理员</a-radio>
            <a-radio value="root">超级管理员</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>

    <!--修改弹出框-->
    <a-modal v-model:open="editVisible" :title="`修改用户：${editTitle} 信息`" ok-text="确认" cancel-text="取消" @ok="doEdit">
      <a-form :model="editInfo" :rules="editRules">
        <a-form-item label="用户昵称" name="userName" v-model:value="editInfo.userName">
          <a-input placeholder="请输入用户昵称" />
        </a-form-item>
        <a-form-item label="用户头像" name="userAvatar" v-model:value="editInfo.userAvatar">
              <a-upload
                :showUploadList="false"
                :beforeUpload="beforeUpload"
                :customRequest="handleUpload"
              >
                <ASpace>
                  <a-avatar :src="editInfo.userAvatar" />
                  <UploadOutlined />
                  <div v-if="!editInfo.userAvatar">
                    点击上传头像
                  </div>
                </ASpace>
              </a-upload>
        </a-form-item>
        <a-form-item label="用户简介" name="userProfile" v-model:value="editInfo.userProfile">
          <a-input placeholder="请输入用户简介" />
        </a-form-item>
        <a-form-item label="用户性别" name="gender" v-model:value="editInfo.gender">
            <a-radio-group v-model:value="editInfo.gender">
              <a-radio :value="0">未知</a-radio>
              <a-radio :value="1">男</a-radio>
              <a-radio :value="2">女</a-radio>
            </a-radio-group>
        </a-form-item>
          <a-form-item name="phone" label="电话">
            <a-input placeholder="电话" v-model:value="editInfo.phone" />
          </a-form-item>
          <a-form-item name="email" label="邮箱">
            <a-input placeholder="邮箱" v-model:value="editInfo.email" />
          </a-form-item>
          <a-form-item name="userStatus" label="状态">
            <a-radio-group v-model:value="editInfo.userStatus">
              <a-radio :value="0">正常</a-radio>
              <a-radio :value="1">封禁</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item name="userRole" label="权限" >
            <a-radio-group v-model:value="editInfo.userRole" :disabled="!roleChangeAuthCheck">
              <a-radio value="user">普通用户</a-radio>
              <a-radio value="admin">管理员</a-radio>
              <a-radio value="root">超级管理员</a-radio>
            </a-radio-group>
          </a-form-item>
      </a-form>
    </a-modal>

    <!--删除-->
    <a-modal v-model:open="deleteVisible" title="用户删除" ok-text="确认" cancel-text="取消" @ok="doDelete">
      <p>是否确认删除？</p>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import {
  addUserUsingPost,
  deleteUserUsingPost,
  listUserVoByPageUsingPost, updateUserUsingPost
} from '@/api/userController'
import { message } from 'ant-design-vue'
import { UploadOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import type { Rule } from 'ant-design-vue/es/form'
import { uploadAvatarUsingPost } from '@/api/pictureController'
import { useLoginUserStore } from '@/stores/useLoginUserStore'

//获取当前登录用户的角色
const loginUserStore = useLoginUserStore()
const loginUser = loginUserStore.loginUser

const editRules: Record<string, Rule[]> = {
  userName: [
    { min: 2, max: 16, message: '昵称长度应在 2 到 16 个字符之间', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9\u4e00-\u9fa5@#$%^&+=.]+$/,
      message: '昵称只能包含大小写字母、数字、中文和某些特殊字符：@#$%^&+=.',
      trigger: 'blur'
    }
  ],
  userProfile: [
    { max: 50, message: '用户简介长度不能超过 50 个字符', trigger: 'blur' }
  ],
  userRole: [
    { pattern: /^(user|admin|root)$/, message: '用户角色必须是指定角色之一', trigger: 'blur' }
  ],
  gender: [
    { pattern: /^([012])$/, message: '性别必须在指定范围之间', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^\d{11}$/, message: '电话号码格式不正确，应为 11 位数字', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  userStatus: [
    { pattern: /^([01])$/, message: '状态必须在指定范围之间', trigger: 'blur' }
  ]
}

// 解构赋值简化重复代码
const addRules: Record<string, Rule[]> = {
  ...editRules,
  userAccount: [
    { min: 2, max: 16, message: '账号长度应在2到16个字符之间', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9\u4e00-\u9fa5@#$%^&+=.]+$/,
      message: '账号只能包含大小写字母、数字、中文或特殊字符@#$%^&+=.',
      trigger: 'blur'
    }
  ],
  userPassword: [
    { min: 8, max: 16, message: '密码长度应在8到16个字符之间', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9@#$%^&+=.]+$/,
      message: '密码只能包含大小写字母、数字和特殊字符@#$%^&+=.',
      trigger: 'blur'
    }
  ]
};

const columns = [
  {
    title: '用户账号',
    dataIndex: 'userAccount',
    width: 120,
    align: 'center',
    ellipsis: true
  },
  {
    title: '用户昵称',
    dataIndex: 'userName',
    width: 120,
    align: 'center',
    ellipsis: true
  },
  {
    title: '头像',
    dataIndex: 'userAvatar',
    width: 45,
    height: 45,
    align: 'center'
  },
  {
    title: '简介',
    dataIndex: 'userProfile',
    width: 120,
    align: 'center',
    ellipsis: true
  },
  {
    title: '用户角色',
    dataIndex: 'userRole',
    width: 80,
    align: 'center'
  },
  {
    title: '性别',
    dataIndex: 'gender',
    width: 80,
    align: 'center'
  },
  {
    title: '电话',
    dataIndex: 'phone',
    width: 100,
    align: 'center'
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    width: 100,
    align: 'center'
  },
  {
    title: '状态',
    dataIndex: 'userStatus',
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
  }
]
const dataList = ref<any>([])
const total = ref(0)
// 分页参数
const pagination = computed(() => {
  return {
    current: searchParams.current ?? 1,
    pageSize: searchParams.pageSize ?? 10,
    total: total.value,
    showSizeChanger: true,
    showTotal: (total: number) => `共 ${total} 条`
  }
})
// 表格变化处理
const doTableChange = (page: any) => {
  searchParams.current = page.current
  searchParams.pageSize = page.pageSize
  fetchData()
}

// ---------获取数据--------
const doSearch = () => {
  // 重置页码
  searchParams.current = 1
  fetchData()
}

// 搜索条件
const searchParams = reactive<API.UserQueryRequest>({
  current: 1,
  pageSize: 10
})
// 获取数据
const fetchData = async () => {
  const res = await listUserVoByPageUsingPost({
    ...searchParams
  })
  if (res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = Number(res.data.data.total) ?? 0
    // 浏览器报类型不匹配警告。判断res.data.data.total 的类型
    // console.log(Object.prototype.toString.call(res.data.data.total));
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
}

// 页面加载时获取数据，请求一次
onMounted(() => {
  fetchData()
})

// ---------新增数据--------
const addVisible = ref(false)
const roleAddAuthCheck = ref(false)
const showAddConfirm = () => {
  addVisible.value = true;
  roleAddAuthCheck.value = loginUser.userRole === 'root';
}
const addInfo = ref<API.UserAddRequest>({
  userRole: 'user'
});
const doAdd = async () => {
  const res = await addUserUsingPost(addInfo.value)
  if (res.data.code === 0) {
    message.success('新增成功')
    addVisible.value = false
    await fetchData()
  } else {
    message.error('新增失败')
  }
}

const addForm = ref<any>(null);
watch(addVisible, (newVal) => {
  if (!newVal) {
    nextTick(() => {
      if (addForm.value) {
        addForm.value.resetFields();
      }
    });
  }
});

// ---------修改数据--------
const editVisible = ref(false)
const editTitle = ref('')
const editInfo = ref<API.UserUpdateRequest>({})
// 控制非超管无权限修改角色项
const roleChangeAuthCheck = ref(false)

const showEditConfirm = (record: any) => {
  // 超管和普通管理员角色的相关权限校验
  if (loginUser.userRole === 'admin' && record.userRole !== 'user') {
    message.error('您无权限操作该用户')
    return
  }
  record.userRole === 'root'? roleChangeAuthCheck.value = true : roleChangeAuthCheck.value = false

  editVisible.value = true
  // 只复制 API.UserUpdateRequest 类型所需的属性
  const { userAccount, id, userName, userAvatar, userProfile, gender, phone, email, userStatus, userRole } = record
  editTitle.value = userAccount
  editInfo.value = { id, userName, userAvatar, userProfile, gender, phone, email, userStatus, userRole }
}
const doEdit = async () => {
  editVisible.value = false
    // 待传入参数
    const res = await updateUserUsingPost(editInfo.value)
    if (res.data.code === 0) {
      message.success('修改成功')
      await fetchData()
    } else {
      message.error('修改失败，' + res.data.message)
    }
}

// 头像上传与检验
const beforeUpload = (file: any) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('只能上传 JPG/PNG 文件');
    return false;
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片大小不能超过 2MB');
    return false;
  }
  return true;
};

const handleUpload = async (options: any) => {
  try {
    const file = options.file;
    const res = await uploadAvatarUsingPost({},file);
    const data = res.data as any;
    if (data.code === 0) {
      editInfo.value.userAvatar = "/api" + data.data.avatarUrl;
      message.success('头像上传成功');
    } else {
      message.error('头像上传失败');
    }
  } catch (error) {
    message.error('头像上传出现错误，请稍后重试');
  }
};

// ---------删除数据-------
const deleteVisible = ref(false)
const deleteInfo = ref('')
const showDeleteConfirm = (id: any) => {
  deleteVisible.value = true
  // 要删除的数据id
  deleteInfo.value = id
}
// 删除弹框点击确认删除
const doDelete = async () => {
  deleteVisible.value = false

  const res = await deleteUserUsingPost({ id: deleteInfo.value as any  })
  if (res.data.code === 0) {
    message.success('删除成功')
    await fetchData()
  } else {
    message.error('删除失败，' + res.data.message)
  }
}
</script>

<style scoped>
.search-add-box {
  display: flex;
  align-items: center;
  margin-bottom: 8px
 }
</style>
