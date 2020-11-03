<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
      <el-form-item label="设备名称" prop="deviceName">
        <el-input
          v-model="queryParams.deviceName"
          placeholder="请输入设备名称"
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
          v-hasPermi="['system:deviceItem:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:deviceItem:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:deviceItem:remove']"
        >删除</el-button>
        </el-col>
        <el-col :span="1.5">
        <!-- <el-button
          type="warning"
          icon="el-icon-s-promotion"
          size="mini"
          :disabled="multiple"
          @click="handleEffect"
          v-hasPermi="['system:deviceItem:effect']"
        >生效</el-button> -->
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="leaseList"
      @selection-change="handleSelectionChange"
      row-key="id"
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <!-- <el-table-column type="expand">
        <template slot-scope="props">
          <el-table style="padding:0;margin:0" :data="props.row.childrenList" id="special">
            <el-table-column label="商品名称" align="center" prop="goodsName" />
            <el-table-column label="供应商名称" align="center" prop="personName" />
            <el-table-column label="商品单位" align="center" prop="goodsDw" />
            <el-table-column label="数量" align="center" prop="goodsNum" />
            <el-table-column label="单价" align="center" prop="goodsPrice" /> 
            <el-table-column label="金额" align="center" prop="goodsMoney" /> 
            <el-table-column label="税率(%)" align="center" prop="goodsRate" /> 
            <el-table-column label="单价(含税)" align="center" prop="goodsPriceRate" /> 
            <el-table-column label="金额(含税)" align="center" prop="goodsMoneyRate" /> 
            <el-table-column label="备注" align="center" prop="remark" />
          </el-table>
        </template>
      </el-table-column> -->
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="设备名称" align="center" prop="deviceName" />
      <el-table-column label="检测通道数" align="center" prop="deviceTdNum" />
      <el-table-column label="测量精度" align="center" prop="deviceAccuracy" />
      <el-table-column label="设备品牌" align="center" prop="deviceBrand" />
      <el-table-column label="设备型号" align="center" prop="deviceModel" />
      <el-table-column label="购置日期" align="center" prop="deviceBuyTime" />
      <el-table-column label="供货单位" align="center" prop="deviceSendUnit" />
      <el-table-column label="供货联系人" align="center" prop="deviceSendLxr" />
      <el-table-column label="电话" align="center" prop="deviceSendLxrPhone" />
      <el-table-column label="售后联系人" align="center" prop="deviceSalesLxr" />
      <el-table-column label="电话" align="center" prop="deviceSalesLxrPhone" />
      <!-- <el-table-column label="制单人" align="center" prop="createBy" />
      <el-table-column label="制单日期" align="center" prop="createTime" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:deviceItem:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:deviceItem:remove']"
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
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="设备信息" name="first">
          
          
           
           <el-form-item label="设备名称" prop="deviceName">
              <el-input v-model="form.deviceName" placeholder="请输入备注信息" />
            </el-form-item>
            <el-form-item label="检测通道数量" prop="deviceTdNum">
              <el-input v-model="form.deviceTdNum" placeholder="请输入备注信息" />
            </el-form-item>
            <el-form-item label="测量精度(%)" prop="deviceAccuracy">
              <el-input v-model="form.deviceAccuracy" placeholder="请输入备注信息" />
            </el-form-item>
            <el-form-item label="品牌" prop="deviceBrand">
              <el-input v-model="form.deviceBrand"  placeholder="请输入品牌" />
            </el-form-item>
              <el-form-item label="型号"   prop="deviceModel">
              <el-input v-model="form.deviceModel"  placeholder="型号名称" />
            </el-form-item>
            <el-form-item label="备注" prop="deviceBz">
              <el-input v-model="form.deviceBz" placeholder="请输入备注信息" />
            </el-form-item>
            <!-- <el-form-item label="单据编号" prop="djNumber"  class="changeBlue">
              <el-input v-model="form.djNumber" :disabled="true" placeholder="后台自动生成" />
            </el-form-item> -->
            <!-- <el-form-item label="制单人"   class="changeBlue">
              <el-input v-model="user.ownerNameJc" :disabled="true" placeholder="制单人" />
            </el-form-item> -->
             <!-- <el-form-item label="制单日期"  prop="djTime" class="changeBlue">
              
               <el-date-picker style="width:100%"
                v-model="form.djTime"
                type="date"
                placeholder="制单日期">
              </el-date-picker>
            </el-form-item> -->
          
        </el-tab-pane>
        <el-tab-pane label="明细信息" name="second">
          <el-form-item label="购置日期"  prop="deviceBuyTime" >
              <el-date-picker style="width:100%"
                v-model="form.deviceBuyTime"
                type="date"
                placeholder="购置日期">
              </el-date-picker>
            </el-form-item> 
            <el-form-item label="供货单位" prop="deviceSendUnit">
              <el-input v-model="form.deviceSendUnit" placeholder="请输入供货单位" />
            </el-form-item>
            <el-form-item label="供货联系人" prop="deviceSendLxr">
              <el-input v-model="form.deviceSendLxr" placeholder="请输入供货联系人" />
            </el-form-item>
            <el-form-item label="联系电话" prop="deviceSendLxrPhone">
              <el-input v-model="form.deviceSendLxrPhone" placeholder="请输入联系电话" />
            </el-form-item>
            <el-form-item label="售后联系人" prop="deviceSalesLxr">
              <el-input v-model="form.deviceSalesLxr" placeholder="请输入售后联系人" />
            </el-form-item>
            <el-form-item label="售后电话" prop="deviceSalesLxrPhone">
              <el-input v-model="form.deviceSalesLxrPhone" placeholder="请输入售后电话" />
            </el-form-item>
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <goods-selects v-if="selectGoodsDialog" ref="selectGoods" @selectData="selectData"  @selectDataMore="selectDataMore"></goods-selects>
  </div>
