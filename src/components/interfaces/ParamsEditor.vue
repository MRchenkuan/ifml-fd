<template>
  <div id="editor_reqBody" class="panel panel-default ifInfoBlock">
    <h5>{{text}}
      <div class="addItems">
        <el-button size="small" @click="addRootField">增加根节点</el-button>
        <el-button size="small" type="primary" @click="addFieldFromJSON">导入JSON</el-button>
      </div>
    </h5>
    <table v-if="fieldList.length>0" border="0" cellspacing="0" cellpadding="0">
      <tbody>
      <tr>
        <th>参数</th>
        <th>MOCK</th>
        <th>说明</th>
        <th>类型</th>
        <th v-if="hasReqField">必须</th>
      </tr>
      <tr class="field-code-editor" v-for="(field, $i) in fieldList">
        <td class="field-input td-operations" :style="'padding-left:'+(field._indent)*30+'px'">
          <input class="field-key-input" type="text" v-model="field.k" :style="'color:'+ field._color">
          <el-button-group class="td-operation">
            <el-button title="增加同级节点" size="small" type="success" icon="caret-left" @click='addNewSiblingField(field)'></el-button>
            <el-button title="增加子节点" size="small" type="success" icon="caret-bottom" @click='addNewChildField(field)'></el-button>
            <el-button title="删除节点" size="small" type="danger" icon="delete" @click="deleteFields(field)"></el-button>
          </el-button-group>
        </td>
        <td class="field-input">
          <input type="text" v-model="field.mock">
        </td>
        <td class="field-input">
          <input type="text" v-model="field.note" placeholder="暂未填写说明"></td>
        <td class="field-input">
          <select v-model="field.type" size="mini">
            <option v-if="!hasChildren(field._level)" label="string" value="1">string</option>
            <option v-if="!hasChildren(field._level)" label="number" value="2">number</option>
            <option label="object" value="3">object</option>
            <option label="list[obj]" value="4">list[obj]</option>
            <option v-if="!hasChildren(field._level)" label="boolean" value="5">boolean</option>
            <option v-if="!hasChildren(field._level)" label="null" value="6">null</option>
            <option v-if="!hasChildren(field._level)" label="array" value="7">array</option>
          </select>
          <span class="lineNum" v-if="!hasReqField">{{$i + 1}}</span>
        </td>
        <td class="td-operations" v-if="hasReqField">
          <el-checkbox-group v-model="field.req">
            <el-checkbox></el-checkbox>
          </el-checkbox-group>
          <span class="lineNum">{{$i + 1}}</span>
        </td>
      </tr>
      </tbody>
    </table>
    <JSONImporter></JSONImporter>
  </div>
