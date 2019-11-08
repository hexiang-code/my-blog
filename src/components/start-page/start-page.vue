<template>
    <div class="bg-wall">
        <background-video :resource="soure"></background-video>
        <form action="https://www.baidu.com/s" target="_blank" class="search-zone">
            <input type="image" alt="Submit" class="search-icon" @keyup.enter="submit" :src="(require('../../assets/iconfont/search-icon.png'))" >
            <input type="text" name="wd" class="search-input" autocomplete="off" />
		</form>
        <div class="icon-list">
            <img title="登录" v-if="isShowlogin" @click="loginWindow = true" class="icon-item" src="../../assets/iconfont/login.png" alt="">
            <img title="注册" v-if="isShowRegister"  @click="registerWindow = true" class="icon-item" src="../../assets/iconfont/register.png" alt="">
            <img title="记事本" class="icon-item" src="../../assets/iconfont/txtEdit.png" alt="">
            <el-popover placement="left" title="书签" width="500" trigger="click">
                <el-input
                    placeholder="输入关键字进行过滤"
                    v-model="filterText"
                    class="bookmark-filter">
                </el-input>
                <el-tree class="bookmarks-content" :data="bookmark" 
                    :props="defaultProps" 
                    @node-click="clickBookmark" 
                    :highlight-current="true" 
                    :accordion="true"
                    :filter-node-method="filterNode"
                    ref="bookmarks">
                    </el-tree>
                <img title="书签" class="icon-item" slot="reference" src="../../assets/iconfont/navigation.png" alt="">
            </el-popover>
        </div>

        <!-- 登录弹框 -->
        <el-dialog :visible.sync="loginWindow" title="登录" width="500px">
            <el-form label-width="80px">
                <el-form-item label="账号">
                    <el-input type="text" v-model="userInfo.userAccount" autocomplete class="user-input" />
                </el-form-item>
                <el-form-item label="密码">
                    <el-input type="password" v-model="userInfo.userPassword" class="user-input" autocomplete="off" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button @click="loginWindow= false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 注册弹框 -->
        <el-dialog :visible.sync="registerWindow" width="500px">
            <el-form label-width="80px">
                <el-form-item label="用户名">
                    <el-input type="text" v-model="registerUserInfo.userName" autocomplete class="user-input" />
                </el-form-item>
                <el-form-item label="账号">
                    <el-input type="text" v-model="registerUserInfo.userAccount" autocomplete class="user-input" />
                </el-form-item>
                <el-form-item label="密码">
                    <el-input type="password" v-model="registerUserInfo.userPassword" class="user-input" autocomplete="off" />
                </el-form-item>
                <el-form-item label="确认密码">
                    <el-input type="password" v-model="registerUserInfo.userPasswordConfirm" class="user-input" autocomplete="off" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="register">注册</el-button>
                    <el-button @click="loginWindow= false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import BackgroundVideo from '../utils/background-video'
import request from '../../utils/http'
import cookieServe from '../../utils/cookie'
const bookmark = [
    {
        label: '娱乐',
        children: [
            {
                label: 'bilibili',
                href: 'https://www.bilibili.com'
            }
        ]
    },
    {
        label: '工作',
        children: [
            {
                label: '百度',
                href: 'https://wwww.baidu.com'
            }
            
        ]
    }
]
export default {
    data() {
        return {
            bookmark: bookmark,  // 书签
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            filterText: '', //过滤关键字
            soure: require('../../assets/start-background-video.mp4'),  //动态壁纸资源
            test: '百度一下',
            isShowlogin: true,  // 是否展示登录按钮
            isShowRegister: true,  // 是否展示注册按钮
            loginWindow: false,  // 是否展示登录弹框
            registerWindow: false,  // 是否展示注册弹框
            userInfo: {
                userAccount: '',  // 账号
                userPassword: '',  // 密码
            },
            registerUserInfo: {
                userAccount: '',  // 用户账户
                userPassword: '',  // 用户密码
                userPasswordConfirm: '',  // 用户确认密码
                userName: ''  //用户名
            },
        }
    },

    components: {
        'background-video': BackgroundVideo
    },

    created () {
        //请求书签内容
        this.getBookmarksData()
    },

   watch: {
      filterText(val) {
        this.$refs.bookmarks.filter(val);
      }
    },

    methods: {
        //点击书签
        clickBookmark(e) {
            if (e.href) {
                window.open(e.href, '_blank')
            }
        },

        filterNode(value, data) {
            if (!value) return true
            return data.label.indexOf(value) !== -1
        },

        //请求书签内容
        getBookmarksData () {
            let url = 'bookmarks/getBookMarksContent'
            let method = 'GET'
            request({url, method: 'GET'}).then(res =>{
                let value = res.data.data
                this.bookmark = value.bookmarksData.children
            })
        },

        // 登录
        login () {
            let url = "user/login"
            let method = "POST"
            let  data = {
                userAccount: this.userInfo.userAccount,
                userPassword: this.userInfo.userPassword
            }
            request({url, method, data}).then( res => {
                console.log(res)
                if (!res.data.status) {
                    this.$message.error(res.data.msg)
                } else {
                    this.$message.success('登录成功')
                    cookieServe.setCookie('token', res.data.data.token, 1)
                     this.loginWindow = false
                     this.isShowlogin = false
                     this.isShowRegister = false
                }
            })
        },

        // 注册密码
        register () {
            let { userName, userAccount, userPassword, userPasswordConfirm } = this.registerUserInfo
            // 如果两次输入密码一致
            if (userPassword == userPasswordConfirm) {
                let url = 'user/register'
                let method = 'POST'
                let data = { userName, userAccount, userPassword }
                request({url, method, data}).then(res => {
                    if (!res.data.status) {
                        this.$message.error(res.data.msg)
                    } else {
                        this.$message.success('创建用户成功')
                        this.registerWindow = false
                        cookieServe.setCookie('token', res.data.data.token, 1)
                    }
                })
            } else {
                this.$message.error('两次输入密码不一致，请重新输入')
                this.registerUserInfo.userPassword = ''
                this.registerUserInfo.userPasswordConfirm = ''
            }

        }
    }
}
</script>

<style lang="scss" scoped>
    .bg-wall {
        position: relative;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        overflow: hidden;
    }

    .search-zone {
        width: 360px;
        height: 100px;
        position: fixed;
        display: flex;
        align-items: center;
        left: 10%;
        top: 8%;
    }

    .search-input {
        width: 300px;
        height: 100px;
        border-radius: 80px;
        border: 1px solid;
        opacity: 0.5;
        outline: none;
        text-align: center;
        padding: 0 80px;
        position: relative;
        z-index: 9;
        font-size: 20px;
    }

    .search-icon {
        width: 60px;
        height: 60px;
        position: absolute;
        left: 20px;
        z-index: 10;;
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

    .bookmark-filter {
        width: 200px;
        margin-bottom: 20px;
    }

    .bookmark-filter .el-input__inner {
        height: 30px;
        line-height: 30px;
        width: 100px;
    }

    .bookmarks-content {
        width: 480px;
        height: 600px;
        overflow: auto;
    }

    .user-input {
        width: 334px;
    }

    .user-input .el-input__inner {
        widows: 334px;
    }
</style>