<template>
  <div class="home-container">
    <div class="home-text"> {{ name }},欢迎进入茶百道效期管理系统！</div>
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
      let dataParams ={
        "#content" : {
          "#size": 100,
          "#start": 0,
        },
        ["#cache"] : "refresh"
      };
      printHistoryQuery(dataParams).then(data => {

        let seriesJson={};

        this.list = getContent(data).map(item => {
          let { m_name } = item;
          seriesJson[m_name] = seriesJson[m_name]!=undefined ? ++seriesJson[m_name] : 1;
        });

        const echartData = {
          title:"今日打印记录",
          xName:"分类",
          unit:'次数',
          xData:Object.keys(seriesJson),
          seriesData:[Object.values(seriesJson)]
        }
        // console.log(echartData);
        this.echartData = echartData;
      })
    }

  }
}
</script>

<style lang="scss" scoped>
.home {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 30px;
    height: 50px;
    // text-align: center;
  }
  &-content {
    display: flex;
    height: calc(100% - 100px);

  }
}
</style>
