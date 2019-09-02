<template>
  <div class="interfaceInfo">
    <div :class="ifeditable?'':'board-center'" class="board basic-info" v-loading="interfaceInfoLoading">
      <h4>[{{interfaceInfo.basicInfo.id}}] {{interfaceInfo.basicInfo.ifName}}
        <follow-icon :follow="interfaceInfo.isFollow" :ifId="interfaceInfo.basicInfo.id" class="follow-icon"></follow-icon>
        <el-button v-if="ifeditable" type="text" icon="setting" size="small" style="float: right" @click="editInterface(interfaceInfo.basicInfo.id)">编辑接口</el-button>
        <el-button v-else type="text" size="small" style="float: right" @click="turnProject(interfaceInfo.basicInfo.pid)">返回项目 <i class="el-icon-d-arrow-right"></i></el-button>
      </h4>
      <pre>路径名：{{interfaceInfo.basicInfo.ifUrl}}</pre>

      <el-tabs>
        <el-tab-pane class="info" label="接口详情">
          <div class="items">
            <div>请求方式：<span id="ifType">{{interfaceInfo.basicInfo.ifType}}</span></div>
            <div>返回类型：<span id="returnType">{{interfaceInfo.basicInfo.returnType}}</span></div>
            <div>接口协议：<span id="ifProtocol">{{interfaceInfo.basicInfo.ifProtocol}}</span></div>
            <div>当前版本：<span>V{{interfaceInfo.basicInfo.ifVersionNo}}</span></div>
          </div>
          <div class="items">
            <div>设计者：<span class="default_head" :style="interfaceInfo.designer.avtSrc && `background-image: url(${interfaceInfo.designer.avtSrc})`">{{interfaceInfo.designer.userName}}</span></div>
            <div>幂等性：<span id="isIdempotent">{{interfaceInfo.basicInfo.isIdempotent=='Y'?"幂等":"非幂等"}}</span></div>
            <div>所属产品：<span id="proName">{{interfaceInfo.basicInfo.proName}}</span></div>
            <div>创建时间：<span id="ifCreateTime">{{tmStampToTime(interfaceInfo.basicInfo.ifCreateTime)}}</span></div>
          </div>
          <div class="links">
            <a class="mock-url" :href="'http://ifml.me/interfaceDebug.do?sys='+interfaceInfo.basicInfo.ifProId+'&ifUrl='+interfaceInfo.basicInfo.ifUrl" target="_blank">
              <i class="host-label"><i class="el-icon-setting"></i> 获取MOCK</i>
              <i class="host-url">http://ifml.me/interfaceDebug.do?sys={{interfaceInfo.basicInfo.ifProId}}&ifUrl=</i>
              <i class="path-url">{{interfaceInfo.basicInfo.ifUrl}}</i>
            </a>
            <a class="mock-url" :href="interfaceInfo.basicInfo.ifUrl" target="_blank">
              <i class="host-label"><i class="el-icon-share"></i> 真实地址</i>
              <i class="host-url">API-HOST</i>
              <i class="path-url">{{interfaceInfo.basicInfo.ifUrl}}</i>
            </a>

          </div>
        </el-tab-pane>
        <el-tab-pane class="invokelist" :label="`关注列表(${interfaceInfo.invokers.length})`">
          <el-table
            :data="interfaceInfo.invokers"
            stripe
            style="width: 100%">
            <el-table-column
              prop="tmFollow"
              label="日期"
              width="180">
            </el-table-column>
            <el-table-column
              prop="userName"
              label="关注者"
              width="180">
            </el-table-column>
            <el-table-column
              prop="remark"
              label="关注说明">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane :label="`变更记录(${feedListCount})`" class="changelogs">
          <div v-for="changelog in interfaceInfo.feedList" class="change-log-box">
            <h5 class="oper"> {{changelog.oper}}</h5>
            <div v-for="changes in changelog.changesList">
              <p>
                <el-tag v-if="changes.optionType=='新增'" type="success">新增</el-tag>
                <el-tag v-if="changes.optionType=='删除'" type="warning">删除</el-tag>
                <el-tag v-if="changes.optionType=='修改'" type="primary">修改</el-tag>
                了 {{changes.changeType || "接口"}}<span class="ts">{{changes.ts.substring(0,19)}}</span>
              </p>
              <p class="text-center" v-if="changes.prmVal || changes.nowVal">
                '{{changes.prmVal}}' → '{{changes.nowVal}}'
              </p>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <params :class="ifeditable?'':'board-center'" type="REQ" v-loading="interfaceInfoLoading" :json="interfaceInfo.reqJsonStr" :params="interfaceInfo.reqFields" title="请求参数(Request Body):"></params>
    <params :class="ifeditable?'':'board-center'" type="RSP" v-loading="interfaceInfoLoading" :json="interfaceInfo.rspJsonStr" :params="interfaceInfo.rspFields" title="响应参数(Response Body):"></params>
  </div>
