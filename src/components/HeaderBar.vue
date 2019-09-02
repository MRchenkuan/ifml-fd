<template>
  <el-menu class="el-menu-demo" mode="horizontal" :class="minisize?'minisize':''">
    <img class="logo" src="../assets/main_logo@2x.png" @click="turnHome()">
    <el-submenu v-if="productsBtn" index='1'>
      <template slot="title">切换产品</template>
      <el-menu-item v-if="canEdit" index="0" disabled class="createProduct" @click="createProduct">
        <i class="el-icon-plus"></i>创建产品
      </el-menu-item>
      <el-menu-item v-for="(child, j) in proList" :key="j" index='' :index="`1-${j}`" @click="$router.push({path:child.path})">{{child.label}}</el-menu-item>
    </el-submenu>

    <el-menu-item v-if="interfaceCreateBtn" index='2' @click="openCreator">创建接口</el-menu-item>






    <!-- 项目信息面板 -->
    <el-menu-item v-if="memberBtn" index='3'>
      <el-popover
      placement="bottom"
      width="500"
      trigger="hover">
        <div slot="reference" class="projectInfoEntry">{{projectInfo.projectName}} <i class="el-icon-information"></i></div>
        <el-tabs value="desc" class="projectBoard">
          <el-tab-pane label="项目说明" name="desc" class="info">
            <p class="pro-name">{{projectInfo.projectName}}</p>
            <p class="pro-desc">{{projectInfo.projectDesc}}</p>
            <br>
            <p class="default-text-color">项目成员：{{projectInfo.members.length}} 位</p>
            <p class="default-text-color">创建时间：{{projectInfo.ts.substring(0,10)}}</p>
            <p class="projectBoard-label">项目管理员：</p>
            <p style="display: inline-block; margin-top: .5rem;">
              <span class="default_head" :style="projectInfo.master.avtSrc && `background-image: url(${projectInfo.master.avtSrc})`"></span>
              <span class='text'>
                <span class="master-name">{{projectInfo.master.userName}}</span><br>
                <span class="master-email">{{projectInfo.master.email}}</span>
              </span>
            </p>
          </el-tab-pane>
          <el-tab-pane :label="`项目成员(${projectInfo.members.length})`" name="members">
            <div class="head-list">
              <span class="headbox" v-if="canEdit" @click="showBoardInviter">
                <span class="head" style="background: #eee">+</span>
                <span class="name" style="color: #20A0FF">添加成员</span>
              </span>
              <span class="headbox" v-for="head in $store.getters.currentMemberList">
                <span class="default_head" :style="head.avtSrc && `background-image: url(${head.avtSrc})`"></span>
                <span class="name">{{head.userName.substring(0,5)}}</span>
              </span>
            </div>
          </el-tab-pane>
        </el-tabs>
        <el-button type="text" style="float: right" @click="turnHome"><i class="el-icon-caret-left"></i> 返回所有应用</el-button>
      </el-popover>
      <member-inviter ref="memberInviter"></member-inviter>
    </el-menu-item>






    <!-- 接口保存按钮组-->
    <el-button-group class="ifSaveBtnGroup" v-if="interfaceEditorBtnGroup">
      <el-button type="success" icon="check" @click="saveInterfaceInfo">快速保存</el-button>
      <el-button :plain="true" type="danger" @click="turnBack">返回首页 <i class="el-icon-d-arrow-right"></i></el-button>
    </el-button-group>

    <!-- 搜索条 -->
    <el-input v-if="searchBar" class="searchBar" placeholder="接口名、URL、接口ID、描述等" v-model="searchBarInfo.keywords">
      <el-select v-model="searchBarInfo.type" style="width: 5rem; color:#20A0FF" slot="prepend" placeholder="请选择">
        <el-option label="当前" value="current"></el-option>
        <el-option label="全局" value="global"></el-option>
      </el-select>
      <el-button slot="append" icon="search" type="primary" @click="searchInterfaces"></el-button>
    </el-input>
    <product-creator ref="productCreator"></product-creator>

    <!-- 个人用户图标 -->
    <el-popover
      v-if="selfIcon"
      placement="bottom"
      trigger="hover"
      content="">
      <div class="userInfo" slot="reference">
        <span class="default_head" :style="userInfo.avtSrc && `background-image: url(${userInfo.avtSrc})`"></span>
        <span class="text" >
            <span class="name">{{userInfo.userName}}</span><br>
            <span class="role">{{myRole}}</span>
          </span>
      </div>
      <div style="width: 100%;text-align: center">
        <el-button type="text" @click="logout"><i class="el-icon-upload2"></i> 安全退出</el-button>
      </div>
    </el-popover>
  </el-menu>
