<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
      <el-form-item label="单据编号" prop="djNumber">
        <el-input
          v-model="queryParams.djNumber"
          placeholder="请输入单据编号"
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
          v-hasPermi="['system:admiss:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:admiss:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:admiss:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-s-promotion"
          size="mini"
          :disabled="multiple"
          @click="handleEffect"
          v-hasPermi="['system:admiss:effect']"
        >生效</el-button>
      </el-col>
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
            <el-table-column label="业主名称" align="center" prop="ownerName" />
            <el-table-column label="商品编号" align="center" prop="goodsCode" />
            <el-table-column label="商品名称" align="center" prop="goodsName" />
            <el-table-column label="供应商编号" align="center" prop="personCode" />
            <el-table-column label="供应商名称" align="center" prop="personName" />
             <el-table-column label="产地" align="center" prop="goodsAddress" />
            <el-table-column label="数量(公斤)" align="center" prop="goodsNum" />
            <el-table-column label="备注" align="center" prop="remark" />
          </el-table>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="单据状态" align="center" prop="djStatusName" />
      <el-table-column label="单据编号" align="center" prop="djNumber" />
      <el-table-column label="车牌号" align="center" prop="carNumber" />
      <el-table-column label="产地" align="center" prop="roomAddress" />
      <el-table-column label="数量(公斤)" align="center" prop="roomNum" />
      <el-table-column label="制单人" align="center" prop="createBy" />
      <el-table-column label="制单日期" align="center" prop="createTime" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:admiss:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:admiss:remove']"
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
    <el-dialog :title="title" :visible.sync="open" width="1000px">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基础信息" name="first">
          <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            
            <el-form-item label="选择车辆" prop="carNumber">
              <el-select v-model="form.carNumber" placeholder="请选择车辆" filterable style="width:100%">
                <el-option
                  v-for="item in carList"
                  :key="item.carNumber"
                  :label="item.carNumber"
                  :value="item.carNumber"
                >
                  <span
                    style="float: left; color: #8492a6; font-size: 13px;width:33%"
                  >{{ item.carNumber }}</span>
                  <span style="float: left;width:33%">{{ item.carOwner }}</span>

                  <span style="float: left;width:33%">{{ item.carOwnerPhone }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="产地" prop="roomAddress">
              <el-input v-model="form.roomAddress" placeholder="请输入产地"></el-input>
            </el-form-item> -->
            <el-form-item label="数量(公斤)" prop="roomNum">
              <el-input size="small" v-model="form.roomNum" placeholder="请输入数量" type="number"></el-input>
            </el-form-item>
            <el-form-item label="备注信息" prop="createBy">
              <el-input v-model="form.remark" placeholder="请输入备注信息" />
            </el-form-item>
            <el-form-item label="单据编号" prop="djNumber">
              <el-input v-model="form.djNumber" :disabled="true" placeholder="后台自动生成" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="明细信息" name="second">
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button type="primary" icon="el-icon-plus" size="mini" @click="goodsSelect">新增明细</el-button>
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
            :header-cell-class-name="starAdd"
          >
          <el-table-column prop="ownerCode" label="选择业主" width="200">
              <template scope="scope">
                <el-select
                  v-model="scope.row.ownerCode"
                  placeholder="请选择业主"
                  filterable
                  @change="ownerSelect($event,scope.$index, scope.row)"
                >
                  <el-option
                    v-for="item in ownerList"
                    :key="item.ownerCode"
                    :label="item.ownerName"
                    :value="item.ownerCode"
                  >
                    <span
                      style="float: left; color: #8492a6; font-size: 13px;width:100%"
                    >{{ item.ownerName }}</span>
                  </el-option>
                </el-select>
                <span>{{scope.row.ownerName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="goodsCode" label="选择商品" width="200">
              <template scope="scope">
                <el-select
                  v-model="scope.row.goodsCode"
                  placeholder="请选择商品"
                  filterable
                 @change="selectGoods($event,scope.$index, scope.row)"
                 @visible-change="selectGoods($event,scope.$index, scope.row)"
                >
                  <el-option
                    v-for="item in goodsList"
                    :key="item.goodsCode"
                    :label="item.goodsName"
                    :value="item.goodsCode"
                  >
                    <span
                      style="float: left; color: #8492a6; font-size: 13px;width:100%"
                    >{{ item.goodsName }}</span>
                  </el-option>
                </el-select>
                <span>{{scope.row.goodsName}}</span>
              </template>
            </el-table-column>
            <el-table-column label="产地信息" width="200">
              <template scope="scope">
                <el-input
                  :disabled="true"
                  size="small"
                  v-model="scope.row.goodsAddress"
                  placeholder="请输入产地信息"
                  @change="handleEdit(scope.$index, scope.row)"
                ></el-input>
                <span>{{scope.row.goodsAddress}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="personCode" label="选择供应商" width="200">
              <template scope="scope">
                <el-select
                  v-model="scope.row.personCode"
                  placeholder="选择供应商"
                  filterable
                  @change="handleEditPerson($event,scope.$index, scope.row)"
                  style="width:100%"
                >
                  <el-option
                    v-for="item in personList"
                    :key="item.personCode"
                    :label="item.personName"
                    :value="item.personCode"
                  >
                    <span style="float: left;width:100%">{{ item.personName }}</span>
                  </el-option>
                </el-select>
                <span style="position: relative;top:-13px;">{{scope.row.personName}}</span>
              </template>
            </el-table-column>

            <el-table-column label="数量(公斤)" width="120">
              <template scope="scope">
                <el-input
                  size="small"
                  @change="getSum()"
                  v-model="scope.row.goodsNum"
                  placeholder="请输入数量"
                  :onkeyup="scope.row.goodsNum=scope.row.goodsNum.replace(/[^\d.]/g,'')"
                ></el-input>
                <span>{{scope.row.goodsNum}}</span>
              </template>
            </el-table-column>
            <el-table-column label="备注" width="150">
              <template scope="scope">
                <el-input
                  size="small"
                  v-model="scope.row.remark"
                  placeholder="请输入备注"
                  @change="handleEdit(scope.$index, scope.row)"
                ></el-input>
                <span>{{scope.row.remark}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" >
              <template scope="scope">
                <!--<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
                <el-button v-if="checkStatus"
                  size="small"
                  type="danger"
                  @click="handleChildDelete(scope.$index, scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- <el-tab-pane label="附件信息" name="three">
          <el-row :gutter="15" class="mb8">
            <el-col :span="1.5">
              <el-upload
                class="upload-demo"
                :limit="1"
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
        </el-tab-pane> -->
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listAdmiss,
  getAdmiss,
  getAdmissChild,
  delAdmiss,
  delAdmissChild,
  addAdmiss,
  updateAdmiss,
  updateAdmissStatus,
  exportAdmiss,
} from "@/api/system/admiss";

import { getOwnerList } from "@/api/system/pool";
import { listOwnerGoods } from "@/api/system/ownerGoods";
import { listCar } from "@/api/system/car";
import { getPersonAll } from "@/api/system/person";
import { getToken } from "@/utils/auth";
export default {
  name: "Lease",
  data() {
    return {
      checkStatus:true,
      //关联账号
      userName: "",
      //业主列表
      ownerList: [],
      //商品列表
      goodsList:[],
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
      stallList: [],
      //供应商
      personList: [],
      // 遮罩层
      loading: false,
      selectGoodsDialog: false,
      //选取主市场
      markDatas: [],
      //车辆列表
      carList: [],
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
        type:1,//多业户
        markCode: undefined,
        djNumber: undefined,
        djTime: undefined,
      },
      // 表单参数m
      form: {},
      activeName: "first",
      // 表单校验
      rules: {
        // carNumber: [
        //   { required: true, message: "车辆不能为空", trigger: "blur" },
        // ],
        roomAddress: [
          { required: true, message: "产地不能为空", trigger: "blur" },
        ],
        roomNum: [{ required: true, message: "数量不能为空", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getList();
    getPersonAll(this.queryParams).then((response) => {
      this.personList = response.rows;
    });
    getOwnerList().then((response) => {
      this.ownerList = response.data;
      console.log(this.markDatas);
    });
    this.getCarList();
  },
  methods: {
    //根据业户选择车辆数据
    // getCarList(createBy) {
    //   let queryParams = { createBy: createBy };
    //   listCar(queryParams).then((response) => {
    //     this.carList = response.rows;
    //   });
    // },
    getCarList() {
      let queryParams = {  };
      listCar(queryParams).then((response) => {
        this.carList = response.rows;
      });
    },
    //追加子表必填样式
    starAdd(obj) {
      if (
        obj.columnIndex === 0 ||
        obj.columnIndex === 1 ||
        obj.columnIndex === 2 ||
        obj.columnIndex === 3 ||
        obj.columnIndex === 4
      ) {
        return "star";
      }
    },
    clickFile(file) {
      if (file.url != "") {
        window.location.href = file.url;
      }
    },
    handleFileSuccess(res, file, fileList) {
      // 上传成功
      console.log(res.url);
      this.form.fileName = res.url;
    },
    handleRemove(file, fileList) {
      this.form.fileName = "";
    },
    //选择客户
    selectOwner(data) {
      //根据ownerCode查找关联业户账号
      for (let i = 0; i < this.ownerList.length; i++) {
        if (this.ownerList[i].ownerCode == data) {
          this.form.ownerName = this.ownerList[i].ownerName;
          let userName = this.ownerList[i].userName;
          if (userName != "" && userName != null && userName != undefined) {
            this.userName = userName;
            this.getCarList(userName);
          }
        }
      }
      //带出该业主下推送磅房等商品信息
      this.addGoodsData();
    },
    //选择供应商
    selectPerson(data) {},
    //选择摊位
    selectStall(data) {
      //根据摊位编码查找摊位名称
      for (let i = 0; i < this.stallList.length; i++) {
        if (this.stallList[i].stallCode == data) {
          this.form.stallName = this.stallList[i].stallName;
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
    //选择业主带出商品
    ownerSelect(data,index,row){
      for (let i = 0; i < this.ownerList.length; i++) {
        if (this.ownerList[i].ownerCode == data) {
          row.ownerName = this.ownerList[i].ownerName;
          // let userName = this.ownerList[i].userName;
          // if (userName != "" && userName != null && userName != undefined) {
          //   let queryParams = { createBy: userName, isSend: 1 };
          //   listOwnerGoods(queryParams).then((response) => {
          //     this.goodsList = response.rows;
          //   });
          // }
        }
      }
    },
    //选择商品
    selectGoods(data,index,row){
      if(row.ownerCode!=""&&row.ownerCode!=null&&row.ownerCode!=undefined){
        for (let i = 0; i < this.ownerList.length; i++) {
        if (this.ownerList[i].ownerCode == row.ownerCode) {
            row.ownerName = this.ownerList[i].ownerName;
            let userName = this.ownerList[i].userName;
            if (userName != "" && userName != null && userName != undefined) {
              let queryParams = { createBy: userName, isSend: 1 };
              listOwnerGoods(queryParams).then((response) => {
                this.goodsList = response.rows;
              });
            }
          }
        }
      }
      for (let i = 0; i < this.goodsList.length; i++) {
        if (this.goodsList[i].goodsCode == data) {
          row.goodsAddress = this.goodsList[i].goodsAddress;
          row.goodsName = this.goodsList[i].goodsName;
        }
      }
    },
    handleEditPerson(data, index, row) {
      //根据编码找产地
      for (let i = 0; i < this.personList.length; i++) {
        if (this.personList[i].personCode == data) {
          if(row.goodsAddress==""||row.goodsAddress==null||row.goodsAddress==undefined){
            row.goodsAddress = this.personList[i].personGoodsAddress;
          }
          row.personName = this.personList[i].personName;
          break;
        }
      }
    },
    handleChildDelete(index, row) {
      if (row.id != "" && row.id != undefined && row.id != null) {
        delAdmissChild(row.id);
        this.tableData.splice(index, 1);
      } else {
        this.tableData.splice(index, 1);
      }
      this.getSum();
      console.log(index, row);
    },
    /** 新增明细操作 */
    goodsSelect() {
       this.goodsList=[];
       let goodsInfo = new Object();
        goodsInfo.ownerCode = "";
        goodsInfo.ownerName = "";
        goodsInfo.goodsCode = "";
        goodsInfo.goodsName = "";
        goodsInfo.goodsDw = "";
        goodsInfo.personCode = "";
        goodsInfo.personName = "";
        goodsInfo.goodsNum = "";
        goodsInfo.goodsWeight = "";
        goodsInfo.remark = "";
        this.tableData.push(goodsInfo);
    },
    getSum() {
      //计算总金额
      let sum = 0;
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].goodsNum != "") {
          sum += parseFloat(this.tableData[i].goodsNum);
        }
      }
      this.form.roomNum = sum.toString();
      console.log(this.form);
      // console.log(row.goodsNum);
    },
    /** 查询信息列表 */
    getList() {
      this.loading = true;
      listAdmiss(this.queryParams).then((response) => {
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
        djNumber: undefined,
        carNumber: undefined,
        ownerName: undefined,
        ownerCode: undefined,
        roomAddress: undefined,
        roomNum: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
        fileName: undefined,
        rows: "",
      };
      this.ownerName = "";
      this.resetForm("form");
      this.tableData = [];
      this.checkStatus=true;
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
      this.title = "添加磅房入场单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getAdmiss(id).then((response) => {
        this.form = response.data;
        if(response.data.status==1){
          this.checkStatus=false;
        }
        getAdmissChild(this.form.djNumber).then((response) => {
          //this.form.rows = response.data;
          this.tableData = response.rows;
        });
        this.open = true;
        this.title = "修改磅房入场单";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      if (this.tableData.length > 0) {
        //检查子表信息
        for (let i = 0; i < this.tableData.length; i++) {
          if (
            this.tableData[i].ownerCode == "" ||
            this.tableData[i].goodsCode == "" ||
            this.tableData[i].personCode == "" ||
            this.tableData[i].goodsAddress == "" ||
            this.tableData[i].goodsNum == ""
          ) {
            this.msgError("检查明细信息必填项!");
            return;
          }
        }
        this.form.rows = JSON.stringify(this.tableData);
        this.$refs["form"].validate((valid) => {
          if (valid) {
            this.form.type=1;//多业户
            if (this.form.id != undefined) {
              updateAdmiss(this.form).then((response) => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                } else {
                  this.msgError(response.msg);
                }
              });
            } else {
              addAdmiss(this.form).then((response) => {
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
      } else {
        this.msgError("请填写子表信息!");
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认删除单据编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delAdmiss(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    /** 生效按钮操作 */
    handleEffect(row) {
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认单据编号为"' + ids + '"的数据项已生效?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return updateAdmissStatus(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("操作成功");
        })
        .catch(function () {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有单据数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportAdmiss(queryParams);
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