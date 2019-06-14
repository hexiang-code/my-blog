<template>
    <div class="head-top-zone">
        <div class="nav-list">
            <div :class="['nav-item', selectedNav === index ? 'selected' : '']" v-for="(item,index) in firstNavConfig" :key="index" @click="clickNav(index)">{{item.title}}</div>
        </div>
    </div>
</template>
<script>
import firstNavConfig from '../../config/firstNavConfig'
export default {
    data(){
        return{
            firstNavConfig: firstNavConfig,  //一级导航配置
            selectedNav: 0,  //选中的一级导航
        }
    },

    created() {

    },
    methods:{
        clickNav(index) {
            this.selectedNav = index;
        }
    }
}
</script>
<style lang='scss' scoped>
    .head-top-zone /deep/ {
        height: 120px;
        position: fixed;
        top: 0;
        width: 100%;
        line-height: 120px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        z-index: 1000;

        .nav-list {
            position: relative;
            right: 628px;
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
                background: #ffc001;
                color: #ffffff;
            }
        }


        .selected {
            background: #ffc001;
            color: #ffffff;
        }
    }
</style>
