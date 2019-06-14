<template>
    <div class="main-page">
        <div class="picture-zone">
            <el-carousel>
                <el-carousel-item class="pic-item" v-for="(item,index) in pictureArr" :key="index">
                    <el-image :src="item.src" fit="contain"></el-image>
                </el-carousel-item>
            </el-carousel>
        </div>
    </div>
</template>
<script>
import pictureArr from '../../config/mainPagePicture';
export default {
    data() {
        return {
            pictureArr: pictureArr,  //轮播数组
        }
    }
}
</script>
<style lang="scss" scoped>
    .main-page /deep/ {
        width: 100%;;
        margin: 120px auto 0 auto;
        position: relative;
        z-index: 100;
        .picture-zone {
            width: 100%;
            height: 800px;

            .el-carousel__container {
                height: 800px;
            }
        }
    }
</style>
