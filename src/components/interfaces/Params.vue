<template>
  <div class="board">
    <h5>{{title}}
      <el-tooltip content="切换展示方式" placement="top">
        <el-switch
          v-model="viewType"
          on-color="#8492A6"
          off-color="#99A9BF"
          on-text="表格"
          off-text="JSON"
          on-value="table"
          off-value="json">
        </el-switch>
      </el-tooltip>
    </h5>

    <div v-show="viewType=='table'">
      <pre>{{fieldsPureString || "无"}}</pre>
      <table class="table table-bordered" cellspacing="0" cellpadding="0" border="0">
        <tbody>
        <tr>
          <th>参数名</th>
          <th v-if="type=='RSP'">MOCK</th>
          <th>类型</th>
          <th>说明</th>
          <th v-if="type=='REQ'">必须</th>
        </tr>
        <tr v-for="field in renderedFields">
          <td :style="'padding-left:'+(5+(field._indent)*30) +'px;color:'+field._color">{{field.k}}</td>

          <td v-if="type=='RSP'" width="4rem">{{field.mock || '无'}}</td>

          <td>{{typeDic(field.type)}}</td>

          <td>{{field.note || '无'}}</td>

          <td v-if="type=='REQ'">
            <el-tooltip v-if="field.req"  class="item" effect="light" content="必填项" placement="top-start">
              <i class="el-icon-circle-check" style="color: #20A0FF"></i>
            </el-tooltip>
            <el-tooltip v-else class="item" effect="light" content="可选项" placement="top-start">
              <i class="el-icon-more" style="color: #C0CCDA"></i>
            </el-tooltip>
          </td>

        </tr>
        </tbody>
      </table>
    </div>
    <pre v-show="viewType=='json'" class="jsonStr">{{json}}</pre>
  </div>
</template>
<script>
  import utils from '@/lib/utils.js'
  import fieldsTools from '@/lib/fieldsTools.js'
  export default{
    name: 'params',
    props: ['params', 'json', 'title', 'type'],
    data () {
      return {
        viewType: 'table'
      }
    },
    computed: {
      renderedFields () {
        let _fieldList = utils.deepCopyArrayObject(this.params)
        fieldsTools.transformFieldListParent(_fieldList)
        return fieldsTools.addStyle2Fields(_fieldList)
      },
      fieldsPureString () {
        let _fieldList = utils.deepCopyArrayObject(this.params)
        // 将ID组织形式的字段层级关系,转换为keyPath组织形式
        fieldsTools.transformFieldListParent(_fieldList)
        return fieldsTools.stringifyFields(_fieldList)
      }
    },
    methods: {
      typeDic (index) {
        let data = {
          1: 'STRING',
          2: 'NUMBER',
          3: 'OBJ',
          4: 'LIST[OBJ]',
          5: 'BOOL',
          6: 'NULL',
          7: 'ARRAY'
        }
        return data[index]
      }
    }
  }
</script>
<style scoped lang="scss">
  .board{
    /*width: 40rem;*/
    margin-bottom: 2rem;
    border-radius: .2rem;
    border: solid 1px #eee;
    box-shadow: 0 0 1rem #eee;
    h4,h5{
      margin: 1rem 0 0 0;
      padding: 1rem;
      font-size: 1.1rem;
      font-weight: 500;
      color: #434B53;
      line-height: 1.2rem;
    }
    h5{
      margin: 0;
      font-size: 1rem;
    }
    pre{
      white-space: pre-wrap;
      font-size: .8rem;
      color: #6D7B89;
      line-height: 1.2;
      padding: 1rem;
      margin: 0 0 1rem 0;
      background: #FBFBFB;
      box-shadow: inset 0 1px 0 0 #F2F3F6, inset 0 -1px 0 0 #F2F3F6;
    }
    .el-switch{
      float: right;
    }
    table{
      width: 100%;
      font-size: .8rem;
      color: #434B53;
      padding: 1rem;
      td,th{
        text-align: left;
        padding: .3rem;
      }
    }
  }


</style>
