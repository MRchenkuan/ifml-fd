<template>
  <el-dialog
    title="创建应用"
    size="tiny"
    :visible.sync="productCreateVisible">

    <div style="margin: 20px;"></div>
    <el-form label-position="right" ref="formName" :model="form" :rules="rules">
      <el-form-item prop="projectName">
        <el-input v-model="form.projectName" placeholder="请填写应用名称"></el-input>
      </el-form-item>
      <el-form-item prop="projectDesc">
        <el-input
          v-model="form.projectDesc"
          type="textarea"
          :rows="3"
          placeholder="请填写说明"></el-input>
      </el-form-item>
      <el-form-item label="标识颜色" prop="projectColor">
        <el-color-picker v-model="form.projectColor" show-alpha></el-color-picker>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="productCreateVisible = false">取 消</el-button>
      <el-button type="primary" @click='submitInfo()'>确 定</el-button>
    </div>

  </el-dialog>
</template>
<script>
  import { Message, MessageBox } from 'element-ui'
  import API from '@/lib/API'
  export default {
    name: 'project-creator',
    data () {
      return {
        form: {
          projectName: '',
          projectDesc: '',
          projectColor: '#11bb5d'
        },
        rules: {
          projectName: [
            { required: true, message: '请填写应用名称', trigger: 'blur' },
            { min: 3, max: 10, message: '产品名称为 3 到 10 个字符', trigger: 'blur' }
          ],
          projectDesc: [
            { required: true, message: '请输入描述', trigger: 'blur' },
            { min: 3, max: 40, message: '产品描述为 3 到 4 个字符', trigger: 'blur' }
          ]
        },
        productCreateVisible: false
      }
    },
    components: {
    },
    methods: {
      open () {
        this.productCreateVisible = true
      },
      submitInfo () {
        let projectName = this.form.projectName
        let projectDesc = this.form.projectDesc
        let projectColor = this.form.projectColor

        this.$refs['formName'].validate((valid) => {
          // 校验
          if (valid) {
            const h = this.$createElement
            const vNode = h('p', null, [
              h('p', null, `是否创建应用${projectName}-${projectDesc}：`),
              h('span', null, `主题色：`),
              h('i', { style: `width: 4.5rem;height: 1rem;background: ${this.form.projectColor};display: inline-block;vertical-align: top;` }, '')
            ])
            MessageBox({
              title: '提醒',
              type: 'info',
              showCancelButton: true,
              message: vNode
            }).then((flag) => {
              if (flag === 'confirm') {
                API.createProject(projectName, projectDesc, projectColor).then(data => {
                  if (data.rspCd && data.rspCd === '00000') {
                    Message({
                      message: '创建成功',
                      type: 'success'
                    })
                    location.reload()
                  } else {
                    MessageBox({
                      title: '提醒',
                      type: 'error',
                      message: data.rspInf || '创建失败'
                    })
                  }
                })
                this.close()
              }
            })
          }
          return false
        })
      },
      close () {
        this.productCreateVisible = false
      }
    }
  }
</script>
<style scoped lang="scss">
  .el-form{
    text-align: center;
  }
</style>
