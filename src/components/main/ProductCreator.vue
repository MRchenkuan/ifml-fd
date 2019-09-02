<template>
  <el-dialog
    title="创建产品"
    size="tiny"
    :visible.sync="productCreateVisible">
    <div style="margin: 20px;"></div>
    <el-form label-position="right" label-width="80px" ref="formName" :model="form" :rules="rules">
      <el-form-item label="产品名称" prop="productName">
        <el-input v-model="form.productName" placeholder="请填写产品名称"></el-input>
      </el-form-item>
      <el-form-item label="产品描述" prop="productDesc">
        <el-input v-model="form.productDesc" placeholder="请填写产品描述"></el-input>
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
    name: 'product-creator',
    data () {
      return {
        form: {
          productName: '',
          productDesc: ''
        },
        rules: {
          productName: [
            { required: true, message: '请填写产品名称', trigger: 'blur' },
            { min: 3, max: 10, message: '产品名称为 3 到 10 个字符', trigger: 'blur' }
          ],
          productDesc: [
            { required: true, message: '请输入产品描述', trigger: 'blur' },
            { min: 3, max: 40, message: '产品描述为 3 到 4 个字符', trigger: 'blur' }
          ]
        },
        productCreateVisible: false
      }
    },
    methods: {
      open () {
        this.productCreateVisible = true
        this.form.productDesc = ''
        this.form.productName = ''
      },
      submitInfo () {
        let pid = this.$store.getters.currentProjectId
        let productName = this.form.productName
        let productDesc = this.form.productDesc

        this.$refs['formName'].validate((valid) => {
          // 校验
          if (valid) {
            if (pid > 0) {
              MessageBox({
                title: '提醒',
                type: 'info',
                showCancelButton: true,
                message: `是否创建产品${productName}-${productDesc}`
              }).then((flag) => {
                if (flag === 'confirm') {
                  API.createProduct(pid, productName, productDesc).then(data => {
                    if (data.rspCd && data.rspCd === '00000') {
                      Message({
                        message: '创建成功',
                        type: 'success'
                      })
                      // 重新请求产品信息
                      API.getAllProductInfo(pid).then((data) => {
                        let proList = data.proList
                        let memberRoles = data.memberRoles
                        this.$store.commit('setProList', proList)
                        this.$store.commit('setMemberRoles', memberRoles)
                      })
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
            } else {
              Message({
                message: '缺少项目ID',
                type: 'error'
              })
            }
          }
          return false
        })
      },
      close () {
        this.productCreateVisible = false
        this.form.productDesc = ''
        this.form.productName = ''
      }
    }
  }
</script>
<style scoped lang="scss">
  .el-form{
    text-align: center;
  }
</style>
