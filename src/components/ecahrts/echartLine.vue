<template>
  <div :id="id" :style="echartStyle"></div>
</template>

<script>
import * as echarts from 'echarts';
export default {
    props:{
        id:{
            type:String,
            default:"echartLine"
        },
        echartStyle:{
            type:String,
            default:"width:50%;height:600px;"
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
                    color=['#1370fb','#FE4365','#FC9D9A','#F9CDAD','#C8C8A9','#83AF9B','#26BCA3',"#26BCD5"],
                    unit="" 
                } = this.echartData;
            let option = {
                title:{
                    text:title,
                    textStyle:{
                        
                    }
                },
                color:color,
                legend:{
                    padding:0,
                    top:0,left:0,right:0,bottom:0
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
            option.series = seriesData.map(item =>{
                
                return {
                    data: item,
                    type: 'line',
                    smooth: true
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