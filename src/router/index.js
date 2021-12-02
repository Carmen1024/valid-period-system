import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/home',
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
    children: [
      {
        path: 'index',
        name: 'Valid',
        component: () => import('@/views/valid/index'),
        meta: { title: '物料效期管理', icon: 'valid' }
      }
    ]
  },
  // {
  //   path: '/area',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Area',
  //       component: () => import('@/views/area/index'),
  //       meta: { title: '区域管理', icon: 'area' }
  //     }
  //   ]
  // },
  // {
  //   path: '/shop',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Shop',
  //       component: () => import('@/views/shop/index'),
  //       meta: { title: '门店管理', icon: 'shop' }
  //     }
  //   ]
  // },
  // {
  //   path: '/device',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Device',
  //       component: () => import('@/views/device/index'),
  //       meta: { title: '设备管理', icon: 'device' }
  //     }
  //   ]
  // },
  // {
  //   path: '/print',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Print',
  //       component: () => import('@/views/print/index'),
  //       meta: { title: '打印模板管理', icon: 'print' }
  //     }
  //   ]
  // },
  {
    path: '/printList',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'PrintList',
        component: () => import('@/views/printList/index'),
        meta: { title: '打印记录管理', icon: 'printList' }
      }
    ]
  },
  // {
  //   path: '/user',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'User',
  //       component: () => import('@/views/user/index'),
  //       meta: { title: '用户管理', icon: 'user' }
  //     }
  //   ]
  // },
  // {
  //   path: '/role',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Role',
  //       component: () => import('@/views/role/index'),
  //       meta: { title: '角色管理', icon: 'role' }
  //     }
  //   ]
  // },
  // {
  //   path: '/power',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Power',
  //       component: () => import('@/views/power/index'),
  //       meta: { title: '权限管理', icon: 'power' }
  //     }
  //   ]
  // },
  // {
  //   path: '/globalSetting',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'GlobalSetting',
  //       component: () => import('@/views/globalSetting/index'),
  //       meta: { title: '全局设置', icon: 'globalSetting' }
  //     }
  //   ]
  // },
  // 权限 全局设置

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
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
