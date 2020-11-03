<template>
    <el-dialog :close-on-click-modal="false" :title="title"
    :visible.sync="visible" width="800px">
    <el-row :gutter="20">
     <!--部门数据-->
      <!-- <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="请输入部门名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="goodsTypeList"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col> -->
     <el-col :span="24" :xs="24">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="商品名称" prop="goodsName">
        <el-input style="width:200px"
          v-model="queryParams.goodsName"
          placeholder="请输入商品名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品编码" prop="goodsCode">
        <el-input style="width:200px"
          v-model="queryParams.goodsCode"
          placeholder="请输入摊位编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
       <!-- <el-form-item label="商品分类" prop="goodsTypePid">
          <treeselect style="width:200px" v-model="queryParams.goodsType" :options="goodsTypeOptions" :normalizer="normalizer" placeholder="请选择商品分类父级" />
        </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button icon="el-icon-check" type="warning" size="mini" @click="selectDataMore">批量选择</el-button>
      </el-form-item>
    </el-form>
  
    
    <el-table v-loading="loading" :data="goodsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="供应商编码" align="center" prop="personCode" />
      <el-table-column label="供应商名称" align="center" prop="personName" />
      <!-- <el-table-column label="商品规格" align="center" prop="goodsGg" /> -->
      <el-table-column label="供应商地址" align="center" prop="personGoodsAddress" />
      <el-table-column label="产地" align="center" prop="personAddress" />
      <!-- <el-table-column prop="personName" label="选择供应商" width="200">
               <template scope="scope">
                 <el-select
                v-model="scope.row.personName"
                placeholder="选择供应商"
                filterable
                @change="handleEditPerson($event,scope.$index, scope.row)"
                style="width:100%"
                >
                <el-option
                  v-for="item in personList"
                  :key="'select'+item.personCode"
                  :label="item.personName"
                  :value="item.personCode"
                >
                  <span style="float: left;width:100%">{{ item.personName }}</span>
                </el-option>
              </el-select>
              <span  style="position: relative;top:-13px;">{{scope.row.personName}}</span>
              </template>
      </el-table-column> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-check"
            @click="selectGoodsData(scope.row)"
          >选择</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
       </el-col>
    </el-row>
     </el-dialog>
</template>

<script>
import { leaseStallList } from "@/api/system/stall";
import { listOwnerGoods, getGoods, delGoods, addGoods, updateGoods, exportGoods } from "@/api/system/ownerGoods";
import { goodsTypeTree,listGoodsType} from "@/api/system/goodsType";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { getPersonAll } from "@/api/system/person";
import { listPerson  } from "@/api/system/person";
export default {
  name: "Stall",
  components: { Treeselect },
  data() {
    return {
      goodsSelectList:[],
       goodsList:[],
       goodsTypeOptions:[],
       visible: false,
      // 遮罩层
      loading: true,
      //供应商
      personList: [],
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 市场摊位信息表格数据
      stallList: [],
      // 弹出层标题
      title: "选择商品信息",
      // 是否显示弹出层
      open: false,
      // 所属非类市场
      markDatas:[],
      //摊位状态
      perationOptions:[],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        stallName: undefined,
        stallCode: undefined,
        markCode: undefined,
        regionArea: undefined,
        stallStatus: undefined,
        stallStartTime: undefined,
        stallEndTime: undefined,
        stallMoney: undefined,
        stallLeaseholder: undefined,
        stallNote: undefined,
        createUser: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
         stallName:[
           {required:true,message:"摊位名称不能为空", trigger: "blur"}
         ],
          stallCode:[
           {required:true,message:"摊位编码不能为空", trigger: "blur"}
         ],
      }
    };
  },
  // watch:{
  //     pshow(newValue,oldValue){
  //        this.visible=newValue;
  //     }
  // },
  created() {
       this.getList();
    //   getPersonAll(this.queryParams).then(response => {
    //     this.personList = response.rows;
    //      console.log(this.personList)
    // });
  },
  methods: {
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id;
      this.getList();
    },
    selectGoodsData(row){
          this.$emit('selectData',row)
    },
    /** 查询市场摊位信息列表 */
    getList() {
      this.loading = true;
 
      // goodsTypeTree(this.queryParams).then(response => {
      //   this.goodsTypeList = response.data;
      // });
     //  this.getTreeselect();
      listOwnerGoods(this.queryParams).then(response => {
        console.log(response)
        // this.goodsList = response.rows;
        // console.log( this.goodsList )
        // this.total = response.total;
        // this.loading = false;
      });
        listPerson(this.queryParams).then(response => {
        this.goodsList = response.rows;
        console.log( this.goodsList )
        this.total = response.total;
        this.loading = false;
      });
    },
     /** 转换商品分类数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.goodsTypeId,
        label: node.goodsTypeName,
        children: node.children
      };
    },
	/** 查询部门下拉树结构 */
    getTreeselect() {
      listGoodsType().then(response => {
        this.goodsTypeOptions = [];
        const data = { goodsTypeId: 0, goodsTypeName: '顶级节点', children: [] };
        data.children = this.handleTree(response.data, "goodsTypeId", "goodsTypePid");
        this.goodsTypeOptions.push(data);
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        stallName: undefined,
        stallCode: undefined,
        markCode: undefined,
        regionArea: undefined,
        stallStatus: undefined,
        stallStartTime: undefined,
        stallEndTime: undefined,
        stallMoney: undefined,
        stallLeaseholder: undefined,
        stallNote: undefined,
        createUser: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      console.log(selection)
      this.goodsSelectList=selection;
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
     selectDataMore(){
          this.$emit('selectDataMore',this.goodsSelectList);
    },
  }
};
</script>