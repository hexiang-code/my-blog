<template>
    <div :class="instruction_content">
        <div :class="instruction_left" v-html="text">
            
        </div>
        <div :class="instruction_right">
            <div class="header">
                <div class="person-info">
                    <el-image class="person-image" :src="userInfo.personImage" fit="contain"></el-image>
                    
                    <div class="person-info-right">
                        <div class="person-name-top">
                            <p class="person-name"><b>{{userInfo.name}}</b></p>
                            <p>求职意向：{{userInfo.targetWork}}</p>
                        </div>
                        <div>
                            <p>生日：{{userInfo.birthday}}</p>
                            <p>住址：{{userInfo.adress}}</p>
                        </div>
                    </div>
                </div>
                <div class="email-phone">
                    <div class="logo-instruction">个人简历</div>
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
import { userInfo } from '../../config/selfInstruction'
export default {
    data() {
        return {
            userInfo: userInfo,
            instruction_content: '',
            instruction_left: '',
            instruction_right: ''
        }
    },

    mounted() {
        console.log(this.userInfo)
    },

    methods: {

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
            height: 500px;
            border: 1px solid #5f5f5f;
        }

        .instruction-right {
            width: 40%;
            color: #000;
            border: 1px solid #5f5f5f;

            .header {
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