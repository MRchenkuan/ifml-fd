<template>
  <div>
    <header-bar
      :minisize="justViewInterface"
      :proList="proList"
      :interfaceCreateBtn="!justViewInterface && !isEditInterface && !isCreateInterface"
      :memberBtn="!justViewInterface  && !isEditInterface && !isCreateInterface"
      :productsBtn="!justViewInterface"
      :searchBar="!justViewInterface && !isEditInterface && !isCreateInterface"
      :interfaceEditorBtnGroup="isEditInterface || isCreateInterface"
      :selfIcon="!justViewInterface"
    ></header-bar>
    <el-row v-if="!justViewInterface">
      <el-col class="leftside" :span="5">
        <interface-list v-loading="interfaceListLoading"></interface-list>
      </el-col>
      <el-col class="content" :span="19">
        <template v-if="$route.name == 'viewDetail'">
          <interface-detail ref="interfaceDetail" :ifeditable="true"></interface-detail>
        </template>
        <template v-if="$route.name == 'editDetail' || $route.name == 'creator'">
          <interface-editor ref="interfaceEditor"></interface-editor>
        </template>
      </el-col>
    </el-row>
    <interface-detail v-else :ifeditable="false"></interface-detail>
  </div>
</template>

<script>
  import API from '@/lib/API'
//  import utils from '@/lib/utils'
  const InterfaceEditor = res => require(['@/components/interfaces/InterfaceEditor.vue'], res)
  const InterfaceDetail = res => require(['@/components/interfaces/InterfaceDetail.vue'], res)
  const InterfaceList = res => require(['@/components/interfaces/InterfaceList.vue'], res)
  const headerBar = res => require(['@/components/HeaderBar.vue'], res)
  export default {
    name: 'main',
    data () {
      return {
//        interfaceList: {},
        interfaceListLoading: false,
        headerButtons: {
          interfaceCreateBtn: true,
          memberBtn: true,
          productsBtn: true,
          searchBar: true,
          selfIcon: true
        }
      }
    },
    components: {
      InterfaceEditor,
      headerBar,
      InterfaceDetail,
      InterfaceList
    },
    mounted () {
      let pid = this.$store.getters.currentProjectId
      let proId = this.$store.getters.currentProductId
      // 请求接口列表
      if (pid > 0 && proId > 0) {
        console.log(proId)
        this.interfaceListLoading = true
        API.getInterfaceList(pid, proId, 1, true).then((data) => {
          this.$store.commit('setInterfaceList', data.pageInfo)
          this.interfaceListLoading = false
        }).catch(() => {
          this.interfaceListLoading = false
        })
      }
    },
    methods: {
      // todo
    },
    computed: {
      proList: function () {
        return this.$store.getters.currentProductListForNav
      },
      justViewInterface: function () {
        // 访问其他地址不显示
        if (this.$route.name !== 'viewDetail') return false
        // 未选项目则显示
        return !this.$store.getters.currentProjectInfo
      },
      isEditInterface: function () {
        return this.$route.name === 'editDetail'
      },
      isViewInterface: function () {
        return this.$route.name === 'viewDetail'
      },
      isCreateInterface: function () {
        return this.$route.name === 'creator'
      }
    },
    watch: {
      '$store.getters.currentProductId': function (proId) {
        let pid = this.$store.getters.currentProjectId
        // 请求接口列表
        this.interfaceListLoading = true
        API.getInterfaceList(pid, proId, 1, true).then((data) => {
          this.$store.commit('setInterfaceList', data.pageInfo)
          this.interfaceListLoading = false
        }).catch(() => {
          this.interfaceListLoading = false
        })
      },
      '$store.getters.currentProductPageNum': function (pageNum) {
        let pid = this.$store.getters.currentProjectId
        let proId = this.$store.getters.currentProductId
        // 请求接口列表
        this.interfaceListLoading = true
        API.getInterfaceList(pid, proId, pageNum, true).then((data) => {
          this.$store.commit('setInterfaceList', data.pageInfo)
          this.interfaceListLoading = false
        }).catch(() => {
          this.interfaceListLoading = false
        })
      },
      '$store.getters.currentIfId': function (ifId, ifidOld) {
        // 接口发生变化时,
        // 更新接口 更新接口编辑框数据
        if (this.$refs['interfaceDetail']) {
          this.$refs['interfaceDetail'].getInterfaceInfo(ifId)
        }
      }
    }
  }

</script>

<style scoped lang="scss">
  .content,.leftside{
    min-height: 80vh;
  }
</style>
