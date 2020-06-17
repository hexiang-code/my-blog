<template>
    <div class="head-top-zone">
        <div class="nav-list">
            <div :class="['nav-item', selectedNav === index ? 'selected' : '']" v-for="(item,index) in firstNavConfig" :key="index" @click="clickNav(index, item.name)">{{item.title}}</div>
        </div>
    </div>
</template>
<script>
import firstNavConfig from '../../config/js/firstNavConfig'
export default {
    data(){
        return{
            firstNavConfig: firstNavConfig //一级导航配置
        }
    },

    computed: {
        selectedNav: {
            get() {
                return this.firstNavConfig.findIndex(item => this.$route.path.indexOf(item.name) > -1)
            },

            set (val) {
                return val
            }
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
    @import '../../config/css/_globalStyle.scss';
    .head-top-zone /deep/ {
        height: 80px;
        position: relative;
        top: 0;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        z-index: 10;
        box-shadow: 0 0 4px 0 rgba(0, 0, 0, .05);

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
