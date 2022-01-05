<template>
  <div class="home-container">
    <div class="home-msg">
      <div><span>全国门店</span><span>{{storeCount}}</span></div>
      <div><span>物料种类</span><span>{{materialCount}}</span></div>
      <div><span>打印记录</span><span>{{printCount}}</span></div>
      <div><span>督导数量</span><span>{{supervisorCount}}</span></div>
    </div>
    <div class="home-content">
      <echart-bar :echartData="barData" />
      <echart-line :echartData="lineData" />
      <dv-rank :dv-data="dvData" :dv-style="dvStyle" title="全国门店实时打印总数排行" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import echartLine from '@/components/ecahrts/echartLine'
import dvRank from '@/components/datav/dvRank';
import EchartBar from '@/components/ecahrts/echartBar.vue';
import { getPageParams, getPageTotal, getContent } from '@/utils/dataParams';
import { printHistoryQuery } from '@/api/print';
import { materialQuery } from '@/api/material';
import { supervisorQuery } from '@/api/supervisor';
import { storeQuery } from '@/api/store';
import { queryClassifyList,queryPrintList,queryStoreRank } from '@/api/home';

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
      dvData:{},
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
    this.getRank();
  },
  methods:{
    getRank(){
      queryStoreRank().then(response=>{
        const data = getContent(response).filter(item=>{
            return item.s_name!= "unkown";
        }).map(item=>{
          return {name:item.s_name,value:item.print_count}
        });
        console.log(data);
        //     "print_count": 49,
        //     "s_name": "茶百道安庆八佰伴店",
        this.dvData={
            data:data,
            unit: '次',
            waitTime:3000,
            rowNum:9,
        };
      })
    },
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
    //物料统计
    getPrintList(){

      const dataParams = getPageParams({},{},10,0,true);
      queryClassifyList(dataParams).then(response=>{
        let {today,yesterday,before_yesterday} = getContent(response);
        let middleData={}
        today.map(item=>{
          middleData[item.clf_name]={
            today:item.print_count
          };
        })
        yesterday.map(item=>{
          if(middleData[item.clf_name]) middleData[item.clf_name]["yesterday"] = item.print_count
        })
        before_yesterday.map(item=>{
          if(middleData[item.clf_name]) middleData[item.clf_name]["before_yesterday"] = item.print_count
        })
        const seriesData = [];
        for(let i in middleData){
          const iData = middleData[i];
          seriesData.push({
            name:i,
            data:[iData.before_yesterday || 0,iData.yesterday || 0,iData.today || 0]
          })
        }
        const lineData = {
          title:"物料打印统计",
          xName:"时间",
          unit:'数量',
          xData:["前天","昨天","今天"],
          seriesData:seriesData,
        }
        this.lineData = lineData;
      });
    },
    // 日均打印统计
    getPrintByDay(){
      queryPrintList().then(response=>{
        const data = getContent(response).reverse();
        const barData = {
          title:"物料总数统计",
          xName:"时间",
          unit:'次数',
          xData:data.map(item=>item._id),
          seriesData:[
            {name:"打印",data:data.map(item=>item.print_count)},
            {name:"报损",data:data.map(item=>item.break_count)},
            {name:"用完",data:data.map(item=>item.finish_count)}
          ]
        }
        // console.log(echartData);
        this.barData = barData;
      })

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
