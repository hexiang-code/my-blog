<template>
    <div class="animation">
        <canvas id="canvas" class="animation-canvas"></canvas>
    </div>
</template>

<script>
export default {
    data() {
        return{

        }
    },

    created() {
        
    },

    mounted() {
        let canvas = document.getElementById("canvas");
        canvas.width = 1920;
        canvas.height = 1080;
        let starCtx = canvas.getContext('2d');

        //this.drawStars()
        // this.drawArc(starCtx, 300, 300, 120, 0, Math.PI * 2, false, "#dd5870");
        // this.drawArc(starCtx, 300, 300, 100, 0, Math.PI * 2, false, "#e0dedf");
        // this.drawArc(starCtx, 300, 300, 80, 0, Math.PI * 2, false, "#dd5870");
        // this.drawArc(starCtx, 300, 300, 60, 0, Math.PI * 2, false, "#2773d3");
        this.drawStars(starCtx, 20, 60, 300, 300, 0, "#fff"); // 五角星 
        
    
    },

    methods: {
        //初始化星星对象
        InitStarObj() {
            return starObj = {
                x: '',  //xzhou
                y: ''

            }
        },
        
        // /**
        //  * 画星星方法
        //  * @param {Number} x  x轴坐标
        //  * @param {Number} y  y轴坐标
        //  * @param {Number} starSize 星星尺寸
        //  * @param {String} starColor 星星颜色
        //   */
        // drawStar(x, y, starColor, starSize) {
        //     let canvas = document.getElementById("#canvas");
        //     let starCtx = canvas.getContext('2d');
        // },

        drawStars (starCtx, r, R, x, y, changeDeg, fillColor) {
         //绘制星星的路径,changeDeg：表示五角星旋转的角度
            starCtx.beginPath(); //开始路径  
            for (let i = 0; i < 5; i++) {
                starCtx.lineTo(Math.cos((18 + i * 72 - changeDeg) / 180 * Math.PI) * R + x, -Math.sin((18 + i * 72 - changeDeg) / 180 * Math.PI) * R + y)
                starCtx.lineTo(Math.cos((54 + i * 72 - changeDeg) / 180 * Math.PI) * r + x, -Math.sin((54 + i * 72 - changeDeg) / 180 * Math.PI) * r + y)
            }
            starCtx.closePath() //结束路径  
            starCtx.fillStyle = fillColor
            starCtx.fill()
        },

        drawArc(ctx, x, y, r, stratAngel, endAngel, flag, fillColor) {
            ctx.beginPath();
            ctx.arc(x, y, r, stratAngel, endAngel, flag);
            ctx.fillStyle = fillColor;
            ctx.fill();
            ctx.closePath();
        }
    }
}
</script>

<style lang="scss" scoped>
    .animation {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: -1;
        background-color: #000;
        opacity: 0.8;
    }

    // .animation-canvas {
    //     height: 100%;
    //     width: 100%;
    // }
</style>