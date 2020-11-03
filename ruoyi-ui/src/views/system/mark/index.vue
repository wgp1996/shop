<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="市场名称" prop="markName">
        <el-input
          v-model="queryParams.markName"
          placeholder="请输入市场名称"
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
          v-hasPermi="['system:mark:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:mark:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:mark:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:mark:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="市场编码" align="center" prop="markCode" />
      <el-table-column label="市场名称" align="center" prop="markName" />
      <el-table-column label="运营主体名称" align="center" prop="perationName" />
      <el-table-column label="主体性质" align="center" prop="perationNature" />
      <el-table-column label="社会信用代码" align="center" prop="socialCreditCode" />
      <el-table-column label="开办日期" align="center" prop="markCreateTime" />
      <el-table-column label="现有商户数量" align="center" prop="markMerchantsCount" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:mark:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:mark:remove']"
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

    <!-- 添加或修改【市场信息】对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基础信息" name="first">
            <el-form-item label="市场名称" prop="markName">
              <el-input v-model="form.markName" placeholder="请输入市场名称" />
            </el-form-item>
            <el-form-item label="运营主体名称" prop="perationName">
              <el-input v-model="form.perationName" placeholder="请输入运营主体名称" />
            </el-form-item>
            <el-form-item label="主体性质">
              <el-select v-model="form.perationNature" placeholder="请选择" style="width:100%">
                <el-option
                  v-for="dict in perationOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="社会信用代码" prop="socialCreditCode">
              <el-input v-model="form.socialCreditCode" placeholder="请输入社会信用代码" />
            </el-form-item>
            <el-form-item label="市场开办日期" prop="markCreateTime">
              <el-date-picker
                clearable
                style="width:100%"
                v-model="form.markCreateTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择开办日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="现有商户数量" prop="markMerchantsCount">
              <el-input
                v-model="form.markMerchantsCount"
               type="number"
                placeholder="请输入现有商户数量"
              />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="位置&简介" name="second">
            <el-form-item label="省份" prop="markAddressProvince">
              <el-select
                v-model="form.markAddressProvince"
                placeholder="请选择"
                @change="getCityData"
                style="width:100%"
              >
                <el-option
                  v-for="dict in provinceDatas"
                  :key="dict.code"
                  :label="dict.name"
                  :value="dict.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="城市" prop="markAddressCity">
              <el-select
                v-model="form.markAddressCity"
                placeholder="请选择"
                @change="getAreaData"
                style="width:100%"
              >
                <el-option
                  v-for="dict in cityDatas"
                  :key="dict.code"
                  :label="dict.name"
                  :value="dict.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="区域" prop="markAddressArea">
              <el-select v-model="form.markAddressArea" placeholder="请选择" style="width:100%">
                <el-option
                  v-for="dict in areaDatas"
                  :key="dict.code"
                  :label="dict.name"
                  :value="dict.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="位置详情" prop="markAddressDetail">
              <el-input v-model="form.markAddressDetail" placeholder="请输入详情" />
            </el-form-item>
            <el-form-item label="市场简介" prop="markNote">
              <el-input
                type="textarea"
                :rows="3"
                placeholder="请输入市场简介"
                v-model="form.markNote">
              </el-input>
            </el-form-item>
            
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listInfo,
  getInfo,
  delInfo,
  addInfo,
  updateInfo,
  exportInfo,
} from "@/api/system/mark";

export default {
  name: "Info",
  data() {
    return {
      activeName: 'first',
      // 主体性质字典
      perationOptions: [],
      // 省份字典
      provinceDatas: [],
      // 城市字典
      cityDatas: [],
      // 地区字典
      areaDatas: [],
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
      // 【市场信息】表格数据
      infoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        markName: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        markName: [
          { required: true, message: "请输入市场名称", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_peration_type").then((response) => {
      this.perationOptions = response.data;
    });
    this.getArea("000000").then((response) => {
      this.provinceDatas = response.data;
    });
  },
  methods: {
    getCityData(code) {
      if (code != "") {
        this.getArea(code).then((response) => {
          this.form.markAddressCity = "";
          this.form.markAddressArea = "";
          this.cityDatas = [];
          this.areaDatas = [];
          this.cityDatas = response.data;
        });
      }
    },
    getAreaData(code) {
      if (code != "") {
        this.getArea(code).then((response) => {
          this.areaDatas = [];
          this.form.markAddressArea = "";
          this.areaDatas = response.data;
        });
      }
    },
     handleClick(tab, event) {
        //console.log(tab, event);
      },
    /** 查询【市场信息】列表 */
    getList() {
      this.loading = true;
      listInfo(this.queryParams).then((response) => {
        console.log(response)
        this.infoList = response.rows;
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
        markName: undefined,
        perationName: undefined,
        perationNature: undefined,
        socialCreditCode: undefined,
        markAddressCity: undefined,
        markAddressProvince: undefined,
        markAddressArea: undefined,
        markAddressDetail: undefined,
        markCreateTime: undefined,
        markMerchantsCount: undefined,
        markNote: undefined,
        createUser: undefined,
        markCode: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
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
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加【市场信息】";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getInfo(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改【市场信息】";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateInfo(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            //console.log(this.form)
            addInfo(this.form).then((response) => {
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
      this.$confirm(
        '是否确认删除【市场信息】编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delInfo(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有【市场信息】数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportInfo(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
  },
};
</script>