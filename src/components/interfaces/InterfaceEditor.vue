<template>
  <div class="interfaceInfo">
    <div class="board basic-info" ref="basicInfo" v-loading="loading">
      <h5>基本信息</h5>
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <h4><el-form-item label="接口名称" prop="ifName">
          <el-input placeholder="接口名称" size="large" v-model="form.ifName" :model="form.ifName"></el-input></el-form-item></h4>
        <h5 style="margin-bottom: 1rem">
          <el-form-item label="接口地址" prop="ifUrl">
            <el-input placeholder="接口地址" size="small" v-model="form.ifUrl"></el-input>
          </el-form-item>
        </h5>
        <div class="items">
          <el-form-item label="请求方式">
            <el-select size="small" v-model="form.ifType" placeholder="请选择请求方式">
              <el-option label="POST" value="POST"></el-option>
              <el-option label="GET" value="GET"></el-option>
              <el-option label="PUT" value="PUT"></el-option>
              <el-option label="DELETE" value="DELETE"></el-option>
              <el-option label="PATCH" value="PATCH"></el-option>
              <el-option label="DUBBO" value="DUBBO"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="返回类型">
            <el-select size="small" v-model="form.returnType" placeholder="请选择返回类型">
              <el-option label="JSON" value="JSON"></el-option>
              <el-option label="文本" value="TEXT"></el-option>
              <el-option label="无" value="NULL"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="幂等性">
            <el-select size="small" v-model="form.isIdempotent" placeholder="幂等性">
              <el-option label="幂等" value="Y"></el-option>
              <el-option label="非幂等" value="N"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="接口协议">
            <el-select size="small" v-model="form.ifProtocol" placeholder="接口协议">
              <el-option label="HTTP" value="HTTP"></el-option>
              <el-option label="HTTPS" value="HTTPS"></el-option>
              <el-option label="DUBBO" value="DUBBO"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属产品" prop="proId">
            <el-select size="small" v-model="form.proId" placeholder="所属产品">
              <el-option v-for="pro in $store.state.currentProject.proList"
                         :key="pro.id"
                         :label="pro.proName"
                         :value="`${pro.id}`"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="提醒关注" style="font-weight: 500">
          <el-select
            v-model="form.invokers"
            filterable
            multiple
            class="invokersearchbar"
            placeholder="请输关注者">
            <el-option
              v-for="item in this.$store.getters.currentMemberList"
              :style="item.avtSrc && `background-image:url(${item.avtSrc})`"
              class="invokeListItem"
              :key="item.email"
              :label="`${item.userName} <${item.email}>`"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <div class="board">
      <el-form :model="form">
        <h5>接口说明 <small>用途、调用事项、返回码、备注</small></h5>
        <el-form-item>
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 10}"
            placeholder="此处可填写接口说明、调用事项、返回码等"
            style="margin: 1rem 0"
            v-model="form.ifDesc">
          </el-input>
        </el-form-item>
      </el-form>
    </div>

    <!-- 请求参数模板 -->
    <div class="board" v-loading="loading">
      <param-editor type="REQ" ref="reqParams" :fields="form.reqFields" text="请求参数"></param-editor>
    </div>
    <!-- 响应参数模板 -->
    <div class="board" v-loading="loading">
      <param-editor type="RES" ref="resParams" :fields="form.resFields" text="返回参数"></param-editor>
    </div>
  </div>
