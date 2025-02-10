<template id="globalHeader">
  <a-row :wrap="false">
    <a-col flex="200px" :offset="1">
      <RouterLink to="/">
        <div class="title-bar">
          <img class="logo" src="../assets/logo.png" alt="logo" />
          <div class="title">智能协同云图库</div>
        </div>
      </RouterLink>
    </a-col>
    <a-col flex="auto" :offset="1">
      <a-menu
        v-model:selectedKeys="current"
        mode="horizontal"
        :items="items"
        @click="doMenuClick"
      />
    </a-col>
    <a-col flex="100px">
      <div class="user-login-status">
        <div v-if="loginUserStore.loginUser.id">
          <a-dropdown class="dropdown-up">
            <ASpace>
              <a-avatar :src="loginUserStore.loginUser.userAvatar"/>
              <span v-if="loginUserStore.loginUser.userName === null">默认用户</span>
              <div class="user-name-overflow" v-else>{{ loginUserStore.loginUser.userName }}</div>
            </ASpace>
            <template #overlay>
            <a-menu :style="{ top: '-10px' }" >
              <a-menu-item @click="UserInfoClick" :style="{ color: 'blue' }">
                <LogoutOutlined :style="{ color: 'blue' }" />
                个人信息
              </a-menu-item>
              <a-menu-item @click="doLogoutClick" :style="{ color: 'red' }">
                <LogoutOutlined :style="{ color: 'red' }" />
                退出登录
              </a-menu-item>
            </a-menu>
            </template>
          </a-dropdown>
        </div>
        <div v-else>
          <a-button type="primary" href="/user/login">登录</a-button>
        </div>
      </div>
    </a-col>
  </a-row>

  <a-modal v-model:open="open" title="退出登录" ok-text="确认" cancel-text="取消" @ok="doLogout">
    <p>是否确认退出登录？</p>
  </a-modal>

</template>
<script lang="ts" setup>
import { computed, h, onMounted, ref } from 'vue'
import { HomeOutlined,LogoutOutlined } from '@ant-design/icons-vue'
import { type MenuProps, message } from 'ant-design-vue'
import { type RouteLocationRaw, useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { userLogoutUsingPost } from '@/api/userController'
const loginUserStore = useLoginUserStore()

const router = useRouter()
const loginUser = loginUserStore.loginUser

// 路由跳转事件
const doMenuClick = ({ key }: { key: string }) => {
  router.push({
    path: key,
  });
};

// 当前选中菜单
const current = ref<string[]>([]);

// 在组件挂载时，获取当前路由路径并设置给current，确保刷新页面时高亮能正确显示
onMounted(() => {
  const currentRoute = router.currentRoute.value;
  if (currentRoute.path === '/' || currentRoute.path === '/home' ||!currentRoute.path) {
    router.push({
      path: '/welcome',
    });
  } else {
    current.value = [currentRoute.path];
  }
});

// 刷新页面，当前菜单高亮同步
// 监听路由变化，更新当前选中菜单
router.afterEach((to, from, next) => {
  if (to.path === '/' || to.path === '/home' ||!to.path) {
    router.push({
      path: '/welcome',
    });
  }
  current.value = [to.path];
});

const originItems = [
  {
    key: '/welcome',
    icon: () => h(HomeOutlined),
    label: '主页',
    title: '主页'
  },
  {
    key: '/admin/userManage',
    label: '用户管理',
    title: '用户管理'
  },
  {
    key: '/admin/pictureManage',
    label: '图片管理',
    title: '图片管理',
  },
  {
    key: '/picture/add_picture',
    label: '创建图片',
    title: '创建图片',
  }
]
// 过滤菜单项
const filterMenus = (menus = [] as MenuProps['items']) => {
  return menus?.filter((menu) => {
    if (menu === null) {
      return false;
    }
    if (typeof menu?.key === 'string' && menu.key.startsWith('/admin')) {
      if (!loginUser || loginUser.id === 0 || loginUser.userRole === 'user') {
        return false
      }
    }
    return true
  })
}
// 展示在菜单的路由数组
const items = computed<MenuProps['items']>(() => filterMenus(originItems))

const UserInfoClick = async () => {
  await router.push('/user/info')
}

const open = ref<boolean>(false);
// 退出登录确认框
const doLogoutClick = () => {
  open.value = true;
};
// 用户注销
const doLogout = async () => {
  open.value = false;
  const res = await userLogoutUsingPost()
  if (res.data.code === 0) {
    loginUserStore.setLoginUser({
      id: 0,
      userName: "未登录",
    })
    message.success('退出登录成功')
    await router.push('/user/login')
  } else {
    message.error('退出登录失败，' + res.data.message)
  }
}
</script>

<style scoped>
.title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: black;
  font-size: 18px;
  margin-left: 16px;
}

.logo {
  height: 48px;
}

.user-name-overflow {
  max-width: 70px; /* 可根据实际需求调整最大宽度 */
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>


