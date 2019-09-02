<template>
  <div>
    <el-row :gutter="1">
      <project-cards :list="management" title="我的应用" :hasCreateBtn="true"></project-cards>
    </el-row>
    <el-row :gutter="1">
      <project-cards :list="participate" title="参与的应用"></project-cards>
    </el-row>
  </div>
</template>

<script>
  import API from '@/lib/API'
  const projectCards = res => require(['@/components/index/ProjectCards.vue'], res)

  export default {
    name: 'projects',
    data () {
      return {
        management: [],
        participate: []
      }
    },
    components: {
      projectCards
    },
    created () {
      API.getAllProjectInfo().then((data) => {
        let projectInfo = data.projectInfo
        if (projectInfo) {
          this.$store.commit('setProjectList', projectInfo)
          projectInfo.some(it => {
            // 根据当前用户角色来对参与的项目分类
            if (~~it.asRole === 0) {
              this.management.push(it)
            } else {
              this.participate.push(it)
            }
          })
        }
        console.log(this.management)
      })
    }
  }
</script>
