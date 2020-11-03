<template>
  <div class="app-container">
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:stall:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:stall:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:stall:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:stall:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="stallList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="摊位编码" align="center" prop="stallCode" />
      <el-table-column label="摊位名称" align="center" prop="stallName" />
      <el-table-column label="所属市场" align="center" prop="markChildName" />
      <el-table-column label="市场面积" align="center" prop="regionArea" />
      <el-table-column label="摊位状态" align="center" prop="stallStatusName" />
      <el-table-column label="开始期限/销售日期" align="center" prop="stallStartTime" />
      <el-table-column label="结束期限" align="center" prop="stallEndTime" />
      <el-table-column label="租金(年)/销售金额" align="center" prop="stallMoney" />
      <el-table-column label="租赁方/销售方" align="center" prop="stallLeaseholder" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:stall:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:stall:remove']"
          >删除</el-button>
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

    <!-- 添加或修改市场摊位信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="摊位名称" prop="stallName">
          <el-input v-model="form.stallName" placeholder="请输入摊位名称" />
        </el-form-item>
        <el-form-item label="摊位编码" prop="stallCode">
          <el-input v-model="form.stallCode" placeholder="请输入摊位编码" />
        </el-form-item>
        <el-form-item label="所属市场" prop="markCode">
          <!-- <el-input v-model="form.markCode" placeholder="请输入所属市场" /> -->
          <el-select v-model="form.markCode" placeholder="请选择所属市场" clearable  style="width
                 :100%">
                    <el-option 
                       v-for="item in markDatas"
                         :key="item.markChildCode"
                         :label="item.markChildName"
                         :value="item.markChildCode"
                     />
                </el-select>
        </el-form-item>
        <el-form-item label="区域面积" prop="regionArea">
          <el-input v-model="form.regionArea" placeholder="请输入区域面积" style="width:80%"/>
          <label>平方/米</label>
        </el-form-item>
        <!-- <el-form-item label="摊位状态">
            <el-select v-model="form.stallStatus" placeholder="请选择摊位状态" clearable  style="width
                 :100%">
                    <el-option 
                       v-for="item in perationOptions"
                         :key="item.dictValue"
                         :label="item.dictLabel"
                         :value="item.dictValue"
                     />
                </el-select>
        </el-form-item>
        <el-form-item label="开始期限" prop="stallStartTime">
          <el-date-picker
                clearable
                style="width:100%"
                v-model="form.stallStartTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请输入开始时间"
              ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束期限" prop="stallEndTime">
            <el-date-picker
                clearable
                style="width:100%"
                v-model="form.stallEndTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请输入结束时间"
              ></el-date-picker>
        </el-form-item>
        <el-form-item label="租金(年)" prop="stallMoney">
          <el-input v-model="form.stallMoney" placeholder="请输入租金(年)" @change="form.stallMoney=form.stallMoney.replace(/[^\d.]/g,'')"/>
        </el-form-item>
        <el-form-item label="租赁方" prop="stallLeaseholder">
          <el-input v-model="form.stallLeaseholder" placeholder="请输入租赁方" />
        </el-form-item> -->
        <el-form-item label="摊位说明" prop="stallNote">
          <el-input v-model="form.stallNote" placeholder="请输入摊位说明" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { cmarkData,listStall, getStall, delStall, addStall, updateStall, exportStall } from "@/api/system/stall";

export default {
  name: "Stall",
  data() {
    return {
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
      title: "",
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
  created() {
       this.getList();
      cmarkData().then((response) => {
      this.markDatas = response.data;
      console.log(this.markDatas)
    });
     this.getDicts("sys_stall_status").then((response) => {
      this.perationOptions = response.data;
      console.log(this.markDatas)
    });
  },
  methods: {
    /** 查询市场摊位信息列表 */
    getList() {
      this.loading = true;
      listStall(this.queryParams).then(response => {
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
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加市场摊位信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getStall(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改市场摊位信息";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateStall(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addStall(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
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
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除市场摊位信息编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delStall(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有市场摊位信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportStall(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>