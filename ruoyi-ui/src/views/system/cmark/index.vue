<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
      
      <el-form-item label="二级市场编码" prop="markChildCode">
        <el-input
          v-model="queryParams.markChildCode"
          placeholder="请输入二级市场编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="二级市场名称" prop="markChildName">
        <el-input
          v-model="queryParams.markChildName"
          placeholder="请输入二级市场名称"
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
          v-hasPermi="['system:cmark:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:cmark:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:cmark:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:cmark:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="cmarkList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="二级市场编码" align="center" prop="markChildCode" />
      <el-table-column label="二级市场名称" align="center" prop="markChildName" />
      <el-table-column label="运营主体名称" align="center" prop="perationName" />
      <el-table-column label="社会信用代码" align="center" prop="socialCreditCode" />
      <el-table-column label="运营方式" align="center" prop="operateType" />
      <el-table-column label="开始时间" align="center" prop="operateStartTime" />
      <el-table-column label="结束时间" align="center" prop="operateEndTime" />
      <el-table-column label="租金" align="center" prop="operateMoney" />
      <el-table-column label="现有商户数量" align="center" prop="markMerchantsCount" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:cmark:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:cmark:remove']"
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

    <!-- 添加或修改二级市场信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px">
      
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="用户管理" name="first">
              <el-form-item label="主市场信息" prop="markCode">
                 <el-select v-model="form.markCode" placeholder="请选择主市场" clearable  style="width
                 :100%">
                    <el-option 
                       v-for="item in markDatas"
                         :key="item.markCode"
                         :label="item.markName"
                         :value="item.markCode"
                     />
                </el-select>
             </el-form-item>
             
              <el-form-item label="二级市场编码" prop="markChildCode" >
                <el-input v-model="form.markChildCode" placeholder="请输入二级市场编码" />
              </el-form-item>
              <el-form-item label="二级市场名称" prop="markChildName">
                <el-input v-model="form.markChildName" placeholder="请输入二级市场名称" />
              </el-form-item>
              <el-form-item label="运营主体名称" prop="perationName">
                <el-input v-model="form.perationName" placeholder="请输入运营主体名称" />
              </el-form-item>
              <el-form-item label="运营主体性质" prop="perationNature">
              <el-select v-model="form.perationNature" placeholder="请选择运营主体性质" style="width:100%">
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
          </el-tab-pane>
          <el-tab-pane label="运营信息" name="second">
                <el-form-item label="运营方式">
                 <el-select v-model="form.operateType" placeholder="请选择运营方式" style="width:100%">
                   <el-option
                  v-for="dict in operateOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="开始时间" prop="operateStartTime">
               <el-date-picker
                clearable
                style="width:100%"
                v-model="form.operateStartTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请输入开始时间"
              ></el-date-picker>
                <!-- <el-input v-model="form.operateStartTime" placeholder="请输入开始时间" /> -->
              </el-form-item>
              <el-form-item label="结束时间" prop="operateEndTime">
                 <el-date-picker
                clearable
                style="width:100%"
                v-model="form.operateEndTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请输入结束时间"
              ></el-date-picker>
                <!-- <el-input v-model="form.operateEndTime" placeholder="请输入结束时间" /> -->
              </el-form-item>
              <el-form-item label="租金" prop="operateMoney" >
                <el-input v-model="form.operateMoney" placeholder="请输入租金元/年" @change="form.operateMoney=form.operateMoney.replace(/[^\d.]/g,'')"/>
              
              </el-form-item>
              <el-form-item label="现有商户数量" prop="markMerchantsCount">
                <el-input v-model="form.markMerchantsCount" type="number" placeholder="请输入现有商户数量" />
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
import { getMark,listCmark, getCmark, delCmark, addCmark, updateCmark, exportCmark } from "@/api/system/cmark";

export default {
  name: "Cmark",
  data() {
    return {
      // 遮罩层
      loading: true,
      //选取主市场
      markDatas:[],
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 二级市场信息表格数据
      cmarkList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      perationOptions:[],
      operateOptions:[],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        markCode: undefined,
        markChildCode: undefined,
        markChildName: undefined,
        perationName: undefined,
        perationNature: undefined,
        socialCreditCode: undefined,
        operateType: undefined,
        operateStartTime: undefined,
        operateEndTime: undefined,
        operateMoney: undefined,
        markMerchantsCount: undefined,
        markNote: undefined,
        createUser: undefined,
      },
      // 表单参数
      form: {},
      activeName: 'first',
      // 表单校验
      rules: {
         markChildCode: [
          { required: true, message: "二级市场编码不能为空", trigger: "blur" }
        ],
         markChildName: [
          { required: true, message: "分类市场名称不能为空", trigger: "blur" }
        ],
        markCode: [
          { required: true, message: "主市场编码不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    getMark().then((response) => {
      this.markDatas = response.data;
      console.log( this.markDatas)
    });
    this.getDicts("sys_peration_type").then((response) => {
      this.perationOptions = response.data;
    });
    this.getDicts("sys_operate_type").then((response) => {
      this.operateOptions = response.data;
    });
   

  },
  methods: {
      handleClick(tab, event) {
        // console.log(tab, event);
      },
    /** 查询二级市场信息列表 */
    getList() {
      this.loading = true;
      listCmark(this.queryParams).then(response => {
        this.cmarkList = response.rows;
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
        markCode: undefined,
        markChildCode: undefined,
        markChildName: undefined,
        perationName: undefined,
        perationNature: undefined,
        socialCreditCode: undefined,
        operateType: undefined,
        operateStartTime: undefined,
        operateEndTime: undefined,
        operateMoney: undefined,
        markMerchantsCount: undefined,
        markNote: undefined,
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
      this.title = "添加二级市场信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      console.log(id)
      getCmark(id).then(response => {
        console.log(response.data)
        this.form = response.data;
        this.open = true;
        this.title = "修改二级市场信息";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          
          if (this.form.id != undefined) {
            updateCmark(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addCmark(this.form).then(response => {
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
      this.$confirm('是否确认删除二级市场信息编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delCmark(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有二级市场信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportCmark(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>