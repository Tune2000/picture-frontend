<template>
  <div id="pictureManagePage">
    <a-flex justify="space-between">
      <h2>图片管理</h2>
      <a-space style="margin-right: 15px">
        <a-button type="primary" href="/picture/add_picture" target="_blank">+ 创建图片</a-button>
        <a-button type="primary" href="/picture/add_picture/batch" target="_blank" ghost>+ 批量创建图片</a-button>
      </a-space>
    </a-flex>
    <div style="margin-bottom: 16px" />
    <!-- 搜索表单 -->
    <a-form layout="inline" :model="searchParams" @finish="doSearch">
      <a-form-item label="关键词">
        <a-input
          v-model:value="searchParams.searchText"
          placeholder="从名称和简介搜索"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="类型">
        <a-select
          ref="select"
          v-model:value="searchParams.category"
          :style="{ minWidth: '70px' }"
          placeholder="分类"
        >
          <a-select-option value="">全部</a-select-option>
          <a-select-option v-for="category in categoryList" :key="category"></a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="标签">
        <a-select
          ref="select"
          v-model:value="searchParams.tags"
          :style="{ minWidth: '70px' }"
          placeholder="标签"
          mode="tags"
        >
          <a-select-option v-for="tag in tagList" :key="tag"></a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="审核状态" name="reviewStatus">
        <a-select
          v-model:value="searchParams.reviewStatus"
          :options="PIC_REVIEW_STATUS_OPTIONS"
          placeholder="请输入审核状态"
          style="min-width: 180px"
          allow-clear
        />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit">搜索</a-button>
      </a-form-item>
    </a-form>
    <div style="margin-bottom: 16px" />
    <!-- 表格 -->
    <a-table
      :columns="columns"
      :data-source="dataList"
      :pagination="pagination"
      @change="doTableChange"
      :scroll="{ x: 700 }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'url'">
          <a-image :src="record.url"/>
        </template>
        <template v-if="column.dataIndex === 'tags'">
          <a-space wrap>
            <a-tag v-for="tag in JSON.parse(record.tags || '[]')" :key="tag">
              {{ tag }}
            </a-tag>
          </a-space>
        </template>
        <template v-if="column.dataIndex === 'picInfo'">
          <div>格式：{{ record.picFormat }}</div>
          <div>宽度：{{ record.picWidth }}</div>
          <div>高度：{{ record.picHeight }}</div>
          <div>宽高比：{{ record.picScale }}</div>
          <div>大小：{{ (record.picSize / 1024).toFixed(2) }}KB</div>
        </template>
        <!-- 审核信息 -->
        <template v-if="column.dataIndex === 'reviewMessage'">
          <a-space>
            <div>审核状态：</div>
            <div v-if="record.reviewStatus === 0">
              <a-tag color="blue">待审核</a-tag>
            </div>
            <div v-else-if="record.reviewStatus === 1">
              <a-tag color="green">通过</a-tag>
            </div>
            <div v-else>
              <a-tag color="red">拒绝</a-tag>
            </div>
          </a-space>
          <div>审核信息：{{ record.reviewMessage }}</div>
          <div>审核人：{{ record.reviewerId }}</div>
        </template>

        <template v-if="column.dataIndex === 'createTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-if="column.dataIndex === 'editTime'">
          {{ dayjs(record.editTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space :size= '2'>
            <a-button
              v-if="record.reviewStatus !== PIC_REVIEW_STATUS_ENUM.PASS"
              type="link"
              @click="handleReview(record, PIC_REVIEW_STATUS_ENUM.PASS)"
            >
              审核通过
            </a-button>
            <a-button
              v-if="record.reviewStatus !== PIC_REVIEW_STATUS_ENUM.REJECT"
              type="link"
              danger
              @click="handleReview(record, PIC_REVIEW_STATUS_ENUM.REJECT)"
            >
              拒绝
            </a-button>
            <a-button type="primary" @click="doEdit(record.id)">
              编辑
            </a-button>
            <a-button danger @click="doDelete(record.id)">删除</a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import {
  deletePictureUsingPost,
  doPictureReviewUsingPost,
  listPictureByPageUsingPost,
  listPictureTagCategoryUsingGet
} from '@/api/pictureController'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import router from '@/router'
import { PIC_REVIEW_STATUS_ENUM, PIC_REVIEW_STATUS_MAP, PIC_REVIEW_STATUS_OPTIONS } from '@/constants/picture'

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    width: 120,
    align: 'center',
    ellipsis: true
  },
  {
    title: '图片',
    dataIndex: 'url',
    width: 100,
    height: 100,
    align: 'center'
  },
  {
    title: '名称',
    dataIndex: 'name',
    width: 120,
    align: 'center',
    ellipsis: true
  },
  {
    title: '简介',
    dataIndex: 'introduction',
    align: 'center',
    ellipsis: true,
  },
  {
    title: '类型',
    dataIndex: 'category',
    width: 120,
    height: 120,
    align: 'center'
  },
  {
    title: '标签',
    dataIndex: 'tags',
    align: 'center'
  },
  {
    title: '图片信息',
    dataIndex: 'picInfo',
    align: 'center',
    width: 120,
    height: 120,
  },
  {
    title: '用户 id',
    dataIndex: 'userId',
    width: 120,
    align: 'center',
    ellipsis: true
  },
  {
    title: '审核信息',
    dataIndex: 'reviewMessage',
    align: 'center',
    ellipsis: true
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    align: 'center'
  },
  {
    title: '编辑时间',
    dataIndex: 'editTime',
    align: 'center'
  },
  {
    title: '操作',
    key: 'action',
    width: 300,
    align: 'center',
  }
]
// 定义数据
const dataList = ref<API.Picture[]>([])
const total = ref(0)
// 搜索条件
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: 'createTime',
  sortOrder: 'descend'
})
// 获取数据
const fetchData = async () => {
  const res = await listPictureByPageUsingPost({
    ...searchParams
  })
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = Number(res.data.data.total) ?? 0
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
}
// 页面加载时获取数据，请求一次
onMounted(() => {
  fetchData()
})
// 分页参数
const pagination = computed(() => {
  return {
    current: searchParams.current,
    pageSize: searchParams.pageSize,
    total: total.value,
    showSizeChanger: true,
    showTotal: (total: number) => `共 ${total} 条`
  }
})

