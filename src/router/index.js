import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import API from '@/lib/API'

const Index = res => require(['@/components/Index.vue'], res)
const Main = res => require(['@/components/Main.vue'], res)
const Interfaces = res => require(['@/components/Interfaces.vue'], res)
const Login = res => require(['@/components/login.vue'], res)

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/p/:pid',
      name: 'Main',
      component: Main,
      beforeEnter (to, from, next) {
        store.dispatch('switchProjectTo', to.params.pid)
        if (!store.getters.currentProjectInfo) {
          API.getAllProjectInfo().then((data) => {
            let projectInfo = data.projectInfo
            store.commit('setProjectList', projectInfo)
          })
        }
        next()
      }
    },
    {
      path: '/g/:proId',
      name: 'switchProductId',
      component: Interfaces
    },
    {
      path: '/g/:proId/:pageNum',
      name: 'paging',
      component: Interfaces,
      beforeEnter (to, from, next) {
        store.commit('setProductPageNum', to.params.pageNum)
        store.commit('setProductId', (~~to.params.proId) || null)
        next()
      }
    },
    {
      path: '/view/:ifId',
      name: 'viewDetail',
      component: Interfaces
    },
    {
      path: '/edit/:ifId',
      name: 'editDetail',
      component: Interfaces
    },
    {
      path: '/create',
      name: 'creator',
      component: Interfaces
    }
  ]
})

// 全局钩子
router.beforeEach(function (to, from, next) {
  // // 未登录时，跳转登录页
  // if (!store.getters.isUserLoged && to.name !== 'Login') {
  //   console.log('to', to.name)
  //   console.log('fr', from.name)
  //   console.log('userinfo', store.state.userInfo)
  //   console.log('未登录，打开login')
  //   next('/login')
  // }
  // 当项目ID不存在时，跳转到首页
  if (store.getters.isUserLoged && to.name !== 'Index' && !store.getters.currentProjectId) {
    console.log('项目ID不存在回首页')
    next('/')
  }
  // 项目切换时触发
  if (to.params.pid > 0) {
    store.dispatch('switchProjectTo', to.params.pid)
    console.log(store.state)
    next()
  }
  // 产品切换时触发
  if (to.params.proId > 0) {
    if (to.params.pageNum > 0) {
      store.dispatch('switchProductTo', {
        proId: to.params.proId,
        pageNum: to.params.pageNum
      })
      next()
    } else {
      store.dispatch('switchProductTo', {
        proId: to.params.proId,
        pageNum: 1
      })
      next()
    }
  }
  // 接口切换时触发
  if (to.name === 'viewDetail' && to.params.ifId > 0) {
    store.dispatch('showInterfaceDetail', to.params.ifId)
    next()
  }
  next()
})

export default router
