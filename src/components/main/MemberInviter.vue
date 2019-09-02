<template>
  <el-dialog
    title="邀请项目成员"
    size="tiny"
    :visible.sync="dialogVisible">
    <el-radio-group v-model="memberType">
      <el-radio class="radio" label="member">项目成员</el-radio>
      <el-radio class="radio" label="visitor">访客</el-radio>
    </el-radio-group>
    <br>
    <el-select
      class="selector"
      v-model="selected"
      filterable
      remote
      placeholder="请输入用户邮箱"
      :remote-method="searching"
      :loading="loading">
      <el-option
        class="users"
        v-for="item in matches"
        :key="item.email"
        :label="item.userName + ` <${item.email}>`"
        :style="item.avtSrc && `background-image:url(${item.avtSrc})`"
        :value="item.id">
      </el-option>
    </el-select>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addProjectMember">确 定</el-button>
   </span>
  </el-dialog>
</template>

<script>
  import API from '@/lib/API.js'
  import { Message, MessageBox } from 'element-ui'
  export default {
    name: 'member-inviter',
    data () {
      return {
        matches: [],
        _matches: [],
        selected: null,
        list: [],
        loading: false,
        states: [],
        dialogVisible: false,
        memberType: 'visitor'
      }
    },
    mounted () {
      this.list = this.states.map(item => {
        return { value: item, label: item }
      })
    },
    methods: {
      searching (query) {
        if (query !== '') {
          this.loading = true
          setTimeout(() => {
            this.loading = false
            API.searchUsers(query, true).then(data => {
              this.matches = data.dataes
              this._matches = data.dataes
            })
          }, 200)
        } else {
          this.matches = []
        }
      },
      addProjectMember () {
        let pid = this.$store.getters.currentProjectId
        let userId = this.selected
        let memberType = this.memberType
        if (!pid) return Message('项目ID不存在')
        if (!userId) return Message('请选择要添加的用户')
        if (!memberType) return Message('成员类型未选择')
        let memberTypeName = this.getMemberTypeName(memberType)
        MessageBox({
          title: '提醒',
          type: 'info',
          showCancelButton: true,
          message: `是否添加当前用户为 "${memberTypeName}" ？`
        }).then((flag) => {
          if (flag === 'confirm') {
            API.addProjectMember(pid, null, userId, memberType).then(data => {
              if (data.rspCd === '00000') {
                this.dialogVisible = false
                Message('添加成功')
                location.reload()
              } else {
                Message(data.rspInf)
              }
            })
          }
        })
      },
      getMemberTypeName (memberType) {
        switch (memberType) {
          case 'member': return '项目成员'
          case 'visitor': return '访客'
          default: return '未知类型' + memberType
        }
      }
    }
  }
</script>
<style scoped lang="scss">
  .selector{
    width: 100%;
  }
  .users{
    background-image: url(../../assets/default_face_pic@2x.png);
    background-size: 2.5rem 100% ;
    background-position: left;
    padding-left: 3rem;
    background-repeat: no-repeat;
    margin: .5rem;
  }
</style>