// 获取分类/标签数据
const categoryList = ref<string[]>([])
const tagList = ref<string[]>([])

const getTagCategoryOptions  = async () => {
  const res = await listPictureTagCategoryUsingGet()
  console.log(res)
  if (res.data.code === 0 && res.data.data) {
    categoryList.value = res.data.data.categoryList ?? []
    tagList.value = res.data.data.tagList ?? []
  } else {
    message.error('加载分类失败，' + res.data.message)
  }
}
onMounted(() => {
  getTagCategoryOptions()
})

// 表格变化之后，重新获取数据
const doTableChange = (page: any) => {
  searchParams.current = page.current
  searchParams.pageSize = page.pageSize
  fetchData()
}
// 搜索数据
const doSearch = () => {
  // 重置页码
  searchParams.current = 1
  fetchData()
}

const handleReview = async (record: API.Picture, reviewStatus: number) => {
  const reviewMessage = reviewStatus === PIC_REVIEW_STATUS_ENUM.PASS ? '审核通过' : '审核拒绝'
  const res = await doPictureReviewUsingPost({
    id: record.id,
    reviewStatus,
    reviewMessage,
  })
  if (res.data.code === 0) {
    message.success('审核操作成功')
    // 重新获取列表
    fetchData()
  } else {
    message.error('审核操作失败，' + res.data.message)
  }
}

// 修改图片及关联数据
const doEdit = (id: number) => {
  router.push('/picture/edit_picture?id=' + id )
}
// 删除图片及关联数据
const doDelete = async (id: any) => {
  if (!id) {
    return
  }
  const res = await deletePictureUsingPost({ id })
  if (res.data.code === 0) {
    message.success('删除成功')
    // 刷新数据
    await fetchData()
  } else {
    message.error('删除失败')
  }
}
</script>
