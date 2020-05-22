<template>
    <div class="bg-wall">
        <backgroundVideo :resource="soure" @videoAlready="videoAlready"></backgroundVideo>
        <load-animation :isShow.sync="isLoadAnimation"></load-animation>
        <div class="search-question">
            <div class="search-tabs">
                <div class="search-items" @click="selectTabs('baiduSearch')">
                    <img v-if="curSelectTabs == 'baiduSearch'" class="leimu-icon" :src="tabsSelectIcon" />
                    <div class="baidu-search">百度搜索</div>
                </div>
                <div class="search-items" @click="selectTabs('openUrl')">
                    <img v-if="curSelectTabs == 'openUrl'" class="leimu-icon" :src="tabsSelectIcon" />
                    <div class="baidu-search tabs-margin-left">打开网址</div>
                </div>
                
            </div>
            <form v-if="curSelectTabs == 'baiduSearch'" action="https://www.baidu.com/s" target="_blank" class="search-zone">
                <input type="image" alt="Submit" class="search-icon" @keyup.enter="submit" :src="(require('../../assets/iconfont/search-icon.png'))" >
                <input type="text" name="wd" class="search-input" autocomplete="off" />
            </form>
            <div class="search-zone" v-if="curSelectTabs == 'openUrl'" @keyup.enter="openNewTabs">
                <input type="text" name="wd" class="search-input go-new-tab" autocomplete="off" v-model="websideUrl" />
                <input @click="openNewTabs" type="image" class="next-icon" :src="(require('../../assets/iconfont/next.png'))" >
            </div>
        </div>
        <div class="icon-list">
            <img title="登录" v-if="isShowlogin" @click="isShowLoginWindow = true" class="icon-item" src="../../assets/iconfont/login.png" alt="">
            <img title="注册" v-if="isShowRegister"  @click="isShowRegisterWindow = true" class="icon-item" src="../../assets/iconfont/register.png" alt="">
            <img title="记事本" class="icon-item" @click="openNotepadList" src="../../assets/iconfont/txtEdit.png" alt="">
            <img title="书签" class="icon-item" @click="openBookmarkList" src="../../assets/iconfont/navigation.png" alt="">
        </div>
        
        <!-- 书签抽屉 -->
        <drawer title="厚积薄发" des="骐骥一跃不能十步，驽马十驾功在不舍。" :isShow.sync="isShowBookmarkList" :isShowModal="true">
            <div class="upload-file" v-if="bookmark && bookmark.length == 0">
                <div class="upload-file__virtual-btn bookmarks-header__search"> 上传 </div>
                <input class="upload-file__actual-btn" type="file" @change="selBookmarksFile" accept="html" ref="bookmarksFileInput"/>
            </div>
            <div class="bookmarks-header">
                <input class="bookmarks-header__input" type="text" placeholder="关键字查询" v-model="marksFilterVal">
                <div class="bookmarks-header__search" @click="filterMarks">
                    search
                    <svg class="bookmarks-header__search-icon" t="1589812672709" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10609" width="200" height="200"><path d="M908.488 821.348L783.7 696.56a401.635 401.635 0 0 1-41.665 48.894 403.103 403.103 0 0 1-35.653 31.68l123.159 123.159c10.855 10.854 25.117 16.282 39.376 16.283 14.262 0.002 28.518-5.427 39.376-16.283l0.188-0.188c10.524-10.524 16.316-24.508 16.316-39.382s-5.792-28.858-16.309-39.375z" fill="#2FBC3C" p-id="10610"></path><path d="M932.967 796.868L803.1 667.001a399.223 399.223 0 0 0 24.478-48.428c20.821-49.225 31.377-101.505 31.377-155.386S848.398 357.024 827.578 307.8c-20.106-47.537-48.887-90.226-85.542-126.881s-79.344-65.435-126.88-85.542C565.931 74.557 513.651 64 459.769 64S353.607 74.557 304.382 95.377c-47.537 20.107-90.226 48.887-126.881 85.542S112.066 260.263 91.96 307.8c-20.82 49.225-31.377 101.504-31.377 155.386S71.139 569.348 91.96 618.573c20.106 47.537 48.887 90.226 85.542 126.881s79.344 65.435 126.881 85.542c49.225 20.82 101.504 31.377 155.386 31.377s106.162-10.557 155.386-31.377a398.173 398.173 0 0 0 62.736-33.395l127.172 127.172c17.605 17.605 40.727 26.407 63.852 26.406 23.126-0.001 46.256-8.805 63.864-26.413l0.188-0.188c17.057-17.056 26.45-39.734 26.45-63.855 0-24.121-9.393-46.799-26.45-63.855z m-24.674 103.425c-10.857 10.857-25.114 16.285-39.376 16.283-14.258-0.001-28.521-5.429-39.376-16.283L706.383 777.134a403.405 403.405 0 0 0 35.653-31.68 401.649 401.649 0 0 0 41.665-48.894l124.787 124.788c10.518 10.518 16.31 24.501 16.31 39.375s-5.792 28.858-16.316 39.382l-0.189 0.188zM459.769 98.619c101.891 0 194.152 42.018 260.37 109.635-9.882-11.269-20.787-22.236-32.792-32.835 185.143 163.447 180.59 397.176 31.458 546.309-64.921 64.921-146.438 99.985-230.202 104.893a367.842 367.842 0 0 1-28.834 1.133c-201.023 0-364.567-163.544-364.567-364.567S258.746 98.619 459.769 98.619z" fill="" p-id="10611"></path><path d="M224.978 245.35c-98.897 103.804-146.487 307.567-35.566 454.728 147.889 153.727 380.29 106.897 493.595-1.051 103.641-98.742 174.303-311.826 51.99-472.601-163.445-166.451-403.394-92.991-510.019 18.924z m96.27 358.446c-36.341-36.341-56.355-84.659-56.355-136.054 0-51.394 20.014-99.713 56.355-136.054 36.341-36.342 84.659-56.356 136.054-56.356s99.713 20.014 136.054 56.356c36.341 36.341 56.355 84.659 56.355 136.054 0 51.395-20.014 99.713-56.355 136.054s-84.659 56.355-136.054 56.355-99.713-20.014-136.054-56.355z" fill="#8BF268" p-id="10612"></path><path d="M459.769 827.754c9.704 0 19.319-0.385 28.834-1.133-105.408 6.176-214.373-35.409-298.313-125.378 11.822 15.535 25.415 30.434 40.917 44.508-169.676-150.365-178.062-387.067-28.93-536.199C347.102 64.727 571.707 56.258 734.25 225.45a338.221 338.221 0 0 0-14.111-17.196C653.921 140.637 561.66 98.619 459.769 98.619c-201.023 0-364.567 163.544-364.567 364.567s163.544 364.568 364.567 364.568z" fill="#8BF268" p-id="10613"></path><path d="M649.711 467.742c0-51.394-20.014-99.713-56.355-136.054-36.341-36.342-84.659-56.356-136.054-56.356s-99.713 20.014-136.054 56.356c-36.341 36.341-56.355 84.659-56.355 136.054 0 51.395 20.014 99.713 56.355 136.054s84.659 56.355 136.054 56.355 99.713-20.014 136.054-56.355 56.355-84.66 56.355-136.054z m-192.409 157.79c-87.006 0-157.791-70.784-157.791-157.791S370.295 309.95 457.302 309.95s157.791 70.784 157.791 157.791-70.785 157.791-157.791 157.791z" fill="" p-id="10614"></path><path d="M189.412 700.078C78.491 552.917 126.081 349.154 224.978 245.35c106.625-111.915 346.574-185.374 510.019-18.924-0.248-0.326-0.498-0.651-0.747-0.976C571.707 56.258 347.102 64.727 202.277 209.552 53.145 358.684 61.531 595.386 231.207 745.75c-15.502-14.074-29.095-28.973-40.917-44.508a439.694 439.694 0 0 1-7.684-8.445 344.242 344.242 0 0 0 6.806 7.281z" fill="#FFFFFF" p-id="10615"></path><path d="M734.997 226.426c122.313 160.775 51.651 373.859-51.99 472.601-113.305 107.948-345.706 154.778-493.595 1.051a343.975 343.975 0 0 1-6.805-7.28 445.765 445.765 0 0 0 7.684 8.445c83.939 89.97 192.905 131.554 298.313 125.378 83.764-4.908 165.281-39.972 230.202-104.893 149.132-149.132 153.685-382.862-31.458-546.309 12.005 10.598 22.91 21.566 32.792 32.835a337.686 337.686 0 0 1 14.111 17.196l0.746 0.976z" fill="#2FBC3C" p-id="10616"></path></svg>
                </div>
            </div>
            <div class="bookmarks-body__content">
                <tree
                    :tree="{ 
                        title: '我的书签',
                        children: bookmark
                    }"
                    :isExpandAll="true"
                    :isShowCheckBox="isShowCheckBox"
                    @childNodeClick="openLink"
                    ref="bookmarks"
                >
                    <template #operation="treeItem">
                        <div class="marks-operation">
                            <span class="modify-btn" @click="modifyBookmarks(treeItem)">修改</span>
                            <span class="delete-btn" @dblclick="deleteMarks(treeItem)">删除</span>
                        </div>
                    </template>
                </tree>
            </div>
        </drawer>

        <!-- 记事本抽屉 -->
        <drawer
            title="记事本列表"
            :isShow.sync="isShowNotepadList">
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
        </drawer>
        
        <!-- 登录弹框 -->
        <windowUtils :isShowWindow.sync="isShowLoginWindow" title="登录" @confirm="login">
            <template>
                <div class="login-input">
                    <p class="login-label">ACCOUNT:</p>
                    <input v-model="userInfo.userAccount" type="text" placeholder="请输入账号" />
                </div>
                <div class="login-input">
                    <p class="login-label">PASSWORD:</p>
                    <input v-model="userInfo.userPassword" type="password" placeholder="请输入密码" />
                </div>
            </template>
        </windowUtils>

        <!-- 注册弹框 -->
        <windowUtils :isShowWindow.sync="isShowRegisterWindow" title="来啦？老弟" @confirm="register">
            <template>
                <div class="login-input">
                    <p class="login-label">NAME:</p>
                    <input v-model="registerUserInfo.userName" type="text" placeholder="请输用户名" />
                </div>
                <div class="login-input">
                    <p class="login-label">ACCOUNT:</p>
                    <input v-model="registerUserInfo.userAccount" type="text" placeholder="请输入账号" />
                </div>
                <div class="login-input">
                    <p class="login-label">PASSWORD:</p>
                    <input v-model="registerUserInfo.userPassword" type="password" placeholder="请输入密码" />
                </div>
                <div class="login-input">
                    <p class="login-label">COMFIRM PWD:</p>
                    <input v-model="registerUserInfo.userPasswordConfirm" type="password" placeholder="请确认密码" />
                </div>
            </template>
        </windowUtils>

        <window-utils :isShowWindow.sync="isShowBookmarksWindow" title="修改书签" @confirm="modifyConfirm">
            <window-utils-item label="书签" :label-icon="require('../../assets/status-icon/leimu-icon.png')">
                <input class="login-input__input" type="text" v-model="curSelBookmark.label" />
            </window-utils-item>
            <window-utils-item label="链接" :label-icon="require('../../assets/status-icon/leimu-icon.png')">
                <input class="login-input__input" type="text" v-model="curSelBookmark.href" />
            </window-utils-item>
        </window-utils>
    </div>
