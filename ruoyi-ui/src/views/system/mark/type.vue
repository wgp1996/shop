<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
      <el-form-item label="市场分类名称" prop="markTypeName">
        <el-input
          v-model="queryParams.markTypeName"
          placeholder="请输入市场分类名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >搜索</el-button>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:markType:add']"
        >新增</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="markTypeList"
      row-key="markId"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="市场分类编码" align="center" prop="markId" />
      <el-table-column label="市场分类名称" align="center" prop="markTypeName" />
      <el-table-column label="显示顺序" align="center" prop="orderNum" />
      <el-table-column label="创建者" align="center" prop="createBy" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:markType:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:markType:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改市场分类对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
         <el-form-item label="市场分类编码" prop="markId">
          <el-input v-model="form.markId" placeholder="请输入市场分类编码" />
        </el-form-item>
        <el-form-item label="市场分类父编码" prop="parentId">
          <treeselect v-model="form.parentId" :options="markTypeOptions" :normalizer="normalizer" placeholder="请选择市场分类父编码" />
        </el-form-item>
        <el-form-item label="市场分类名称" prop="markTypeName">
          <el-input v-model="form.markTypeName" placeholder="请输入市场分类名称" />
        </el-form-item>
        <el-form-item label="显示顺序" prop="orderNum">
          <el-input v-model="form.orderNum" placeholder="请输入显示顺序" />
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
import { listMarkType, getMarkType, delMarkType, addMarkType, updateMarkType, exportMarkType } from "@/api/system/markType";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "MarkType",
  components: { Treeselect },
  data() {
    return {
      type:0,
      // 遮罩层
      loading: true,
      // 市场分类表格数据
      markTypeList: [],
      // 市场分类树选项
      markTypeOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        parentId: undefined,
        markTypeName: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
         markId: [
          { required: true, message: "分类编码不能为空", trigger: "blur" }
        ],
         parentId: [
          { required: true, message: "父级分类不能为空", trigger: "blur" }
        ],
         markTypeName: [
          { required: true, message: "分类名称不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询市场分类列表 */
    getList() {
      this.loading = true;
      listMarkType(this.queryParams).then(response => {
        this.markTypeList = this.handleTree(response.data, "markId", "parentId");
        this.loading = false;
      });
    },
    /** 转换市场分类数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.markId,
        label: node.markTypeName,
        children: node.children
      };
    },
	/** 查询部门下拉树结构 */
    getTreeselect() {
      listMarkType().then(response => {
        this.markTypeOptions = [];
        const data = { markId: 0, markTypeName: '批发市场', children: [] };
        data.children = this.handleTree(response.data, "markId", "parentId");
        this.markTypeOptions.push(data);
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
        markId: undefined,
        parentId: undefined,
        markTypeName: undefined,
        orderNum: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        type: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.type=0;
      this.reset();
	  this.getTreeselect();
      this.open = true;
      this.title = "添加市场分类";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.type=1;
      this.reset();
	  this.getTreeselect();
      if (row != undefined) {
        this.form.parentId = row.markId;
      }
      getMarkType(row.markId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改市场分类";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.type==1) {
            updateMarkType(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addMarkType(this.form).then(response => {
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
      this.$confirm('是否确认删除市场分类编号为"' + row.markId + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delMarkType(row.markId);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    }
  }
};
</script>