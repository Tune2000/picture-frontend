<template>
  <div id="userInfoPage">
    <div class="user-profile">
      <a-card :bordered="false">
        <a-row type="flex" justify="space-between">
          <a-col :span="7" :offset="3">
            <a-avatar :size="150" :src="userInfo.userAvatar" />
          </a-col>
          <a-col :span="14">
            <div class="user-name">{{ userInfo.userName || '未命名'}}</div>
            <div class="user-intro">{{ userInfo.userProfile || '暂无个人简介' }}</div>
            <div class="user-gender">
              <a-space v-if="userInfo.gender === '1'">
                <ManOutlined style="color: cornflowerblue"/>
                <span>男</span>
              </a-space>
              <a-space v-else-if="userInfo.gender === '2'">
                <WomanOutlined style="color: pink"/>
                <span>女</span>
              </a-space>
              <a-space v-else>
                <QuestionOutlined style="color: orange"/>
                <span>未知</span>
              </a-space>
            </div>
            <div class="user-phone">
              手机号：{{ userInfo.phone || '暂未填写手机号'  }}
            </div>
            <div class="user-email">
              邮箱：{{ userInfo.email || '暂未填写邮箱'}}
            </div>
          </a-col>
        </a-row>
        <a-divider dashed />
        <a-row type="flex" justify="end">
          <a-button type="primary" @click="editProfile">修改资料</a-button>
        </a-row>
      </a-card>
    </div>
    <a-modal v-model:open="editModalInfo.open" title="用户修改" ok-text="确认" cancel-text="取消" @ok="doEdit">
      <a-form :model="editFormInfo" :rules="editRules">
        <a-form-item :wrapperCols="{ span: 24 }" name="userName" label="昵称">
          <a-input placeholder="昵称" v-model:value="editFormInfo.userName" />
        </a-form-item>
        <a-form-item name="userAvatar" label="头像">
          <a-upload
            :showUploadList="false"
            :beforeUpload="beforeUpload"
            :customRequest="handleUpload"
          >
            <ASpace>
              <a-avatar :src="editFormInfo.userAvatar" />
              <div v-if="!editFormInfo.userAvatar">
                <UploadOutlined /> 上传头像
              </div>
            </ASpace>
          </a-upload>
        </a-form-item>
        <a-form-item name="userProfile" label="简介">
          <a-input placeholder="简介" v-model:value="editFormInfo.userProfile" />
        </a-form-item>
        <a-form-item name="gender" label="性别">
          <a-radio-group v-model:value="editFormInfo.gender">
            <a-radio value="0">未知</a-radio>
            <a-radio value="1">男</a-radio>
            <a-radio value="2">女</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item name="phone" label="电话">
          <a-input placeholder="电话" v-model:value="editFormInfo.phone" />
        </a-form-item>
        <a-form-item name="email" label="邮箱">
          <a-input placeholder="邮箱" v-model:value="editFormInfo.email" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>

</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { ManOutlined, UploadOutlined, WomanOutlined, QuestionOutlined } from '@ant-design/icons-vue'
import { getLoginUserInfoVoByIdUsingGet, updateLoginUserInfoUsingPost } from '@/api/userController'
import { useLoginUserStore } from '@/stores/useLoginUserStore';
import { message } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import { uploadAvatarUsingPost } from '@/api/pictureController'

const loginUserStore = useLoginUserStore();
const id = ref('');
id.value = loginUserStore.loginUser.id as any;


// 用户信息
const userInfo = reactive({
  userName: '',
  userAvatar: '',
  userProfile:'',
  gender: '',
  phone: '',
  email: ''
});
// 修改用户信息显示
const editFormInfo = reactive({...userInfo });

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const res = await getLoginUserInfoVoByIdUsingGet({ id: id.value as any });
    console.log(res)
    if (res.data.data) {
      const { userName, userAvatar, userProfile, gender, phone, email } = res.data.data;
      userInfo.userName = userName as string;
      userInfo.userAvatar = userAvatar as string;
      userInfo.userProfile = userProfile as string;
      userInfo.gender = gender?.toString() || '';
      userInfo.phone = phone as string;
      userInfo.email = email as string;
      // 更新 editFormInfo
      Object.assign(editFormInfo, userInfo);
    }
  } catch (error) {
    message.error('获取用户信息失败');
  }
};

// 修改用户信息
const editModalInfo = reactive({
  open: false
})
const editProfile = () => {
  editModalInfo.open = true;
}

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
  gender: [
    { pattern: /^([012])$/, message: '性别必须在指定范围之间', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^\d{11}$/, message: '电话号码格式不正确，应为 11 位数字', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ]
}

// 头像提交校验和上传
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
      editFormInfo.userAvatar = data.data.avatarUrl;
      message.success('头像上传成功');
    } else {
      message.error('头像上传失败');
    }
  } catch (error) {
    message.error('头像上传出现错误，请稍后重试');
  }
};

const doEdit = async () => {
  editModalInfo.open = false
  // 构造请求参数，根据UserUpdateRequest类型要求
  const userUpdateByLoginUserRequest: API.UserUpdateRequest = {
    id: loginUserStore.loginUser.id as any,
    userAvatar: editFormInfo.userAvatar,
    userName: editFormInfo.userName,
    userProfile: editFormInfo.userProfile,
    gender: editFormInfo.gender as any,
    phone: editFormInfo.phone,
    email: editFormInfo.email,
  }
  try {
    const res = await updateLoginUserInfoUsingPost(userUpdateByLoginUserRequest)
    if (res.data.code === 0) {
      message.success('修改成功')
      await fetchUserInfo()
      await loginUserStore.fetchLoginUser()
    } else {
      message.error('修改失败，' + res.data.message)
    }
  } catch (error) {
    message.error('修改用户信息出现错误，请稍后重试')
  }
}


// 页面挂载时获取用户信息
onMounted(() => {
  fetchUserInfo();
});
</script>

<style scoped>
#userInfoPage {
  width: 60%;
  height: 100vh;
  margin: 0 auto;
}
.user-profile {
  padding: 20px;
}
.user-name {
  font-size: 24px;
  font-weight: bold;
  font-family: Arial, sans-serif;
  color: #333;
  margin-bottom: 25px;
}
.user-intro {
  margin-top: 10px;
  color: #666;
  margin-bottom: 20px;
}
.user-gender{
  margin-bottom: 20px;
  color: #666;
}
.user-email{
  margin-bottom: 20px;
  color: #666;
}
.user-phone{
  margin-bottom: 20px;
  color: #666;
}
</style>
