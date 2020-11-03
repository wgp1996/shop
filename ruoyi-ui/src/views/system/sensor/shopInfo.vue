<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="门店编号" prop="storeid">
        <el-input
          v-model="queryParams.storeid"
          placeholder="请输入门店编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="门店名称" prop="shopName">
        <el-input
          v-model="queryParams.shopName"
          placeholder="请输入门店名称"
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
          v-hasPermi="['system:shopInfo:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:shopInfo:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:shopInfo:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleRefresh"
          v-hasPermi="['system:shopInfo:refresh']"
        >刷新电子价签</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:shopInfo:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="shopInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="门店编号" align="center" prop="storeid" />
      <el-table-column label="门店名称" align="center" prop="shopName" />
      <el-table-column label="门店地址" align="center" prop="shopAddress" />
      <el-table-column label="门店面积" align="center" prop="shopArea" />
      <el-table-column label="人数" align="center" prop="personNum" />
      <el-table-column label="联系电话" align="center" prop="personPhone" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:shopInfo:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:shopInfo:remove']"
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

    <!-- 添加或修改门店管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="门店编号" prop="storeid">
          <el-input v-model="form.storeid" placeholder="请输入门店编号" />
        </el-form-item>
        <el-form-item label="门店名称" prop="shopName">
          <el-input v-model="form.shopName" placeholder="请输入门店名称" />
        </el-form-item>
        <el-form-item label="关联账号" prop="createBy">
          <el-input v-model="form.createBy" placeholder="请输入关联账号" />
        </el-form-item>
        <el-form-item label="门店地址" prop="shopAddress">
          <el-input v-model="form.shopAddress" placeholder="请输入门店地址" />
        </el-form-item>
        <el-form-item label="门店面积" prop="shopArea">
          <el-input v-model="form.shopArea" placeholder="请输入门店面积" />
        </el-form-item>
        <el-form-item label="人数" prop="personNum">
          <el-input v-model="form.personNum" placeholder="请输入人数" />
        </el-form-item>
        <el-form-item label="联系电话" prop="personPhone">
          <el-input v-model="form.personPhone" placeholder="请输入联系电话" />
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
import { listShopInfo, getShopInfo, refresh,delShopInfo, addShopInfo, updateShopInfo, exportShopInfo } from "@/api/system/shopInfo";

export default {
  name: "ShopInfo",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      storeId:[],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 门店管理表格数据
      shopInfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        storeid: undefined,
        shopName: undefined,
        shopAddress: undefined,
        shopStatus: undefined,
        shopArea: undefined,
        personNum: undefined,
        personPhone: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        storeid:[
           {required:true,message:"门店编号不能为空", trigger: "blur"}
         ],
         shopName:[
           {required:true,message:"门店名称不能为空", trigger: "blur"}
         ],
         createBy:[
           {required:true,message:"关联账号不能为空", trigger: "blur"}
         ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询门店管理列表 */
    getList() {
      this.loading = true;
      listShopInfo(this.queryParams).then(response => {
        this.shopInfoList = response.rows;
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
        storeid: undefined,
        shopName: undefined,
        shopAddress: undefined,
        shopStatus: "0",
        shopArea: undefined,
        personNum: undefined,
        personPhone: undefined,
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
      this.storeId=selection.map(item => item.storeid)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加门店管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getShopInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改门店管理";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateShopInfo(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addShopInfo(this.form).then(response => {
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
      this.$confirm('是否确认删除门店管理编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delShopInfo(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
     /** 刷新按钮操作 */
    handleRefresh(row) {
      const storeid = this.storeId[0];
      this.$confirm('是否刷新门店管理编号为"' + storeid + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return refresh(storeid);
        }).then(() => {
          this.getList();
          this.msgSuccess("刷新成功");
        }).catch(function() {});
    },
    
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有门店管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportShopInfo(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>