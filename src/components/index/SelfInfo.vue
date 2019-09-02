<template>
  <div v-if="userInfo">
    <div class="head">
      <img v-if="userInfo.avtSrc" :src="userInfo.avtSrc">
    </div>
    <h3>{{userInfo.userName}}</h3>
    <h5>{{userInfo.province}}·{{userInfo.city}}</h5>
    <h5>{{userInfo.email}}</h5>
    <h5>注册时间</h5>
    <h5>{{userInfo.registTime.substring(0,19)}}</h5>
    <h5>注册方式：{{channel(userInfo.channel)}}</h5>
    <hr>
    <h5>{{userInfo.followededCount}} 人关注了你的接口</h5>
    <h5>你设计了 {{userInfo.createdCount}} 个接口</h5>
    <h5>你关注了 {{userInfo.followedCount}} 个接口</h5>
    <el-button @click="logout">安全退出</el-button>
  </div>
</template>

<style scoped lang="scss">
  .el-button{
    margin-top: 2rem;
  }
  .head{
    width: 100%;
    background-image: url(../../assets/default_face_pic@2x.png);
    background-size: cover;
    background-position: center;
    min-height: 8vw;
    border-radius: .5rem;
    overflow: hidden;
    img{
      width: 100%;
    }
  }
  h3{
    margin: 0;
  }
  h5{
    color: #666;
    padding: 0;
    font-size: 12px;
    margin: .5rem 0;
    font-weight: 400;
  }
  hr{
    margin-top:7px;
    *margin: 0;
    border: 0;
    background-color: #aeaeae;
    height: 1px;
  }
</style>
<script>
  import API from '@/lib/API'
  import {MessageBox,Message} from 'element-ui'
  export default {
    name: 'self-info',
    data () {
      return {
        userInfo: null
      }
    },
    created () {
      API.whoAmI().then(data => {
        this.userInfo = data.userInfo
        if (!userInfo) {
          Message({
            message: '用户信息不存在',
            type: 'error'
          })
        } else {
          this.$store.state.userInfo = this.userInfo
        }
      })
    },
    methods: {
      channel () {
        switch (this.userInfo.channel) {
          case 1:return '内部注册'
          case 2:return '微信注册'
          case 3:return '邮箱注册'
          default :return `未知注册方式[${this.userInfo.channel}]`
        }
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
      }
    },
    watch: {
      '$store.getters.currentUserInfo': function (userInfo) {
        this.userInfo = userInfo
      }
    }
  }
</script>
