<template>
  <div id="outer-container">
    <div id="userLoginPage">
      <h2 class="title">智能云图库 - 登录</h2>
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
        <div class="tip">
          没有账号？
          <RouterLink to="/user/register">去注册</RouterLink>
        </div>
        <a-form-item>
          <a-button type="primary" html-type="submit" style="width: 100%">登录</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import { useLoginUserStore } from '@/stores/useLoginUserStore'
  import { userLoginUsingPost } from '@/api/userController'
  import { message } from 'ant-design-vue'

  const formState = reactive<API.UserLoginRequest>({
    userAccount: '',
    userPassword: ''
  })

  const router = useRouter()
  const loginUserStore = useLoginUserStore()

  /**
   * 提交表单
   * @param values
   */
  const handleSubmit = async (values: any) => {
    const res = await userLoginUsingPost(values)
    if (res.data.code === 0 && res.data.data) {
      await loginUserStore.fetchLoginUser()
      message.success('登录成功')
      try {
        await router.push({
          path: '/',
          replace: true,
        });
      } catch (error) {
        message.error('登录成功后跳转页面出现错误，请稍后重试');
      }
    }else {
      message.error("登录失败：" + res.data.message)
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

#userLoginPage {
  width: 350px;
  margin: -5% auto 0; /* 让登录框从正中间往上偏移 */
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
