<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
      <el-form-item label="收款单号" prop="collectionCode">
        <el-input
          v-model="queryParams.collectionCode"
          placeholder="请输入收款单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="合同名称" prop="contractName">
        <el-input
          v-model="queryParams.contractName"
          placeholder="请输入合同名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="开始时间" prop="contractStartTime">
        <el-date-picker
          clearable
          style="width:100%"
          v-model="queryParams.contractStartTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择开始时间"
          @keyup.enter.native="handleQuery"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="contractEndTime">
        <el-date-picker
          clearable
          style="width:100%"
          v-model="queryParams.contractEndTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择结束时间"
          @keyup.enter.native="handleQuery"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <elCol :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:leaseCollection:add']"
        >新增</el-button>
      </elCol>
      <elCol :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:leaseCollection:edit']"
        >修改</el-button>
      </elCol>
      <elCol :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:leaseCollection:remove']"
        >删除</el-button>
      </elCol>
      <elCol :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:leaseCollection:export']"
        >导出</el-button>
      </elCol>
    </el-row>

    <el-table
      v-loading="loading"
      :data="leaseCollectionList"
      @selection-change="handleSelectionChange"
    >
     <el-table-column type="selection" width="55" align="center" />
      <el-tableColumn label="收款单号" align="center" prop="collectionCode" width="180px"/>
      <el-tableColumn label="合同名称" align="center" prop="contractName" />
      <el-tableColumn label="合同编码" align="center" prop="contractCode" />
      <el-tableColumn label="客户名称" align="center" prop="ownerName" />
      <el-tableColumn label="摊位名称" align="center" prop="stallName" />
      <!-- <el-tableColumn label="合同金额" align="center" prop="contractMoney" /> -->
      <el-tableColumn label="收费开始时间" align="center" prop="contractStartTime" />
      <el-tableColumn label="收费结束时间" align="center" prop="contractEndTime" />
      <el-tableColumn label="收款金额" align="center" prop="collectionMoney" />
      <el-tableColumn label="收款方式" align="center" prop="collectionPayType" />
      <el-tableColumn label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:leaseCollection:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:leaseCollection:remove']"
          >删除</el-button>
        </template>
      </el-tableColumn>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改销售收款对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="选择合同" prop="contractName">
          <el-row :gutter="0">
            <el-col :span="20">
              <el-input v-model="form.contractName" placeholder="点击选择合同" :disabled="true" />
            </el-col>
            <el-col :span="2" :offset="2">
              <i @click="leaseCollectionSelect" class="el-icon-plus" style="font-size:20px"></i>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="选择客户" prop="ownerName">
          <el-row :gutter="0">
            <el-col :span="20">
              <el-input v-model="form.ownerName" placeholder="点击选择客户" :disabled="true" />
            </el-col>
            <el-col :span="2" :offset="2">
              <i @click="leaseCollectionSelect" class="el-icon-plus" style="font-size:20px"></i>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="选择摊位" prop="stallName">
          <el-row :gutter="0">
            <el-col :span="20">
              <el-input v-model="form.stallName" placeholder="点击选择摊位" :disabled="true" />
            </el-col>
            <el-col :span="2" :offset="2">
              <i @click="leaseCollectionSelect" class="el-icon-plus" style="font-size:20px"></i>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="收款金额" prop="collectionMoney">
          <el-input v-model="form.collectionMoney" placeholder="请输入收款金额" />
        </el-form-item>
        <el-form-item label="收款方式" prop="collectionPayType">
          <el-select v-model="form.collectionPayType" placeholder="请选择收款方式" style="width:100%">
            <el-option
              v-for="dict in payTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="有效开始时间" prop="contractStartTime">
            <el-date-picker
            clearable
            style="width:100%"
            v-model="form.contractStartTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择收费有效开始时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="有效结束时间" prop="contractEndTime">
            <el-date-picker
            clearable
            style="width:100%"
            v-model="form.contractEndTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择收费有效结束时间"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <select-sales v-if="leaseCollection" ref="leaseCollection" @selectData="selectData"></select-sales>
  </div>
</template>

<script>
import {
  listSalesCollection,
  getSalesCollection,
  delSalesCollection,
  addSalesCollection,
  updateSalesCollection,
  exportSalesCollection,
} from "@/api/system/salesCollection";
import selectSales from "./selectSales";
export default {
  name: "property",
  components: {
    selectSales,
  },
  data() {
    return {
      tableData: [],
      leaseCollection: false,
      //收款方式
      payTypeOptions: [],
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
      // 销售收款表格数据
      leaseCollectionList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        collectionCode: undefined,
        contractName: undefined,
        contractCode: undefined,
        ownerCode: undefined,
        ownerName: undefined,
        stallCode: undefined,
        stallName: undefined,
        // contractMoney: undefined,
        contractStartTime: undefined,
        contractEndTime: undefined,
        collectionMoney: undefined,
        collectionPayType: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        contractName: [
          { required: true, message: "合同不能为空", trigger: "blur" },
        ],
        ownerName: [
          { required: true, message: "客户不能为空", trigger: "blur" },
        ],
        stallName: [
          { required: true, message: "摊位不能为空", trigger: "blur" },
        ],
        collectionMoney: [
          { required: true, message: "收款金额不能为空", trigger: "blur" },
        ],
        collectionPayType: [
          { required: true, message: "收款方式不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_pay_type").then((response) => {
      this.payTypeOptions = response.data;
    });
  },
  methods: {
    /** 操作 */
    leaseCollectionSelect() {
      this.leaseCollection = true;
      this.$nextTick(() => {
        this.$refs.leaseCollection.visible = true;
      });
    },
    //选择数据
    selectData(row) {
      //  this.leaseCollection=false;
      this.$nextTick(() => {
        this.form.contractCode = row.contractCode;
        this.form.contractName = row.contractName;
        this.form.ownerCode = row.ownerCode;
        this.form.ownerName = row.ownerName;
        this.form.stallCode = row.stallCode;
        this.form.stallName = row.stallName;
        // this.form.contractMoney = row.rentMoney;
        //this.form.collectionMoney = row.rentMoney;
        this.form.leaseMxId = row.id;
        this.$refs.leaseCollection.visible = false;
      });
    },
    /** 查询销售收款列表 */
    getList() {
      this.loading = true;
      listSalesCollection(this.queryParams).then((response) => {
        console.log(response);
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
        collectionCode: undefined,
        id: undefined,
        contractName: undefined,
        contractCode: undefined,
        ownerCode: undefined,
        ownerName: undefined,
        stallCode: undefined,
        stallName: undefined,
        // contractMoney: undefined,
        contractStartTime: undefined,
        contractEndTime: undefined,
        collectionMoney: undefined,
        collectionPayType: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
        leaseMxId: undefined,
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
      this.ids = selection.map((item) => item.collectionCode);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加销售收款";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const collectionCode = row.collectionCode || this.ids;
      getSalesCollection(collectionCode).then((response) => {
        this.form = response.data;
    
        this.open = true;
        this.title = "修改销售收款";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.collectionCode != undefined) {
            updateSalesCollection(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
                this.$refs.leaseCollection.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addSalesCollection(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
                this.$refs.leaseCollection.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const collectionCodes = row.collectionCode || this.ids;
      this.$confirm(
        '是否确认删除销售收款编号为"' + collectionCodes + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delSalesCollection(collectionCodes);
        })
        .then(() => {
          this.getList();
           this.$refs.leaseCollection.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有销售收款数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportSalesCollection(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
  },
};
</script>