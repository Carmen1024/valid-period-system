<template>
  <div :id="id" :style="echartStyle"></div>
</template>

<script>
import * as echarts from 'echarts';
import { commonColor,commonColorList } from '@/utils/commonData';
export default {
    props:{
        id:{
            type:String,
            default:"echartBar"
        },
        echartStyle:{
            type:String,
            default:"float:left;width:50%;height:600px;"
        },
        echartData:{
            type:Object,
            default:()=>{} 
        }
    },
    data() {
        return {
            option : {}
        }
    },
    watch : {
        echartData:{
            handler: function (val, oldVal) {
                this.refreshData();
            },
            deep:true
        }
    },
    mounted(){
        // this.refreshData();
    },
    methods:{

        refreshData(){

            const chartDom = document.getElementById(this.id);
            const myChart = echarts.init(chartDom);
            myChart.clear();
            let { 
                    title="",
                    xName="",
                    xData=[],
                    seriesData=[],
                    color=commonColor,
                    unit="" 
                } = this.echartData;
                
            let option = {
                title:{
                    text:title
                },
                color:color,
                legend:{
                    show:false
                },
                tooltip:{
                    show:true,
                    trigger: 'axis'
                },
                xAxis: {
                    type: 'category',
                    data: xData,
                    name:xName,
                    axisLabel:{
                        color:"#333"
                    },
                    nameTextStyle:{
                        color:"#333"
                    },
                    // boundaryGap: false,
                },
                yAxis: {
                    type: 'value',
                    name:unit,
                    axisLine:{
                        show:true,
                        lineStyle:{
                            color:"#ddd"
                        },
                    },
                    axisLabel:{
                        color:"#333"
                    },
                    nameTextStyle:{
                        color:"#333"
                    },
                },
                series:[]
                
            }
            option.series = seriesData.map((item,index) =>{
                
                return {
                    data: item.data,
                    type: 'bar',
                    smooth: true,
                    name:item.name || '',
                }
                
            });
            this.option = option;

            this.option && myChart.setOption(this.option);

        }
    }

}
</script>

<style>

</style>