<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="冷库名称" prop="storeName">
        <el-input
          v-model="queryParams.storeName"
          placeholder="请输入冷库名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="冷库编码" prop="storeCode">
        <el-input
          v-model="queryParams.storeCode"
          placeholder="请输入冷库编码"
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
          v-hasPermi="['system:store:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:store:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:store:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:store:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="storeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="冷库名称" align="center" prop="storeName" />
      <el-table-column label="冷库编码" align="center" prop="storeCode" />
      <el-table-column label="冷库面积" align="center" prop="storeArea" />
      <el-table-column label="冷库容积" align="center" prop="storeVolume" />
      <el-table-column label="冷库类型" align="center" prop="storeType" />
      <el-table-column label="冷库地址" align="center" prop="storeAddress" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:store:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:store:remove']"
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

    <!-- 添加或修改冷库建档对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" @close="closeDialog">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-tabs v-model="activeName" @tab-click="tabClick">
          <el-tab-pane label="基础信息" name="first">
            <el-form-item label="冷库名称" prop="storeName">
              <el-input v-model="form.storeName" placeholder="请输入冷库名称" />
            </el-form-item>
            <el-form-item label="冷库面积" prop="storeArea">
              <el-input v-model="form.storeArea" placeholder="请输入冷库面积" />
            </el-form-item>
            <el-form-item label="冷库容积" prop="storeVolume">
              <el-input v-model="form.storeVolume" placeholder="请输入冷库容积" />
            </el-form-item>
            <el-form-item label="冷库类型">
              <el-select v-model="form.storeType" placeholder="请选择冷库类型" style="width:100%">
                <el-option
                  v-for="item in perationOptions"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入备注" />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="位置信息" name="second">
            <baidu-map
              v-if="showMap"
              v-bind:style="mapStyle"
              class="bm-view"
              ak="cGklIMXA6RuKkir9UobkakSE0QhwyuoO"
              :center="center"
              :zoom="zoom"
              :scroll-wheel-zoom="true"
              @ready="handler"
              @click="getClickInfo"
              @moving="syncCenterAndZoom"
              @moveend="syncCenterAndZoom"
              @zoomend="syncCenterAndZoom"
            >
              <bm-view style="width: 100%; height:500px;"></bm-view>
              <bm-marker
                :position="{lng: center.lng, lat: center.lat}"
                :dragging="true"
                animation="BMAP_ANIMATION_BOUNCE"
              ></bm-marker>
              <bm-control :offset="{width: '10px', height: '10px'}">
                <bm-auto-complete v-model="keyword" :sugStyle="{zIndex: 999999}">
                  <input
                    type="text"
                    placeholder="请输入搜索关键字"
                    v-model="form.storeAddress"
                    class="serachinput"
                  />
                </bm-auto-complete>
              </bm-control>
              <bm-local-search
                :keyword="keyword"
                :auto-viewport="true"
                style="width:0px;height:0px;overflow: hidden;"
              ></bm-local-search>
            </baidu-map>
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
import {
  listStore,
  getStore,
  delStore,
  addStore,
  updateStore,
  exportStore,
} from "@/api/system/store";
import {
  BaiduMap,
  BmControl,
  BmView,
  BmAutoComplete,
  BmLocalSearch,
  BmMarker,
} from "vue-baidu-map";
let _that;
export default {
  name: "Store",
  data() {
    return {
      //冷库类型
      perationOptions: [],
      showMap: false,
      BMap: null,
      map: null,
      keyword: "",
      mapStyle: {
        width: "100%",
        height: this.mapHeight + "px",
      },
      center: { lng: "", lat: "" },
      zoom: 15,
      activeName: "first",
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
      // 冷库建档表格数据
      storeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        storeName: undefined,
        storeCode: undefined,
        storeArea: undefined,
        storeVolume: undefined,
        storeType: undefined,
        storeAddress: undefined,
        lat: undefined,
        lng: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        storeName: [
          { required: true, message: "冷库名称不能为空", trigger: "blur" },
        ],
      },
    };
  },
  components: {
    BaiduMap,
    BmControl,
    BmView,
    BmAutoComplete,
    BmLocalSearch,
    BmMarker,
  },
  created() {
    _that = this;
    _that.getList();
     _that.getDicts("sys_store_type").then((response) => {
      _that.perationOptions = response.data;
    });
  },
  methods: {
    closeDialog() {
      _that.activeName = "first";
      _that.showMap = false;
    },
    tabClick(res) {
      console.log(res);
      if (res.name == "second") {
        _that.showMap = true;
      }
    },
    handler({ BMap, map }) {
      map.clearOverlays();
      // var point = new BMap.Point(109.49926175379778, 36.60449676862417)
      // map.centerAndZoom(point, 13)
      // var marker = new BMap.Marker(point) // 创建标注
      // map.addOverlay(marker) // 将标注添加到地图中
      // var circle = new BMap.Circle(point, 6, { strokeColor: 'Red', strokeWeight: 6, strokeOpacity: 1, Color: 'Red', fillColor: '#f03' })
      // map.addOverlay(circle)
      _that.BMap = BMap;
      _that.map = map;
      map.enableScrollWheelZoom(true);
      // map.centerAndZoom('青岛市', 13)
      // let hide = this.$message.loading('正在获取当前省市请稍候..', 0)

      if (
        _that.form.lat != "" &&
        _that.form.lat != null &&
        _that.form.lat != undefined
      ) {
        _that.center = { lng: _that.form.lng, lat: _that.form.lat }; // 设置center属性值
      } else {
        let geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(
          function (r) {
            let gc = new _that.BMap.Geocoder();
            gc.getLocation(r.point, function (rs) {
              _that.form.storeAddress = rs.address;
            });
            _that.center = { lng: r.longitude, lat: r.latitude }; // 设置center属性值
            // _that.autoLocationPoint = { lng: r.longitude, lat: r.latitude }        // 自定义覆盖物
            _that.initLocation = true;
          },
          { enableHighAccuracy: true }
        );
      }
    },
    /***
     * 地图点击事件。
     */
    getClickInfo(e) {
      //  _that.map.clearOverlays();
      _that.center.lng = e.point.lng;
      _that.center.lat = e.point.lat;
      let gc = new _that.BMap.Geocoder();
      gc.getLocation(e.point, function (rs) {
        console.log(rs.address);
        _that.form.storeAddress = rs.address;
      });
    },
    syncCenterAndZoom(e) {
      const { lng, lat } = e.target.getCenter();
      _that.center.lng = lng;
      _that.center.lat = lat;
      _that.zoom = e.target.getZoom();
    },
    /** 查询冷库建档列表 */
    getList() {
      _that.loading = true;
      listStore(_that.queryParams).then((response) => {
        _that.storeList = response.rows;
        _that.total = response.total;
        _that.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      _that.open = false;
      _that.reset();
    },
    // 表单重置
    reset() {
      _that.form = {
        id: undefined,
        storeName: undefined,
        storeCode: undefined,
        storeArea: undefined,
        storeVolume: undefined,
        storeType: undefined,
        storeAddress: undefined,
        lat: undefined,
        lng: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
      };
      _that.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      _that.queryParams.pageNum = 1;
      _that.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      _that.resetForm("queryForm");
      _that.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      _that.ids = selection.map((item) => item.id);
      _that.single = selection.length != 1;
      _that.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      _that.reset();
      _that.open = true;
      _that.title = "添加冷库建档";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      _that.reset();
      const id = row.id || _that.ids;
      getStore(id).then((response) => {
        _that.form = response.data;
        _that.open = true;
        _that.title = "修改冷库建档";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      _that.$refs["form"].validate((valid) => {
        if (valid) {
          _that.form.lat = _that.center.lat;
          _that.form.lng = _that.center.lng;
          if (_that.form.id != undefined) {
            updateStore(_that.form).then((response) => {
              if (response.code === 200) {
                _that.msgSuccess("修改成功");
                _that.open = false;
                _that.getList();
              } else {
                _that.msgError(response.msg);
              }
            });
          } else {
            addStore(_that.form).then((response) => {
              if (response.code === 200) {
                _that.msgSuccess("新增成功");
                _that.open = false;
                _that.getList();
              } else {
                _that.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || _that.ids;
      _that
        .$confirm('是否确认删除冷库建档编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(function () {
          return delStore(ids);
        })
        .then(() => {
          _that.getList();
          _that.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = _that.queryParams;
      _that
        .$confirm("是否确认导出所有冷库建档数据项?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(function () {
          return exportStore(queryParams);
        })
        .then((response) => {
          _that.download(response.msg);
        })
        .catch(function () {});
    },
  },
};
</script>
<style scoped>
.serachinput {
  width: 300px;
  box-sizing: border-box;
  padding: 9px;
  border: 1px solid #dddee1;
  line-height: 20px;
  font-size: 16px;
  height: 38px;
  color: #333;
  position: relative;
  border-radius: 4px;
  -webkit-box-shadow: #666 0px 0px 10px;
  -moz-box-shadow: #666 0px 0px 10px;
  box-shadow: #666 0px 0px 10px;
}
</style>