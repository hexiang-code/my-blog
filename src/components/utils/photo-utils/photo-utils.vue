<template>
<div class="main">
        <div class="mask"></div>
        <div class="photo">
            <el-image :src="photoList[0].src" fit="contain"></el-image>
        </div>

</div>


</template>

<script>
export default {
    name: 'photoUtils',
    props:{
        photoList: null,  //相片数组
        curPhoto: ''   //当前照片
    },

    created() {
        console.log(this.photoList)
    }
}
</script>

<style lang="scss" scoped>
.main {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
}
    .mask {
        position: fixed;
        width: 100%;
        top: 0;
        left: 0;
        height: 100%;
        z-index: 11;
        background-color: #000000;
        background-image: url('../../../assets/photo-border.png');
        opacity: 0.6;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 60% 60%;
    }

    .photo {
        position: fixed;
        z-index: 12;
        //background-image: url('../../../assets/photo-border.png');
        // width: 600px;
        // height: 600px;
        // left: 0;
        // right: 0;
        // margin: auto;
    }


</style>