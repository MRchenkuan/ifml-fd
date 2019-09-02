<template>
  <el-card>
    <el-tabs v-model="activeName">
      <el-tab-pane label="登录" name="login">
        <el-form :model="login" ref="loginForm" :rules="rules.login">
          <el-form-item prop="email"><el-input v-model="login.email" placeholder="登录邮箱/账号"></el-input></el-form-item>
          <el-form-item prop="password"><el-input v-model="login.password" type="password" placeholder="登录密码"></el-input></el-form-item>
          <el-button type="primary" size="large" style="width: 100%;margin-top: 1rem" @click="doLogin" :loading="loginLoading">登录</el-button>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="注册" name="regist">
        <el-form :model="regist" ref="registForm" :rules="rules.regist">
          <el-form-item prop="email"><el-input v-model="regist.email" placeholder="请输入邮箱"></el-input></el-form-item>
          <el-form-item prop="password"><el-input v-model="regist.password" type="password" placeholder="请输入密码"></el-input></el-form-item>
          <el-form-item prop="nickname"><el-input v-model="regist.nickname" placeholder="昵称"></el-input></el-form-item>
          <el-button type="primary" size="large" style="width: 100%;margin-top: 1rem" @click="doRegist" :loading="registLoading">注册</el-button>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <!-- 注册面板 -->
    <div v-show="sendSuccess" class="regShader">
      <p class="right"><i class="el-icon-circle-check"></i></p>
      <p class="title">注册成功</p>
      <p class="subtitle">激活邮件已发送到 <span class="email">
        <a :href="`http://mail.${emailEnd}`" target="_blank">{{regist.email}}</a>
      </span><br>请查收邮件激活账户，即可正常登录</p>
      <p class="customEmailLink"><a :href="`http://mail.${emailEnd}`" target="_blank">前往验证 <i class="el-icon-d-arrow-right"></i></a></p>
    </div>
  </el-card>
</template>
<script>
  import API from '@/lib/API'
//  import ElButton from 'element-ui/packages/button/src/button'
//  import ElCard from 'element-ui/packages/card/src/main'
//  import ElInput from 'element-ui/packages/input/src/input'
//  import ElForm from '../../../node_modules/element-ui/packages/form/src/form'

//  const ElButton = res => require(['element-ui/packages/button/src/button'], res)
//  const ElCard = res => require(['element-ui/packages/card/src/main'], res)
//  const ElInput = res => require(['element-ui/packages/input/src/input'], res)
//  const ElForm = res => require(['element-ui/packages/form/src/form'], res)

//  const ElButton = () => import('element-ui/packages/button/src/button')
//  const ElCard = () => import('element-ui/packages/card/src/main')
//  const ElInput = () => import('element-ui/packages/input/src/input')
//  const ElForm = () => import('element-ui/packages/form/src/form')

//  const MessageBox = res => require(['element-ui'], res)

  import {MessageBox, Button as ElButton, Card as ElCard, Input as ElInput, Form as ElForm} from 'element-ui'
  export default{
    name: 'login-box',
    components: {
      ElForm,
      ElInput,
      ElCard,
      ElButton},
    data () {
      let emailRegx = /^[A-Za-z0-9\u4e00-\u9fa5]+@([a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+)$/g
      let validateRegEmail = (rule, value, callback) => {
        let email = this.regist.email
        if (!email.match(emailRegx) || email.match(emailRegx).length <= 0) {
          callback(new Error('邮箱格式不对'))
        }
        callback()
      }
      return {
        activeName: 'login',
        loginLoading: false,
        registLoading: false,
        sendSuccess: false,
        emailRegx: emailRegx,
        emailEnd: '',
        login: {
          email: '',
          password: ''
        },
        regist: {
          email: '',
          password: '',
          nickname: ''
        },
        rules: {
          login: {
            email: [
              { required: true, message: '请填登录账号', trigger: 'blur' }
            ],
            password: [
              { required: true, message: '请输入描述', trigger: 'blur' }
            ]
          },
          regist: {
            email: [
              { required: true, message: '请填写邮箱', trigger: 'blur' },
              { validator: validateRegEmail, trigger: 'blur' }
            ],
            password: [
              { required: true, message: '请输入描述', trigger: 'blur' },
              { min: 6, max: 40, message: '产品描述为 6 到 4 个字符', trigger: 'blur' }
            ],
            nickname: [
              { min: 3, max: 40, message: '产品描述为 3 到 4 个字符', trigger: 'blur' }
            ]
          }
        }
      }
    },
    methods: {
      doLogin () {
        this.$refs['loginForm'].validate(async (valid) => {
          if (!valid) return false
          this.loginLoading = true
          await API.login(this.login.email, this.login.password, true).then((data) => {
            if (data.rspCd === '00000') {
              this.$router.push('/')
            } else if (data.rspCd === 'D0000') {
              MessageBox({
                message: `账号或者密码错误`,
                type: 'error'
              })
            } else {
              MessageBox({message: `${data.rspInf}`, type: 'error'})
            }
            console.log(data)
          })
          this.loginLoading = false
        })
      },
      doRegist () {
        this.$refs['registForm'].validate(async (valid) => {
          if (!valid) return false
          this.registLoading = true
          await API.regByEmail(this.regist.nickname, this.regist.email, this.regist.password, true).then((data) => {
            if (data.rspCd === '00000') {
              this.sendSuccess = true
              this.emailEnd = this.emailRegx.exec(this.regist.email)[1]
            } else {
              MessageBox({message: `${data.rspInf}`, type: 'error'})
            }
            console.log(data)
          })
          this.registLoading = false
        })
      }
    }
  }
</script>
<style scoped lang="scss">
  .el-input{
    margin-top: 1rem;
  }
  .el-card{
    position: relative;
  }

  .regShader{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    background-color: #ffffff;
    z-index: 999;
    p{
      margin: 1rem auto;
    }
    .right{
      color: #13ce66;
      font-size: 4rem;
      margin-top: 2rem;
    }
    .title{
      font-size: 1.5rem;
      color: #6D7B89;
    }
    .subtitle{
      font-size: .75rem;
      color: #A0ABB7;
      .email{
        color: #2E96F7;
      }
      a{
        color: #2E96F7;
        text-decoration: none;
      }
    }
    .customEmailLink{
      a{
        color: #2E96F7;
        font-size: 1rem;
        text-decoration: none;
      }
    }
  }
</style>