</template>
<script>
  import utils from '@/lib/utils.js'
  const followIcon = res => require(['./Follow.vue'], res)
  const params = res => require(['./Params.vue'], res)
  import API from '@/lib/API'
  //  import {Message} from 'element-ui'
  export default {
    name: 'interface-detail',
    props: [
      'ifeditable'
    ],
    data () {
      return {
        interfaceInfo: {
          basicInfo: {},
          invokers: [],
          designer: {},
          feedList: [],
          reqFields: [],
          rspFields: []
        },
        interfaceInfoLoading: false
      }
    },
    mounted () {
      // 初始化接口ID
      let ifId = this.$store.getters.currentIfId || this.$router.params.ifId || 0
      if (ifId > 0) {
        // 若当前打开的是接口展示页，
        // 则需要记录当前接口ID,
        // 用来触发接口id变更动作
        if (this.$route.name === 'viewDetail') {
          this.$store.dispatch('showInterfaceDetail', ifId)
        }
        this.getInterfaceInfo(ifId)
      } else {
        // todo 接口id不存在，表示当前不应该打开接口框
        console.log('接口ID小于0')
      }
    },
    components: {
      followIcon,
      params
    },
    methods: {
      editInterface (ifId) {
        this.$router.push(`/edit/${ifId}`)
      },
      tmStampToTime (ts) {
        return utils.tmStampToTime(ts)
      },
      turnProject (pid) {
        console.log(pid)
        this.$store.commit('setPid', pid)
        this.$router.push('/p/' + pid)
      },
      // 请求接口信息
      async getInterfaceInfo (ifId) {
        this.interfaceInfoLoading = true
        let interfaceInfo = {}
        // 完全加载
        await Promise.all([
          // 请求接口基本信息
          API.getInterfaceBasicInfo(ifId, true).then((data) => {
            interfaceInfo.basicInfo = data.interFaceInfo
            interfaceInfo.designer = data.userInfo
            interfaceInfo.invokers = data.invokers
            interfaceInfo.isFollow = data.follow
          }),
          // 请求接口field信息
          API.getInterfaceFieldsDetail(ifId, true).then((data) => {
            interfaceInfo.ifEdition = data.detail.ifEdition
            interfaceInfo.reqFields = data.detail.reqFields
            interfaceInfo.reqJsonStr = data.detail.reqJsonStr
            interfaceInfo.rspFields = data.detail.rspFields
            interfaceInfo.rspJsonStr = data.detail.rspJsonStr
            interfaceInfo.updateTime = data.detail.updateTime
          }),
          // 请求接口变更记录信息
          API.getInterfaceChanges(ifId, true).then((data) => {
            interfaceInfo.feedList = data.feedsList
          })
        ])
        this.interfaceInfoLoading = false
        this.interfaceInfo = interfaceInfo
        this.$store.commit('setCurrentInterfaceInfo', utils.clone(interfaceInfo))
      }
    },
    computed: {
      feedListCount () {
        let count = 0
        this.interfaceInfo.feedList.some(it => {
          count += it.changesList ? it.changesList.length : 0
        })
        return count
      }
    }
  }
</script>
<style scoped lang="scss">
  .links{
    border-top: 1px dashed #bfcbd9;
    padding-top: .5rem;
    display: block;
    a{
      display: block;
    }
    .mock-url{
      text-decoration: none;
      padding: .5rem 0;
      overflow: hidden;
      line-height: 1.5;
      .path-url,.host-url,.host-label{
        padding: .1rem .5rem;
        text-shadow: 0 1px 1px #4a4949;
        font-style: normal;
        font-weight: 900;
        float: left;
      }
      .host-label{
        background: linear-gradient(to bottom, #5f5f5f 0%,#4d4d4d 100%);
        border-radius: .2rem 0 0 .2rem;
        color: #fff;
        width: 5rem;
      }
      .host-url{
        background: linear-gradient(to bottom, #1795d2 0%, #2196F3 100%);
        color: #fff;
      }
      .path-url{
        background: linear-gradient(to bottom, #52bc9c 0%,#40aa8b 100%);
        border-radius:0 .2rem .2rem 0;
        color: #fff;
      }
    }
  }

  .interfaceInfo{
    padding: 2rem;
    min-height: 500px;
    .tab-board{
      width: 40rem;
      margin-bottom: 2rem;
      border-radius: .2rem;
      border: solid 1px #eee;
      box-shadow: 0 0 1rem #eee;
    }

    .board{
      &.board-center{
        margin: 0 auto 2rem;
      }
      width: 40rem;
      margin-bottom: 2rem;
      border-radius: .2rem;
      border: solid 1px #eee;
      box-shadow: 0 0 1rem #eee;
      h4,h5{
        margin: 1rem 0 0 0;
        padding: 1rem;
        font-size: 1.1rem;
        font-weight: 500;
        color: #434B53;
        line-height: 1.2rem;
      }
      h5{
        margin: 0;
        font-size: 1rem;
      }
      pre{
        font-size: .75rem;
        color: #6D7B89;
        line-height: 2rem;
        padding: 0 1rem;
        margin: 0 0 1rem 0;
        background: #FBFBFB;
        box-shadow: inset 0 1px 0 0 #F2F3F6, inset 0 -1px 0 0 #F2F3F6;
        &.jsonStr{
          line-height: 1.2;
        }
      }

      .el-collapse{
        border:none;
      }
      &.basic-info{
        .items,.links{
          margin-bottom: .5rem;
          font-size: .75rem;
          color: #434B53;
          &.items{
            column-count: 2;
          }
        }
        .default_head{
          background-size: 1rem;
          background-position: left;
          background-repeat: no-repeat;
          padding-left: 1.2rem;
        }
        .follow-icon{
          margin-left: .5rem;
        }
      }
    }
    .el-collapse-item__content{
      padding: 0
    }

    .el-tabs{
      .changelogs,.info{
        padding: 0 1rem 1rem;
        &.changelogs{
          font-size: .8rem;
          font-weight:300;
          .change-log-box {
            .ts {
              float: right
            }
            .oper {
              background: #99A9BF;
              color: #fff;
              padding: 1px 5px;
              border-radius: 5px;
              font-weight: 900;
              font-size: .85rem
            }
          }
          .text-center{
            text-align: center;
          }
        }
      }
      .el-tag{
        height: auto;
        line-height: inherit;
      }
    }
  }


</style>
