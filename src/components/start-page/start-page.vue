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
            <img title="记事本" class="icon-item" @click="openNotepadList" src="../../assets/iconfont/txtEdit.png" alt="">
            <img title="书签" class="icon-item" @click="openBookmarkList" src="../../assets/iconfont/navigation.png" alt="">
        </div>
        
        <!-- 书签抽屉 -->
        <el-drawer
            title="书签列表"
            :visible.sync="isShowBookmarkList"
            size="20%"
            :close-on-press-escape="true">
            <div class="drawe-padding">
                <el-input
                    placeholder="找一找"
                    v-model="filterText"
                    class="bookmark-filter">
                </el-input>
                <input type="file" @change="selBookmarksFile" accept="html" ref="bookmarksFileInput"/>
                <el-button @click="uploadBookmarks">提交</el-button>
                <el-tree class="bookmarks-content" :data="bookmark" 
                    :props="defaultProps" 
                    @node-click="clickBookmark" 
                    :highlight-current="true" 
                    :accordion="true"
                    :filter-node-method="filterNode"
                    ref="bookmarks">
                </el-tree>
            </div>
        </el-drawer>

        <!-- 记事本抽屉 -->
        <el-drawer
            title="记事本列表"
            :visible.sync="isShowNotepadList"
            :close-on-press-escape="true"
            size="40%">
            <div class="drawe-padding">
                <el-input
                    placeholder="找一找"
                    v-model="notepadFilterText"
                    class="bookmark-filter">
                </el-input>
                <el-tree class="bookmarks-content" :data="notepadList" 
                    :props="notepadProps" 
                    @node-click="clickNotepadList" 
                    :highlight-current="true" 
                    :accordion="true"
                    :filter-node-method="filterNode"
                    ref="notepadList"
                    size="30%">
                </el-tree>
                <el-drawer
                    :title="curNotepad.name"
                    :append-to-body="true"
                    :visible.sync="isShowNotepadContent"
                    :close-on-press-escape="true">
                        <div class="drawe-padding">
                            <vue-editor v-model="curNotepad.content"></vue-editor>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="notepadWindow = false">取消</el-button>
                                <el-button type="primary" @click="updateNotepadContent">修改</el-button>
                            </div>
                        </div>
                </el-drawer>
            </div>
        </el-drawer>
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
                    <el-button @click="loginWindow = false">取消</el-button>
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
                    <el-button @click="registerWindow = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import BackgroundVideo from '../utils/background-video'
import request from '../../utils/http'
import cookieServe from '../../utils/cookie'
import { VueEditor } from "vue2-editor";
export default {
    data() {
        return {
            bookmark: [],  // 书签
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            notepadProps: {
                label: 'name',
                children: 'children',
            },
            filterText: '', // 书签搜索关键字
            notepadFilterText: '', // 记事本搜索关键字
            soure: require('../../assets/start-background-video.mp4'),  //动态壁纸资源
            test: '百度一下',
            // isShowlogin: true,  // 是否展示登录按钮
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
            notepadList: [], // 记事本列表
            notepadWindow: false, // 记事本弹框开关
            curNotepad: {
                content: '',
                id: '',
                name: ''
            }, // 当前记事本内容
            isShowBookmarkList: false, // 是否展示书签列表
            isShowNotepadList: false,  // 是否展示记事本列表
            isShowNotepadContent: false, // 是否展示记事本内容
            selFile: '' // 用户选择的文件
        }
    },

    components: {
        'background-video': BackgroundVideo,
        'vue-editor': VueEditor
    },

    created () {

    },

    computed: {
        'isShowlogin': function() {
            return Boolean(Object.keys(this.$store.getters.getUserInfo))
        }
    }, 

    mounted () {
        // // 如果用户登录则请求书签和记事本列表
        // if (this.$store.getters.getUserInfo.userId) {
        //     // 请求书签列表
        //     this.getBookmarksList()
        //     // 请求记事本列表
        //     this.getNotepadList()
        // }
    },

   watch: {
      filterText (val) {
        this.$refs.bookmarks.filter(val);
      },
      notepadFilterText (val) {
          this.$refs.notepadList.filter(val)
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
        
        // 请求记事本列表
        getNotepadList() {
            let userInfo = this.$store.getters.getUserInfo
            if (!userInfo) {
                this.$message.info('请登录')
                this.loginWindow = true
                return
            }
            let url = 'notepad/getNotepadCatalog'
            let method = 'GET'
            request({url, method, params: { userId: userInfo.userId }}).then(res => {
                this.notepadList = res
            })
        },

        // 点击记事本文件
        clickNotepadList (e) {
            this.isShowNotepadContent = true
            this.getNotepadContent(e.id)
        },
        
        /**
         * 请求记事本内容
         * @param {Number} notepadId 记事本id
         */
        getNotepadContent (notepadId) {
            let method = 'GET'
            let url = 'notepad/getNotepadContent'
            let params = {
                userId: this.$store.getters.getUserInfo.userId,
                id: notepadId,
            }
            request({url, method, params}).then(res => {
                this.curNotepad = res
            })
        },

        // 更新记事本内容
        updateNotepadContent () {
            let method = 'POST'
            let url = 'notepad/updateNotepadContent'
            let data = {
                userId: this.$store.getters.userInfo.userId,
                id: this.curNotepad.id,
                content: this.curNotepad.content,
                name: this.curNotepad.id
            }
            request({url, method, data}).then(res => {
                console.log(res)
            })
        }, 

        // 展示记事本列表回调函数
        openNotepadList() {
            this.isShowNotepadList = true
            this.getNotepadList()
        },
        
        // 展示书签内容的回调函数
        openBookmarkList() {
            this.isShowBookmarkList = true
            this.getBookmarksList()
        },

        // 用户选择书签文件
        selBookmarksFile () {
            let userInfo = this.$store.getters.getUserInfo
            this.selFile = this.$refs.bookmarksFileInput.files[0]
            console.log(this.selFile)
            let url = 'bookmarks/uploadBookmarks',
                data = new FormData(),
                method = 'POST'
            data.append('file', this.selFile)
            // data.append('userId', userInfo.userId)
            data.append('userId', 1)
            request({url, method, data}).then(res => {
                console.log(res)
            })
        },

        // 上传文件
        uploadBookmarks() {

        },

        //请求书签内容
        getBookmarksList () {
            let url = 'bookmarks/getBookMarksContent'
            let method = 'GET'
            request({url, method}).then(res =>{
                let value = res
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
                this.$message.success('登录成功')
                cookieServe.setCookie('token', res.token, 1)
                this.$store.commit('setUserInfo', res.userData)
                this.loginWindow = false
                this.registerWindow = false
            }).catch(e => {
                this.$message.error(e.msg)
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
                    this.$message.success('创建用户成功')
                    this.registerWindow = false
                    cookieServe.setCookie('token', res.data.data.token, 1)
                }).catch(e => {
                    this.$message.error(e.msg)
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
    .el-drawer {
        overflow: auto !important;
    }
    .bg-wall {
        position: relative;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        overflow: hidden;
    }

    .drawe-padding {
        padding: 20px;
        overflow: auto;
        height: 100%;
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
        top: 20%;
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
        max-height: 600px;
        overflow: auto;
    }

    .user-input {
        width: 334px;
    }

    .user-input .el-input__inner {
        widows: 334px;
    }
</style>