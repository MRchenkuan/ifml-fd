<template>
  <div>
    <header-bar></header-bar>
    <el-row>
      <el-col :span="2" :offset="1">
        <self-info></self-info>
      </el-col>
      <el-col :span="20">
        <projects></projects>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  const selfInfo = res => require(['@/components/index/SelfInfo.vue'], res)
  const headerBar = res => require(['@/components/HeaderBar.vue'], res)
  const projects = res => require(['@/components/index/projects.vue'], res)
  export default {
    name: 'index',
    data () {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    },
    components: {
      selfInfo,
      headerBar,
      projects
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-row{
    margin-top: 2rem;
  }
</style>