</template>

<script>
import request from '../../utils/http'
import cookieServe from '../../utils/cookie'
import { VueEditor } from "vue2-editor"
import tabsConfig from '../../config/start-page'
export default {
    data() {
        return {
            isLoadAnimation: true, // 是否加载开始动画
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
            isShowLoginWindow: false,  // 是否展示登录弹框
            isShowRegisterWindow: false,  // 是否展示注册弹框
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
            selFile: '', // 用户选择的文件
            tabsSelectIcon: tabsConfig.tabsSelectIcon, // 导航栏选择中状态的图标
            curSelectTabs: 'baiduSearch', // openUrl: 打开网址， baidusearch： 百度搜索
            websideUrl: '', // 要打开的导航地址
            isShowCheckBox: false, // 是否展示复选框
            marksFilterVal: '', // 书签过滤关键字
            isShowBookmarksWindow: false, // 是否展示书签弹框
            curSelBookmark: {}, // 当前选中的书签
        }
    },

    components: {
        'vue-editor': VueEditor
    },

    created () {

    },
    computed: {
        isShowlogin: {
            get () {
                let { userId } = this.$store.getters.getUserInfo
                if (userId) return false
                return true
            },

            set (value) {
                return value
            }
        },

        isVagueBg () {
            return false
        }
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
        // 视频加载完成回调
        videoAlready () {
            this.isLoadAnimation = false
        },
        // 初始化请求数据
        _initData () {
            this.getNotepadList()
            this.getBookmarksList()
        },

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
                this.$liveRem.showToast('我还不认识你呢，快去登录吧')
                this.isShowLoginWindow = true
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
                this.$liveRem.showToast('拿到记事本啦')
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
                this.$liveRem.showToast('记事本更新完成啦')
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
            let url = 'bookmarks/uploadBookmarks',
                data = new FormData(),
                method = 'POST'
            data.append('file', this.selFile)
            request({url, method, data}).then(res => {
                this.$liveRem.showToast('书签上传完成咯~')
            })
        },

        // 上传文件
        uploadBookmarks() {

        },

        // 打开书签链接链接
        openLink ({ href }) {
            window.open(href)
        },

        //请求书签内容
        getBookmarksList () {
            let url = 'bookmarks/getBookMarksContent'
            let method = 'GET'
            request({url, method}).then(res =>{
                this.bookmark = res.bookmarksData
                this.$liveRem.showToast('书签拿到啦, 快去学习吧')
            }).catch(e => {
                this.$liveRem.showToast('出问题了。。。快去看看请求吧')
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
                this.$liveRem.showToast('欢迎回家~')
                cookieServe.setCookie('token', res.token, 1)
                this.$store.commit('setUserInfo', res.userData)
                this.isShowLoginWindow = false
                this.isShowRegisterWindow = false
                this.isShowlogin = false
                // 登录成功后请求数据
                this._initData()
            }).catch(e => {
                this.$liveRem.showToast(e.msg)
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
                    this.$liveRem.showToast('欢迎加入我的大家庭！')
                    this.isShowRegisterWindow = false
                    cookieServe.setCookie('token', res.data.data.token, 1)
                }).catch(e => {
                    this.$liveRem.showToast("失败啦，稍后再试吧")
                })
            } else {
                this.$liveRem.showToast('两次输入密码不一致，请重新输入')
                this.registerUserInfo.userPassword = ''
                this.registerUserInfo.userPasswordConfirm = ''
            }
        },

        // 选择标签页事件
        selectTabs (val) {
            this.curSelectTabs = val
        },

        // 打开新的标签页
        openNewTabs () {
            window.open(this.websideUrl, '_blank')
        },

        // 过滤书签
        filterMarks () {
            this.$refs.bookmarks.filterNode(this.marksFilterVal)
        },

        // 删除书签
        deleteMarks (treeItem) {
            let url = 'bookmarks/deleteBookmarks'
            let method = "POST"
            let data = {
                bookmarksId: treeItem.id
            }
            request({url, method, data}).then(res => {
                this.$liveRem.showToast('又少了个书签呢~')
                this.getBookmarksList()
            })
        },

        modifyBookmarks (treeItem) {
            this.curSelBookmark = treeItem
            this.isShowBookmarksWindow = true
        },

        // 确认修改书签
        modifyConfirm () {
            let url = 'bookmarks/updateBookmarks',
                method = 'POST',
                data = {
                    bookmarksArray: [{
                        label: this.curSelBookmark.label,
                        pid: this.curSelBookmark.pid,
                        href: this.curSelBookmark.href,
                        id: this.curSelBookmark.id
                    }]
                }
            request({ url, method, data}).then(res => {
                this.$liveRem.showToast('修改好啦！')
                this.getBookmarksList()
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .el-drawer {
        overflow: auto !important;
    }
    .bg-wall {
        position: fixed;
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

    .search-question /deep/ {
        position: fixed;
        left: 200px;
        top: 100px;
        width: 360px;

        .search-tabs {
            display: flex;
            height: 40px;
            padding: 0 0 0 80px;

            .search-items {
                position: relative;

                .leimu-icon {
                    position: absolute;
                    width: 100px;
                    height: auto;
                    top:-60px;
                    left: 0;
                    z-index: 9;
                    animation: tabsIconAnimation 1s ease-out;
                }

                @keyframes tabsIconAnimation {
                    0% {
                        opacity: 0;
                    }

                    50% {
                        opacity: 0.5;
                    }
                    100% {
                        opacity: 1;
                    }
                }
                .baidu-search {
                    position: relative;
                    width: 100px;
                    line-height: 40px;
                    font-size: 18px;
                    font-weight: bold;
                    text-align: center;
                    color: #1296DB;
                    cursor: pointer;
                    font-family: monospace;
                    z-index: 10;
                }
            }


            .tabs-margin-left {
                margin-left: 5px;
            }
        }
    }
    .search-zone {
        display: flex;
        align-items: center;
    }

    .search-input {
        width: 300px;
        height: 100px;
        border-radius: 80px;
        border: 1px solid;
        opacity: 0.5;
        outline: none;
        text-align: center;
        padding: 0 0 0 80px;
        position: relative;
        z-index: 9;
        font-size: 20px;
    }

    .go-new-tab {
        padding: 0 80px 0 0;
    }

    .search-icon {
        width: 60px;
        height: 60px;
        position: absolute;
        left: 20px;
        z-index: 10;
    }

    .next-icon {
        width: 60px;
        height: 60px;
        position: absolute;
        right: 20px;
        z-index: 10;
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

    .bg-vague {
        filter: blur(10px) contrast(.8);
    }

    .login-input {
        display: flex;
        height: 60px;
        align-items: center;
    }

    .login-label {
        position: relative;
        display: inline-block;
        width: 140px;
        margin-right: 40px;
        text-align: right;
        font-weight: 700;
        color: #1296db;
    }

    .login-label::before {
        content: '';
        position: absolute;
        width: 30px;
        height: 30px;
        right: -30px;
        top: -5px;
        background-image: url('../../assets/status-icon/leimu-icon.png');
        background-size: 30px 30px;
    }

    .login-input__input {
        height: 30px;
        padding-left: 20px;
        border: 1px solid #1296db;
        color: #1296db;
        background-color: transparent;
    }

    .login-btn {
        width: 100%;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .login-btn button {
        position: relative;
        padding: 0;
        margin: 0;
        width: 100px;
        height: 40px;
        background-color: none;
        text-transform: uppercase;
        border: 4px solid #1296db;
        background-color: transparent;
        color: #ffffff;
        cursor: pointer;
    }
    
    .login-btn button:nth-child(1) {
        margin-right: 60px;
        color: #1296db;
    }

    .login-btn button::after, .login-btn button::before {
        content: '';
        position: absolute;
        width: 10px;
        height: 4px;
        background-color: #fff;
    }

    .login-btn button::after {
        top: 32px;
        right: 10px;
    }

    .login-btn button::before {
        top: -4px;
    }
    
    .login-btn button:hover::before {
        animation: translateBefore 1s forwards;
    }

    .login-btn button:hover::after {
        animation: translateAfter 1s forwards;
    }

    ::-webkit-input-placeholder { /* Chrome/Opera/Safari */ 
        color: #1296db;
    }

    ::-moz-placeholder { /* Firefox 19+ */  
        color: #1296db;
    }

    :-ms-input-placeholder { /* IE 10+ */ 
        color: #1296db;
    }

    :-moz-placeholder { /* Firefox 18- */ 
        color: #1296db;
    }

    .marks-operation {
        text-align: right;
        color: #1296db;
        font-size: 12px;
        margin-left: 20px;

        .delete-btn {
            cursor: pointer;
            margin-left: 10px;
        }

        .modify-btn {
            cursor: pointer;
        }
    }

    .bookmarks-header {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 50px;
    }

    .bookmarks-header__input {
        width: 200px;
        height: 30px;
        margin-right: 20px;
        border: 1px solid #1296db;
        font-size: 14px;
        text-align: center;
    }
    
    .bookmarks-header__search {
        position: relative;
        width: 100px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        /* border-radius: 15px; */
        /* background-color: #1296db; */
        color: #1296db;
    }

    .bookmarks-header__search-icon {
        width: 14px;
        height: 14px;
    }
    
    .bookmarks-body__content {
        padding-bottom: 100px;
    }

    .bookmarks-header__search:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        border: 2px solid #1296db;
        animation: search-animation 1.5s infinite linear;
    }

    .bookmarks-header__search:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        border: 2px solid #1296db;
        animation: search-animation 1s .5s linear infinite reverse;
    }

    .upload-file {
        position: relative;
        height: 40px;
    }

    .upload-file__virtual-btn {
        position: absolute;
        top: 0;
        right: 0;
        width: 100px;
        height: 40px;
        text-align: center;
        line-height: 40px;
    }

    .upload-file__actual-btn {
        position: absolute;
        top: 0;
        right: 0;
        width: 100px;
        height: 40px;
        opacity: 0;
    }

    @keyframes search-animation {
        0%, 100% {
            clip: rect(0, 60px, 22px, 0)
        }
        25% {
            clip: rect(0, 102px, 22px, 60px)
        }
        50% {
            clip: rect(20px, 102px, 40px, 60px)
        }
        75% {
            clip: rect(22px, 40px, 40px, 0)
        }
    }
</style>