<template>
    <div class="head-top-zone">
        <div class="nav-list">
            <div :class="['nav-item', selectedNav === index ? 'selected' : '']" v-for="(item,index) in firstNavConfig" :key="index" @click="clickNav(index, item.name)">{{item.title}}</div>
        </div>
    </div>
</template>
<script>
import firstNavConfig from '../../config/firstNavConfig'
export default {
    data(){
        return{
            firstNavConfig: firstNavConfig //一级导航配置
        }
    },

    computed: {
        selectedNav () {
            return this.firstNavConfig.findIndex(item => item.name == this.$route.name)
        }
    },

    created() {

    },

    methods:{
        clickNav(index, name) {
            this.selectedNav = index;
            this.$router.push({name})
        }
    }
}
</script>
<style lang='scss' scoped>
    @import '../../config/_globalStyle.scss';
    .head-top-zone /deep/ {
        height: 120px;
        position: relative;
        top: 0;
        width: 100%;
        line-height: 120px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        z-index: 10;

        .nav-list {
            position: relative;
            right: 20%;
            display: flex;
            
            .nav-item {
                border-radius: 20px;
                width: 100px;
                height: 40px;
                text-align: center;
                line-height: 40px;
                margin-left: 20px;
                cursor: pointer;
            }

            .nav-item:first-child {
                margin-left: 0;
            }
            
            .nav-item:hover {
                background: $leimu-color;
                color: #ffffff;
            }
        }


        .selected {
            background: $leimu-color;
            color: #ffffff;
        }
    }
</style>