</template>
<script>
//  import ElMenu from 'element-ui/packages/menu/src/menu'
//  import ElMenuItem from 'element-ui/packages/menu/src/menu-item'
//  import ElButton from '../../node_modules/element-ui/packages/button/src/button'
  import API from '@/lib/API'
  // const ElMenu = res => require(['element-ui/packages/menu/src/menu'], res)
  // const ElMenuItem = res => require(['element-ui/packages/menu/src/menu-item'], res)
  // const ElButton = res => require(['../../node_modules/element-ui/packages/button/src/button'], res)
  const ProductCreator = res => require(['./main/ProductCreator.vue'], res)
  import {MessageBox, Message, Menu as ElMenu, MenuItem as ElMenuItem, Button as ElButton} from 'element-ui'
  import MemberInviter from './main/MemberInviter'

  export default {
    components: {
      MemberInviter,
      ElButton,
      ElMenuItem,
      ProductCreator,
      ElMenu},
    name: 'header-bar',
    props: [
      'proList',
      'interfaceCreateBtn',
      'memberBtn',
      'productsBtn',
      'searchBar',
      'interfaceEditorBtnGroup',
      'selfIcon',
      'minisize'
    ],
    data () {
      return {
        searchBarInfo: {
          type: 'global',
          keywords: ''
        }
      }
    },
    methods: {
      searchInterfaces () {
        let keywords = this.searchBarInfo.keywords
        if (keywords) {
          API.searchInterfaces(keywords, this.$store.getters.currentProjectId, 0, 1).then(data => {
            this.$store.commit('setProductId', 0)
            this.$store.commit('setInterfaceList', data.pageInfo)
          })
        } else {
          Message(`请输入查询内容`)
        }
      },
      turnHome () {
        this.$router.push('/')
      },
      turnBack () {
        let ifId = this.$store.getters.currentIfId
        let pid = this.$store.getters.currentProjectId
        if (ifId > 0) {
          this.$router.push('/view/' + ifId)
        } else if (pid > 0) {
          this.$router.push('/p/' + pid)
        } else {
          this.$router.push('/')
        }
      },
      createProduct () {
        this.$refs.productCreator.open()
      },
      saveInterfaceInfo () {
        this.$store.commit('saveInterfaceInfo')
      },
      openCreator () {
        this.$router.push('/create')
      },
      logout () {
        MessageBox({
          title: '提醒',
          type: 'info',
          showCancelButton: true,
          message: '正在退出登录，是否确定？'
        }).then((flag) => {
          if (flag === 'confirm') {
            API.logout().then((data) => {
              if (data.rspCd === '00000') {
                this.$router.push('/login')
                this.$store.dispatch('logout')
              }
            })
          }
        })
      },
      showBoardInviter () {
        this.$refs.memberInviter.dialogVisible = true
      }
    },
    computed: {
      canEdit: function () {
        let roles = this.$store.getters.currentMemberRoles
        return roles && roles.length > 0 && [0] && roles[0].id === 0
      },
      projectInfo: function () {
        let emptyProjectInfo = {
          master: {},
          members: [],
          ts: ''
        }
        return this.$store.getters.currentProjectInfo || emptyProjectInfo
      },
      myRole: function () {
        let role = this.projectInfo.asRole
        switch (role) {
          case 0: return '管理员'
          case 1: return '项目成员'
          case 2: return '访客'
        }
      },
      userInfo: function () {
        return this.$store.getters.currentUserInfo || {}
      }
    }
  }

