<template>
  <el-row :gutter="2">
    <el-col :span="23" :offset="1">
      <h3>{{title}}</h3>
    </el-col>
    <el-col :span="5" :offset="1" v-for="card in list" :key="card.id">
      <el-card class="box-card" :style="`border-left-color: ${card.signColor||'#7e2d44'}`">
        <router-link tag="div" class="clearfix entry-link" :to="`/p/${card.id}`">
          <h4 class="projectName">{{card.projectName}}</h4>
          <h5 class="projectDesc">{{card.projectDesc}}</h5>
        </router-link>
        <br>
        <h6>应用成员({{card.members.length}})</h6>
        <div class="head-list">
          <el-tooltip
            v-for="head in card.members"
            :key="head.userName"
            :enterable="false"
            effect="dark"
            :content="head.userName"
            placement="top">
            <span class="head" :style="head.avtSrc?`background-image: url(${head.avtSrc})`:''">{{head.userName.substring(0,2)}}</span>
          </el-tooltip>
        </div>
      </el-card>
    </el-col>

    <el-col :span="5" :offset="1">
      <div @click="createProject" style="width: 100%;height: 100%">
      <el-card v-if="hasCreateBtn" class="createBtn box-card" >
          <p @click="createProject">+</p>
          <p @click="createProject">创建应用</p>
      </el-card>
      </div>
    </el-col>
    <project-creator ref="projectCreator"></project-creator>
  </el-row>
</template>
<style scoped lang="scss">
  .entry-link{
    cursor: pointer;
  }
  .head{
    background-image: url(../../assets/default_face_pic@2x.png);
    background-size: contain;
    height: 2rem;
    line-height: 2rem;
    color: #fff;
    font-size: .5em;
    text-shadow: 0 0 2px #000;
    text-align: center;
    width: 2rem;
    border-radius: 2rem;
    margin: .25rem;
    display: inline-block;
  }
  .clearfix{
    color:#202020;
    text-decoration: none;
  }
  .el-row{
    margin-bottom: 1rem;
  }
  .projectName,.projectDesc{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .box-card{
    height: 244px;
    overflow: hidden;
  }
  .el-card{
    margin: 1rem auto;
    border-left: 5px solid;
  }
  h4,h5,h6{margin: 0;padding: 0;font-size: 12px}
  h4{font-size: 1.5rem;font-weight: 300}
  h5{font-weight: 300}
  h6{font-weight: 400}

  .head-list{
    height: 5rem;
    overflow: auto;
  }

  .createBtn{
    cursor: pointer;
    border-left: 1px solid #d1dbe5;
    p{
      text-align: center;
      color: #2E96F7;
    }
  }

</style>
<script>
//  import ProjectCreator from './ProjectCreator'
  const ProjectCreator = res => require(['@/components/index/ProjectCreator.vue'], res)

  export default {
    components: {ProjectCreator},
    props: ['list', 'title', 'hasCreateBtn'],
    data () {
      return {
        msg: ''
      }
    },
    methods: {
      createProject () {
        this.$refs.projectCreator.open()
      }
    }
  }
</script>
