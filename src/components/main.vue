<template>
  <div>
    <header-bar :proList="proList" :interfaceCreateBtn="true" :memberBtn="true" :productsBtn="true" :searchBar="true" :selfIcon="true"></header-bar>
    <el-row>
      <el-col :span="5" class="leftside">
        <!--<self-info></self-info>-->
        <interface-list :interfaceList="[]" v-loading="interfaceListLoading"></interface-list>
      </el-col>
      <el-col :span="19" class="content">
        <feed-list></feed-list>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import API from '@/lib/API'
  const InterfaceList = res => require(['./interfaces/InterfaceList'], res)
  const selfInfo = res => require(['@/components/index/SelfInfo.vue'], res)
  const FeedList = res => require(['@/components/main/FeedList.vue'], res)
  const headerBar = res => require(['@/components/HeaderBar.vue'], res)
  export default {
    name: 'main',
    data () {
      return {
        interfaceListLoading: false
      }
    },
    mounted () {
      // 从store中获取pid
      let pid = this.$store.getters.currentProjectId
      // 请求项目相关信息
      this.getAllProductInfo(pid)
    },
    components: {
      InterfaceList,
      selfInfo,
      headerBar,
      FeedList
    },
    methods: {
      getAllProductInfo (pid) {
        // 请求产品信息
        API.getAllProductInfo(pid).then((data) => {
          let proList = data.proList
          let memberRoles = data.memberRoles
          this.$store.commit('setProList', proList)
          this.$store.commit('setMemberRoles', memberRoles)
          this.proList = this.$store.getters.currentProductListForNav
        })
        // 请求项目成员
        API.getMemberList(pid).then((data) => {
          let userInfos = data.userInfos
          this.$store.commit('setMemberList', userInfos)
        })
      }
    },
    computed: {
      proList: function () {
        return this.$store.getters.currentProductListForNav
      }
    },
    watch: {
      '$store.getters.currentProjectId': function (pid) {
        // 请求项目相关信息
        this.getAllProductInfo(pid)
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .content,.leftside{
    min-height: 80vh;
  }
</style>
