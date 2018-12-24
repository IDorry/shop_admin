import Vue from 'vue'
import Router from 'vue-router'
import Login from 'components/Login'
import Home from 'components/Home'
// 导入user路由
import Users from 'components/Users'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      // home路由的子路由---children
      children: [
        {
          path: '/users',
          component: Users
        }
      ]
    }
  ]
})

// 给router对象注册一个导航守卫
// 将来所有的导航（路由发生了跳转）都要经过beforeEach
// to: 去哪儿
// from: 从哪儿
// next: 是否放行  next():表示直接放行   next('/login')表示跳转到/login
router.beforeEach((to, from, next) => {
  // console.log(to, from)
  if (to.path === '/login') {
    // 如果要去的是login页面，直接放行
    next()
    return
  }

  let token = localStorage.getItem('token')
  if (token) {
    // 如果有token,放行
    next()
  } else {
    // 没有token,去登录页
    next('/login')
  }
})

// 把vue实例暴露出去
export default router
