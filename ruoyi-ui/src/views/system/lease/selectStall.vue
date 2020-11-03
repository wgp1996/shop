<template>
    <el-dialog :close-on-click-modal="false" :title="title"
    :visible.sync="visible">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="摊位名称" prop="stallName">
        <el-input
          v-model="queryParams.stallName"
          placeholder="请输入摊位名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="摊位编码" prop="stallCode">
        <el-input
          v-model="queryParams.stallCode"
          placeholder="请输入摊位编码"
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
    <el-table v-loading="loading" :data="stallList" @selection-change="handleSelectionChange">
      <el-table-column label="摊位编码" align="center" prop="stallCode" />
      <el-table-column label="摊位名称" align="center" prop="stallName" />
      <el-table-column label="所属市场" align="center" prop="markChildName" />
      <el-table-column label="市场面积" align="center" prop="regionArea" />
      <el-table-column label="添加日期" align="center" prop="createTime" />
      <!-- <el-table-column label="摊位状态" align="center" prop="stallStatus" />
      <el-table-column label="租金(年)" align="center" prop="stallMoney" />
      <el-table-column label="租赁方" align="center" prop="stallLeaseholder" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-check"
            @click="selectStallData(scope.row)"
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
import { leaseStallList,cmarkData,listStall, getStall, delStall, addStall, updateStall, exportStall } from "@/api/system/stall";

export default {
  // props:{
  //  pshow:{
  //     type:Boolean,
  //     default:false
  //  }
  // },
  name: "Stall",
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
      stallList: [],
      // 弹出层标题
      title: "选择摊位信息",
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
  },
  methods: {
    selectStallData(row){
          this.$emit('selectData',row)
    },
    /** 查询市场摊位信息列表 */
    getList() {
      this.loading = true;
      leaseStallList(this.queryParams).then(response => {
        this.stallList = response.rows;
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    }
  }
};
</script>