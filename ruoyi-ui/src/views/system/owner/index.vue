<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
      <el-form-item label="业户编号" prop="ownerCode">
        <el-input
          v-model="queryParams.ownerCode"
          placeholder="请输入业户编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="业户名称" prop="ownerName">
        <el-input
          v-model="queryParams.ownerName"
          placeholder="请输入业户名称"
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
          v-hasPermi="['system:owner:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:owner:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:owner:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:owner:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="ownerList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="所属市场" align="center" prop="markTypeName" />
      <el-table-column label="业户编号" align="center" prop="ownerCode" />
      <el-table-column label="业户名称" align="center" prop="ownerName" width="300"/>
      <el-table-column label="信用代码/身份证号" align="center" prop="ownerPersonId" />
      <el-table-column label="联系人" align="center" prop="ownerLxr" />
      <el-table-column label="电话" align="center" prop="ownerLxrPhone" />
      <el-table-column label="创建日期" align="center" prop="createTime" />
      <!-- <el-table-column label="关联账号" align="center" prop="userName" />
      <el-table-column label="组织类型" align="center" prop="ownerOrg" />
      <el-table-column label="机构性质" align="center" prop="ownerOrgNature" />
      <el-table-column label="经营方式" align="center" prop="ownerMangerType" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:owner:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:owner:remove']"
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

    <!-- 添加或修改业户信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
           <el-tabs v-model="activeName" >
          <el-tab-pane label="基础信息" name="first">
        <el-form-item label="业户编号" prop="ownerCode">
          <el-input v-model="form.ownerCode" placeholder="请输入业户编号" />
        </el-form-item>
        <el-form-item label="业户名称" prop="ownerName">
          <el-input v-model="form.ownerName" placeholder="请输入业户名称" />
        </el-form-item>
         <el-form-item label="关联账号" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入关联账号" />
        </el-form-item>
        <el-form-item label="市场分类" prop="markType">
          <treeselect v-model="form.markType" :options="markTypeOptions" :normalizer="normalizer" placeholder="请选择市场分类" />
        </el-form-item>
        <el-form-item label="组织类型" prop="ownerOrg">
          <el-select v-model="form.ownerOrg" placeholder="请选择组织类型" style="width:100%">
                <el-option
                  v-for="dict in orgOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机构性质" prop="ownerOrgNature">
          <el-select v-model="form.ownerOrgNature" placeholder="请选择机构性质" style="width:100%">
                <el-option
                  v-for="dict in perationOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="信用代码/身份证号" prop="ownerPersonId">
          <el-input v-model="form.ownerPersonId" placeholder="请输入信用代码/身份证号" />
        </el-form-item>
        <el-form-item label="经营方式">
          <el-select v-model="form.ownerMangerType" placeholder="请选择经营方式" style="width:100%">
                <el-option
                  v-for="dict in mangerOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系人" prop="ownerLxr">
          <el-input v-model="form.ownerLxr" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="电话" prop="ownerLxrPhone">
          <el-input v-model="form.ownerLxrPhone" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item label="微信" prop="ownerLxrWx">
          <el-input v-model="form.ownerLxrWx" placeholder="请输入微信" />
        </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="证件信息" name="second">
         <el-form-item label="标题" prop="ownerLxrWx">
          <el-input v-model="form.fileTitle1" placeholder="请输入标题" />
        </el-form-item>
            <el-form-item label="证件信息">
              <el-upload
                class="avatar-uploader"
                  :action="upload.url"
                  :headers="upload.headers"
                :show-file-list="false"
                :on-success="handleImageSuccess">
                <img width="100%" v-if="form.fileName1" :src="form.fileName1" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
          </el-form-item>
         <el-form-item label="标题" prop="ownerLxrWx">
          <el-input v-model="form.fileTitle2" placeholder="请输入标题" />
        </el-form-item>
          <el-form-item label="证件信息">
              <el-upload
                class="avatar-uploader"
                  :action="upload.url"
                  :headers="upload.headers"
                :show-file-list="false"
                :on-success="handleImageSuccess1">
                <img width="100%" v-if="form.fileName2" :src="form.fileName2" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
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
import { listOwner, getOwner, delOwner, addOwner, updateOwner, exportOwner } from "@/api/system/owner";
import { listMarkType } from "@/api/system/markType";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { getToken } from "@/utils/auth";
export default {
  name: "Owner",
  components: { Treeselect },
  data() {
    return {
       // 市场分类树选项
      markTypeOptions: [],
        upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/common/upload"
      },
      //组织类型
      orgOptions:[],
      //机构性质
      perationOptions:[],
      //经营方式
      mangerOptions:[],
      activeName:"first",
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
      // 业户信息表格数据
      ownerList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        ownerCode: undefined,
        ownerName: undefined,
        ownerOrg: undefined,
        ownerOrgNature: undefined,
        ownerPersonId: undefined,
        ownerMangerType: undefined,
        ownerLxr: undefined,
        ownerLxrPhone: undefined,
        ownerLxrWx: undefined,
        ownerNote: undefined,
        createUser: undefined,
        fileName1: undefined,
        fileTitle1: undefined,
        fileName2: undefined,
        fileTitle2: undefined,
        userName:undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        ownerCode: [
          { required: true, message: "请输入业户编码", trigger: "blur" }
        ],
        ownerName: [
          { required: true, message: "请输入业户名称", trigger: "blur" }
        ],
         userName: [
          { required: true, message: "请输入关联账号", trigger: "blur" }
        ]
        
      }
    };
  },
  created() {
    this.getList();
    //公司性质
    this.getDicts("sys_peration_type").then((response) => {
      this.perationOptions = response.data;
    });
    //市场分类
    this.getTreeselect();
    //组织类型
    this.getDicts("sys_org_type").then((response) => {
      this.orgOptions = response.data;
    });
    //经营方式
    this.getDicts("sys_manager_type").then((response) => {
      this.mangerOptions = response.data;
    });
  },
  methods: {
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
     handleImageSuccess(res, file, fileList) {
      this.form.fileName1 = res.url;
      // 上传成功
      console.log(res.url);
    },
    handleImageSuccess1(res, file, fileList) {
      this.form.fileName2 = res.url;
      // 上传成功
      console.log(res.url);
    },
    /** 查询业户信息列表 */
    getList() {
      this.loading = true;
      listOwner(this.queryParams).then(response => {
        this.ownerList = response.rows;
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
        ownerCode: undefined,
        ownerName: undefined,
        ownerOrg: undefined,
        ownerOrgNature: undefined,
        ownerPersonId: undefined,
        ownerMangerType: undefined,
        ownerLxr: undefined,
        ownerLxrPhone: undefined,
        ownerLxrWx: undefined,
        ownerNote: undefined,
        createUser: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
        fileName1: undefined,
        fileTitle1: undefined,
        fileName2: undefined,
        fileTitle2: undefined,
        userName:undefined
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
      this.title = "添加业户信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getOwner(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改业户信息";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateOwner(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addOwner(this.form).then(response => {
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
      this.$confirm('是否确认删除业户信息编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delOwner(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有业户信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportOwner(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .el-upload-dragger{
    height: auto !important;
  }
</style>