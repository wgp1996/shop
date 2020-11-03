<template>
  <el-row :gutter="10" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col" style="width:20% !important">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            当日下发订单
          </div>
          <count-to :start-val="0" :end-val="227" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col" style="width:20% !important">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-message">
          <!-- <svg-icon icon-class="message" class-name="card-panel-icon" /> -->
          <img src="../../assets/count.png" style="width:50px;height:50px">
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            当日相应订单
          </div>
          <count-to :start-val="0" :end-val="272" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col" style="width:20% !important">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
           当日下发询价单
          </div>
          <count-to :start-val="0" :end-val="376542.76" :duration="3200" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col" style="width:20% !important">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-shopping">
          <!-- <svg-icon icon-class="shopping" class-name="card-panel-icon" /> -->
          <img src="../../assets/dan.png" style="width:50px;height:50px">
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            当日回复询价单
          </div>
          <count-to :start-val="0" :end-val="1732" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
      <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col" style="width:20% !important"> 
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-shopping">
          <!-- <svg-icon icon-class="shopping" class-name="card-panel-icon" /> -->
          <img src="../../assets/he.png" style="width:50px;height:50px">
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            当日药残检测批次
            <br>
           
            <span style="display:inline-block;color:#666;font-size:20px;margin-top:15px">89.7%</span>
          </div>
          <!-- <count-to :start-val="0" :duration="3600" class="card-panel-num" />  -->
        </div>
      </div>
    </el-col>
     <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col" style="width:33.3% !important"> 
     <a href="/shop/sensor/shopInfo">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="documentation" class-name="card-panel-icon" />
          <!-- <img src="../../assets/he.png" style="width:50px;height:50px"> -->
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text" style="margin-top:20px;">
             门店建档
            <br>
           
            <!-- <span style="display:inline-block;color:#666;font-size:20px;margin-top:15px">89.7%</span> -->
          </div>
          <!-- <count-to :start-val="0" :duration="3600" class="card-panel-num" />  -->
        </div>
      </div>
      </a>
    </el-col>
     <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col" style="width:33.3% !important"> 
      <a href="/shop/sensor/shopLabel">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="bug" class-name="card-panel-icon" />
          <!-- <img src="../../assets/he.png" style="width:50px;height:50px"> -->
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text" style="margin-top:20px;">
             电子价签管理
            <br>
           
            <!-- <span style="display:inline-block;color:#666;font-size:20px;margin-top:15px">89.7%</span> -->
          </div>
          <!-- <count-to :start-val="0" :duration="3600" class="card-panel-num" />  -->
        </div>
      </div>
      </a>
    </el-col>
     <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col" style="width:33.3% !important"> 
       <a href="/shop/sensor/shopGoods">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="drag" class-name="card-panel-icon" />
          <!-- <img src="../../assets/he.png" style="width:50px;height:50px"> -->
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text" style="margin-top:20px;">
             门店商品管理
            <br>
           
            <!-- <span style="display:inline-block;color:#666;font-size:20px;margin-top:15px">89.7%</span> -->
          </div>
          <!-- <count-to :start-val="0" :duration="3600" class="card-panel-num" />  -->
        </div>
      </div>
      </a>
    </el-col>
     
    <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col" style="width:25% !important"> 
        <a href="/shop/terminal/inquiry">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
          <!-- <img src="../../assets/he.png" style="width:50px;height:50px"> -->
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text" style="margin-top:20px;">
            询价
            <br>
           
            <!-- <span style="display:inline-block;color:#666;font-size:20px;margin-top:15px">89.7%</span> -->
          </div>
          <!-- <count-to :start-val="0" :duration="3600" class="card-panel-num" />  -->
        </div>
      </div>
      </a>
    </el-col>
        <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col" style="width:25% !important"> 
         <a href="/shop/terminal/singleBuy">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-people ">
          <svg-icon icon-class="people" class-name="card-panel-icon" />
          <!-- <img src="../../assets/he.png" style="width:50px;height:50px"> -->
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text" style="margin-top:20px;">
            单供应商订单
            <br>
           
            <!-- <span style="display:inline-block;color:#666;font-size:20px;margin-top:15px">89.7%</span> -->
          </div>
          <!-- <count-to :start-val="0" :duration="3600" class="card-panel-num" />  -->
        </div>
      </div>
      </a>
    </el-col>
      <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col" style="width:25% !important"> 
          <a href="/shop/terminal/moreBuy">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-people ">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          <!-- <img src="../../assets/he.png" style="width:50px;height:50px"> -->
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text" style="margin-top:20px;">
             多供应商订单
            <br>
           
            <!-- <span style="display:inline-block;color:#666;font-size:20px;margin-top:15px">89.7%</span> -->
          </div>
          <!-- <count-to :start-val="0" :duration="3600" class="card-panel-num" />  -->
        </div>
      </div>
      </a>
    </el-col>
     <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col" style="width:25% !important"> 
        <a href="/shop/terminal/owner">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="user" class-name="card-panel-icon" />
          <!-- <img src="../../assets/he.png" style="width:50px;height:50px"> -->
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text" style="margin-top:20px;">
            业户查询
            <br>
           
            <!-- <span style="display:inline-block;color:#666;font-size:20px;margin-top:15px">89.7%</span> -->
          </div>
          <!-- <count-to :start-val="0" :duration="3600" class="card-panel-num" />  -->
        </div>
      </div>
      </a>
    </el-col>
    
  </el-row>
  
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      text-align: center;
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
@media (max-width:1400px) {
  .panel-group .card-panel .card-panel-icon-wrapper[data-v-0333a520] {
    margin: 14px 0 0 0px;
    padding:16px 5px
  }


}
</style>