</template>
<script>
  /* eslint-disable indent,quotes,semi,eqeqeq,keyword-spacing,space-infix-ops,semi-spacing,space-before-blocks,comma-spacing,space-before-function-paren,curly,one-var */
  import { Message } from 'element-ui'

  import utils from '@/lib/utils.js'
  import fieldsTools from '@/lib/fieldsTools.js'
  const JSONImporter = res => require(['@/components/interfaces/JSONImporter.vue'], res)
  export default{
    name: 'param-editor',
    props: ['type', 'fields', 'text'],
    components: {
      JSONImporter
    },
    data () {
      return {
        // 缩进颜色
        colors: ["#b33c39", "#6a6fff", "#53bb57", "#ff1cdc", "#5ab4a6", "#ada662"],
        fieldList: [],
        prmSummaryBak: [],
        hasReqField: this.type === 'REQ',
        levelParentMap: {}
      }
    },
    watch: {
      'fields': function (fields) {
        this.prmSummaryBak = utils.deepCopyArrayObject(fields)
        this.fieldList = utils.deepCopyArrayObject(fields)
        this.reRenderFields();
      }
    },
    created(){
      let fields = this.fields
      this.prmSummaryBak = utils.deepCopyArrayObject(fields)
      this.fieldList = utils.deepCopyArrayObject(fields)
      this.reRenderFields();
    },
    methods: {
      checkField(field) {

      },
      hasChildren(_level){
        _level = _level+'-'
        for(let k in this.levelParentMap){
          if(k.length>_level.length && k.indexOf(_level)>=0){
            return true;
          }
        }
      },

//      // 参数列表JSON化
      stringifyFields: function () {
        // 当前所有参数列表
        var nowList = this.fieldList;
        if (!nowList) {
          // 当前字段列表不存在时的逻辑
          return "/*不存在list*/{}";
        }
        var value = {};
        // 1.由于参数列表可能发生修改,json的组织,依赖于parent,需要重新组织parent
        fieldsTools.reorganizeParent(nowList);
        // 2.组织json
        fieldsTools.relatedList2JSON(value, nowList, nowList);
        return JSON.stringify(value, null, 3)
      },
      addRootField () {
        this.addChildFieldByLevel("0");
      },
      addNewSiblingField (field) {
        var currentLevel = field._level;
        var currentLevelArr = currentLevel.split("-");
        currentLevelArr.pop();
        var parentLevel = currentLevelArr.join("-");
        this.addChildFieldByLevel(parentLevel)
      },
      addNewChildField (field) {
        // 获取当前节点level
        var fieldLevel = field._level;
        this.addChildFieldByLevel(fieldLevel)
        // 若当前节点非对象，则改为对象
        if(field.type !== "4" && field.type !== "3"){
          field.type = "3"
        }
      },
      addFieldFromJSON () {
//        var self = this;
        this.$store.dispatch('fillDatesToJsonExporter', {
          json:this.stringifyFields(),
          cb:this.fillJSONAsItems
        });
      },
      // 新增子节点
      addChildFieldByLevel (fieldLevel) {
        // todo 在节点增加之前渲染了一次，暂时未想到原因，先注释
        // todo 好像会导致重复判断的时机延后
        this.reRenderFields();
        let parentKey = this.getParentKeyByLevel(fieldLevel)
        // 获取映射关系表
        let fieldList = this.fieldList;
        // 获取当前节点length
        var childIndex = this.getChildIndexByLevel(fieldLevel);
        var childLevel = fieldLevel + "-" + childIndex;
        var colors = this.colors;
        var indent = childLevel.split("-").length - 2;

        // 新建对象并初始化
        var newField = {};
        newField._level = childLevel;
        newField._color = colors[indent];
        newField._indent = indent;
        // 设置默认属性
        newField.id = "";
        newField.k = "";
        newField.parent = parentKey; // 必须
        newField.mock = "null";
        newField.type = "1"; // 默认为 string
        newField.note = ""; // 必须
        newField.req = true;

        var editingCode = {};
        var editingLineNumber = 0;
        // 空校验
        var isEmpty = fieldList.some(function (it, id) {
          // 判断提交是否和初始空值相重复
          // 即:level前缀相同,并且参数名相同
          if (fieldsTools.isSameLevel(it._level, newField._level) && it.k == newField.k) {
            editingCode = it;
            editingLineNumber = id + 1;
            return true;
          } else {
            return false;
          }
        });
        // 重复校验
        var hasRepeat = this.fieldsRepeatCheck();

        // 插入
        if (isEmpty) {
          Message({
            message: "第 " + editingLineNumber + " 行未定义参数:\n\n\t参数:" + editingCode.k + "\n\t说明:" + editingCode.note,
            type: 'error'
          })
        } else if (hasRepeat) {
          Message({
            message: "第 " + hasRepeat.comparedLine + " 行与第 " + hasRepeat.compareLine + " 行参数重复:\n\n\t参数:" + hasRepeat.repeatItem.k + "\n\t说明:" + hasRepeat.repeatItem.note,
            type: 'error'
          })
        } else {
          fieldList.push(newField);
          fieldsTools.addStyle2Fields(fieldList, this.levelParentMap)
        }
      },
      getParentKeyByLevel (level) {
        let keyPath = this.levelParentMap[level]
        console.log(this.levelParentMap, level, keyPath)
        return keyPath || ''
      },
      deleteFields(field){
        var parentLevel = field._level;
        var fields = this.fieldList;
        if (field) {
          // 删除本身和子节点
          // 逆序遍历的原因在于
          // 由于js的原因,正序遍历会导致索引变化使遍历中断
          for (var i = fields.length; i > 0; i--) {
            var it = fields[i - 1];
            var currentLevel = it._level;
            if (currentLevel.indexOf(parentLevel) == 0) {
              fields.splice(i - 1, 1);
            } else {}
            delete this.levelParentMap[currentLevel]
          }
        }
        this.reRenderFields();
        delete this.levelParentMap[parentLevel]
      },
      /**
       *
       * 包装,并重设返回参数列表
       * */
      reRenderFields(){
        let colors = this.colors;
        let fields = this.fieldList;
        // 将ID组织形式的字段层级关系,
        // 转换为keyPath组织形式
        fieldsTools.transformFieldListParent(fields);
        // 渲染LEVEL到参数列表
        fieldsTools.wrapFieldsLevel(fields, this.levelParentMap);
        fields.forEach((it) => {
          if (it.hasOwnProperty("_level")) {
            // 确认缩进
            let indent = it._level.split("-").length - 2;
            it._indent = indent;
            // 确认颜色
            it._color = colors[indent];
          } else {
            console.log("渲染失败,渲染前,请确认field对象已经加入了level")
          }
        });
        // 触发重绘
        this.fieldList = fields;
      },
      /**
       *  校验当前类型参数是否存在重复
       *  返回校验结果
       *  */
      fieldsRepeatCheck(){
        // 当前列表
        var nowList = this.fieldList;
        if (!nowList) {
          // 当前字段列表不存在时的逻辑
          // todo 弹框等处理
          return false;
        }
        // 比较行数
        var operLine = 0;
        // 重复对象
        var repeatItem;
        // 参照行数
        var comparedLine = 0;
        var ifRepeat = nowList.some(function (operateItem, id) {
          // 当前被比较的行数自增
          operLine++;
          // 重复次数 [1,1<<]
          var repeatCount = 0;
          // 参照行数
          var _comparedLine = 0;
          // 重复次数该是1 ,发现相同则应该大于1
          return nowList.some(function (compareItem) {
            // 当前参照的行数自增
            _comparedLine++;
            // 转存
            comparedLine = _comparedLine;
            // 比较二元是否一致
            if (fieldsTools.isSameLevel(operateItem._level, compareItem._level) && operateItem.k == compareItem.k)
              repeatCount++;

            // 发现发现重复则
            if (repeatCount > 1) {
              // 确定重复对象
              repeatItem = compareItem;
              return true;
            } else {
              return false;
            }
          });
        });
        return ifRepeat ? {
          compareLine: operLine,
          comparedLine: comparedLine,
          repeatItem: repeatItem
        } : false;
      },
      /**
       * 计算当前层级关系下,子节点应该的取值
       * 如:
       * 0-1-1-1 下的节点
       * 0-1-1-1-10
       * 0-1-1-1-55
       * 最新的子节点取值应该是
       * 0-1-1-1-56
       * 具体算法为:
       * 1.找到与正则 0-1-1-1-\d* 相匹配的元素
       * 2.取出最后一个数字,拼到数组
       * 3.Math.max + 1
       * @param level
       * @param fieldList
       * @returns {number}
       */
      getChildIndexByLevel(level){
        var fieldList = this.fieldList;
        var childrenIndexes = [];
        var reg = new RegExp("^" + level + '-(\\d+)$', 'gi');
        fieldList.forEach(function (field) {
          reg.lastIndex = 0;// 重置游标
          var $level = field._level;
          var result = reg.exec($level);
          if (result && result[1]) {
            childrenIndexes.push(result[1])
          }
        });
        var maxIndex = 0;
        if (childrenIndexes.length > 0) {
          maxIndex = Math.max.apply(Math, childrenIndexes);
        }

        return maxIndex + 1;
      },
      /**
       * 导入参数方法
       */
      fillJSONAsItems(json){
        var JSONObj = eval("(" + json + ")");
        // 编辑框中,列表化的field数据
        var fieldList = fieldsTools.JSON2relatedList(JSONObj);
        // 已有的field数据
        var existFieldList = this.fieldList;

        // 去重
        var filteredField = [];
        fieldList.forEach((now) => {
          var now_parent = now.parent.replace(" ", "");
          var now_k = now.k.replace(" ", "");
          var isExist = existFieldList.some(function (prm, id, ar) {
            var prm_parent = prm.parent.replace(" ", "");
            var prm_k = prm.k.replace(" ", "");
            var prm_req = prm.req;
            var prm_note = prm.note;
            // 存在相等的
            if (prm_parent == now_parent && prm_k == now_k) {
              //相等则更新,顺便除空格 xxxxxxx 不能用原始信息,因为路径已经发生改变 x.x
              now.id = prm.id;// ID不变
              now.req = prm_req; // 勾选状态不变
              now.note = prm_note; // 字段说明不变
              // 保存已有的字段
              filteredField.push(now);
              return true
            } else {
              return false;
            }
          });
          // now 为新增的字段
          if (!isExist) {
            // 进一步判断,新增字段是否和原始数据存在一致
            // 此操作主要是为了避免同一字段改来改来改去最后ID丢失的情况
            var prmExist = this.prmSummaryBak.some(function (primItem) {
              if (primItem.parent == now_parent && primItem.k.replace(" ", "") == now_k) {
                now.id = primItem.id;
                now.req = primItem.req;
                now.note = primItem.note;
                filteredField.push(now);
                return true
              } else {
                return false
              }
            });
            // 不相等则收集传出
            if (!prmExist) {
              now.id = "";
              filteredField.push(now);
            }

          }
        });
        // 重设参数列表
        this.fieldList = filteredField;
        this.reRenderFields();
      }
    }
  }
