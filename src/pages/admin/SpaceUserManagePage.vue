<template>
  <a-form layout="inline" :model="formData" @finish="handleSubmit">
    <a-form-item label="用户 id" name="userId">
      <a-input v-model:value="formData.userId" placeholder="请输入用户 id" allow-clear />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit">添加用户</a-button>
    </a-form-item>
  </a-form>
  <a-table :columns="columns" :data-source="dataList">
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'userInfo'">
        <a-space>
          <a-avatar :src="record.user?.userAvatar" />
          {{ record.user?.userName }}
        </a-space>
      </template>
      <template v-if="column.dataIndex === 'spaceRole'">
        <a-select
          v-model:value="record.spaceRole"
          :disabled="record.spaceRole === SPACE_ROLE_ENUM.ADMIN"
          :options="SPACE_ROLE_OPTIONS"
          @change="(value: any) => editSpaceRole(value, record)"
        />
      </template>
      <template v-else-if="column.dataIndex === 'createTime'">
        {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template v-else-if="column.key === 'action'">
        <a-space wrap>
          <a-button :disabled="record.spaceRole === SPACE_ROLE_ENUM.ADMIN" type="link" danger @click="doDelete(record.id)">删除</a-button>
        </a-space>
      </template>
    </template>
  </a-table>

</template>

<script setup lang="ts">
import {
  addSpaceUserUsingPost,
  deleteSpaceUserUsingPost,
  editSpaceUserUsingPost,
  listSpaceUserUsingPost
} from '@/api/spaceUserController'
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { SPACE_ROLE_ENUM, SPACE_ROLE_OPTIONS } from '@/constants/space'

interface Props {
  id: string
}
const props = defineProps<Props>()

// 表格列
const columns = [
  {
    title: '用户',
    dataIndex: 'userInfo',
  },
  {
    title: '角色',
    dataIndex: 'spaceRole',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    key: 'action',
  },
]

// 数据
const dataList = ref<API.SpaceUserVO[]>([])

// 获取数据
const fetchData = async () => {
  const spaceId = props.id as any
  if (!spaceId) {
    return
  }
  const res = await listSpaceUserUsingPost({
    spaceId,
  })
  if (res.data.data) {
    dataList.value = res.data.data ?? []
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
}

// 页面加载时请求一次
onMounted(() => {
  fetchData()
})

// 添加成员表单
const formData = reactive<API.SpaceUserAddRequest>({})

// 创建成员
const handleSubmit = async () => {
  const spaceId = props.id as any
  if (!spaceId) {
    return
  }
  const res = await addSpaceUserUsingPost({
    spaceId,
    ...formData,
  })
  if (res.data.code === 0) {
    message.success('添加成功')
    // 刷新数据
    await fetchData()
  } else {
    message.error('添加失败，' + res.data.message)
  }
}

// 编辑成员角色
const editSpaceRole = async (value: any, record: any) => {
  const res = await editSpaceUserUsingPost({
    id: record.id,
    spaceRole: value,
  })
  if (res.data.code === 0) {
    message.success('修改成功')
  } else {
    message.error('修改失败，' + res.data.message)
  }
}

// 删除数据
const doDelete = async (id: any) => {
  if (!id) {
    return
  }
  const res = await deleteSpaceUserUsingPost({ id })
  if (res.data.code === 0) {
    message.success('删除成功')
    // 刷新数据
    await fetchData()
  } else {
    message.error('删除失败')
  }
}
</script>

<style scoped>

</style>