</script>
<style scoped lang="scss">
  .el-menu{
    &.minisize{
      width: 40rem;
      margin: auto;
      border: 1px solid #eee;
      border-top: none;
    }
  }
  .head-list {
    overflow: auto;
    max-height: 70vh;
    .headbox {
      display: flex;
      float: left;
      flex-direction: column;
      align-items: center;
      margin: .5rem;
      transition: .3s ease all;
      &:hover{
        box-shadow: 0 0 6px #434B53;
        border-radius: 5px;
        transition: none;
      }
      .default_head,.head {
        background-image: url(../assets/default_face_pic@2x.png);
        background-size: contain;
        height: 2rem;
        line-height: 2rem;
        color: #fff;
        font-size: .5em;
        text-shadow: 0 0 2px #000;
        text-align: center;
        width: 2rem;
        border-radius: 2rem;
        margin: .25rem;
        display: inline-block;
      }
      .name {
        text-align: center;
        max-width: 3rem;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        color: #6D7B89;
        font-size: .75rem;
        line-height: 1.5;
      }
    }
  }
  .ifSaveBtnGroup{
    margin-top: .9rem;
    margin-left: 3rem;
  }
  .logo{
    float: left;
    height: 60px;
    padding: 10px 2rem;
    line-height: 60px;
    cursor: pointer;
    position: relative;
    box-sizing: border-box;
  }
  .el-menu{
    background-color: #fbfbfb;
    border-bottom: 1px solid #eee;
  }
  .createProduct{
    font-weight: 900;
    color: #11bb5d;
    border-bottom: 1px solid #ccc;
    &:hover{
      color: #fff;
      background: #11bb5d;
    }
  }
  .searchBar{
    width: 20rem;
    margin-top: .7rem;
    margin-left: 3rem;
  }

  .projectBoard-label{
    font-size: 1rem;
    margin-top: 1rem;
    color: #6D7B89;
  }
  .projectBoard{
    .info{
      column-count: 2;
      p{
        margin: 0;
        padding: 0;
        color: #6D7B89;
      }
      .default_head{
        display:inline-block;
        width:3rem;
        height:3rem;
        background-size: cover;
        background-position: center;
        vertical-align: middle;
        border-radius: .5rem;
      }
      .text{
        display:inline-block;
        vertical-align: middle;
        .master-name{
          font-size: 1rem;
        }
        .master-email{
          font-size: .8rem;
        }
      }
      .pro-name{
        font-size: 1.2rem;
      }
    }
  }
  .userInfo{
    float: right;
    height: 2.5rem;
    margin-top: .7rem;
    border-radius: 5px;
    border:1px solid #fff;
    padding-right: .5rem;
    margin-right: 2rem;
    display: inline-block;
    overflow: hidden;
    box-shadow: 0 0 0 1px #bfcbd9;
    cursor: pointer;
    transition: .3s all ease;
    &:hover{
      background: #eee;
    }
    .default_head{
      height: 100%;
      margin-right: .5rem;
      min-width: 2.5rem;
      background-size: cover;
      background-position: center;
      vertical-align: middle;
      display: block;
      float: left;
    }
    .text{
      font-size: .9rem;
      color: #6D7B89;
      display: inline-block;
      vertical-align: middle;
      .name{
        font-size: .9rem;
      }
      .role{
        font-size: .75rem;
      }
    }
  }
  .projectInfoEntry{
    font-weight: 900;
  }

</style>
<style>
  .el-menu--horizontal .el-submenu>.el-menu{
    max-height: 60vh;
    overflow: auto;
  }
</style>
