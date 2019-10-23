<template>
    <div class="foot-zone">
        <div class="foot-left">
            <p class="font-left">天高鸟嗷嗷飞</p>
            <p class="font-right">水深鱼哗哗游</p>
        </div>
        <div class="foot-right">
            <div class="bottom-nav">
                <div class="bottom-nav-item" v-for="(item,index) in bottomNavArr" :key="index">{{item.title}}</div>
            </div>
            <div class="person-info">
                <p>
                    <span>QQ: 309871923</span>
                    <span>电话: 18715057130</span>
                </p>
                <p>
                    <span>地址: 安徽合肥</span>
                    <span>邮箱: hxlyy18715057130@163.com</span>
                </p>
 
            </div>
        </div>
    </div>
</template>
<script>
import bottomNavArr from '../../config/firstNavConfig';

export default {
   data() {
       return {
           bottomNavArr: bottomNavArr
       }
   } 
}
</script>
<style lang="scss" scoped>
    .foot-zone {
        width: 100%;
        height: 200px;
        background: #333333;
        display: flex;
        align-items: center;
        justify-content: space-around;

        .foot-left {
            .font-left {
                font-size: 30px;
                margin: 0;
            }

            .font-right {
                margin: 0;
                font-size: 20px;
                color: #ffc908;
                margin-left: 100px;
            }
        }

        .foot-right {
            .bottom-nav {
                width: 300px;
                display: flex;
                justify-content: space-between;
                .bottom-nav-item {
                    color: #ffffff;
                    font-size: 13px;
                }
            }

            .person-info {
                color: #ffffff;
                display: flex;
                align-content: space-between;
                width: 500px;
                height: 70px;
                margin-top: 20px;
                
                p{
                    display: flex;
                    flex-wrap: wrap;
                }
            }
        }

    }
</style>
