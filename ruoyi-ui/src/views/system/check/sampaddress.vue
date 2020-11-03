<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
      <el-form-item label="取样地业主" prop="sampAddressPerson">
        <el-input
          v-model="queryParams.sampAddressPerson"
          placeholder="请输入取样地业主"
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
          v-hasPermi="['system:sampAddress:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:sampAddress:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:sampAddress:remove']"
        >删除</el-button>
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
      <el-table-column label="标题" align="center" prop="sampAddress" />
      <el-table-column label="取样地点详细地址" align="center" prop="sampAddressDetail" />
      <el-table-column label="取样地业主" align="center" prop="sampAddressPerson" />
      <el-table-column label="联系电话" align="center" prop="sampAddressPersonTel" />
      <el-table-column label="备注" align="center" prop="sampBz" />
      <el-table-column label="制单日期" align="center" prop="createTime" />
    
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
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
           <el-form-item label="标题" prop="sampAddress">
              <el-input v-model="form.sampAddress" placeholder="请输入标题" />
            </el-form-item>
            <el-form-item label="取样地业主" prop="sampAddressPerson">
              <el-input v-model="form.sampAddressPerson" placeholder="请输入取样地业主" />
            </el-form-item>
            <el-form-item label="联系电话" prop="sampAddressPersonTel">
              <el-input v-model="form.sampAddressPersonTel" placeholder="请输入联系电话" />
            </el-form-item>
           <el-form-item label="备注" prop="sampBz">
              <el-input v-model="form.sampBz" placeholder="请输入备注信息" />
            </el-form-item>
             <baidu-map class="bm-view" ak="cGklIMXA6RuKkir9UobkakSE0QhwyuoO" :center="center" :zoom="zoom" @ready="handler" 
             :min-zoom="10"
             :max-zoom="17"
             :scroll-wheel-zoom="true"
              @click="getClickInfo"
              v-if="showMap"
             >
             <bm-view style="width: 100%; height:500px;"></bm-view>
               <bm-control :offset="{width: '10px', height: '10px'}" style="display：none">
                <!-- <bm-auto-complete v-model="keyword" :sugStyle="{zIndex: 999999}" style="display：none">
                  <input
                    type="text"
                    placeholder="请输入搜索关键字"
                    v-model="form.checkAddressDetail"
                    class="serachinput"
                    style="width:200px;height:30px;border-width:1px;display:none"
                  />
                </bm-auto-complete> -->
              </bm-control>
               <bm-marker
                :position="{lng: center.lng, lat: center.lat}"
                :dragging="true"
                animation="BMAP_ANIMATION_BOUNCE"
              ></bm-marker>
                <!-- <bm-local-search
                :keyword="form.sampAddressDetail"
                :auto-viewport="true"
                style="width:0px;height:0px;overflow: hidden;dispaly:none"
                @searchcomplete="checking"
                :selectFirstResult="false"
              ></bm-local-search> -->
            </baidu-map>
            <el-form-item label="纬度" prop="sampAddressLat">
              <el-input v-model="form.sampAddressLat" placeholder="请输入纬度" />
            </el-form-item>
            <el-form-item label="经度" prop="sampAddressLng">
              <el-input v-model="form.sampAddressLng" placeholder="请输入经度" />
            </el-form-item>
            <el-form-item label="可输入位置查询" prop="sampAddressDetail" style="width:80%">
              <el-input v-model="form.sampAddressDetail" placeholder="" />
               <el-button type="primary" @click="checke" style="float: right;position: relative;top: -36px;right: -100px;" >查询</el-button>
            </el-form-item>
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
import {
  listSampAddress,
  getSampAddress,
  addSampAddress,
  updateSampAddress,
  delSampAddress,
  addCgrkd,
  updateCgrkd,
  exportSampAddress,
  
} from "@/api/system/sampAddress";
import {BaiduMap, BmMarker,  BmControl,  BmAutoComplete,BmLocalSearch, BmView,} from 'vue-baidu-map'
 var _that
