<template>
  <div class="home-container">
    <!-- <div class="home-text"> {{ name }},欢迎进入茶百道效期管理系统！</div> -->
    <div class="home-msg">
      <div v-for="(item,index) in tips" :key="index">
        <span>{{ item.label }}</span>
        <span>{{ item.value }}</span>
      </div>
    </div>
    <div class="home-content">
      <echart-line :echartData="lineData" />
      <echart-bar :echartData="barData" />
      <dv-rank :dv-data="dvData" :dv-style="dvStyle" title="今日门店打印数排行" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import echartLine from '@/components/ecahrts/echartLine'
import dvRank from '@/components/datav/dvRank';
import { printHistoryQuery } from '@/api/print';
import { getContent } from '@/utils/dataParams';
import EchartBar from '@/components/ecahrts/echartBar.vue';

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
          unit: '家',
          waitTime:3000,
          rowNum:9,
      },
      tips:[
        {label:"全国门店",value:'5471'},
        {label:"今日有效物料",value:'79'},
        {label:"今日物料效期",value:'111'},
        {label:"打印订单",value:'15001'},
      ],
      dvStyle:"width:100%;height:100%;",
      lineData:{},
      barData:{},
    }
  },
  mounted() {
    this.getPrintList();
    this.getPrintByDay();
  },
  methods:{

    // 临时用一下
    getPrintList(){

      const lineData = {
        title:"打印种类统计",
        xName:"时间",
        unit:'次数',
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
                    54812,
                    54815,
                    54821
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
      console.log(lineData);
      // console.log(echartData);
      this.lineData = lineData;
    },
    // 日均打印统计
    getPrintByDay(){

      const data=[
          {
            "value": 417360,
            "date": "2021-11-28"
          },
          {
            "value": 385739,
            "date": "2021-11-29"
          },
          {
            "value": 393994,
            "date": "2021-11-30"
          },
          {
            "value": 397642,
            "date": "2021-12-01"
          },
          {
            "value": 405511,
            "date": "2021-12-02"
          },
          {
            "value": 428785,
            "date": "2021-12-03"
          },
          {
            "value": 440362,
            "date": "2021-12-04"
          },
          {
            "value": 419162,
            "date": "2021-12-05"
          },
          {
            "value": 388623,
            "date": "2021-12-06"
          },
          {
            "value": 398498,
            "date": "2021-12-07"
          },
          {
            "value": 408247,
            "date": "2021-12-08"
          },
          {
            "value": 418724,
            "date": "2021-12-09"
          },
          {
            "value": 438672,
            "date": "2021-12-10"
          },
          {
            "value": 449891,
            "date": "2021-12-11"
          },
          {
            "value": 424334,
            "date": "2021-12-12"
          },
          {
            "value": 120379,
            "date": "2021-12-13"
          }
        ];
        const barData = {
          title:"日均打印统计",
          xName:"时间",
          unit:'次数',
          xData:data.map(item=>item.date),
          seriesData:[
            {name:"打印数",data:data.map(item=>item.value)}
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