</script>
<style scoped lang="scss" rel="stylesheet/scss">
  table{
    width: 100%;
    margin: 1rem 0;
    border-left: 1px solid #bfcbd9;
    border-bottom: 1px solid #bfcbd9;
    td,th{
      border-top: 1px solid #bfcbd9;
      border-right: 1px solid #bfcbd9;
    }
    th{
      padding: .5rem 0;
      font-size: .85rem;
    }
  }

  .lineNum{
    position: absolute;
    top: 0;
    line-height: 28px;
    padding: 0 3px;
    border: 1px solid #ddd;
    border-radius: 0 5px 5px 0;
    background: #c1c1c1;
    color: #fff;
    left: 100%;
  }

  /* 参数导入编辑框 */
  .field-code-editor {
    .field-input {
      padding: 0 .5rem;
      line-height: 28px;
      input {
        border: none;
        width: 100%;
        line-height: 28px;
      }
      &:last-child {
        position: relative;
      }
    }
  }
  h4,h5{
    margin: 0;
    padding: 1rem 0;
    font-size: 1.1rem;
    font-weight: 500;
    color: #434B53;
    line-height: 1.2rem;
  }
  .addItems{
    float: right;
  }
  .td-operation {
    position: absolute;
    left: 99%;
    top: 0;
    width: 120px;
    display: none;
    button {
      margin: 0 1px;
      float: left;
    }
  }

  .td-operations {
    position: relative;
    text-align: center;
  }

  .td-operations:hover .td-operation {
    display: block;
  }

  .field-key-input {
    border:none;
    border-left: 1px solid #bfcbd9 !important
  }
</style>
