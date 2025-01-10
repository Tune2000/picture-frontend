import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { message } from 'ant-design-vue'
import router from '@/router'

// 是否为首次获取登录用户
let firstFetchLoginUser = true;

/**
 * 全局权限校验
 */
router.beforeEach(async (to, from, next) => {
  const loginUserStore = useLoginUserStore()
  let loginUser = loginUserStore.loginUser
  // 确保页面刷新，首次加载时，等后端返回用户信息后再校验权限
  if (firstFetchLoginUser) {
    await loginUserStore.fetchLoginUser()
    loginUser = loginUserStore.loginUser
    firstFetchLoginUser = false
  }
  const toUrl = to.fullPath
  if (toUrl.startsWith('/home/admin')) {
    if (!loginUser || loginUser.id === 0) {
      message.error('未登录或登录已过期')
      next(`/user/login?redirect=${to.fullPath}`)
      return
    }
    if (loginUser.userRole !== 'admin') {
      message.error('没有权限，请联系管理员')
      return
    }
  }
  next()
})
