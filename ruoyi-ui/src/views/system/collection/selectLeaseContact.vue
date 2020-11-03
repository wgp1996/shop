<template>
    <el-dialog :close-on-click-modal="false" :title="title"
    :visible.sync="visible">
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
      <el-form-item label="合同名称" prop="contractName">
        <el-input
          v-model="queryParams.contractName"
          placeholder="请输入合同名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户名称" prop="ownerName">
        <el-input
          v-model="queryParams.ownerName"
          placeholder="请输入客户名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
       <el-form-item label="摊位名称" prop="stallName">
        <el-input
          v-model="queryParams.stallName"
          placeholder="请输入摊位名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
   <el-table
      v-loading="loading"
      :data="leaseCollectionList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="合同编码" align="center" prop="contractCode" />
      <el-table-column label="合同名称" align="center" prop="contractName" />
      <el-table-column label="租赁客户" align="center" prop="ownerName" />
      <el-table-column label="摊位" align="center" prop="stallName" />
      <el-table-column label="合同金额" align="center" prop="rentMoney" />
      <el-table-column label="合同开始日期" align="center" prop="leaseStartTime" />
      <el-table-column label="合同结束日期" align="center" prop="leaseEndTime" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
       <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-check"
            @click="selectCollectionData(scope.row)"
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
     </el-dialog>
</template>

<script>
import { getLeaseContractlist } from "@/api/system/leaseCollection";

export default {
  // props:{
  //  pshow:{
  //     type:Boolean,
  //     default:false
  //  }
  // },
  name: "leaseCollection",
  data() {
    return {
       visible: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 市场摊位信息表格数据
      leaseCollectionList: [],
      // 弹出层标题
      title: "选择合同信息",
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
        contractName: undefined,
        ownerName: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
         
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
  },
  methods: {
    selectCollectionData(row){
          this.$emit('selectData',row)
    },
    /** 查询市场摊位信息列表 */
    getList() {
      this.loading = true;
      getLeaseContractlist(this.queryParams).then(response => {
        this.leaseCollectionList = response.rows;
        this.total = response.total;
        this.loading = false;
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
        contractName: undefined,
        ownerName: undefined
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    }
  }
};
</script>