<template>
  <div class="home-container">
    <div class="home-msg">
      <div><span>全国门店</span><span>{{storeCount}}</span></div>
      <div><span>物料种类</span><span>{{materialCount}}</span></div>
      <div><span>打印记录</span><span>{{printCount}}</span></div>
      <div><span>督导数量</span><span>{{supervisorCount}}</span></div>
    </div>
    <div class="home-content">
      <echart-line :echartData="lineData" />
      <echart-bar :echartData="barData" />
      <dv-rank :dv-data="dvData" :dv-style="dvStyle" title="全国门店实时打印总数排行" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import echartLine from '@/components/ecahrts/echartLine'
import dvRank from '@/components/datav/dvRank';
import EchartBar from '@/components/ecahrts/echartBar.vue';
import { getPageParams, getPageTotal } from '@/utils/dataParams';
import { printHistoryQuery } from '@/api/print';
import { materialQuery } from '@/api/material';
import { supervisorQuery } from '@/api/supervisor';
import { storeQuery } from '@/api/store';


export default {
  name: 'Home',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  components:{
    echartLine,
    dvRank,
    EchartBar
  },
  data() {
    return {
      dvData:{
          data:[
            {
              "value": 427,
              "store_id": "3611",
              "name": "茶百道上海长岛路店"
            },
            {
              "value": 403,
              "store_id": "681",
              "name": "茶百道上海大木桥路店"
            },
            {
              "value": 399,
              "store_id": "441",
              "name": "茶百道北京魏公村店"
            },
            {
              "value": 368,
              "store_id": "390",
              "name": "茶百道上海中原欧尚店"
            },
            {
              "value": 359,
              "store_id": "3118",
              "name": "茶百道哈尔滨乐松广场店"
            },
            {
              "value": 356,
              "store_id": "561",
              "name": "茶百道上海绿地缤纷城店"
            },
            {
              "value": 352,
              "store_id": "504",
              "name": "茶百道上海惠南二店"
            },
            {
              "value": 342,
              "store_id": "385",
              "name": "茶百道曹杨路地铁站店"
            },
            {
              "value": 336,
              "store_id": "307",
              "name": "茶百道上海福州路店"
            },
            {
              "value": 328,
              "store_id": "592",
              "name": "茶百道广州GOGO新天地店"
            }
          ],
          unit: '次',
          waitTime:3000,
          rowNum:9,
      },
      storeCount:null,
      materialCount:null,
      printCount:null,
      supervisorCount:null,
      dvStyle:"width:100%;height:100%;",
      lineData:{},
      barData:{},
    }
  },
  mounted() {
    this.getPrintList();
    this.getPrintByDay();
    this.getMaterialCount();
    this.getPrintCount();
    this.getStoreCount();
    this.getSupervisorCount();

  },
  methods:{

    // 获取订单数
    getPrintCount(){
      const dataParams = getPageParams({},{},10,0,false);
      printHistoryQuery(dataParams).then(data => {
        this.printCount = getPageTotal(data);
        console.log(this.printCount);
      })
    },
    // 获取物料总数
    getMaterialCount(){
      const dataParams = getPageParams({},{},10,0,false);
      materialQuery(dataParams).then(data => {
        this.materialCount = getPageTotal(data);
      })
    },
    getSupervisorCount(){
      const dataParams = getPageParams({},{},10,0,false);
      supervisorQuery(dataParams).then(data => {
        this.supervisorCount = getPageTotal(data);
      })
    },
    getStoreCount(){
      const dataParams = getPageParams({},{},10,0,false);
      storeQuery(dataParams).then(data => {
        this.storeCount = getPageTotal(data);
      })
    },
    // 临时用一下
    getPrintList(){

      const lineData = {
        title:"日均物料统计",
        xName:"时间",
        unit:'数量',
        xData:["前天","昨天","今天"],
        seriesData:[
            {
                "name": "半成品原料",
                "data": [
                    26897,
                    36896,
                    39899
                ]
            },
            {
                "name": "开封冷冻冷藏原料",
                "data": [
                    6996,
                    19961,
                    8001
                ]
            },
            {
                "name": "罐头、果汁、果酱",
                "data": [
                    44812,
                    43815,
                    50821
                ]
            },
            {
                "name": "粉末",
                "data": [
                    6547,
                    6553,
                    6598
                ]
            },
            {
                "name": "不锈钢奶油瓶",
                "data": [
                    12379,
                    16380,
                    19455
                ]
            },
            {
                "name": "鲜果",
                "data": [
                    6965,
                    6470,
                    5550
                ]
            },

            {
                "name": "茶叶",
                "data": [
                    8410,
                    8412,
                    8499
                ]
            },
            {
                "name": "糖类",
                "data": [
                    1418,
                    1421,
                    1477
                ]
            }
        ],
      }
      // console.log(lineData);
      // console.log(echartData);
      this.lineData = lineData;
    },
    // 日均打印统计
    getPrintByDay(){

      const data=[
          
          {
            "value": 398498,
            "value1": 308498,
            "value2": 368498,
            "date": "2021-12-23"
          },
          {
            "value": 508247,
            "value1": 398498,
            "value2": 428498,
            "date": "2021-12-24"
          },
          {
            "value": 418724,
            "value1": 328498,
            "value2": 398498,
            "date": "2021-12-25"
          },
          {
            "value": 438672,
            "value1": 398498,
            "value2": 498498,
            "date": "2021-12-26"
          },
          {
            "value": 349891,
            "value1": 398498,
            "value2": 298498,
            "date": "2021-12-27"
          },
          {
            "value": 404334,
            "value1": 328498,
            "value2": 388498,
            "date": "2021-12-28"
          },
          {
            "value": 220379,
            "value1": 190379,
            "value2": 170379,
            "date": "2021-12-29"
          }
        ];
        const barData = {
          title:"日均打印统计",
          xName:"时间",
          unit:'次数',
          xData:data.map(item=>item.date),
          seriesData:[
            {name:"总数",data:data.map(item=>item.value)},
            {name:"报损",data:data.map(item=>item.value1)},
            {name:"用完",data:data.map(item=>item.value2)}
          ]
        }
        // console.log(echartData);
        this.barData = barData;
    }


  }
}
</script>

<style lang="scss" scoped>
$color1:#fc758e;
$color2:#F9CDAD;
$color3:#4fbdaa;
$color4:#5169ca;
// @mixin getColor(n){
//   let colorList = ['#fc758e']
//   color:colorList[n];
// }
.home {
  &-container {
    margin: 20px;
  }
  &-text {
    font-size: 30px;
    line-height: 30px;
    height: 50px;
    // text-align: center;
  }
  &-content {
    // display: flex;
    // height: calc(100% - 150px);
    
  }
  &-msg{
    width: 100%;
    height: 100px;
    margin-bottom: 30px;
    display: flex;
    align-items: stretch;
    div{
      border-radius: 10px;
      margin: 0 20px;
      background: $color1;
      flex: 1;
      text-align: center;
      &:nth-child(2){
        background: $color2;
      }
      &:nth-child(3){
        background: $color3;
      }
      &:nth-child(4){
        background: $color4;
      }
      span{
        display: block;
        color:#fff;
        font-size: 22px;
        line-height: 50px;
        &:last-child{
          font-size: 18px;
          line-height: 30px;
        }
      }
    }
  }
}
.dv-scroll-ranking-board .ranking-column .inside-column{
  height: 20px;
}
</style>
