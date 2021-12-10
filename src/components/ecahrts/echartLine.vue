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
            const colorList=[
                ["#fc758e","rgb(252,117,142,.5)"],
                ["#F9CDAD","rgb(249,25,173,.5)"],
                ["#4fbdaa","rgb(79,189,170,.5)"],
                ["#5169ca","rgb(81,105,202,.5)"],
            ]

            myChart.clear();
            let { 
                    title="",
                    xName="",
                    xData=[],
                    seriesData=[],
                    color=["#fc758e","#F9CDAD","#4fbdaa","#5169ca"],
                    unit="" 
                } = this.echartData;
                
            let option = {
                title:{
                    text:title
                },
                color:color,
                legend:{
                    
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
                    boundaryGap: false,
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
                    type: 'line',
                    smooth: true,
                    name:item.name || '',
                    areaStyle: {
                        opacity: 0.5,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: colorList[index][0]
                            },
                            {
                                offset: 1,
                                color: colorList[index][1]
                            }
                        ])
                    }
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