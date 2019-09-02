<template>
    <pre class="jsonStr">
        {{json}}
    </pre>
</template>
<script>
  export default{
    name: 'params',
    props: ['params', 'json', 'title'],
    data () {
      return {
        viewType: 'table'
      }
    }
  }
</script>
<style scoped lang="scss">
  .board{
    /*width: 40rem;*/
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
      font-size: .8rem;
      color: #6D7B89;
      line-height: 1.2;
      padding: 0 1rem;
      background: #FBFBFB;
      box-shadow: inset 0 1px 0 0 #F2F3F6, inset 0 -1px 0 0 #F2F3F6;
    }
    .el-switch{
      float: right;
    }
  }
</style>
<style>
  .el-tabs__content{
    padding: 0;
  }
</style>
