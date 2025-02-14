<template>
  <div id="editPicturePage">
    <h2 class="title">
      修改图片信息
    </h2>
    <img :src="picture.url" class="editImg" alt="avatar"/>
    <a-form layout="vertical" :model="pictureForm" @finish="handleSubmit">
      <a-form-item label="名称" name="name">
        <a-input v-model:value="pictureForm.name" placeholder="请输入名称" />
      </a-form-item>
      <a-form-item label="简介" name="introduction">
        <a-textarea
          v-model:value="pictureForm.introduction"
          placeholder="请输入简介"
          :rows="2"
          autoSize

        />
      </a-form-item>
      <a-form-item label="分类" name="category">
        <a-auto-complete
          v-model:value="pictureForm.category"
          :options="categoryOptions"
          placeholder="请输入分类"

        />
      </a-form-item>
      <a-form-item label="标签" name="tags">
        <a-select
          v-model:value="pictureForm.tags"
          :options="tagOptions"
          mode="tags"
          placeholder="请输入标签"

        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%">修改</a-button>
      </a-form-item>
    </a-form>
  </div>

</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import { editPictureUsingPost, getPictureVoByIdUsingGet, listPictureTagCategoryUsingGet } from '@/api/pictureController'

const picture = ref<API.PictureVO>({})
const pictureForm = reactive<API.PictureEditRequest>({})

const router = useRouter()
/**
 * 提交表单
 * @param values
 */
const handleSubmit = async (values: any) => {
  const pictureId = picture.value?.id
  if (!pictureId) {
    return
  }
  // 修改图片相关信息
  const res = await editPictureUsingPost({
    id: pictureId,
    ...values,
  })
  if (res.data.code === 0 && res.data.data) {
    message.success('修改成功')
    // 跳转到图片详情页
    await router.push({
      path: `/picture/detail/${pictureId}`,
    })
  } else {
    message.error('修改失败，' + res.data.message)
  }
}

const categoryOptions = ref<string[]>([])
const tagOptions = ref<string[]>([])

const getTagCategoryOptions = async () => {
  const res = await listPictureTagCategoryUsingGet()
  console.log(res.data)
  if (res.data.code === 0 && res.data.data) {
    // 转换成下拉选项组件接受的格式
    // a-select 或 a-auto-complete 等下拉选择组件时，它们需要接收一个数组作为选项，该数组中的元素通常是对象，且每个对象包含 value 和 label 属性
    tagOptions.value = (res.data.data.tagList ?? []).map((data: string) => {
      return {
        value: data,
        label: data,
      }
    }) as any
    categoryOptions.value = (res.data.data.categoryList ?? []).map((data: string) => {
      return {
        value: data,
        label: data,
      }
    }) as any
  } else {
    message.error('加载选项失败，' + res.data.message)
  }
}

onMounted(() => {
  getTagCategoryOptions()
})

const route = useRoute()
// 获取数据
const getOldPicture = async () => {
  // 获取到 id
  const id = route.query?.id as any
  if (id) {
    const res = await getPictureVoByIdUsingGet({ id })
    if (res.data.code === 0 && res.data.data) {
      const data = res.data.data
      picture.value = data
      pictureForm.name = data.name
      pictureForm.introduction = data.introduction
      pictureForm.category = data.category
      pictureForm.tags = data.tags
    } else {
      message.error('获取图片失败，' + res.data.message);
    }
  }
}
onMounted(() => {
  getOldPicture()
})

</script>

<style scoped>
#editPicturePage {
  max-width: 720px;
  margin: 0 auto;
}

.title {
  margin: 0 auto 16px;
  padding: 10px 15px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
  font-size: 20px;
  font-weight: 200;
  color: #24292e;
  background-color: #f6f8fa;
  border: 1px solid #eaecef;
  border-radius: 6px;
}

.editImg {
  max-width: 100%;
  max-height: 250px;
  margin: 0 auto;
  display: block;
}
</style>
