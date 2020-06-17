<template>
    <div class="main-page">
        <div class="picture-zone">
            <el-carousel trigger="click" :autoplay="false">
                <el-carousel-item class="pic-item" v-for="(item,index) in pictureArr" :key="index">
                    <video class="my-video" controls="controls" preload="auto" v-if="item.type == 'video'" :src="item.src"></video>
                    <el-image class="image" v-if="item.type == 'image'" :src="item.src" fit="contain"></el-image>
                </el-carousel-item>
            </el-carousel>
        </div>

        <div class="my-photo-zone">
            <div class="photo-zone-title">
                <div class="en-title-text">
                    in my eyes
                    <p class="line"></p>
                </div>
                <p class="title-text">我眼里的</p>
            </div>
            <div class="photo-list">
                <div class="photo-item" v-for="(item,index) in photoList" :key="index">
                    <el-image :class="item.arrangement == 'X' ? 'x-photo-item' : 'y-photo-item'" :src="item.src" fit="contain"></el-image>
                    <p class="photo-direction">{{item.photoDirection}}</p>
                </div>
            </div>
        </div>
        <!-- <photoUtils :photoList="photoList"></photoUtils> -->
    </div>



</template>
<script>
import {pictureArr, photoList}  from '../../config/js/mainPagePicture';
import PhotoUtils  from '../utils/photo-utils/photo-utils';
export default {
    data() {
        return {
            pictureArr: pictureArr,  //轮播数组
            photoList: photoList,  //照片数组
        }
    },
    components: {
        photoUtils: PhotoUtils
    }
}
</script>
<style lang="scss" scoped>
    .main-page /deep/ {
        width: 80%;
        margin: 120px auto 0 auto;
        position: relative;
        z-index: 100;

        .picture-zone {
            width: 100%;
            height: 800px;
            text-align: center;

            .el-carousel__container {
                height: 800px;
            }

            .image {
                display: block;
                height: 800px;
                width: 100%;
            }

            .my-video {
                width: 100%;
                height: 800px;
            }
        }

        .my-photo-zone {
            margin-top: 60px;
            .photo-zone-title {
                margin: 0 auto;
                display: flex;
                justify-content: center;
                flex-direction: column;
                align-items: center;

                .en-title-text {
                    width: 128px;
                    font-size: 14px;
                    color: #a0a0a0;

                    .line {
                        margin-top: 20px;
                        height: 1px;
                        width: 60px;
                        background: #ffc908;
                    }
                }

                .title-text {
                    margin-top: 20px;
                    font-weight: bold;
                    font-size: 32px;
                }
            }

            .photo-list {
                display: flex;
                justify-content: center;
                align-items: center;
                flex-wrap: wrap;
                position: relative;
                z-index: 9;
                
                .photo-item {
                    width: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    .photo-direction {
                        widows: 30%;
                        color: #BBA9A9;
                    }
                }

                
                .x-photo-item {
                    height: 150px;
                    width: 300px;
                }

                .y-photo-item {
                    width: 150px;
                    height: 300px;
                }
            }

            @keyframes circling {
                from{
                    transform: rotate(0deg);
                }
                to{
                    transform: rotate(360deg)
                }
            }
        }
    }
</style>
