/**
 * Created by chenkuan on 2017/4/10.
 */

import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import API from '@/lib/API.js'
import { Message } from 'element-ui'
const store = new Vuex.Store({
  state: {
    currentProject: {
      pid: null,
      productId: null,
      productPageNum: 1,
      ifId: 0,
      proList: [],
      memberRoles: [],
      memberList: [],
      projectInfo: null
    },
    projectList: [],
    userInfo: null,
    interfaceEditor: null,
    invokers: [],
    interfaceInfo: null,
    interfaceList: {},
    jsonImporter: null,
  },
  mutations: {
    // 修改pid
    setPid (state, pid) {
      state.currentProject.pid = pid
    },
    setInterfaceList (state, interfaceList) {
      state.interfaceList = interfaceList
    },
    setProList (state, proList) {
      state.currentProject.proList = proList
    },
    setMemberRoles (state, memberRoles) {
      state.currentProject.memberRoles = memberRoles
    },
    setProductId (state, proId) {
      state.currentProject.productId = proId
    },
    setIfId (state, ifId) {
      state.currentProject.ifId = ifId
    },
    setMemberList (state, memberList) {
      state.currentProject.memberList = memberList
    },
    setProductPageNum (state, pageNum) {
      state.currentProject.productPageNum = pageNum
    },
    setProjectList (state, projectList) {
      state.projectList = projectList
    },
    // 保存接口编辑框的数据
    saveInterfaceInfo (state) {
      state.interfaceEditor.saveInterfaceInfo()
    },
    setCurrentInterfaceInfo (state, interfaceInfo) {
      state.interfaceInfo = interfaceInfo
    },
    setUserInfo (state, userInfo) {
      state.userInfo = userInfo
    },
    openJsonExporter(state,handle){
      state.jsonImporter.open(handle)
    }
  },
  actions: {
    // 切换项目到指定项目
    switchProjectTo (context, pid) {
      context.commit('setPid', pid)
      context.commit('setProductId', null)
    },
    // 切换项目到指定产品
    switchProductTo (context, pro) {
      context.commit('setProductId', pro.proId)
      context.commit('setProductPageNum', pro.pageNum)
    },
    // 展示指定接口
    showInterfaceDetail (context, ifId) {
      context.commit('setIfId', ifId)
    },
    logout (context) {
      context.commit('setUserInfo', null)
    },
    fillDatesToJsonExporter(context, handle){
      context.commit('openJsonExporter',handle)
    }
  },
  getters: {
    interfaceList (state) {
      return state.interfaceList
    },
    currentProjectId (state) {
      return state.currentProject.pid
    },
    currentProductId (state) {
      return state.currentProject.productId
    },
    currentProductPageNum (state) {
      return state.currentProject.productPageNum
    },
    currentIfId (state) {
      return state.currentProject.ifId
    },
    currentMemberRoles (state) {
      return state.currentProject.memberRoles
    },
    currentMemberList (state) {
      return state.currentProject.memberList
    },
    currentProductInfo (state) {
      let proId = state.currentProject.productId
      let info = null
      let exist = state.currentProject.proList.some(it => {
        info = it
        return ~~it.id === ~~proId
      })
      return exist ? info : null
    },
    currentProjectInfo (state) {
      let pid = state.currentProject.pid
      let info = null
      let exist = state.projectList.some(it => {
        info = it
        return ~~it.id === ~~pid
      })
      return exist ? info : null
    },
    currentProductListForNav (state) {
      let _proList = []
      // 重新组织产品信息
      if (!state.currentProject.proList) return _proList
      state.currentProject.proList.some(it => {
        _proList.push({
          label: it.proName,
          path: `/g/${it.id}`
        })
      })
      return _proList
    },
    currentInterfaceInfo (state) {
      return state.interfaceInfo
    },
    currentUserInfo (state) {
      let userInfo = state.userInfo
      if (!userInfo) {
        API.whoAmI().then(data => {
          userInfo = data.userInfo
          if (!userInfo) {
            Message({
              message: '用户信息不存在',
              type: 'error'
            })
          } else {
            state.userInfo = userInfo
          }
        })
      }
      return userInfo
    },
    isUserLoged (state) {
      return !!state.userInfo
    }
  }
})
window.state = store.state
export default store