</template>
<script>
  /* eslint-disable quotes */

  import utils from '@/lib/utils.js'
  const followIcon = res => require(['./Follow.vue'], res)
  const ParamEditor = res => require(['./ParamsEditor.vue'], res)

  import API from '@/lib/API'
  import {Message, MessageBox} from 'element-ui'
  export default {
    name: 'interface-editor',
    props: [
      'loading'
    ],
    data () {
      return {
        interfaceInfo: null,
        utils,
        form: {
          ifType: 'POST',
          id: 0,
          ifName: '',
          ifDesc: '',
          ifUrl: '',
          returnType: 'JSON',
          isIdempotent: 'N',
          ifProtocol: 'HTTP',
          proId: null,
          invokers: [],
          reqFields: [],
          rspFields: []
        },
        rules: {
          ifName: [
            { required: true, message: '请填写接口名', trigger: 'blur' },
            { min: 3, max: 40, message: '接口名名称为 3 到 40 个字符', trigger: 'blur' }
          ],
          ifUrl: [
            { required: true, message: '请填写接口地址', trigger: 'blur' },
            { min: 3, max: 100, message: '接口地址为 3 到 100 个字符', trigger: 'blur' }
          ],
          proId: [
            { required: true, message: '请填选择产品', trigger: 'change' }
          ]
        },
        memberList: this.$store.getters.currentMemberList
      }
    },
    created () {
      // 注册组件到store
      this.$store.state.interfaceEditor = this
    },
    mounted () {
      // 编辑模式下，将store中的值给 interfaceinfo
      if (this.isEditMode) this.interfaceInfo = this.$store.getters.currentInterfaceInfo
      // 一旦有值，则必然是在编辑模式下
      if (this.interfaceInfo) this.initInterfaceInfo(this.interfaceInfo)
      // 一旦没值，则需要继续判断
      if (!this.interfaceInfo) {
        // 若为编辑模式，则跳转出去
        if (this.isEditMode) {
          let ifId = this.$route.params.ifId
          this.$router.push('/view/' + ifId)
        }
        // 若为创建模式，则继续判断
        if (this.isCreateMode) {
          let pid = this.$store.getters.currentProjectId
          // 若PID不存在，则跳出去
          if (!pid) {
            this.$router.push('/')
          } else {
            // 否则尝试设置proId
            let proId = this.$store.getters.currentProductId
            this.form.proId = proId > 0 ? proId.toString() : null
          }
        }
      }
    },
    computed: {
      isEditMode: function () {
        // 处于编辑模式下
        return this.$route.name === 'editDetail'
      },
      isCreateMode: function () {
        // 处于编辑模式下
        return this.$route.name === 'creator'
      },
      feedListCount () {
        let count = 0
        this.interfaceInfo.feedList.some(it => {
          count += it.changesList.length
        })
        return count
      }
    },
    components: {
      ParamEditor,
      followIcon
    },
    methods: {
      editInterface (ifId) {
        this.$router.push(`/edit/${ifId}`)
      },
      saveInterfaceInfo (isAdvance) {
        let interfaceInfo = {
          ifId: this.form.id,
          interFaceInfo: {
            ifName: this.form.ifName,
            ifDesc: this.form.ifDesc,
            ifProId: this.form.proId,
            ifProtocol: this.form.ifProtocol,
            ifType: this.form.ifType,
            ifUrl: this.form.ifUrl,
            isIdempotent: this.form.isIdempotent,
            returnType: this.form.returnType
          },
          reqFields: this.$refs['reqParams'].fieldList,
          rspFields: this.$refs['resParams'].fieldList,
          invokerList: this.form.invokers
        }
        console.log(interfaceInfo)
        this.$refs['form'].validate((valid) => {
          if (valid) {
            MessageBox({
              title: '提醒',
              type: 'info',
              showCancelButton: true,
              message: `确认${interfaceInfo.ifId > 0 ? '修改' : '新建'}接口：${interfaceInfo.interFaceInfo.ifName}${isAdvance ? ',并推进版本' : ''}?`
            }).then((flag) => {
              if (flag === 'confirm') {
                console.log(interfaceInfo)
                // 保存接口左侧列表
                API.saveInterfaceDetail(interfaceInfo, isAdvance).then((data) => {
                  if (data.rspCd === '00000') {
                    Message({
                      message: `${interfaceInfo.ifId > 0 ? '修改' : '新建'}成功`,
                      type: 'success'
                    })
                    this.$router.push(`/view/${data.detail.ifId}`)
                    // 更新左侧列表
                    API.getInterfaceList(this.$store.getters.currentProjectId, this.form.proId, 1, true).then((data) => {
                      this.$store.commit('setInterfaceList', data.pageInfo)
                    })
                  } else {
                    Message({
                      message: data.rspInf || '接口返回异常',
                      type: 'danger'
                    })
                  }
                })
              }
            })
          }
        })
      },
      initInterfaceInfo (interfaceInfo) {
        if (interfaceInfo && interfaceInfo.basicInfo) {
          // proid转字符串，否则elemetui报错
          let proId = interfaceInfo.basicInfo.ifProId > 0 ? interfaceInfo.basicInfo.ifProId.toString() : null
          this.form = {
            id: interfaceInfo.basicInfo.id,
            ifName: interfaceInfo.basicInfo.ifName,
            ifDesc: interfaceInfo.basicInfo.ifDesc,
            ifUrl: interfaceInfo.basicInfo.ifUrl,
            ifType: interfaceInfo.basicInfo.ifType,
            returnType: interfaceInfo.basicInfo.returnType,
            isIdempotent: interfaceInfo.basicInfo.isIdempotent,
//            ifCreateTime: interfaceInfo.basicInfo.ifCreateTime,
            ifProtocol: interfaceInfo.basicInfo.ifProtocol,
            proId: proId,
            reqFields: interfaceInfo.reqFields,
            resFields: interfaceInfo.rspFields,
            invokers: []
          }
          // 将invoke列表转为 id列表
          // 界面才好显示
          let invokers = []
          interfaceInfo.invokers.some(it => {
            invokers.push(it.uId)
          })
          this.form.invokers = invokers
          // 当产品列表不存在时，重新请求产品列表
          if (this.$store.state.currentProject.proList.length === 0) {
            API.getAllProductInfo(interfaceInfo.basicInfo.pid).then(data => {
              let proList = data.proList
              let memberRoles = data.memberRoles
              this.$store.commit('setProList', proList)
              this.$store.commit('setMemberRoles', memberRoles)
            })
          }
          // 当成员列表不存在时，重新请求成员列表
          if (this.$store.getters.currentMemberList.length === 0) {
            API.getMemberList(interfaceInfo.basicInfo.pid).then(data => {
              let userInfos = data.userInfos
              this.$store.commit('setMemberList', userInfos)
            })
          }
        }
      }
    },
    watch: {
      'interfaceInfo': function (interfaceInfo) {
        this.initInterfaceInfo(interfaceInfo)
      }
    }
  }
</script>
<style scoped lang="scss">
  .invokeListItem{
    background-size: 2rem 2rem;
    background-position: .5rem;
    background-repeat: no-repeat;
    padding-left: 3rem;
    background-image: url(../../assets/default_face_pic@2x.png);
  }
  .invokersearchbar{
    width: 100%;
    margin-bottom: 1rem;
  }
  .el-form-item{
    margin-bottom: 0rem;
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
      padding: 0 1rem;
      width: 40rem;
      margin-bottom: 2rem;
      border-radius: .2rem;
      border: solid 1px #eee;
      box-shadow: 0 0 1rem #eee;
      h4,h5{
        margin: 0;
        padding: 1rem 0 0;
        font-size: 1.1rem;
        font-weight: 500;
        color: #434B53;
        line-height: 1.2rem;
        small{
          font-weight: 400;
          font-size: .75rem;
          color: #6D7B89;
        }
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
            border-top: 1px dashed #bfcbd9;
            border-bottom: 1px dashed #bfcbd9;
            margin: 1rem 0;
            padding: 1rem 0;
          }
        }
        #designer{
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
              font-weight: 400;
            }
          }
          .text-center{
            text-align: center;
          }
        }
      }
    }
  }


</style>
