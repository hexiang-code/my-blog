<template>
    <div class="instruction-content show">
        <div class="instruction-left" v-html="styleText">
            
        </div>
        <div class="instruction-right show">
            <div :class="classNameArr.header_instruction">
                <div :class="classNameArr.person_info">
                    <el-image :class="classNameArr.person_image" :src="userInfo.personImage" fit="contain"></el-image>
                    
                    <div :class="classNameArr.person_info_right">
                        <div :class="classNameArr.person_name_top">
                            <p :class="classNameArr.person_name"><b>{{userInfo.name}}</b></p>
                            <p>求职意向：{{userInfo.targetWork}}</p>
                        </div>
                        <div>
                            <p><i :class="classNameArr.icon_image"><img src="../../assets/person-image.png"/></i>生日：{{userInfo.birthday}}</p>
                            <p><i :class="classNameArr.icon_image"><img src="../../assets/adress.png"/></i>住址：{{userInfo.adress}}</p>
                        </div>
                    </div>
                </div>
                <div :class="classNameArr.email_phone">
                    <div :class="classNameArr.logo_instruction">
                        <div class="left-item"></div>
                        <div class="instruction-text"><b>个人简历</b></div>
                        <div class="right-item"></div>
                    </div>
                    <div>
                        <p><i :class="classNameArr.icon_image"><img src="../../assets/phone-image.png"/></i>电话：{{userInfo.phone}}</p>
                        <p><i :class="classNameArr.icon_image"><img src="../../assets/email-image.png"/></i>邮箱：{{userInfo.email}}</p>
                    </div>
                </div>
            </div>

            <div class="line-row"></div>

            <div class="evaluate-background">

            </div>
        </div>
    </div>
</template>

<script>
import { userInfo, styleStr } from '../../config/selfInstruction'
import { Loading } from 'element-ui'
export default {
    data() {
        return {
            userInfo: userInfo,
            styleText: '',
            classNameArr: {
                header_instruction: '',
                person_info: '',
                person_image: '',
                person_info_right: '',
                person_name_top: '',
                person_name: '',
                email_phone: '',
                logo_instruction: '',
                icon_image: ''
            }
        }
    },
  
    mounted() {
        // let loading = Loading.service({
        //     fullscreen: true,
        //     text: '准备中'
        // })
        // setTimeout(() => {
        //     loading.close()
        //     this.$confirm('准备就绪，请点击确定按钮开始', '简历准备好啦', {
        //         confirmButtonText: '确定',
        //         center: true
        //     }).then(()=>{
        //         this.getClassName();
        //         this.getStyleText();
        //     })
        // }, 2000);
    },

    methods: {
        //每隔400ms修改一个dom元素的类名值，
        getClassName() {
            let classNameArr = Object.keys(this.classNameArr);
            let times = 0;
            let timeInterVal = setInterval(()=>{
                if(times == classNameArr.length - 1) {
                    clearInterval(timeInterVal)
                }
                let res = classNameArr[times].replace(/_/g, '-')
                this.classNameArr[classNameArr[times]] = res;
                times ++
            }, 400)
        },

        //获取页面需要渲染的样式内容，将'{', '}', ';'替换成'<br>'已达到换行的效果
        getStyleText() {
        //    let str = styleStr.replace(/{|;|}/g, '<br>')
            //挨个替换（）
            let str = styleStr.replace(/{/g, '{<br>').replace(/;/g, ';<br>').replace(/}/g, '}<br>')
            let times = 0;
            let length = 10;
            let timeInterVal = setInterval(()=>{
                if(times > parseInt(str.length / 10)) {
                    clearInterval(timeInterVal)
                }
                this.styleText = this.styleText + str.slice(times*length, times*length + length)
                times ++
            }, 30) 
        }
    }
}
</script>

<style lang="scss" scoped>
    .instruction-content {
        width: 80%;
        display: flex;
        margin: 0 auto;
        justify-content: space-around;
        font-size: 14px;
    }

    .instruction-left {
        width: 40%;
        border: 1px solid #5f5f5f;
    }

    .instruction-right {
        width: 40%;
        color: #000;
        border: 1px solid #5f5f5f;
    }

    .header-instruction {
        padding: 20px;
        display: flex;
        justify-content: space-around;
    }

    .person-info {
        height: 140px;
        display: flex;
    }

    .person-image {
        width: 60px;
        height: 120px;
        border: 1px solid #f5f5f5;
    }

    .person-info-right {
        padding: 0 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .person-info-right p {
        line-height: 30px;
    }

    
    .person-name-top {
        height: 120px;
    }

    .person-name {
        font-size: 26px;
    }

    .email-phone {
        padding-left:  20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 140px;
    }

    .email-phone p {
        line-height: 30px;
    }

    .logo-instruction {
        display: flex;
    }

    .instruction-text {
        padding: 5px 0;
        width: 150px;
        background: rgb(217, 150, 147);
        color: #fff;
        font-size: 20px;
        text-align: center;
    }

    .logo-instruction .left-item {
        background: rgb(217, 150, 147);
        width: 10px;
        height: 40px;
        margin-right: 3px;
    }

    
    .logo-instruction .right-item {
        background: rgb(217, 150, 147);
        width: 10px;
        height: 40px;
        margin-left: 3px;
    }


    @keyframes showAnimation {
        from {
            opacity: 0;
        } to {
            opacity: 1;
        }
    }

    .show {
        animation: showAnimation 2s linear;
    }

    .icon-image {
        margin-right: 10px;
    }

    .line-row {
        height: 4px;
        width: 100%;
        background-color: rgb(118, 113, 113)
    }

    .evaluate-background {
        padding: 20px;
    }
</style>