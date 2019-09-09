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
                            <p>生日：{{userInfo.birthday}}</p>
                            <p>住址：{{userInfo.adress}}</p>
                        </div>
                    </div>
                </div>
                <div :class="classNameArr.email_phone">
                    <div :class="classNameArr.logo_instruction">个人简历</div>
                    <div>
                        <p>电话：{{userInfo.phone}}</p>
                        <p>邮箱：{{userInfo.email}}</p>
                    </div>
                </div>
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
                logo_instruction: ''
            }
        }
    },
  
    mounted() {
        let loading = Loading.service({
            fullscreen: true,
            text: '准备中'
        })
        setTimeout(() => {
            loading.close()
            this.$confirm('准备就绪，请点击确定按钮开始', '简历准备好啦', {
                confirmButtonText: '确定',
                center: true
            }).then(()=>{
                this.getClassName();
                this.getStyleText();
            })
        }, 2000);
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
        height: 120px;
        justify-content: space-around;
    }

    .person-info {
        height: 120px;
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
    }

    .logo-instruction {
        color: #fff;
        font-size: 20px;
        background-color: #FF6600;
        text-align: center;
        padding: 5px 0;
        border-radius: 10px;
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
</style>