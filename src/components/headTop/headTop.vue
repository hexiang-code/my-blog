<template>
    <div class="head-top-zone">
        <div class="nav-list">
            <div class="nav-item selected">首页</div>
        </div>
        
    </div>
</template>
<script>
export default {
    
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

        .nav-list {
            position: relative;
            left: 628px;
            
            .nav-item {
                border-radius: 20px;
                width: 100px;
                height: 40px;
                text-align: center;
                line-height: 40px;
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
