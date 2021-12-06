<template>
  <div class="timeUtil" style="display:flex;" :id="id">
      <!-- 
        输入框：
        type：input
        数字
    -->
    <el-input style="width: 25%;margin:0 5px;" :min=0
        v-model.number="days" @change="changeNumber">
    </el-input>
    <span>天</span>
    <el-input style="width: 25%;margin:0 5px;"
        v-model.number="hours" :min=0 :max=23 @change="changeNumber">
    </el-input>
    <span>时</span>
    <el-input style="width: 25%;margin:0 5px;"
        v-model.number="minutes" :min=0 :max=59 @change="changeNumber">
    </el-input>
    <span>分</span>
  </div>
</template>

<script>
export default {

    props:{
        propModel:{
            required: true,
            type: String,
            default: ""
        },
        times:{
            type: Number,
            default: 0
        },
        id:{
            required: true,
            type: String,
            default: ""
        }
    },
    watch:{
        propModel:{
            handler: function (val,oldVal) {

            },
            deep: true
        },
        times:{
            handler: function (val,oldVal) {
                this.setTimes();
            },
            deep: true
        },
        id:{
            handler: function (val,oldVal) {
                this.setTimes();
            },
            deep: true
        },
    },
    data() {
        return {
            time:0,
            days:null,
            hours:null,
            minutes:null,

        }
    },
    mounted(){
       this.setTimes();
    },
    methods:{
        changeNumber() {
            const time = this.realNumber(this.days) * 60 *24 + this.realNumber(this.hours) * 60 + this.realNumber(this.minutes);
            this.$emit("returnTime",this.propModel,time * 60);
        },
        realNumber(time){
            const reg = /^[1-9]+[0-9]*$/g;
            const t = reg.test(time) ? time : 0;
            return t;
        },
        setTimes(){
            let times = this.times;
            // console.log(times);
            if(isNaN(times) || times<=0){
                this.days = null;
                this.hours = null;
                this.minutes = null;
                return;
            }
            // 60 * 60 * 24 / 60 * 60 / 60
            times = Math.floor(times /60);
            this.days = Math.floor( times / (60 * 24));
            this.hours = Math.floor(( times - this.days * 60 *24) / 60);
            this.minutes = times % 60;
        }
    }

}
</script>

<style scoped lang='scss'>
    // .timeUtl{
    //     display: flex;
    //     span{
    //         padding: 0 5px;
    //     }
    // }

</style>