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
      <echart-line :echartData="echartData" />
      <dv-rank :dv-data="dvData" :dv-style="dvStyle" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import echartLine from '@/components/ecahrts/echartLine'
import dvRank from '@/components/datav/dvRank';
import { printHistoryQuery } from '@/api/print';
import { getContent } from '@/utils/dataParams';

export default {
  name: 'Home',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  components:{
    echartLine,
    dvRank
  },
  data() {
    return {
      dvData:{
          data:[
              // 西南 华北 东北 西北 中南 华东
              {
              name: '西南',
              value: 976
              },
              {
              name: '华北',
              value: 34
              },
              {
              name: '东北',
              value: 36
              },
              {
              name: '西北',
              value: 176
              },
              {
              name: '中南',
              value: 514
              },
              {
              name: '华东',
              value: 1112
              }
          ],
          unit: '家',
          waitTime:5000,
      },
      tips:[
        {label:"今日全国门店",value:'5241'},
        {label:"今日有效物料",value:'17'},
        {label:"今日有效效期",value:'20'},
        {label:"今日打印模板",value:'15'},
      ],
      dvStyle:"width:50%;height:100%;",
      echartData:{}
    }
  },
  mounted() {
    this.getPrintList();
  },
  methods:{

    // 临时用一下
    getPrintList(){



        const echartData = {
          title:"打印记录",
          xName:"时间",
          unit:'次数',
          xData:["前天","昨天","今天"],
          seriesData:[
            {name:"佛手",data:[82,163,155]},{name:"西瓜",data:[200,180,80]},
            {name:"葡萄",data:[252,209,235]},{name:"珍珠",data:[100,90,105]}
          ]
        }
        // console.log(echartData);
        this.echartData = echartData;
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
    display: flex;
    height: calc(100% - 150px);
  }
  &-msg{
    width: 100%;
    height: 100px;
    margin-bottom: 20px;
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
</style>
