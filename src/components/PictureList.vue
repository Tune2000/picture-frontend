<template>
  <div class="picture-list">
    <!-- 图片列表 -->
    <a-list
      :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 6 }"
      :data-source="dataList"
      :loading="loading"
    >
      <template #renderItem="{ item: picture }">
        <a-list-item style="padding: 0">
          <!-- 单张图片 -->
          <a-card hoverable @click="doClickPicture(picture)">
            <template #cover>
              <img
                :alt="picture.name"
                :src="picture.thumbnailUrl ?? picture.url"
                style="height: 180px; object-fit: cover"
              />
            </template>
            <a-card-meta :title="picture.name">
              <template #description>
                <a-flex>
                  <a-tag color="green">
                    {{ picture.category ?? '默认' }}
                  </a-tag>
                  <a-tag v-for="tag in picture.tags" :key="tag">
                    {{ tag }}
                  </a-tag>
                </a-flex>
              </template>
            </a-card-meta>
            <template v-if="showOp" #actions>
              <a-space @click="(e : any) => doEdit(picture, e)">
                <EditOutlined />
                编辑
              </a-space>
              <a-space @click="(e : any) => showDeleteConfirm(picture, e)">
                <DeleteOutlined />
                删除
              </a-space>
            </template>
          </a-card>
        </a-list-item>
      </template>
    </a-list>

    <!--删除-->
    <a-modal v-model:open="deleteVisible" title="用户删除" ok-text="确认" cancel-text="取消" @ok="doDelete">
      <p>是否确认删除？</p>
    </a-modal>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons-vue'
import { deletePictureUsingPost } from '@/api/pictureController'
import { message } from 'ant-design-vue'
import { ref } from 'vue'
interface Props {
  dataList?: API.PictureVO[]
  loading?: boolean
  showOp?: boolean
  onReload?: () => void
}
const props = withDefaults(defineProps<Props>(), {
  dataList: () => [],
  loading: false,
  showOp: false,
})
const router = useRouter()
// 跳转至图片详情页
const doClickPicture = (picture: API.PictureVO) => {
  router.push({
    path: `/picture/detail/${picture.id}`,
  })
}
// 编辑
const doEdit = (picture: API.PictureVO , e: MouseEvent) => {
  // 阻止冒泡，避免同时触发卡片点击事件
  e.stopPropagation()
  // 跳转时一定要携带 spaceId
  router.push({
    path: '/picture/edit_picture',
    query: {
      id: picture.id,
      spaceId: picture.spaceId,
    },
  })
}

// 删除数据弹出框
const deleteVisible = ref(false)
const deleteInfo = ref()
const showDeleteConfirm = (picture: API.PictureVO , e: MouseEvent) => {
  // 阻止冒泡，避免同时触发卡片点击事件
  e.stopPropagation()
  deleteVisible.value = true
  // 要删除的数据id
  deleteInfo.value = picture.id as any
}
// 删除数据
const doDelete = async () => {
  deleteVisible.value = false
  console.log(deleteInfo.value)
  const res = await deletePictureUsingPost({ id: deleteInfo.value})
  if (res.data.code === 0) {
    message.success('删除成功')
    props.onReload?.()
    deleteInfo.value = ''
  } else {
    message.error('删除失败')
  }
}
</script>
<style scoped></style>
