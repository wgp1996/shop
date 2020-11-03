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
          v-hasPermi="['system:cgrkd:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:cgrkd:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:cgrkd:remove']"
        >删除</el-button>
        </el-col>
        <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-s-promotion"
          size="mini"
          :disabled="multiple"
          @click="handleEffect"
          v-hasPermi="['system:cgrkd:effect']"
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
      <!-- <el-table-column type="expand">
        <template slot-scope="props">
          <el-table style="padding:0;margin:0" :data="props.row.childrenList" id="special">
            <el-table-column label="商品名称" align="center" prop="goodsName" />
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
      <el-table-column label="业户代码" align="center" prop="createBy" />
      <el-table-column label="业户名称" align="center" prop="createName" />
      <el-table-column label="进货日期" align="center" prop="djTime" />
      <el-table-column label="进货商品" align="center" prop="goodsName" />
      <el-table-column label="单位" align="center" prop="goodsDw" />
      <el-table-column label="产地" align="center" prop="goodsAddress" />
      <!-- <el-table-column label="制单人" align="center" prop="createBy" />
      <el-table-column label="制单日期" align="center" prop="createTime" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:cgrkd:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:cgrkd:remove']"
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
             <el-form-item label="供应商" prop="personCode">
              <el-select
                v-model="form.personCode"
                placeholder="请选择供应商"
                filterable
                 style="width:100%"
                @change="selectPerson"
              >
                <el-option
                  v-for="item in personList"
                  :key="item.personCode"
                  :label="item.personName"
                  :value="item.personCode"
                >
                  <span style="float: left;width:50%">{{ item.personCode }}</span>
                  <span style="float: left;width:50%">{{ item.personName }}</span>
                </el-option>
              </el-select>
            </el-form-item> 
            <el-form-item label="仓库信息" prop="storeCode">
              <el-select
                v-model="form.storeCode"
                :placeholder="placeholderone"
                filterable
                @change="selectStore"
                style="width:100%"
              >
                <el-option
                  v-for="item in storeList"
                  :key="item.ckCode"
                  :label="item.ckName"
                  :value="item.ckCode"
                >
                  <span style="float: left;width:50%">{{ item.ckCode }}</span>

                  <span style="float: left;width:50%">{{ item.ckName }}</span>
                </el-option>
              </el-select>
            </el-form-item>
              <el-form-item label="是否含税" prop="isRate">
                 <el-radio-group v-model="form.isRate" @change="changeRate">
                  <el-radio :label="0" >否</el-radio>
                  <el-radio :label="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
            
          
          
            <el-form-item label="备注信息" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入备注信息" />
            </el-form-item>
   
           <el-form-item label="业户代码" class="changeBlue">
              <el-input v-model="user.ownerCode" :disabled="true" placeholder="业户代码" />
            </el-form-item>
              <el-form-item label="业户名称" class="changeBlue">
              <el-input v-model="user.ownerName" :disabled="true" placeholder="业户名称" />
            </el-form-item>
            <el-form-item label="单据编号" prop="djNumber" class="changeBlue">
              <el-input v-model="form.djNumber" :disabled="true" placeholder="后台自动生成" />
            </el-form-item>
            <el-form-item label="制单人" class="changeBlue">
              <el-input v-model="user.ownerNameJc" :disabled="true" placeholder="制单人" />
            </el-form-item>
             <el-form-item label="制单日期" prop="djTime" class="changeBlue">
             <el-date-picker style="width:100%"
                v-model="form.djTime"
                type="date"
                placeholder="制单日期">
              </el-date-picker>
            </el-form-item>
    
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="明细信息" name="second">
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button type="primary" icon="el-icon-plus" size="mini" @click="goodsSelect">新增商品</el-button>
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
           
            <el-table-column prop="goodsName" label="商品名称" width="150">
              <template scope="scope">
                <el-input
                  :disabled="true"
                  size="small"
                  v-model="scope.row.goodsName"
                  placeholder="请输入内容"
                ></el-input>
                <span>{{scope.row.goodsName}}</span>
              </template>
            </el-table-column>
              <el-table-column label="产地" width="200">
              <template scope="scope">
                <el-input
                  :disabled="true"
                  size="small"
                  v-model="scope.row.goodsAddress"
                  placeholder="请输入产地"
                  @change="(scope.$index, scope.row)"
                ></el-input>
                <span>{{scope.row.goodsAddress}}</span>
              </template>
            </el-table-column>
             <el-table-column prop="goodsDw" label="单位" width="120">
              <template scope="scope">
                <el-input
                  :disabled="true"
                  size="small"
                  v-model="scope.row.goodsDw"
                  placeholder=""
                ></el-input>
                <span>{{scope.row.goodsDw}}</span>
              </template>
            </el-table-column>
      
         
            <el-table-column label="数量" width="120">
              <template scope="scope">
                <el-input
                  size="small"
                  v-model="scope.row.goodsNum"
                  placeholder="请输入数量"
                  :onkeyup="scope.row.goodsNum=scope.row.goodsNum.replace(/[^\d.]/g,'')"
                   @change="handleEdit(scope.$index, scope.row)"
                ></el-input>
                <span>{{scope.row.goodsNum}}</span>
              </template>
            </el-table-column>
            <!-- :onkeyup="scope.row.goodsPrice=scope.row.goodsPrice.replace(/[^\d.]/g,'')" -->
            <el-table-column label="单价" width="120">
              <template scope="scope">
                <el-input
                  size="small"
                  v-model="scope.row.goodsPrice"
                  placeholder="请输入单价"
                  
                  @change="handleEdit(scope.$index, scope.row)"
                ></el-input>
                <span>{{scope.row.goodsPrice}}</span>
              </template>
            </el-table-column>
              <el-table-column label="金额" width="120">
              <template scope="scope">
                <el-input
                  :disabled="true"
                  size="small"
                  v-model="scope.row.goodsMoney"
                  placeholder="请输入金额"
                ></el-input>
                <span>{{scope.row.goodsMoney}}</span>
              </template>
            </el-table-column>
               <el-table-column label="税率(%)" width="120">
              <template scope="scope">
                <el-input
                  :disabled="form.isRate==0"
                  size="small"
                  v-model="scope.row.goodsRate"
                  placeholder="请输入税率"
                  @change="handleEdit(scope.$index, scope.row)"
                ></el-input>
                <span>{{scope.row.goodsRate}}</span>
              </template>
            </el-table-column>
              <el-table-column label="单价(含税)" width="120">
              <template scope="scope">
                <el-input
                 :disabled="true"
                  size="small"
                  v-model="scope.row.goodsPriceRate"
                  placeholder="请输入单价"
                ></el-input>
                <span>{{scope.row.goodsPriceRate}}</span>
              </template>
            </el-table-column>
            <el-table-column label="金额(含税)" width="120">
              <template scope="scope">
                <el-input
                  size="small"
                  :disabled="true"
                  v-model="scope.row.goodsMoneyRate"
                  placeholder="请输入金额"
                ></el-input>
                <span>{{scope.row.goodsMoneyRate}}</span>
              </template>
            </el-table-column>
            <el-table-column label="备注" width="150">
              <template scope="scope">
                <el-input
                  size="small"
                  v-model="scope.row.remark"
                  placeholder="请输入备注"
                ></el-input>
                <span>{{scope.row.remark}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template scope="scope">
                <el-button
                  size="small"
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
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <goods-select v-if="selectGoodsDialog" ref="selectGoods" @selectData="selectData"  @selectDataMore="selectDataMore"></goods-select>
  </div>
</template>

<script>
import {
  listCgrkdSingle,
  getCgrkdSingle,
  getCgrkdSingleChild,
  delCgrkdSingle,
  delCgrkdSingleChild,
  addCgrkdSingle,
  updateCgrkdSingle,
  updateCgrkdSingleStatus,
  exportCgrkdSingle,
  getOwnerList,
} from "@/api/system/cgrkdSingle";


import goodsSelect from "./goodsSelect";
import { getCkAll } from "@/api/system/ck";
import { getPersonAll } from "@/api/system/person";
import { getToken } from "@/utils/auth";
import { getInfo } from "@/api/login";
export default {
  name: "Lease",
  components: {
    goodsSelect,
  },
  data() {
    return {
      //用户信息
      user:{
        ownerCode:"",
        ownerName:"",
        ownerNameJc:"",
      },
       //仓库列表
      storeList: [],
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
      // 仓库信息默认
      placeholderone:'',
      //业主列表
      storeList: [],
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
      //  djTime: [
      //     { required: true, message: "单据日期不能为空", trigger: "blur" },
      //   ],
        personCode: [
          { required: true, message: "供应商不能为空", trigger: "blur" },
        ],
        // storeCode: [
        //   { required: true, message: "仓库信息不能为空", trigger: "blur" },
        // ],
      },
    };
  },
  created() {
    this.getList();
     getCkAll(this.queryParams).then(response => {
        this.storeList = response.rows;
        // console.log(this.storeList)
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
        this.form.djTime=this.getTime();
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
      if(obj.columnIndex === 0 || obj.columnIndex === 3) {
          return 'star';
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
         //根据编码找产地
        for(let i=0;i<this.personList.length;i++){
          if(this.personList[i].personCode==data){
            this.form.personName=this.personList[i].personName;
            break;
          }
        }
    },
    //选择仓库
    selectStore(data){
      //根据摊位编码查找摊位名称
      for(let i=0;i<this.storeList.length;i++){
        if(this.storeList[i].ckCode==data){
          this.form.storeName=this.storeList[i].ckName;
          break;
        }
      }
    },
    handleClick(tab, event) {
      // if(tab.name=="second"){
      //     if(this.radio=="1"){
      //       this.show=true
      //     }else{
      //      this.show= false
      //     }
      // }
      //  console.log(tab.name);
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
      
        for(let i=0;i<this.personList.length;i++){
          
          if(this.personList[i].personCode==data){
           row.goodsAddress=this.personList[i].personGoodsAddress;
            row.personName=this.personList[i].personName;
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
    
    },
    handleChildDelete(index, row) {
      if (row.id != "" && row.id != undefined && row.id != null) {
        delCgrkdSingleChild(row.id);
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
    // selectData(row) {
    //   //  this.selectGoodsDialog=false;
    //   this.$nextTick(() => {
    //     //检查是否存在重复数据
    //     // for (let i = 0; i < this.tableData.length; i++) {
    //     //   if (row.goodsCode == this.tableData[i].goodsCode) {
    //     //     this.msgError("信息重复!");
    //     //     return;
    //     //   }
    //     // }
    //     let goodsInfo = new Object();
    //     goodsInfo.goodsCode = row.goodsCode;
    //     goodsInfo.goodsName = row.goodsName;
    //     goodsInfo.goodsDw = row.goodsDw;
    //     goodsInfo.personCode = "";
    //     goodsInfo.personName = "";
    //     goodsInfo.goodsNum = "";
    //    // goodsInfo.goodsWeight = "";
    //     goodsInfo.remark = "";
    //     this.tableData.push(goodsInfo);
    //     this.$refs.selectGoods.visible = false;
    //   });
    // },
    //批量选择数据
    selectData(row) {
      console.log(row)
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
        goodsInfo.goodsAddress=row.goodsAddress;
        goodsInfo.personCode = "";
        goodsInfo.personName = "";
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
    selectDataMore(rows) {
     
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
                  goodsInfo.goodsAddress=row.goodsAddress;
                  goodsInfo.personCode = "";
                  goodsInfo.personName = "";
                  goodsInfo.goodsNum = "";
                  goodsInfo.goodsPrice = "";
                  goodsInfo.goodsMoney = "";
                  goodsInfo.goodsPriceRate = "";
                  goodsInfo.goodsMoneyRate = "";
                  goodsInfo.goodsRate = "0";
                  //goodsInfo.goodsWeight = "";
                  goodsInfo.remark = "";
              this.tableData.push(goodsInfo);
        }
        this.$refs.selectGoods.visible = false;
      });
    },
    /** 查询二级市场信息列表 */
    getList() {
      this.loading = true;
      listCgrkdSingle(this.queryParams).then((response) => {
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
        djTime: this.getTime(),
        storeCode: undefined,
        storeName: undefined,
        personName:undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
        fileName: undefined,
        personCode:undefined,
        rows: "",
        isRate:0,
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
      this.title = "添加采购单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getCgrkdSingle(id).then((response) => {
        this.form = response.data;
        if (response.data.fileName != "") {
          this.fileList = [];
          let info = new Object();
          info.name = response.data.fileName;
          info.url = response.data.fileName;
          this.fileList.push(info);
        }
        getCgrkdSingleChild(this.form.djNumber).then((response) => {
          //this.form.rows = response.data;
          this.tableData = response.rows;
        });
        this.open = true;
        this.title = "修改采购单";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      if (this.tableData.length > 0) {
        //检查子表信息
        for (let i = 0; i < this.tableData.length; i++) {
          if (
             this.tableData[i].goodsCode == "" ||
             //this.tableData[i].goodsPrice == "" ||
             //this.tableData[i].goodsMoney == "" ||
            //this.tableData[i].goodsRate == "" ||
            this.tableData[i].goodsNum == ""
          ) {
            this.msgError("检查明细信息必填项!");
            return;
          }
        }
        this.form.rows = JSON.stringify(this.tableData);
        this.$refs["form"].validate((valid) => {
          if (valid) {
            if (this.form.id != undefined) {
              updateCgrkdSingle(this.form).then((response) => {
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
              addCgrkdSingle(this.form).then((response) => {
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
          return delCgrkdSingle(ids);
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
          return updateCgrkdSingleStatus(ids);
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
          return exportCgrkdSingle(queryParams);
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