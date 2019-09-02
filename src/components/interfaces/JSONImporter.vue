<template>
  <el-dialog
    title="JSON 导入"
    :visible.sync="dialogVisible"
    :lock-scroll=true
    size="small"
  >
    <el-alert
      :title="isFormat?'验证成功':'JSON格式有误，请检查输入'"
      :type="isFormat?'info':'warning'"
      :description = "isFormat?'没有发现错误!':('发现错误：'+err_msg)"
      :closable = false
      style="margin-bottom: 1rem"
      show-icon>
    </el-alert>
    <el-input v-show="!isShow"
              @blur="showPlayer"
              type="textarea"
              :autosize="{ minRows: 10}"
              placeholder="请填写标准的json"
              v-model="json"
              ref="input"
    >
    </el-input>
    <div v-show="isShow" @click="hidePlayer" id="player" ref="player"></div>
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="save">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>

  export default {
    data() {
      return {
        dialogVisible: false,
        json:"",
        cb:null,
        isShow:true,
        jsonObj:{},
        err_msg:"right input!"
      };
    },
    created(){
      this.$store.state.jsonImporter = this;
    },
    computed:{
      isFormat : function () {
        let isFormat = true;
        try{
          this.jsonObj = JSON.parse(this.json)
          isFormat = true;
        }catch(e){
          this.err_msg = e.message
          isFormat = false
        }
        return isFormat
      }
    },
    methods: {
      open(handle){
        this.json = handle.json
        this.cb = handle.cb

        this.dialogVisible = true;
        this.showPlayer()
      },
      showPlayer(){
        if(!this.isFormat)return this.hidePlayer()
        this.isShow = true
        setTimeout(()=>{
          let player = this.$refs['player'];
          let $player = $(player);
          $player.JSONView(this.jsonObj)
        },0)
      },
      hidePlayer(){
        this.isShow = false
        setTimeout(()=>{
          let textarea = this.$refs['input'].$refs['textarea'];
          let $textarea = $(textarea)
          $textarea.focus()
        },0)
      },
      save(){
        if(!this.isFormat)return
        this.cb(this.json);
        this.dialogVisible = false;
      },

    }
  };
</script>
