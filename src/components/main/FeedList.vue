<template>
  <div v-cloak>
    <div class="feedList" :class="noData" v-loading="loading">
      <div v-for="feed in feedList" class="block">
        <h4 class="oper">{{feed.oper}}<span class="ts">{{feed.ts}}</span></h4>
        <p  v-for="detail in feed.changesList">
          <span v-if='detail.optionType == "修改"' class="mod">{{detail.optionType}}</span>
          <span v-if='detail.optionType == "新增"' class="new">{{detail.optionType}}</span>
          <span v-if='detail.optionType == "删除"' class="del">{{detail.optionType}}</span> 了
          <span><router-link :to="{path:'/view/'+detail.ifId}">[{{detail.ifId}} {{detail.ifName}}] </router-link> </span>
          <span v-if="detail.changeType">的 {{detail.changeType}}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>

  import API from '@/lib/API'

  export default{
    name: 'feed-list',
    data () {
      return {
        feedList: [],
        loading: true,
        noData: ''
      }
    },
    mounted () {
      let pid = this.$store.getters.currentProjectId
      this.loading = true
      API.getFeedList(pid, true).then((data) => {
        this.feedList = data['feedsList']
        // 加载不出数据则展示默认提示
        if (!this.feedList || this.feedList.length <= 0) {
          this.noData = 'noData'
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .feedList {
    width: 800px;
    min-height: 500px;
    float: left;
    margin-left: 3rem;
    font-size: 12px;
    font-weight: 400;
    color:#434B53;
    &.noData{
      margin-top: 20vh;
      &:before{
        font-family: 'element-icons'!important;
        content: '\E623 没有变更记录，创建接口，或切换产品';
        display: block;
        height: 100%;
        width: 100%;
        text-align: center;
      }
    }
    .ts{float: right}
    .block{
      border-bottom: 1px solid #ccc;
      margin-bottom: 15px;
    }
    .mod{color:#2cb6bb!important;  font-weight: 500}
    .new{color:#53bb57  ;font-weight: 500}
    .del{color:#ff4e44;font-weight: 500}
    .ifName{color: #2cb6bb;}
    a{color:#2cb6bb;font-weight: 500;text-decoration: underline}
    .oper{
      font-weight: 500;
      color: #666
    }
  }
</style>
