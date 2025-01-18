<template>
  <div id="outer-container">
    <div id="userRegisterPage">
      <h2 class="title">智能云图库 - 注册</h2>
      <div class="desc"> 智能协同云图库平台</div>

      <a-form
        :model="formState"
        name="basic"
        autocomplete="off"
        @finish="handleSubmit"
      >
        <a-form-item
          name="userAccount"
          :rules="[
            { required: true, message: '请输入账号' },
            { min: 4, message: '账号不能小于 2 位' },
            { max: 16, message: '账号不能大于 16 位' },
          ]"
        >
          <a-input v-model:value="formState.userAccount" placeholder="请输入账号" />
        </a-form-item>
        <a-form-item
          name="userPassword"
          :rules="[
            { required: true, message: '请输入密码' },
            { min: 8, message: '密码不能小于 8 位' },
            { max: 16, message: '密码不能大于 16 位' },
          ]"
        >
          <a-input-password v-model:value="formState.userPassword" placeholder="请输入密码" />
        </a-form-item>
        <a-form-item
          name="checkPassword"
          :rules="[
            { required: true, message: '请重新输入密码' },
            { min: 8, message: '密码不能小于 8 位' },
            { max: 16, message: '密码不能大于 16 位' },
          ]"
        >
          <a-input-password v-model:value="formState.checkPassword" placeholder="请重新输入密码" />
        </a-form-item>
        <div class="tip">
          已有账号？
          <RouterLink to="/user/login">去登录</RouterLink>
        </div>
        <a-form-item>
          <a-button type="primary" html-type="submit" style="width: 100%">注册</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { userLoginUsingPost, userRegisterUsingPost } from '@/api/userController'
import { message } from 'ant-design-vue'

const formState = reactive<API.UserRegisterRequest>({
  userAccount: '',
  userPassword: '',
  checkPassword: ''
})

const router = useRouter()
const loginUserStore = useLoginUserStore()

/**
 * 注册表单
 * @param values
 */
const handleSubmit = async (values: any) => {
  if (values.userPassword !== values.checkPassword) {
    message.error('两次密码不一致')
    return
  }
  const registerRes = await userRegisterUsingPost(values)
  if (registerRes.data.code === 0 && registerRes.data.data) {
    message.success('注册成功')
    // 注册成功自动登录
    const { userAccount, userPassword } = values;
    const loginRes = await userLoginUsingPost({ userAccount, userPassword });
    if (loginRes.data.code === 0 && loginRes.data.data) {
      await loginUserStore.fetchLoginUser()
      try {
        await router.push({
          path: '/',
          replace: true,
        });
      } catch (error) {
        message.error('注册成功后跳转页面出现错误，请稍后重试');
      }
    }else {
      message.error("自动登录失败,请重新登录")
      router.push({
        path: '/usr/login',
        replace: true,
      })
    }
  }else {
    message.error("注册失败：" + registerRes.data.message)
  }
}
</script>

<style scoped>
#outer-container {
  min-height: 100vh;
  background-image: url('@/assets/login_bg.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

#userRegisterPage {
  width: 350px;
  margin: -5% auto 0;
  background: linear-gradient(to bottom, rgba(214, 240, 255, 0.9), rgba(143, 201, 255, 0.9));
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.title {
  margin-bottom: 16px;
  text-align: center;
}

.desc {
  margin-bottom: 16px;
  text-align: center;
  color: #888;
}

.tip {
  margin-bottom: 16px;
  color: #888;
  font-size: 13px;
  text-align: right;
}
</style>
