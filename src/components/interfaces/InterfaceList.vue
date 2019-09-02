<template>
  <div class="interfacelist">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">全部</el-breadcrumb-item>
      <el-breadcrumb-item>{{proName || '未选择产品'}}</el-breadcrumb-item>
    </el-breadcrumb>


    <ul v-if="hasData">
      <li v-for="ifinfo in interfaceList.list" @click="openDetail(ifinfo.id)" :class="ifinfo.id==$store.getters.currentIfId ? `active`: ``">
        <span class="ifid">{{ifinfo.id}}</span>
        <span class="ifname" :title="ifinfo.ifName">{{ifinfo.ifName}}</span>
        <span class="signs">
          <span v-if="ifinfo.inAutoTest == 'Y'" class="inAutoTest">⚡️</span>
          <span v-if="ifinfo.isIdempotent == 'Y'" class="isIdempotent">🌲️</span>
          <span v-if="ifinfo.followed" class="followed">👓️</span>
        </span>
      </li>
    </ul>
    <p v-else style="text-align: center; color: #97a8be;height: 20rem;line-height: 20rem">暂无数据</p>

    <el-pagination v-if="interfaceList.size>0"
      layout="prev, pager, next"
      :page-count="interfaceList.pages"
      :page-size="interfaceList.size"
      :current-page="interfaceList.pageNum"
      @current-change="currentChange"
    >
    </el-pagination>
  </div>
</template>
<script>
  export default {
    name: 'interface-list',
//    props: ['interfaceList'],
    data () {
      return {}
    },
    mounted () {
      this.$store.commit('setInterfaceList', {})
    },
    computed: {
      proName: function () {
        let currentInfo = this.$store.getters.currentProductInfo
        if (currentInfo) {
          return currentInfo.proName
        } else {
          return null
        }
      },
      interfaceList: function () {
        return this.$store.getters.interfaceList
      },
      hasData: function () {
        let list = this.interfaceList.list
        return list && (list.length > 0)
      }
//      computedInterfaceList: function () {
//        return this.interfaceList || {}
//      }
    },
    methods: {
      currentChange (currentPage) {
        console.log('currentPage', currentPage)
        this.$router.push(`/g/${this.$store.getters.currentProductId}/${currentPage}`)
      },
      openDetail (ifId) {
        this.$router.push(`/view/${ifId}`)
      }
    }
  }
</script>
<style scoped lang="scss">
  .interfacelist{
    width: 100%;
    height: 100%;
    border: 1px solid #eee;
    border-top: none;
    box-sizing: border-box;
    font-size: .85rem;
    .el-breadcrumb{
      padding: 1rem;
      border-bottom: 1px solid #eee;
    }
    .el-pagination{
      text-align: right;
    }
    ul{
      list-style: none;
      margin: 0;
      padding: 1rem 0;
      font-size: .8rem;
      min-height: 20rem;
      max-height: 70vh;
      overflow: auto;
      li{
        overflow: hidden;
        position: relative;
        padding: 0 1rem;
        line-height: 2.5;
        .ifid{
          max-width: 15%;
          margin-right: .5rem;
          color:#20A0FF;
          float: left;
        }
        .ifname{
          color: #6D7B89;
          max-width: 70%;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          /*font-weight: 300;*/
          float: left;
        }
        .signs{
          position: absolute;
          right:1rem;
          span{
            color:#20A0FF;
            float: right;
          }
        }
        &:hover,&.active{
          background: #F2F3F6;
        }
      }
    }
    .block{
      margin: auto;
    }
  }
</style>
