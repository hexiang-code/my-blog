<template>
    <div class="bg-wall">
        <div class="icon-list">
            <img class="icon-item" src="../../assets/iconfont/txtEdit.png" alt="">
            <img class="icon-item" src="../../assets/iconfont/navigation.png" alt="">
        </div>
        
    </div>
</template>

<script>
export default {
    
}
</script>

<style lang="scss" scoped>
    .bg-wall {
        width: 100%;
        height: 800px;
    }

    .icon-list {
        position: fixed;
        right: 0;
        top: 100px;
        width: 60px;
        text-align: center;
    }

    .icon-item {
        position: relative;
        margin-top: 30px;
        width: 40px;
        height: 40px;
        cursor: pointer;
    }

    .icon-item:hover {
        transform: scale(1.2);
    }

</style>