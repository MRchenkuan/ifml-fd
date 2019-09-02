<template>
  <span>
    <a v-if="isFollow" class="followed">
      <el-tooltip class="item" effect="dark" content="取消关注" placement="top">
        <i :class="isLoading ? 'el-icon-loading' : 'el-icon-star-on'" @click="cancelFollow"></i>
      </el-tooltip>
    </a>
    <a v-else class="follow">
      <el-tooltip class="item" effect="dark" content="关注该接口" placement="top">
        <i :class="isLoading ? 'el-icon-loading' : 'el-icon-star-off'" @click="doFollow"></i>
      </el-tooltip>
    </a>
  </span>
</template>
<script>
  import { Message } from 'element-ui'
  import API from '../../lib/API'
  export default{
    name: 'follow-icon',
    props: ['follow', 'ifId'],
    data () {
      return {
        isLoading: false,
        isFollow: false
      }
    },
//    computed: {
//      isFollow: function () {
//        return this.follow
//      }
//    },
    mounted () {
      this.isFollow = this.follow
    },
    watch: {
      ifId: function () {
        this.isFollow = this.follow
      }
    },
    methods: {
      doFollow () {
        if (this.isLoading) return
        this.isLoading = true
        API.followInterface(this.ifId, '手动关注', true).then((data) => {
          this.isLoading = false
          this.isFollow = data.follow
          Message({
            message: '关注成功此接口',
            duration: 1000
          })
        })
      },
      cancelFollow () {
        if (this.isLoading) return
        this.isLoading = true
        API.followInterface(this.ifId, '手动关注', true).then((data) => {
          this.isLoading = false
          this.isFollow = data.follow
          Message({
            message: '已经不再关注该接口',
            duration: 1000
          })
        })
      }
    }
  }
</script>
<style scoped lang="scss">
  .followed{
    color: #ffeb3b;
  }
</style>
