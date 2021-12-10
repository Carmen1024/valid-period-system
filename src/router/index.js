import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    name: '登录',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/register',
    name: '注册',
    component: () => import('@/views/register/index'),
    hidden: true
  },

  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    name:'工作台',
    component: Layout,
    redirect: '/home',
    name: '工作台',
    children: [{
      path: 'home',
      name: 'Home',
      component: () => import('@/views/home/index'),
      meta: { title: '工作台', icon: 'home' }
    }]
  },
  {
    path: '/sort',
    component: Layout,
    name: '分类管理',
    children: [
      {
        path: 'index',
        name: 'Sort',
        component: () => import('@/views/sort/index'),
        meta: { title: '分类管理', icon: 'sort' }
      }
    ]
  },
  {
    path: '/materials',
    component: Layout,
    name: '物料管理',
    children: [
      {
        path: 'index',
        name: 'Materials',
        component: () => import('@/views/materials/index'),
        meta: { title: '物料管理', icon: 'materials' }
      }
    ]
  },
  {
    path: '/valid',
    component: Layout,
    name: '物料效期管理',
    children: [
      {
        path: 'index',
        name: 'Valid',
        component: () => import('@/views/valid/index'),
        meta: { title: '物料效期管理', icon: 'valid' }
      }
    ]
  },
  {
    path: '/area',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Area',
        component: () => import('@/views/area/index'),
        meta: { title: '区域管理', icon: 'area' }
      }
    ]
  },
  {
    path: '/store',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Store',
        component: () => import('@/views/store/index'),
        meta: { title: '门店管理', icon: 'store' }
      }
    ]
  },
  {
    path: '/device',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Device',
        component: () => import('@/views/device/index'),
        meta: { title: '设备管理', icon: 'device' }
      }
    ]
  },
  {
    path: '/print',
    component: Layout,
    redirect: '/print/index',
    name: '打印管理',
    meta: { title: '打印管理', icon: 'print' },
    children: [
      {
        path: 'index',
        name: 'Printer',
        component: () => import('@/views/printer/index'),
        meta: { title: '打印机', icon: 'printer' }
      },
      {
        path: 'PrintTemp',
        name: 'PrintTemp',
        component: () => import('@/views/printTemp/index'),
        meta: { title: '打印模板', icon: 'printTemp' }
      },
      {
        path: 'PrintList',
        name: 'PrintList',
        component: () => import('@/views/printList/index'),
        meta: { title: '打印记录', icon: 'printList' }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    name: '用户管理',
    meta: { title: '用户管理', icon: 'userMode' },
    children: [
      {
        path: 'index',
        name: 'User',
        component: () => import('@/views/user/index'),
        meta: { title: '用户', icon: 'user' }
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/role/index'),
        meta: { title: '角色管理', icon: 'role' }
      },
      {
        path: 'power',
        name: 'Power',
        component: () => import('@/views/power/index'),
        meta: { title: '权限管理', icon: 'power' }
      }
    ]
  },
  {
    path: '/globalSetting',
    component: Layout,
    name: '全局设置',
    children: [
      {
        path: 'index',
        name: 'GlobalSetting',
        component: () => import('@/views/globalSetting/index'),
        meta: { title: '全局设置', icon: 'globalSetting' }
      }
    ]
  },
  // {
  //   path: 'outLink',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'outLink',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]
const createRouter = () => new Router({
  
  scrollBehavior: () => ({ y: 0 }),
  mode: 'history', // require service support
  base:'/admin/',
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
