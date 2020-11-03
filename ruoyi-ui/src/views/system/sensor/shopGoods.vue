<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
      <el-form-item label="门店编码" prop="storeid">
        <el-input
          v-model="queryParams.storeid"
          placeholder="请输入门店编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品编码" prop="goodsCode">
        <el-input
          v-model="queryParams.goodsCode"
          placeholder="请输入商品编码"
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
          v-hasPermi="['system:shopGoods:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:shopGoods:edit']"
        >商品改价</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:shopGoods:remove']"
        >删除</el-button>
      </el-col>
       <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-edit"
          size="mini"
          @click="handleImport"
          v-hasPermi="['system:shopGoods:import']"
          >批量改价</el-button
        >
           </el-col>
          <el-col :span="1.5">
        <el-button
         type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="downFild"
        >下载模板</el-button>
   
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="shopGoodsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="门店编码" align="center" prop="storeid" />
      <el-table-column label="商品编码" align="center" prop="goodsCode" />
      <el-table-column label="商品名称" align="center" prop="goodsName" />
      <el-table-column label="商品单位" align="center" prop="goodsDw" />
      <el-table-column label="商品产地" align="center" prop="goodsAddress" />
      <el-table-column label="价格" align="center" prop="goodsPrice" />
      <el-table-column label="会员价" align="center" prop="goodsHyPrice" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:shopGoods:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:shopGoods:remove']"
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

    <!-- 添加或修改门店商品管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="门店信息" prop="storeid">
              <el-select
                v-model="form.storeid"
                placeholder="请选择门店"
                filterable
                 style="width:100%"
              >
                <el-option
                  v-for="item in shopList"
                  :key="item.storeid"
                  :label="item.shopName"
                  :value="item.storeid"
                >
                  <span style="float: left;width:50%">{{ item.storeid }}</span>
                   <span style="float: left;width:50%">{{ item.shopName }}</span>
                </el-option>
              </el-select>
        </el-form-item> 
        <el-form-item label="商品信息" prop="storeid">
              <el-select
                v-model="form.goodsCode"
                placeholder="请选择商品"
                filterable
                 style="width:100%"
              >
                <el-option
                  v-for="item in goodsList"
                  :key="item.goodsCode"
                  :label="item.goodsName"
                  :value="item.goodsCode"
                >
                  <span style="float: left;width:40%">{{ item.goodsCode }}</span>
                  <span style="float: left;width:40%">{{ item.goodsName }}</span>
                  <span style="float: left;width:10%">{{ item.goodsDw }}</span>
                  <span style="float: left;width:10%">{{ item.goodsG }}</span>
                </el-option>
              </el-select>
        </el-form-item> 
        <el-form-item label="价格" prop="goodsPrice">
          <el-input v-model="form.goodsPrice" placeholder="请输入价格" />
        </el-form-item>
        <el-form-item label="会员价" prop="goodsHyPrice">
          <el-input v-model="form.goodsHyPrice" placeholder="请输入会员价" />
        </el-form-item>
      </el-form>
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
            
                :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
              </el-upload>
            </el-col>
          </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { listShopGoods, getShopGoods, delShopGoods, addShopGoods, updateShopGoods, exportShopGoods } from "@/api/system/shopGoods";
import { getToken } from "@/utils/auth";
import {listShopInfo} from "@/api/system/shopInfo"; 
import { goodsList} from "@/api/system/ownerGoods";
export default {
  name: "ShopGoods",
  data() {
    return {
       importUrl:"",
      //门店
      shopList: [],
       //商品
      goodsList: [],
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
      // 门店商品管理表格数据
      shopGoodsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      iopen: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        storeid: undefined,
        goodsCode: undefined,
        labelMac: undefined,
        goodsPrice: undefined,
        goodsHyPrice: undefined,
      },
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
      // 表单参数
      form: {},
      // 表单校验
      rules: {
         storeid:[
           {required:true,message:"门店不能为空", trigger: "blur"}
         ],
         goodsCode:[
           {required:true,message:"商品不能为空", trigger: "blur"}
         ],
          goodsPrice:[
           {required:true,message:"价格不能为空", trigger: "blur"}
         ],
      }
    };
  },
  created() {
    this.getList();
    //获取门店信息
    listShopInfo(this.queryParams).then(response => {
        this.shopList = response.rows;
        console.log(this.shopList)
    });
    //获取商品信息
      goodsList(this.queryParams).then(response => {
        this.goodsList = response.rows;
      });
  },
  methods: {
    downFild(){
      location.href=process.env.VUE_APP_BASE_API+"/profile/upload/template-goods-price.xlsx";
    },
     handleSuccess(res, file, fileList) {
       this.getList();
    },
     submitUpload() {
        this.$refs.upload.submit();
      },
      /** 导入操作 */
    handleImport() {
      //this.reset();
      this.iopen = true;
      this.title = "商品批量改价";
      const id = this.ids;
      this.importUrl=process.env.VUE_APP_BASE_API + "/system/shopGoods/import";
    },
    /** 查询门店商品管理列表 */
    getList() {
      this.loading = true;
      listShopGoods(this.queryParams).then(response => {
        this.shopGoodsList = response.rows;
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
        storeid: undefined,
        goodsCode: undefined,
        labelMac: undefined,
        goodsPrice: undefined,
        id: undefined,
        goodsHyPrice: undefined,
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
      this.title = "添加门店商品管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getShopGoods(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改门店商品管理";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateShopGoods(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addShopGoods(this.form).then(response => {
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
      this.$confirm('是否确认删除门店商品管理编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delShopGoods(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有门店商品管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportShopGoods(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>