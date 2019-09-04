<template>
    <div :class="instruction_content">
        <div :class="instruction_left" v-html="styleText">
            
        </div>
        <div :class="instruction_right">
            <div :class="header_instruction">
                <div :class="person_info">
                    <el-image :class="person_image" :src="userInfo.personImage" fit="contain"></el-image>
                    
                    <div :class="person_info_right">
                        <div :class="person_name_top">
                            <p :class="person_name"><b>{{userInfo.name}}</b></p>
                            <p>求职意向：{{userInfo.targetWork}}</p>
                        </div>
                        <div>
                            <p>生日：{{userInfo.birthday}}</p>
                            <p>住址：{{userInfo.adress}}</p>
                        </div>
                    </div>
                </div>
                <div :class="email_phone">
                    <div :class="logo_instruction">个人简历</div>
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
export default {
    data() {
        return {
            userInfo: userInfo,
            styleText: '',
            instruction_content: '',
            instruction_left: '',
            instruction_right: '',
            header_instruction: '',
            person_info: '',
            person_image: '',
            person_info_right: '',
            person_name_top: '',
            person_name: '',
            email_phone: '',
            logo_instruction: ''
        }
    },
  
    mounted() {
        setTimeout(() => {
            this.getClassName();
            this.getStyleText();
        }, 2000);
    },

    methods: {
        getClassName() {
            let classNameArr = Object.keys(this.$data);
            let times = 2;
            let timeInterVal = setInterval(()=>{
                if(times > classNameArr.length - 2) {
                    clearInterval(timeInterVal)
                }
                let res = classNameArr[times].replace(/_/g, '-')
                this.$data[classNameArr[times]] = res;
                times ++
            }, 200)
        },

        getStyleText() {
        //    let str = styleStr.replace(/{|;|}/g, '<br>')
           let str = styleStr.replace(/{/g, '{<br>').replace(/;/g, ';<br>').replace(/}/g, '}<br>')
           let times = 0;
           let length = 10;
           let timeInterVal = setInterval(()=>{
               if(times > parseInt(str.length / 10)) {
                   clearInterval(timeInterVal)
               }
               this.styleText = this.styleText + str.slice(times*length, times*length+ length)
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

        .instruction-left {
            width: 40%;
            border: 1px solid #5f5f5f;
        }

        .instruction-right {
            width: 40%;
            color: #000;
            border: 1px solid #5f5f5f;

            .header-instruction {
                padding: 20px;
                display: flex;
                height: 120px;

                .person-info {
                    height: 120px;
                    display: flex;

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

                        .person-name-top {
                            height: 120px;
                            .person-name {
                                font-size: 26px;
                            }
                        }


                    }
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
      
            }
        }
    }
</style>