</template>

<script>
// import {
//   listCgrkd,
//   getCgrkd,
//   getCgrkdChild,
//   delCgrkd,
//   delCgrkdChild,
//   addCgrkd,
//   updateCgrkd,
//   updateCgrkdStatus,
//   exportCgrkd,
//   getOwnerList,
// } from "@/api/system/deviceItem";
import {
  listDeviceItem,
  getDeviceItem,
  addDeviceItem,
  updateDeviceItem,
  delDeviceItem,
  exportDeviceItem,
  // updateCgrkd,
  // updateCgrkdStatus,
  // exportCgrkd,
  // getOwnerList,
} from "@/api/system/deviceItem";

import { getCkAll } from "@/api/system/ck";
import { getInfo } from "@/api/login";
import { getPersonAll } from "@/api/system/person";
import { getToken } from "@/utils/auth";
import { goodsList } from "@/api/system/ownerGoods";
import { getShopList } from "@/api/system/shopInfo";
export default {
  name: "Lease",
  data() {
    return {
      //用户信息
      user:{
        ownerCode:"",
        ownerName:"",
        ownerNameJc:"",
      },
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
      //仓库列表
      storeList: [],
      // 门店信息
      shopList:[],
      //供应商
      personList: [],
      // 遮罩层
      loading: false,
      selectGoodsDialog: false,
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
        // 仓库信息默认
      placeholderone:'',
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
        deviceName: undefined,
        deviceBuyTime: undefined,
      },
      // 表单参数
      form: {},
      activeName: "first",
      // 表单校验
      rules: {
       
      deviceBuyTime: [
          { required: true, message: "单据日期不能为空", trigger: "blur" },
        ],
        deviceName: [
          { required: true, message: "设备名称不能为空", trigger: "blur" },
        ],
        devicetdNum: [
          { required: true, message: "检测通道数量不能为空", trigger: "blur" },
        ],
         deviceAccuracy: [
          { required: true, message: "测量精度不能为空", trigger: "blur" },
        ]
      },
    };
  },
  created() {
    this.getList();
    getCkAll(this.queryParams).then(response => {
        this.storeList = response.rows;
          for(let i=0;i<this.storeList.length;i++){
            this.placeholderone=this.storeList[0].ckName;
              //  console.log(this.placeholderone)
            
          }
    });
    getPersonAll(this.queryParams).then(response => {
        this.personList = response.rows;
        // console.log(this.personList)
    });
    getInfo().then(response => {
        this.user.ownerCode=response.user.userName;
        this.user.ownerName=response.user.nickName;
        this.user.ownerNameJc=response.user.nickName;
        // this.form.djTime=this.getTime();
    });
      getShopList(this.queryParams).then(response => {
        this.shopList = response.rows;
    });
       goodsList(this.queryParams).then(response => {
        // console.log(response)
         this.goodsList = response.rows;
        // console.log( this.goodsList )
        // this.total = response.total;
        // this.loading = false;
      });
  },
  methods: {
     editTime(i){
      if(i<10){
      i="0"+i;
      }
      return i;
      },
     getTime(){
        var date=new Date();
        var year=date.getFullYear();//得到当前年份
        var month=this.editTime(date.getMonth()+1);//得到当前月份
        var day=this.editTime(date.getDate());//得到当前几号
        var hour=this.editTime(date.getHours());//得到当前小时
        var min=this.editTime(date.getMinutes());//得到当前分钟
        var seconds=this.editTime(date.getSeconds());//得到当前秒
        var weeks=date.getDay();
        var week;
        switch(weeks){
        case 0:
        week="星期日";
        break;
        case 1:
        week="星期一";
        break;
        case 2:
        week="星期二";
        break;
        case 3:
        week="星期三";
        break;
        case 4:
        week="星期四";
        break;
        case 5:
        week="星期五";
        break;
        case 6:
        week="星期六";
        break;
        }
          return year+"-"+month+"-"+day;
        },
    //是否含税
    changeRate(data){
      //不含税时置空税率跟恢复含税金额
      if(data==0){
          for(let i=0;i<this.tableData.length;i++){
            this.tableData[i].goodsRate="0";
            this.tableData[i].goodsPriceRate= this.tableData[i].goodsPrice;
            this.tableData[i].goodsMoneyRate= this.tableData[i].goodsMoney;
          }
      }
    },
    //追加子表必填样式
    starAdd(obj) {
      //if(obj.columnIndex === 0 || obj.columnIndex === 1 || obj.columnIndex === 4 || obj.columnIndex === 5 || obj.columnIndex === 6|| obj.columnIndex === 7) {
      if(obj.columnIndex === 0 || obj.columnIndex === 1 || obj.columnIndex === 2|| obj.columnIndex === 5 ) {
          return 'star';
      }
    },
    handleEditShop(data,index, row){
        //根据编码名称
        for(let i=0;i<this.shopList.length;i++){
          if(this.shopList[i].storeid==data){
            row.shopName=this.shopList[i].shopName;
            break;
          }
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
    selectPerson(data){

    },
    //选择仓库
    selectStore(data){
      //根据仓库编码查找仓库名称
      for(let i=0;i<this.storeList.length;i++){
        if(this.storeList[i].ckCode==data){
          this.form.storeName=this.storeList[i].ckName;
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
      //不含税
      if(this.form.isRate==0){
          if(row.goodsPrice!=""&&row.goodsPrice!=null&&row.goodsPrice!=undefined){
             row.goodsPriceRate=row.goodsPrice;
          }
          if(row.goodsNum!=""&&row.goodsNum!=null&&row.goodsNum!=undefined&&row.goodsPrice!=""&&row.goodsPrice!=null&&row.goodsPrice!=undefined){
            row.goodsMoney=(parseFloat(row.goodsNum)*parseFloat(row.goodsPrice)).toFixed(2);
            row.goodsMoneyRate=row.goodsMoney;
          }
      }
      //含税
      if(this.form.isRate==1){
          if(row.goodsNum!=""&&row.goodsNum!=null&&row.goodsNum!=undefined&&row.goodsPrice!=""&&row.goodsPrice!=null&&row.goodsPrice!=undefined&&row.goodsRate!=""&&row.goodsRate!=null&&row.goodsRate!=undefined){
            row.goodsMoney=(parseFloat(row.goodsNum)*parseFloat(row.goodsPrice)).toFixed(2);
            row.goodsMoneyRate=(((1+parseFloat(row.goodsRate)/100))*row.goodsMoney).toFixed(2);
            row.goodsPriceRate=(parseFloat(row.goodsMoneyRate)/parseFloat(row.goodsNum)).toFixed(2);
          }
      }
    },
    handleEditPerson(data,index, row){
        //根据编码找产地
        for(let i=0;i<this.goodsList.length;i++){
          console.log(this.goodsList[i].goodsCode==data)
          if(this.goodsList[i].goodsCode==data){
            row.goodsAddress=this.goodsList[i].goodsAddress;
            row.goodsDw=this.goodsList[i].goodsDw;
            row.goodsName=this.goodsList[i].goodsName;
            break;
          }
        }
    },
    getSumMoney(index, row) {
      //计算总金额
      let sumMoney = 0;
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].goodsNum != "") {
          sumMoney += parseFloat(this.tableData[i].goodsNum);
        }
      }
      this.form.storeName = sumMoney.toString();
      console.log(this.form);
      // console.log(row.goodsNum);
    },
    handleChildDelete(index, row) {
      if (row.id != "" && row.id != undefined && row.id != null) {
        delCgrkdChild(row.id);
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
    //选择数据
    selectData(row) {
      //  this.selectGoodsDialog=false;
      this.$nextTick(() => {
        //检查是否存在重复数据
        // for (let i = 0; i < this.tableData.length; i++) {
        //   if (row.goodsCode == this.tableData[i].goodsCode) {
        //     this.msgError("信息重复!");
        //     return;
        //   }
        // }
       
        let goodsInfo = new Object();
        goodsInfo.goodsCode = row.goodsCode;
        goodsInfo.goodsName = row.goodsName;
        goodsInfo.goodsDw = row.goodsDw;
        goodsInfo.personCode = row.ownerCode;
        goodsInfo.personName = row.ownerName;
        goodsInfo.goodsNum = "";
        goodsInfo.goodsPrice = "";
        goodsInfo.goodsMoney = "";
        goodsInfo.goodsPriceRate = "";
        goodsInfo.goodsMoneyRate = "";
        goodsInfo.goodsRate = "0";
       // goodsInfo.goodsWeight = "";
        goodsInfo.remark = "";
        this.tableData.push(goodsInfo);
        this.$refs.selectGoods.visible = false;
      });
    },
    //批量选择数据
    selectData(row) {

      //  this.selectGoodsDialog=false;
      this.$nextTick(() => {
        //检查是否存在重复数据
        // for (let i = 0; i < this.tableData.length; i++) {
        //   if (row.goodsCode == this.tableData[i].goodsCode) {
        //     this.msgError("信息重复!");
        //     return;
        //   }
        // }
        
        let goodsInfo = new Object();
        goodsInfo.goodsCode = row.goodsCode;
        goodsInfo.goodsName = row.goodsName;
        goodsInfo.goodsDw = row.goodsDw;
        goodsInfo.personCode = row.ownerCode;
        goodsInfo.personName = row.ownerName;
        goodsInfo.goodsNum = "";
              goodsInfo.goodsPrice = "";
        goodsInfo.goodsMoney = "";
        goodsInfo.goodsPriceRate = "";
        goodsInfo.goodsMoneyRate = "";
        goodsInfo.goodsRate = "0";
        //goodsInfo.goodsWeight = "";
        goodsInfo.remark = "";
        this.tableData.push(goodsInfo);
        this.$refs.selectGoods.visible = false;
      });
    },
     //批量选择数据
    selectDataMore(rows) {
      //  this.selectGoodsDialog=false;
      this.$nextTick(() => {
        //检查是否存在重复数据
        // for (let i = 0; i < this.tableData.length; i++) {
        //   if (row.goodsCode == this.tableData[i].goodsCode) {
        //     this.msgError("信息重复!");
        //     return;
        //   }
        // }
        for(let i=0;i<rows.length;i++){
            let row=rows[i];
             let goodsInfo = new Object();
              goodsInfo.goodsCode = row.goodsCode;
              goodsInfo.goodsName = row.goodsName;
              goodsInfo.goodsDw = row.goodsDw;
              goodsInfo.personCode = row.ownerName;
              goodsInfo.personName = "";
              goodsInfo.goodsNum = "";
                 goodsInfo.goodsPrice = "";
                  goodsInfo.goodsMoney = "";
                  goodsInfo.goodsPriceRate = "";
                  goodsInfo.goodsMoneyRate = "";
              goodsInfo.remark = "";
               goodsInfo.goodsRate = "0";
              this.tableData.push(goodsInfo);
        }
        this.$refs.selectGoods.visible = false;
      });
    },
    /** 查询二级市场信息列表 */
    getList() {
      this.loading = true;
      // listCgrkd(this.queryParams).then((response) => {
      //   this.leaseList = response.rows;
      //   console.log(this.leaseList)
      //   this.total = response.total;
      //   this.loading = false;
      // });
        listDeviceItem(this.queryParams).then((response) => {
        this.leaseList = response.rows;
        console.log(this.leaseList)
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
        deviceBuyTime: this.getTime(),
        storeCode: undefined,
        storeName: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
        fileName: undefined,
        isRate:0,
        rows: "",
        deviceName: undefined,  
        devicetdNum: undefined,
        deviceAccuracy: undefined, 
        deviceBrand: undefined,
        deviceModel: undefined,
        deviceBz: undefined,
       
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
      this.title = "添加设备档案";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getDeviceItem(id).then((response) => {
        this.form = response.data;
        if (response.data.fileName != "") {
          this.fileList = [];
          let info = new Object();
          info.name = response.data.fileName;
          info.url = response.data.fileName;
          this.fileList.push(info);
        }
        // getCgrkdChild(this.form.djNumber).then((response) => {
        //   //this.form.rows = response.data;
        //   this.tableData = response.rows;
        // });
        this.open = true;
        this.title = "修改设备档案";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      if (true) {
        //检查子表信息
        // for (let i = 0; i < this.tableData.length; i++) {
        //   if (
        //     this.tableData[i].storeid == "" ||
        //     this.tableData[i].goodsCode == "" ||
        //     this.tableData[i].personCode == "" ||
        //    // this.tableData[i].goodsPrice == "" ||
        //    // this.tableData[i].goodsMoney == "" ||
        //    // this.tableData[i].goodsRate == "" ||
        //     this.tableData[i].goodsNum == ""
        //   ) {
        //     this.msgError("检查明细信息必填项!");
        //     return;
        //   }
        // }
        this.form.rows = JSON.stringify(this.tableData);
        this.$refs["form"].validate((valid) => {
          if (valid) {
            if (this.form.id != undefined) {
              updateDeviceItem(this.form).then((response) => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                  // this.$refs.selectGoods.getList();
                } else {
                  this.msgError(response.msg);
                }
              });
            } else {
              addDeviceItem(this.form).then((response) => {
                if (response.code === 200) {
                  this.msgSuccess("新增成功");
                  this.open = false;
                  this.getList();
                  // this.$refs.selectGoods.getList();
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
          return delDeviceItem(ids);
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
          return updateCgrkdStatus(ids);
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
          return exportCgrkd(queryParams);
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
.changeBlue .el-form-item__label{
  color: #1890ff;
}

</style>