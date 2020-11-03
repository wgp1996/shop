<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="100px"
    >
      <el-form-item label="单据编号" prop="djNumber">
        <el-input
          v-model="queryParams.djNumber"
          placeholder="请输入单据编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="单据名称" prop="djTime">
        <el-input
          v-model="queryParams.djTime"
          placeholder="请输入单据名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:wholeRetail:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:wholeRetail:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:wholeRetail:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-s-promotion"
          size="mini"
          :disabled="multiple"
          @click="handleEffect"
          v-hasPermi="['system:wholeRetail:effect']"
          >生效</el-button
        >
      </el-col>
          <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-edit"
          size="mini"
          @click="handleImport"
          v-hasPermi="['system:wholeRetail:import']"
          >导入</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="leaseList"
      @selection-change="handleSelectionChange"
      row-key="id"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table style="padding:0;margin:0" :data="props.row.childrenList" id="special">
            <!-- <el-table-column label="商品编号" align="center" prop="goodsCode" /> -->
            <el-table-column label="客户名称" align="center" prop="khName" />
            <el-table-column label="商品名称" align="center" prop="goodsName" />
            <el-table-column label="单位" align="center" prop="wholeDw" />
            <el-table-column label="销售量" align="center" prop="wholeNum" />
            <el-table-column label="单价" align="center" prop="wholePrice" />
            <el-table-column label="金额" align="center" prop="wholeMoney" />
            <el-table-column label="备注" align="center" prop="remark" />
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="销货日期" align="left" prop="djTime" />
      <el-table-column label="业户名称" align="left" prop="createName" width="350px"/>
      <el-table-column label="单据状态" align="left" prop="djStatusName" />
      <!-- <el-table-column label="单据编号" align="center" prop="djNumber" /> -->
      <!-- <el-table-column label="备注说明" align="center" prop="remark" /> -->
      <el-table-column label="制单人" align="left" prop="createBy" /> 
      <!-- <el-table-column label="制单日期" align="center" prop="createTime" /> -->
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:wholeRetail:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:wholeRetail:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
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
            <el-form-item label="单据编号" prop="djNumber">
              <el-input
                v-model="form.djNumber"
                :disabled="true"
                placeholder="后台自动生成"
              />
            </el-form-item>
            <el-form-item label="单据时间" prop="djTime">
              <el-date-picker
                clearable
                style="width: 100%"
                v-model="form.djTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择单据时间"
              ></el-date-picker>
            </el-form-item>
            <!-- <el-form-item label="选择客户" prop="khName">
              <el-row :gutter="0">
                <el-col :span="21">
                  <el-input
                    v-model="form.khName"
                    placeholder="点击选择客户"
                    :disabled="true"
                  />
                </el-col>
                <el-col :span="1" :offset="2">
                  <i
                    @click="khSelect"
                    class="el-icon-plus"
                    style="font-size: 20px"
                  ></i>
                </el-col>
              </el-row>
            </el-form-item> -->
            <el-form-item label="零售类型" prop="wholeType">
              <el-radio-group v-model="form.wholeType">
                <el-radio :label="0">自由售货</el-radio>
                <el-radio :label="1">以采定销</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="备注信息" prop="createBy">
              <el-input v-model="form.remark" placeholder="请输入备注信息" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="明细信息" name="second">
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="goodsSelect"
                >添加商品</el-button
              >
            </el-col>
          </el-row>
          <el-table
            :data="tableData"
            class="tb-edit"
            style="width: 100%"
            highlight-current-row
            @row-click="handleCurrentChange"
            :header-cell-class-name="starAdd"
          >
          <el-table-column prop="khCode" label="选择客户" width="200">
               <template scope="scope">
                 <el-select
                v-model="scope.row.khCode"
                placeholder="选择客户"
                filterable
                @change="handleEditPerson($event,scope.$index, scope.row)"
                style="width:100%"
                >
                <el-option
                  v-for="item in khList"
                  :key="item.khCode"
                  :label="item.khName"
                  :value="item.khCode"
                >
                  <span style="float: left;width:100%">{{ item.khName }}</span>
                </el-option>
              </el-select>
              <span  style="position: relative;top:-13px;">{{scope.row.khName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="goodsCode" label="商品编码" width="150">
              <template scope="scope">
                <el-input
                  :disabled="true"
                  size="small"
                  v-model="scope.row.goodsCode"
                  placeholder="请输入内容"
                  @change="handleEdit(scope.$index, scope.row)"
                ></el-input>
                <span>{{ scope.row.goodsCode }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="goodsName" label="商品名称" width="150">
              <template scope="scope">
                <el-input
                  :disabled="true"
                  size="small"
                  v-model="scope.row.goodsName"
                  placeholder="请输入内容"
                  @change="handleEdit(scope.$index, scope.row)"
                ></el-input>
                <span>{{ scope.row.goodsName }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="wholeDw" label="单位" width="120">
              <template scope="scope">
                <el-input
                  :disabled="true"
                  size="small"
                  v-model="scope.row.wholeDw"
                  placeholder="请输入单位信息"
                  @change="handleEdit(scope.$index, scope.row)"
                ></el-input>
                <span>{{ scope.row.wholeDw }}</span>
              </template>
            </el-table-column>
            <el-table-column label="销售量" width="120">
              <template scope="scope">
                <el-input
                  size="small"
                  v-model="scope.row.wholeNum"
                  placeholder="请输入数量"
                  :onkeyup="
                    (scope.row.wholeNum = scope.row.wholeNum.replace(
                      /[^\d.]/g,
                      ''
                    ))
                  "
                  @change="handleEdit(scope.$index, scope.row)"
                ></el-input>
                <span>{{ scope.row.wholeNum }}</span>
              </template>
            </el-table-column>
            <el-table-column label="单价" width="120">
              <template scope="scope">
                <el-input
                  size="small"
                  v-model="scope.row.wholePrice"
                  placeholder="请输入单价"
                  @change="handleEdit(scope.$index, scope.row)"
                ></el-input>
                <span>{{ scope.row.wholePrice }}</span>
              </template>
            </el-table-column>
            <el-table-column label="金额" width="120">
              <template scope="scope">
                <el-input
                  size="small"
                  v-model="scope.row.wholeMoney"
                  @change="handleEdit(scope.$index, scope.row)"
                ></el-input>
                <span>{{ scope.row.wholeMoney }}</span>
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
                <span>{{ scope.row.remark }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template scope="scope">
                <!--<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
                <el-button
                  size="small"
                  type="danger"
                  @click="handleChildDelete(scope.$index, scope.row)"
                  >删除</el-button
                >
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
      <el-dialog :title="title" :visible.sync="iopen" width="600px">
                <el-row :gutter="15" class="mb8">
            <el-col :span="1.5">
              <el-upload
                class="upload-demo"
                ref="upload"
                :action="importUrl"
                :headers="upload.headers"
                 :on-success="handleSuccess"
                :on-remove="handleRemove"
                :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
              </el-upload>
            </el-col>
          </el-row>
    </el-dialog>
    <goods-select
      v-if="selectGoodsDialog"
      ref="selectGoods"
      @selectData="selectData"
      @selectDataMore="selectDataMore"
    ></goods-select>
    <kh-select
      v-if="selectKhDialog"
      ref="selectKh"
      @selectData="selectKhData"
    ></kh-select>
  </div>
</template>

<script>
import {
  allListWholeRetail,
  listWholeRetail,
  getWholeRetail,
  getWholeRetailChild,
  delWholeRetail,
  delWholeRetailChild,
  addWholeRetail,
  updateWholeRetail,
  updateWholeRetailStatus,
  exportWholeRetail,
} from "@/api/system/wholeRetail";

import goodsSelect from "./goodsSelect";
import khSelect from "./khSelect";
import { getToken } from "@/utils/auth";
export default {
  name: "Lease",
  components: {
    goodsSelect,
    khSelect,
  },
  data() {
    return {
      importUrl:"",
      iopen:false,
      goodsDw: "",
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
      khList: [],
      // 遮罩层
      loading: false,
      selectGoodsDialog: false,
      selectKhDialog: false,
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
        djNumber: undefined,
        djTime: undefined,
      },
      // 表单参数
      form: {},
      activeName: "first",
      // 表单校验
      rules: {
        djTime: [
          { required: true, message: "单据日期不能为空", trigger: "blur" },
        ],
        // khName: [{ required: true, message: "客户不能为空", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getList();
    allListWholeRetail(this.queryParams).then(response => {
        this.khList = response.rows;
        // console.log(this.personList)
    });
  },
  methods: {
    submitUpload() {
        this.$refs.upload.submit();
      },
     handleSuccess(res, file, fileList) {
       this.getList();
    },
     handleRemove(file, fileList) {

    },
         /** 导入操作 */
    handleImport() {
      this.iopen = true;
      this.title = "导入多品配货";
      this.importUrl=process.env.VUE_APP_BASE_API + "/system/wholeRetail/import";
    },
       handleEditPerson(data,index, row){
        //根据编码找产地
      
        for(let i=0;i<this.khList.length;i++){
          if(this.khList[i].khCode==data){
            row.khName=this.khList[i].khName;
            break;
          }
        }
    },
    //追加子表必填样式
    starAdd(obj) {
      if (
        obj.columnIndex === 0 ||
        obj.columnIndex === 1 ||
        obj.columnIndex === 2
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
    selectOwner(data) {},
    //选择供应商
    selectPerson(data) {},
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    handleCurrentChange(row, event, column) {
      console.log(row, event, column, event.currentTarget);
    },
    handleEdit(index, row) {
      if (
        row.wholePrice != "" &&
        row.wholePrice != null &&
        row.wholePrice != undefined &&
        row.wholeNum != "" &&
        row.wholeNum != null &&
        row.wholeNum != undefined
      ) {
        row.wholeMoney = (
          parseFloat(row.wholePrice) * parseFloat(row.wholeNum)
        ).toFixed(2);

        //  else {
        //   console.log(this.form.inhibitionNum);
        //   this.msgError("请先填写抑制率标准设定值!");
        //   return;
      }
    },
    handleChildDelete(index, row) {
      if (row.id != "" && row.id != undefined && row.id != null) {
        delWholeRetailChild(row.id);
        this.tableData.splice(index, 1);
      } else {
        this.tableData.splice(index, 1);
      }
      console.log(index, row);
    },
    /** 操作 */
    goodsSelect() {
      this.selectGoodsDialog = true;
      this.$nextTick(() => {
        this.$refs.selectGoods.visible = true;
      });
    },
    editTime(i) {
      if (i < 10) {
        i = "0" + i;
      }
      return i;
    },
      getTime() {
      var date = new Date();
      var year = date.getFullYear(); //得到当前年份
      var month = this.editTime(date.getMonth() + 1); //得到当前月份
      var day = this.editTime(date.getDate()); //得到当前几号
      var hour = this.editTime(date.getHours()); //得到当前小时
      var min = this.editTime(date.getMinutes()); //得到当前分钟
      var seconds = this.editTime(date.getSeconds()); //得到当前秒
      var weeks = date.getDay();
      var week;
      switch (weeks) {
        case 0:
          week = "星期日";
          break;
        case 1:
          week = "星期一";
          break;
        case 2:
          week = "星期二";
          break;
        case 3:
          week = "星期三";
          break;
        case 4:
          week = "星期四";
          break;
        case 5:
          week = "星期五";
          break;
        case 6:
          week = "星期六";
          break;
      }
      return year + "-" + month + "-" + day;
    },
    khSelect() {
      this.selectKhDialog = true;
      this.$nextTick(() => {
        this.$refs.selectKh.visible = true;
      });
    },
    //批量选择数据
    selectDataMore(rows) {
      //  this.selectGoodsDialog=false;
      this.$nextTick(() => {
        for (let i = 0; i < rows.length; i++) {
          let row = rows[i];
          let goodsInfo = new Object();
          goodsInfo.goodsCode = row.goodsCode;
          goodsInfo.goodsName = row.goodsName;
          goodsInfo.wholeDw = row.goodsViceDw;
          goodsInfo.wholeNum = "";
          goodsInfo.wholePrice = "";
             goodsInfo.wholeMoney=""
          this.tableData.push(goodsInfo);
        }
        this.$refs.selectGoods.visible = false;
      });
    },
    //选择数据
    selectData(row) {
      //  this.selectGoodsDialog=false;

      this.$nextTick(() => {
        let goodsInfo = new Object();
        goodsInfo.goodsCode = row.goodsCode;
        goodsInfo.goodsName = row.goodsName;
        goodsInfo.wholeDw = row.goodsViceDw;
        goodsInfo.wholeNum = "";
        goodsInfo.wholePrice = "";
        goodsInfo.wholeMoney=""
        this.tableData.push(goodsInfo);
        this.$refs.selectGoods.visible = false;
      });
    },
    //选择数据
    selectKhData(row) {
      this.form.khCode = row.khCode;
      this.form.khName = row.khName;
      this.$refs.selectKh.visible = false;
    },
    /** 查询二级市场信息列表 */
    getList() {
      this.loading = true;
      listWholeRetail(this.queryParams).then((response) => {
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
        djTime: this.getTime(),
        khCode: undefined,
        khName: undefined,
        goodsDw: undefined,
        wholeType: 0,
        from: 0,
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
      this.title = "添加销货一票通";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getWholeRetail(id).then((response) => {
        this.form = response.data;
        // if (response.data.fileName != "") {
        //   this.fileList = [];
        //   let info = new Object();
        //   info.name = response.data.fileName;
        //   info.url = response.data.fileName;
        //   this.fileList.push(info);
        // }
        getWholeRetailChild(this.form.djNumber).then((response) => {
          //this.form.rows = response.data;
          this.tableData = response.rows;
        });
        this.open = true;
        this.title = "修改销货一票通";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      if (this.tableData.length > 0) {
        //检查子表信息
        for (let i = 0; i < this.tableData.length; i++) {
          if (
            this.tableData[i].khCode == "" ||
            this.tableData[i].wholeNum == "" ||
            this.tableData[i].wholeDw == ""
          ) {
            this.msgError("检查明细信息必填项!");
            return;
          }
        }
        this.form.rows = JSON.stringify(this.tableData);
        this.$refs["form"].validate((valid) => {
          if (valid) {
            if (this.form.id != undefined) {
              updateWholeRetail(this.form).then((response) => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                  this.$refs.selectGoods.getList();
                } else {
                  this.msgError(response.msg);
                }
              });
            } else {
              addWholeRetail(this.form).then((response) => {
                if (response.code === 200) {
                  this.msgSuccess("新增成功");
                  this.open = false;
                  this.getList();
                  this.$refs.selectGoods.getList();
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
      this.$confirm('是否确认删除单据编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delWholeRetail(ids);
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
      this.$confirm('是否确认单据编号为"' + ids + '"的数据项已生效?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return updateWholeRetailStatus(ids);
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
      this.$confirm("是否确认导出所有租赁单据数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportWholeRetail(queryParams);
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
.cell .el-select + span {
  display: none;
}
.cell .el-input + span {
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

/* .cell .el-select+span{
  display: none;
}
.cell .el-input+span{
  display: none;
}
.el-table__expanded-cell {
  padding: 0 !important;
  margin: 0 !important;
} */
</style>