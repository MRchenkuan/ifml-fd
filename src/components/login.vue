<template>
  <div class="loginPage">
    <div class="loginBox">
      <img src="../assets/main_logo@2x.png" alt="">
      <login-box></login-box>
      <p>© 2017 ifml.me <br><a>辽ICP备17010520号</a></p>
    </div>
  </div>
</template>
<script>
  const LoginBox = res => require(['./login/LoginBox'], res)

  export default{
    components: {LoginBox},
    data () {
      return {}
    }
  }
</script>
<style scoped lang="scss">
  .loginPage{
    background-image: url("../assets/home_page_background.jpg");
    background-size: cover;
    background-position: top;
    height: 100%;
    width: 100%;
    text-align: center;
    &:before{
      content: '';
      display: inline-block;
      height: 100%;
      vertical-align: middle;
      margin-right: -.25em;
    }
    .loginBox{
      img{
        margin-bottom: 4rem;
        width: 85%;
      }
      width: 350px;
      display: inline-block;
      vertical-align: middle;
      p{
        color: #939393;
        font-weight: 400;
        text-shadow: 0 1px 1px #fff,0 -1px 1px #c2c2c2;
        a{
          font-size: .85rem;
        }
        margin-top: 10rem;
        text-align: center;
      }
    }
  }
</style>