import { getCkAll } from "@/api/system/ck";
import { getInfo } from "@/api/login";
import { getPersonAll } from "@/api/system/person";
import { getToken } from "@/utils/auth";
import { goodsList } from "@/api/system/ownerGoods";
import { getShopList } from "@/api/system/shopInfo";
let index=0;
export default {
  name: "Lease",
  components: {
    BaiduMap,
    BmMarker,
    BmControl,
    BmAutoComplete,
  BmLocalSearch,
   BmView,
  },
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
        center: {lng: '', lat: ''},
      zoom: 15,
      showMap: true,
      keyword:'',
      BMap: null,
      map: null,
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
        djNumber: undefined,
        djTime: undefined,
      },
      // 表单参数
      form: {},
      activeName: "first",
      // 表单校验
      rules: {
 
        sampAddressPerson: [
          { required: true, message: "取样地业主不能为空", trigger: "blur" },
        ],
        sampAddressPersonTel: [
          { required: true, message: "联系电话不能为空", trigger: "blur" },
        ],
        //  accuracy: [
        //   { required: true, message: "测量精度不能为空", trigger: "blur" },
        // ]
      },
    };
  },
  created() {
     _that = this;
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
        this.form.djTime=this.getTime();
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
         handler ({BMap, map}) {
      console.log(BMap, map)
      map.clearOverlays();
       _that.BMap = BMap;
      _that.map = map;
      map.enableScrollWheelZoom(true);
      if (
        _that.form.sampAddressLng != "" &&
        _that.form.sampAddressLng != null &&
        _that.form.sampAddressLng != undefined
      ) {

        _that.center = { lng: _that.form.sampAddressLng, lat: _that.form.sampAddressLat }; // 设置center属性值
      } else {
        let geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(
          function (r) {
            console.log(r)
            let gc = new _that.BMap.Geocoder();
            gc.getLocation(r.point, function (rs) {
               console.log(rs)
              _that.form.sampAddressDetail = rs.address;
            });
            _that.center = { lng: r.longitude, lat: r.latitude }; // 设置center属性值
            // _that.autoLocationPoint = { lng: r.longitude, lat: r.latitude }        // 自定义覆盖物
             _that.form.sampAddressLat=r.point.lat
            _that.form.sampAddressLng=r.point.lng
      
            _that.initLocation = true;
          },
          { enableHighAccuracy: true }
        );
      }
    },
        getClickInfo(e){
     
      _that.center.lng = e.point.lng;
      _that.center.lat = e.point.lat;
       _that.form.sampAddressLat=e.point.lat
       _that.form.sampAddressLng=e.point.lng
        _that.map.panTo(e.point)
      let gc = new _that.BMap.Geocoder();
      gc.getLocation(e.point, function (rs) {
        console.log(rs);
        _that.form.sampAddressDetail = rs.address;
      });
    },
       checking(res){
      // alert("1")
      //  console.log(res)
      
      //  _that.form.sampAddressLat=res.Hr[0].point.lng
      //  _that.form.sampAddressLng=res.Hr[0].point.lat
      //   _that.form.sampAddressDetail=res.keyword
   
      // _that.form.keyword=res.keyword
    },
      checke(res){
      var localSearch = new _that.BMap.LocalSearch(_that.map);
      // var keyword = document.getElementById("text_").value;
       var keyword=_that.form.sampAddressDetail
　　localSearch.setSearchCompleteCallback(function (searchResult) {
　　　　var poi = searchResult.getPoi(0);
　　　　//document.getElementById("result_").value = poi.point.lng + "," + poi.point.lat; //获取经度和纬度，将结果显示在文本框中
       console.log(poi)
      _that.center.lng = poi.point.lng;
      _that.center.lat = poi.point.lat;
       _that.form.sampAddressLat=poi.point.lat
       _that.form.sampAddressLng=poi.point.lng
// 　　　　_that.map.centerAndZoom(poi.point, 13);
          _that.map.panTo(poi.point)
　　});
　　localSearch.search(keyword);
    },
     editTime(i){
      if(i<10){
      i="0"+i;
      }
      return i;
      },
      syncCenterAndZoom(e) {
      const { lng, lat } = e.target.getCenter();
      // _that.center.lng = lng;
      // _that.center.lat = lat;
      // _that.zoom = e.target.getZoom();
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
    handleClick(res) {
         index++;
       if (res.name == "second") {
         _that.showMap = true;
         if(index==1){
            _that.map.panBy(350, 300);
         }
        }else{
          _that.showMap = false;
        }
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
      listSampAddress(this.queryParams).then((response) => {
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
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
        fileName: undefined,
        isRate:0,
        rows: "",
        sampAddress: undefined,  sampAddressPerson: undefined,  sampaddressPersonTel: undefined, 
         sampBz: undefined,
            sampAddressLat: undefined, 
          sampAddressLng: undefined, 
          sampAddressDetail: undefined,
          ckAddress: undefined,
          lat: undefined,
        lng: undefined,
        
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
      this.title = "取样地点档案";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getSampAddress(id).then((response) => {
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
        this.title = "修改取样地点档案";
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
              updateSampAddress(this.form).then((response) => {
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
              addSampAddress(this.form).then((response) => {
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
          return delSampAddress(ids);
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
      this.$confirm("是否确认导出所有数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportSampAddress(queryParams);
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