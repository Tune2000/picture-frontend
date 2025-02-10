import { createRouter, createWebHistory } from 'vue-router'
import UserLoginPage from '@/pages/user/UserLoginPage.vue'
import UserRegisterPage from '@/pages/user/UserRegisterPage.vue'
import UserManagePage from '@/pages/admin/UserManagePage.vue'
import BasicLayout from '@/layouts/BasicLayout.vue'
import HomePage from '@/pages/HomePage.vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import UserInfoPage from '@/pages/user/UserInfoPage.vue'
import AddPicturePage from '@/pages/picture/AddPicturePage.vue'
import PictureManagePage from '@/pages/admin/PictureManagePage.vue'
import PictureDetailPage from '@/pages/admin/PictureDetailPage.vue'
import EditPicturePage from '@/pages/picture/EditPicturePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: () => {
        const loginUserStore = useLoginUserStore()
        let loginUser = loginUserStore.loginUser
        if (loginUser.id!== 0) {
          return '/home' // 用户已登录，重定向到主页-默认欢迎页（'/home'）
        }
        return '/user/login' // 用户未登录，重定向到登录页
      }
    },
    {
      path: '/home',
      name: '主页',
      component: BasicLayout,
      children: [
        {
          path: '/welcome',
          name: '欢迎',
          component: HomePage
        },
        {
          path: '/admin/userManage',
          name: '用户管理',
          component: UserManagePage
        },
        {
          path: '/admin/pictureManage',
          name: '图片管理',
          component: PictureManagePage,
        },
        {
          path: '/user/info',
          name: '个人信息',
          component: UserInfoPage
        },
        {
          path: '/picture/add_picture',
          name: '创建图片',
          component: AddPicturePage,
        },
        {
          path: '/picture/detail/:id',
          name: '图片详情',
          component: PictureDetailPage,
          props: true,
        },
        {
          path: '/picture/edit_picture',
          name: '修改图片',
          component: EditPicturePage,
        },
      ]
    },
    {
      path: '/user/login',
      name: '用户登录',
      component: UserLoginPage,
    },
    {
      path: '/user/register',
      name: '用户注册',
      component: UserRegisterPage,
    },
  ],
})

export default router
