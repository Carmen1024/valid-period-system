<template>
    <div class="dvRank-Container" :style="dvStyle">
        <div class="dvRank-title">{{ title }}</div>
        <dv-scroll-ranking-board 
            class="dvRank-content"
            :config="config" 
            :id="id"
        />
    </div>
</template>

<script>

export default {
    props:{
        id:{
            type:String,
            default:"dvRank"
        },
        dvStyle:{
            type:String,
            default:"width:100%;height:100%"
        },
        dvData:{
           type:Object,
           default:()=>{} 
        },
        title:{
            type:String,
            default:"今日全国门店巡视"
        },
    },
    watch:{
        dvData:{
            handler: function (val, oldVal) {
                this.refreshConfig();
            },
            deep: true
        },
    },
    data() {
        return {
            config:{
                data:[],
            }
            
        }
    },
    mounted(){
        this.refreshConfig();

    },
    methods:{
        refreshConfig(){
            let { data=[],unit="",waitTime="3000" } = this.dvData;
            this.config = { data, unit, waitTime };
        }
    }
    

}
</script>

<style scoped lang="scss">
    .dvRank-Container{
        .dvRank-title{
            line-height: 30px;
            font: {
                size: 18px;
                weight: bold;
            }
        }
        .dvRank-content{
            width:100%;
            height:550px;
            padding:0 20px;
            color:#152a7d;


        }
        .dv-scroll-ranking-board .ranking-column .inside-column{
            height: 20px;
        }
    }
</style>