<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
      <el-form-item label="合同编号" prop="contractCode">
        <el-input
          v-model="queryParams.contractCode"
          placeholder="请输入合同编号"
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
          v-hasPermi="['system:pool:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:pool:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:pool:remove']"
        >删除</el-button>
      </el-col>
       <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-s-promotion"
          size="mini"
          :disabled="multiple"
          @click="handleEffect"
          v-hasPermi="['system:pool:effect']"
        >生效</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:pool:export']"
        >导出</el-button>
      </el-col>-->
    </el-row>

    <el-table
      v-loading="loading"
      :data="leaseList"
      @selection-change="handleSelectionChange"
      row-key="id"
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table style="padding:0;margin:0" :data="props.row.childrenList" id="special">
            <el-table-column label="摊位编号" align="center" prop="stallCode" />
            <el-table-column label="摊位名称" align="center" prop="stallName" />
            <el-table-column label="面积(平方米)" align="center" prop="stallArea" />
            <el-table-column label="计费日期" align="center" prop="leaseTime" />
            <el-table-column label="抽成比例(%)" align="center" prop="takeNum" />
            <el-table-column label="备注" align="center" prop="contractBz" />
          </el-table>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="55" align="center" />
       <el-table-column label="合同状态" align="center" prop="contractStatus" />
      <el-table-column label="合同编码" align="center" prop="contractCode" />
      <el-table-column label="合同名称" align="center" prop="contractName" />
      <el-table-column label="联营客户" align="center" prop="ownerName" />
      <el-table-column label="联营模式" align="center" prop="poolModel" />
      <el-table-column label="抽成率" align="center" prop="takeNum" />
      <el-table-column label="抽成结算方式" align="center" prop="takePayType" />
      <el-table-column label="签约地点" align="center" prop="signAddress" />
      <el-table-column label="签约日期" align="center" prop="signTime" />

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:pool:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:pool:remove']"
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
    <el-dialog :title="title" :visible.sync="open" width="900px">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基础信息" name="first">
          <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="合同编号" prop="contractCode">
              <el-input v-model="form.contractCode" placeholder="请输入合同编号" />
            </el-form-item>
            <el-form-item label="合同名称" prop="contractName">
              <el-input v-model="form.contractName" placeholder="请输入合同名称" />
            </el-form-item>
            <el-form-item label="联营客户" prop="ownerName">
              <el-select
                v-model="form.ownerCode"
                placeholder="请选择联营客户"
                filterable
                @change="selectOwner"
                style="width:100%"
              >
                <el-option
                  v-for="item in ownerList"
                  :key="item.ownerCode"
                  :label="item.ownerName"
                  :value="item.ownerCode"
                >
                  <span
                    style="float: left; color: #8492a6; font-size: 13px;width:33%"
                  >{{ item.ownerName }}</span>
                  <span style="float: left;width:33%">{{ item.ownerCode }}</span>

                  <span style="float: left;width:33%">{{ item.ownerLxrPhone }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="联营模式">
              <el-select v-model="form.poolModel" placeholder="请选择联营模式" style="width:100%">
                <el-option
                  v-for="dict in poolModelOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="抽成率(%)" prop="contractMoney">
              <el-input  v-model="form.takeNum" placeholder="请输入抽成率" @change="form.takeNum=form.takeNum.replace(/[^\d.]/g,'')"></el-input>
            </el-form-item>
            <el-form-item label="抽成结算方式">
              <el-select v-model="form.takePayType" placeholder="请选择结算方式" style="width:100%">
                <el-option
                  v-for="dict in takePayTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="签约时间" prop="signTime">
              <el-date-picker
                clearable
                style="width:100%"
                v-model="form.signTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择签约时间"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="签约地点" prop="signAddress">
              <el-input v-model="form.signAddress" placeholder="请输入签约地点" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="明细信息" name="second">
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button type="primary" icon="el-icon-plus" size="mini" @click="stallSelect">新增摊位</el-button>
            </el-col>
            <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
            </el-col>-->
          </el-row>

          <el-table
            :data="tableData"
            class="tb-edit"
            style="width: 100%"
            highlight-current-row
            @row-click="handleCurrentChange"
          >
            <el-table-column label="摊位编号" width="120">
              <template scope="scope">
                <el-input
                  :disabled="true"
                  size="small"
                  v-model="scope.row.stallCode"
                  placeholder="请输入内容"
                  @change="handleEdit(scope.$index, scope.row)"
                ></el-input>
                <span>{{scope.row.stallCode}}</span>
              </template>
            </el-table-column>
            <el-table-column label="摊位名称" width="120">
              <template scope="scope">
                <el-input
                  :disabled="true"
                  size="small"
                  v-model="scope.row.stallName"
                  placeholder="请输入内容"
                  @change="handleEdit(scope.$index, scope.row)"
                ></el-input>
                <span>{{scope.row.stallName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="stallArea" label="面积" width="120">
              <template scope="scope">
                <el-input
                  :disabled="true"
                  size="small"
                  v-model="scope.row.stallArea"
                  placeholder="请输入内容"
                  @change="handleEdit(scope.$index, scope.row)"
                ></el-input>
                <span>{{scope.row.stallArea}}</span>
              </template>
            </el-table-column>
            <el-table-column label="计费日期" width="180">
              <template scope="scope">
                <el-date-picker
                  clearable
                  size="small"
                  v-model="scope.row.leaseTime"
                  type="date"
                  @change="handleEdit(scope.$index, scope.row)"
                  value-format="yyyy-MM-dd"
                  placeholder="选择计费日期"
                ></el-date-picker>
                <span>{{scope.row.leaseTime}}</span>
              </template>
            </el-table-column>
            <el-table-column label="抽成比例(%)" width="150">
              <template scope="scope">
                <el-input
                  size="small"
                  v-model="scope.row.takeNum"
                  placeholder="请输入抽成比例"
                  @change="handleEdit(scope.$index, scope.row)"
                  :onkeyup="scope.row.takeNum=scope.row.takeNum.replace(/[^\d.]/g,'')"
                ></el-input>
                <span>{{scope.row.takeNum}}</span>
              </template>
            </el-table-column>
            <el-table-column label="备注" width="180">
              <template scope="scope">
                <el-input
                  size="small"
                  v-model="scope.row.contractBz"
                  placeholder="请输入备注"
                  @change="handleEdit(scope.$index, scope.row)"
                ></el-input>
                <span>{{scope.row.contractBz}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template scope="scope">
                <!--<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
                <el-button
                  size="small" v-if="checkStatus"
                  type="danger"
                  @click="handleChildDelete(scope.$index, scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="附件信息" name="three">
          <el-row :gutter="15" class="mb8">
            <el-col :span="1.5">
              <el-upload
                class="upload-demo"
                :limit="15"
                drag
                :file-list="fileList"
                :action="upload.url"
                :headers="upload.headers"
                :on-success="handleFileSuccess"
                :on-remove="handleRemove"
                :on-preview="clickFile"
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  将文件拖到此处，或
                  <em>点击上传</em>
                </div>
              </el-upload>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <pool-stall v-if="poolStallDialog" ref="poolStall" @selectData="selectData"></pool-stall>
  </div>
</template>

<script>
import {
  listContract,
  getContract,
  getContractChild,
  delContract,
  delContractChild,
  addContract,
  updateContract,
  updateContractStatus,
  exportContract,
  getOwnerList,
} from "@/api/system/pool";
import poolStall from "./poolStall";
import { getToken } from "@/utils/auth";
import { listFile, delFile } from "@/api/system/file";
export default {
  name: "Lease",
  components: {
    poolStall,
  },
  data() {
    return {
       checkStatus:true,
      fileList: [],
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
        url: process.env.VUE_APP_BASE_API + "/common/upload",
      },
      //业主列表
      ownerList: [],
      //联营模式
      poolModelOptions: [],
      //抽成结算方式
      takePayTypeOptions: [],
      // 遮罩层
      loading: false,
      poolStallDialog: false,
      //选取主市场
      markDatas: [],
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      //子表数据
      tableData: [],

      // 主表信息表格数据
      leaseList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      perationOptions: [],
      operateOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        markCode: undefined,
        contractCode: undefined,
        contractName: undefined,
      },
      // 表单参数
      form: {},
      activeName: "first",
      // 表单校验
      rules: {
        contractCode: [
          { required: true, message: "合同编号不能为空", trigger: "blur" },
        ],
        contractName: [
          { required: true, message: "合同名称不能为空", trigger: "blur" },
        ],
        ownerCode: [
          { required: true, message: "业户不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
    //联营模式
    this.getDicts("sys_pool_model_type").then((response) => {
      this.poolModelOptions = response.data;
    });
    //抽成结算方式
    this.getDicts("sys_take_pay_type").then((response) => {
      this.takePayTypeOptions = response.data;
    });
    getOwnerList().then((response) => {
      this.ownerList = response.data;
      console.log(this.markDatas);
    });
  },
  methods: {
    clickFile(file) {
     if (file.response != ""&&file.response != undefined&&file.response != null) {
          window.open(file.response.url);
      }
      if (file.url != ""&&file.url != undefined&&file.url != null) {
          window.open (file.url);
      }
    },
    handleFileSuccess(res, file, fileList) {
       this.fileList=fileList;
      // 上传成功
      console.log(res.url);
     // this.form.fileName = res.url;
    },
    handleRemove(file, fileList) {
     // this.form.fileName = "";
     this.fileList=fileList;
      if(file.id!=undefined&&file.id!=""&&file.id!=null){
        delFile(file.id);
      }
    },
    //选择客户
    selectOwner(data) {
      for(let i=0;i<this.ownerList.length;i++){
        if(data==this.ownerList[i].ownerCode){
          this.form.ownerName=this.ownerList[i].ownerName;
          break;
        }
      }
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    handleCurrentChange(row, event, column) {
      console.log(row, event, column, event.currentTarget);
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleChildDelete(index, row) {
      if (row.id != "" && row.id != undefined && row.id != null) {
        delContractChild(row.id);
        this.tableData.splice(index, 1);
      } else {
        this.tableData.splice(index, 1);
      }
      console.log(index, row);
    },
    /** 操作 */
    stallSelect() {
      this.poolStallDialog = true;
      this.$nextTick(() => {
        this.$refs.poolStall.visible = true;
      });
    },
    //选择数据
    selectData(row) {
      //  this.poolStallDialog=false;
      this.$nextTick(() => {
        //检查是否存在重复数据
        for (let i = 0; i < this.tableData.length; i++) {
          if (row.stallCode == this.tableData[i].stallCode) {
            this.msgError("摊位信息重复!");
            return;
          }
        }
        let stallInfo = new Object();
        stallInfo.stallCode = row.stallCode;
        stallInfo.stallName = row.stallName;
        stallInfo.stallArea = row.regionArea;
        stallInfo.leaseTime = "";
        stallInfo.takeNum = "";
        stallInfo.contractBz = "";
        this.tableData.push(stallInfo);
        this.$refs.poolStall.visible = false;
      });
    },
    /** 查询信息列表 */
    getList() {
      this.loading = true;
      listContract(this.queryParams).then((response) => {
        this.leaseList = response.rows;
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
        contractCode: undefined,
        contractName: undefined,
        ownerCode: undefined,
        ownerName: undefined,
        poolModel: undefined,
        fileName: undefined,
        takePayType: undefined,
        takeNum: undefined,
        signAddress: undefined,
        signTime: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
        fileName: undefined,
        rows: "",
      };
      this.resetForm("form");
      this.tableData = [];
       this.checkStatus=true;
       this.fileList=[];
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
      this.title = "添加联营合同";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getContract(id).then((response) => {
        this.form = response.data;
        if(response.data.contractStatus=="已生效"){
          this.checkStatus=false;
        }
        // if (response.data.fileName != "") {
        //   this.fileList = [];
        //   let info = new Object();
        //   info.name = response.data.fileName;
        //   info.url = response.data.fileName;
        //   this.fileList.push(info);
        // }
         let queryParams={djNumber:response.data.contractCode}
        listFile(queryParams).then((response) => {
          this.fileList=[];
          for(let i=0;i<response.rows.length;i++){
                let file=response.rows[i];
                let item= new Object();
                item.id=file.id;
                item.name=file.fileName;
                item.url=file.fileUrl;
                this.fileList.push(item);
          }
        });
        getContractChild(this.form.contractCode).then((response) => {
          //this.form.rows = response.data;
          this.tableData = response.data;
        });
        this.open = true;
        this.title = "修改联营合同";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      if (this.tableData.length > 0) {
        //检查子表信息
        for (let i = 0; i < this.tableData.length; i++) {
          if (
            this.tableData[i].leaseStartTime == "" ||
            this.tableData[i].leaseEndTime == "" ||
            this.tableData[i].rentMoney == ""
          ) {
            this.msgError("明细时间和金额信息不能为空!");
            return;
          }
        }
        this.form.rows = JSON.stringify(this.tableData);
          //附件转换
        if(this.fileList.length>0){
          let files=[];
          for(let i=0;i<this.fileList.length;i++){
              let file=this.fileList[i];
              console.log(file.response)
              if (file.response != undefined&&file.response != ""&&file.response != null) {
                 let item= new Object();
                 item.id="";
                 item.fileName=file.name;
                 item.fileUrl=file.response.url;
                 files.push(item);
              }
              if (file.url != undefined&&file.url != ""&&file.url != null) {
                 let item= new Object();
                 item.id=file.id;
                 item.fileName=file.name;
                 item.fileUrl=file.url;
                 files.push(item);
              }
          }
          this.form.fileRows = JSON.stringify(files);
        }
        this.$refs["form"].validate((valid) => {
          if (valid) {
            if (this.form.id != undefined) {
              updateContract(this.form).then((response) => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                  this.$refs.poolStall.getList();
                } else {
                  this.msgError(response.msg);
                }
              });
            } else {
              addContract(this.form).then((response) => {
                if (response.code === 200) {
                  this.msgSuccess("新增成功");
                  this.open = false;
                  this.getList();
                  this.$refs.poolStall.getList();
                } else {
                  this.msgError(response.msg);
                }
              });
            }
          }
        });
      } else {
        this.msgError("请填写子表信息!");
      }
    },
     /** 生效按钮操作 */
    handleEffect(row) {
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认租赁合同编号为"' + ids + '"的数据项已生效?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return updateContractStatus(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("操作成功");
            this.$refs.poolStall.getList();
        })
        .catch(function () {});
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认删除联营合同编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delContract(ids);
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
      this.$confirm("是否确认导出所有联营合同数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportContract(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
  },
};
</script>
<style>
.cell .el-select+span{
  display: none;
}
.cell .el-input+span{
  display: none;
}
.el-table__expanded-cell {
  padding: 0 !important;
  margin: 0 !important;
}
.tb-edit .el-input {
  display: block !important;
}
.tb-edit .current-row .el-input {
  display: block;
}
.tb-edit .current-row .el-input + span {
  display: none;
}
.tb-edit .current-row .el-select {
  display: block;
}
.tb-edit .current-row .el-select + span {
  display: none;
}
table th.star div::after {
  content: "*";
  color: red;
}
.el-input.is-disabled .el-input__inner {
    
    color: #606266;
    
}
</style>