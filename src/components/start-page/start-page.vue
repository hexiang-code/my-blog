<template>
  <div class="bg-wall">
    <backgroundVideo :resource="bgVideo" :poster="startPagePoster" @posterLoaded="videoAlready"></backgroundVideo>
    <load-animation :isShow.sync="isLoadAnimation" v-if="bgVideo"></load-animation>
    <div class="search-question">
      <div class="search-tabs">
        <div class="search-items" v-for="item in navgation" :key="item.name" @click="selectTabs(item)">
            <div :class="{ 'selected' : item.type == curNav.type}">{{item.name}}</div>
        </div>
      </div>
      <!-- 哔哩哔哩搜索 -->
      <!-- https://search.bilibili.com/all?keyword=asmr&from_source=nav_search_new -->
      <form
        :action="curNav.action"
        target="_blank"
        class="search-zone"
        ref="searchForm"
      >
        <i class="iconfont start-page-icon search-icon" @keyup.enter="submit">&#xe6e6;</i>
        <input
          type="text"
          placeholder="你想要的，这里都有"
          :name="curNav.formName"
          class="search-input"
          autocomplete="off"
          v-model="searchText"
          @blur="suggestList = []"
          @focus="getSearchSuggestList(searchText)"
        />
        <i class="iconfont start-page-icon logo" v-html="curNav.icon"></i>
        <ul class="search-suggest" v-show="suggestList && suggestList.length > 0">
          <li v-for="item in suggestList" class="sug-item" :key="item" @mousedown.prevent @click.capture="selSugItem(item)">{{item}}</li>
        </ul>
      </form>
    </div>
    <div class="icon-list">
      <i
        title="进入新世界"
        @click="$router.push({name: 'mainPage'})"
        class="iconfont start-page-icon icon-item"
      >&#xe60d;</i>
      <i
        title="登录"
        v-if="!isLogin"
        @click="isShowLoginWindow = true"
        class="iconfont start-page-icon icon-item"
      >&#xe662;</i>
      <i
        title="注册"
        v-if="isShowRegister"
        @click="isShowRegisterWindow = true"
        class="iconfont start-page-icon icon-item"
      >&#xe6bc;</i>
      <i
        title="记事本"
        v-if="openNotepadList"
        @click="openNotepadList"
        class="iconfont start-page-icon icon-item"
      >&#xe600;</i>
      <i
        title="书签"
        v-if="openBookmarkList"
        @click="openBookmarkList"
        class="iconfont start-page-icon icon-item"
      >&#xe646;</i>
      <i
        title="退出登录"
        v-if="isLogin"
        @click="logout"
        class="iconfont start-page-icon icon-item"
      >&#xe677;</i>
    </div>

    <!-- 书签抽屉 -->
    <drawer
      title="厚积薄发"
      des="骐骥一跃不能十步，驽马十驾功在不舍。"
      :isShow.sync="isShowBookmarkList"
      :isShowModal="true"
     >
      <div class="upload-file" v-if="bookmark && bookmark.length == 0">
        <div class="upload-file__virtual-btn bookmarks-header__search">上传</div>
        <input
          class="upload-file__actual-btn"
          type="file"
          @change="selBookmarksFile"
          accept="html"
          ref="bookmarksFileInput"
        />
      </div>
      <div class="bookmarks-header">
        <input
          class="bookmarks-header__input"
          type="text"
          placeholder="关键字查询"
          v-model="marksFilterVal"
          @keyup.enter="filterMarks"
        />
        <div class="bookmarks-header__search" @click="filterMarks">
          search
          <i class="iconfont start-page-icon bookmarks-header__search-icon">&#xe6e6;</i>
        </div>
      </div>
      <div class="bookmarks-body__content">
        <hx-tree
          :tree="{
            title: '我的书签',
            children: bookmark
          }"
          :is-expand-all="bookmarkExpand"
          :is-show-checkbox="isShowCheckbox"
          @child-node-click="openLink"
          ref="bookmarks"
         >
          <template #header>
            <div class="bookmarks-body__header">
              子叶节点展开：
              <hx-switch v-model="bookmarkExpand" :active-color="themeColor" inactive-color="#dcdfe6"></hx-switch>
            </div>
          </template>
          <template #operation="treeItem">
            <div class="marks-operation">
              <span v-visitor class="modify-btn" @click="modifyBookmarks(treeItem)">修改</span>
              <span v-visitor class="delete-btn" title="双击删除" @dblclick="deleteMarks(treeItem)">删除</span>
            </div>
          </template>
        </hx-tree>
      </div>
    </drawer>

    <!-- 记事本抽屉 -->
    <drawer title="记事本" des="好记性不如烂笔头" :isShow.sync="isShowNotepadList" v-visitor>
      <div class="drawe-padding">
        <div class="bookmarks-header">
          <input
            class="bookmarks-header__input"
            type="text"
            placeholder="关键字查询"
            v-model="notepadFilterText"
            @keyup.enter="filterNotepad"
          />
          <div class="bookmarks-header__search" @click="filterNotepad">
            search
            <i class="iconfont start-page-icon bookmarks-header__search-icon">&#xe6e6;</i>
          </div>
        </div>
        <hx-tree
          class="notepad-content"
          :tree=" {
            title: '我的记事本',
            children: notepadList
          }"
          :is-expand-all="true"
          :render-key="{
            label: 'name'
          }"
          @child-node-click="clickNotepadList"
          ref="notepad"
         >
          <template #header>
            <div class="notepad-content__header">
              <span @click="notepadDialogVisible = !notepadDialogVisible">
                添加
                <i class="iconfont middle-icon">&#xe60a;</i>
              </span>
            </div>
          </template>
        </hx-tree>
        <drawer
          :title="curNotepad.name"
          :isShow.sync="isShowNotepadContent"
        >
          <div class="drawe-padding">
            <div class="dialog-footer">
              <button @click="isShowNotepadContent = false">取消</button>
              <button type="primary" @click="updateNotepadContent">修改</button>
            </div>
            <vue-editor v-model="curNotepad.content"></vue-editor>
          </div>
        </drawer>
      </div>
    </drawer>

    <!-- 登录弹框 -->
    <hx-dialog :dialog-visiable.sync="isShowLoginWindow" :isCurtain="false" title="登录" @confirm="login">
      <template>
        <hx-form-item
          label="ACCOUNT"
          :label-icon="require('../../assets/status-icon/leimu-icon.png')"
        >
          <input
            class="login-input__input"
            v-model="userInfo.userAccount"
            type="text"
            placeholder="请输用户名"
          />
        </hx-form-item>
        <hx-form-item
          label="PASSWORD"
          :label-icon="require('../../assets/status-icon/leimu-icon.png')"
        >
          <input
            class="login-input__input"
            v-model="userInfo.userPassword"
            type="password"
            placeholder="请输入密码"
          />
        </hx-form-item>
      </template>
    </hx-dialog>

    <!-- 注册弹框 -->
    <hx-dialog :dialog-visiable.sync="isShowRegisterWindow" title="来啦？老弟" @confirm="register">
      <template>
        <hx-form-item
          label="NAME"
          :label-icon="require('../../assets/status-icon/leimu-icon.png')"
        >
          <input
            class="login-input__input"
            v-model="registerUserInfo.userName"
            type="text"
            placeholder="请输用户名"
          />
        </hx-form-item>
        <hx-form-item
          label="ACCOUNT"
          :label-icon="require('../../assets/status-icon/leimu-icon.png')"
        >
          <input
            class="login-input__input"
            v-model="registerUserInfo.userAccount"
            type="text"
            placeholder="请输入账号"
          />
        </hx-form-item>
        <hx-form-item
          label="PASSWORD"
          :label-icon="require('../../assets/status-icon/leimu-icon.png')"
        >
          <input
            class="login-input__input"
            v-model="registerUserInfo.userPassword"
            type="password"
            placeholder="请输入密码"
          />
        </hx-form-item>
        <hx-form-item
          label="COMFIRM PWD"
          :label-icon="require('../../assets/status-icon/leimu-icon.png')"
        >
          <input
            class="login-input__input"
            v-model="registerUserInfo.userPasswordConfirm"
            type="password"
            placeholder="请确认密码"
          />
        </hx-form-item>
      </template>
    </hx-dialog>

    <!-- 修改书签弹框 -->
    <hx-dialog :dialog-visiable.sync="isShowBookmarksWindow" title="修改书签" @confirm="modifyConfirm">
      <hx-form-item
        label="书签"
        :label-icon="require('../../assets/status-icon/leimu-icon.png')"
      >
        <input class="login-input__input" type="text" v-model="curSelBookmark.label" />
      </hx-form-item>
      <hx-form-item
        label="链接"
        :label-icon="require('../../assets/status-icon/leimu-icon.png')"
      >
        <input class="login-input__input" type="text" v-model="curSelBookmark.href" />
      </hx-form-item>
    </hx-dialog>

    <!-- 记事本对话框 -->
    <hx-dialog :dialog-visiable.sync="notepadDialogVisible" title="新增记事本" @confirm="addNotepadComfirm">
      <hx-form-item
        label="记事本名称"
        :label-icon="require('../../assets/status-icon/leimu-icon.png')"
      >
        <input class="login-input__input" type="text" v-model="curNotepad.name" />
      </hx-form-item>
    </hx-dialog>
  </div>
</template>

<script>
import request from "../../utils/http"
import cookieServe from "../../utils/cookie"
import { VueEditor } from "vue2-editor"
import { tabsConfig, navgation } from "../../config/js/start-page"
import jsonp from 'jsonp'
export default {
  data() {
    return {
      isLoadAnimation: true, // 是否加载开始动画
      bookmark: [], // 书签
      defaultProps: {
        children: "children",
        label: "label"
      },
      notepadProps: {
        label: "name",
        children: "children"
      },
      filterText: "", // 书签搜索关键字
      notepadFilterText: "", // 记事本搜索关键字
      test: "百度一下",
      isShowRegister: true, // 是否展示注册按钮
      isShowLoginWindow: false, // 是否展示登录弹框
      isShowRegisterWindow: false, // 是否展示注册弹框
      userInfo: {
        userAccount: "", // 账号
        userPassword: "" // 密码
      },
      registerUserInfo: {
        userAccount: "", // 用户账户
        userPassword: "", // 用户密码
        userPasswordConfirm: "", // 用户确认密码
        userName: "" //用户名
      },
      notepadList: [], // 记事本列表
      notepadWindow: false, // 记事本弹框开关
      curNotepad: {
        content: "",
        id: "",
        name: ""
      }, // 当前记事本内容
      isShowBookmarkList: false, // 是否展示书签列表
      isShowNotepadList: false, // 是否展示记事本列表
      isShowNotepadContent: false, // 是否展示记事本内容
      selFile: "", // 用户选择的文件
      tabsSelectIcon: tabsConfig, // 导航栏选择中状态的图标
      navgation: navgation, // 导航数据
      curNav: navgation[0], // 当前选中的导航
      websideUrl: "", // 要打开的导航地址
      isShowCheckbox: false, // 是否展示复选框
      marksFilterVal: "", // 书签过滤关键字
      isShowBookmarksWindow: false, // 是否展示书签弹框
      curSelBookmark: {}, // 当前选中的书签
      suggestList: [], // 搜索建议列表
      searchText: '', // 搜索关键字
      bookmarkExpand: false, // 书签子叶展开
      notepadDialogVisible: false // 记事本对话框开关
    };
  },

  components: {
    "vue-editor": VueEditor
  },

  computed: {
    isLogin () {
      return this.$store.getters.getCurMode !== 'visitor' && this.$store.getters.getUserInfo && this.$store.getters.getUserInfo.userId
    },
    // 启动页海报
    startPagePoster () {
      let userDesignSetting  = this.$store.getters.getUserDesignSetting
      // return userDesignSetting.startSetting.startPoster || require('../../assets/startBg.png')
      return userDesignSetting.startSetting.startPoster
    },
    // 动态壁纸
    bgVideo () {
      let userDesignSetting  = this.$store.getters.getUserDesignSetting
      // return userDesignSetting.startSetting.startVideo || require("../../assets/start-background-video.mp4")
      return userDesignSetting.startSetting.startVideo
    },

    // 主题色
    themeColor () {
      let userDesignSetting  = this.$store.getters.getUserDesignSetting
      return userDesignSetting.themeSetting.themeColor || '#000'
    }
  },

  watch: {
    searchText (val) {
      this.getSearchSuggestList(val)
    }
  },

  created () {
    this.getAllData()
  },

  methods: {
    // 获取启动页所有数据
    getAllData () {
      request({
        url: 'startPage/getAll'
      }).then(res => {
        this.notepadList = res.notepadList
        this.bookmark = res.bookmarksList
      })
    },

    // 视频加载完成回调
    videoAlready() {
      this.isLoadAnimation = false;
    },

    //点击书签
    clickBookmark(e) {
      if (e.href) {
        window.open(e.href, "_blank");
      }
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

    // 请求记事本列表
    // getNotepadList() {
    //   let userInfo = this.$store.getters.getUserInfo;
    //   if (!userInfo) {
    //     this.$liveRem.showToast({
    //       text: "我还不认识你呢，快去登录吧",
    //       type: "lovely"
    //     });
    //     this.isShowLoginWindow = true;
    //     return;
    //   }
    //   let url = "notepad/getNotepadCatalog";
    //   let method = "GET";
    //   request({ url, method, params: { userId: userInfo.userId } }).then(
    //     res => {
    //       this.notepadList = res;
    //     }
    //   );
    // },

    // 点击记事本文件
    clickNotepadList(e) {
      this.isShowNotepadContent = true;
      this.getNotepadContent(e.id);
    },

    /**
     * 请求记事本内容
     * @param {Number} notepadId 记事本id
     */
    getNotepadContent(notepadId) {
      let method = "GET";
      let url = "notepad/getNotepadContent";
      let params = {
        userId: this.$store.getters.getUserInfo.userId,
        id: notepadId
      };
      request({ url, method, params }).then(res => {
        this.$liveRem.showToast({ text: "拿到记事本啦", type: "success" });
        this.curNotepad = res;
      });
    },

    // 更新记事本内容
    updateNotepadContent() {
      let method = "POST";
      let url = "notepad/updateNotepadContent"
      let data = {
        id: this.curNotepad.id,
        content: this.curNotepad.content,
        name: this.curNotepad.name
      }
      request({ url, method, data }).then(() => {
        this.$liveRem.showToast({ text: "记事本更新完成啦", type: "success" })
      })
    },

    // 展示记事本列表回调函数
    openNotepadList() {
      this.isShowNotepadList = true
    },

    // 展示书签内容的回调函数
    openBookmarkList() {
      this.isShowBookmarkList = true
    },

    // 用户选择书签文件
    selBookmarksFile() {
      // let userInfo = this.$store.getters.getUserInfo
      this.selFile = this.$refs.bookmarksFileInput.files[0];
      let url = "bookmarks/uploadBookmarks",
        data = new FormData(),
        method = "POST";
      data.append("file", this.selFile);
      request({ url, method, data }).then(() => {
        this.$liveRem.showToast({ text: "书签上传完成咯~", type: "success" });
      });
    },

    // 打开书签链接链接
    openLink({ href }) {
      window.open(href);
    },

    //请求书签内容
    // getBookmarksList() {
    //   let url = "bookmarks/getBookMarksContent"
    //   let method = "GET"
    //   request({ url, method }).then(res => {
    //     this.bookmark = res.bookmarksData;
    //     this.$liveRem.showToast({
    //       text: "书签拿到啦, 快去学习吧",
    //       type: "success"
    //     })
    //   })
    // },

    // 登录
    login() {
      let { userAccount, userPassword } = this.userInfo
      if (!userAccount || !userPassword) {
        this.$liveRem.showToast({text: '不要调皮, 要输入账号密码才能登陆'})
        return
      }
      let url = "user/login"
      let method = "POST"
      let data = {
        userAccount: userAccount,
        userPassword: userPassword
      };
      request({ url, method, data }).then(res => {
        // cookieServe.setCookie("token", res.token, 1);
        this.$socket.emit("login", cookieServe.getAuthorization())
        this.$store.commit("setUserInfo", res.userData)
        this.$store.dispatch('setCurLoginUserInfo')
        this.isShowLoginWindow = false;
        this.isShowRegisterWindow = false;
      });
    },

    // 退出登录
    async logout () {
      cookieServe.clear('token')
      this.$liveRem.showToast({text: '成功登出已为您切换访客模式，期待下次再见'})
      await this.$store.dispatch("setCurLoginUserInfo")
    },

    // 注册密码
    register() {
      let {
        userName,
        userAccount,
        userPassword,
        userPasswordConfirm
      } = this.registerUserInfo;
      // 如果两次输入密码一致
      if (userPassword == userPasswordConfirm) {
        let url = "user/register";
        let method = "POST";
        let data = { userName, userAccount, userPassword };
        request({ url, method, data })
          .then(res => {
            this.$liveRem.showToast({
              text: "欢迎加入我的大家庭！",
              type: "lovely"
            });
            this.isShowRegisterWindow = false;
            cookieServe.setCookie("token", res.data.data.token, 1);
          })
          .catch(() => {
            this.$liveRem.showToast({
              text: "失败啦，稍后再试吧",
              type: "error"
            });
          });
      } else {
        this.$liveRem.showToast({
          text: "两次输入密码不一致，请重新输入",
          type: "error"
        });
        this.registerUserInfo.userPassword = "";
        this.registerUserInfo.userPasswordConfirm = "";
      }
    },

    // 选择标签页事件
    selectTabs(val) {
      this.curNav = val;
    },

    // 打开新的标签页
    openNewTabs() {
      window.open(this.websideUrl, "_blank");
    },

    // 过滤书签
    filterMarks() {
      this.$refs.bookmarks.filterNode(this.marksFilterVal);
    },

    filterNotepad () {
      this.$refs.notepad.filterNode(this.notepadFilterText)
    },

    // 删除书签
    deleteMarks(treeItem) {
      let url = "bookmarks/deleteBookmarks";
      let method = "POST";
      let data = {
        bookmarksId: treeItem.id
      };
      request({ url, method, data }).then(res => {
        this.$liveRem.showToast({ text: "又少了个书签呢~", type: "error" });
        this.bookmark = res.bookmarksList
      });
    },

    // 修改书签
    modifyBookmarks(treeItem) {
      this.curSelBookmark = treeItem;
      this.isShowBookmarksWindow = true;
    },

    // 确认修改书签
    modifyConfirm() {
      let url = "bookmarks/updateBookmarks",
        method = "POST",
        data = {
          bookmarksArray: [
            {
              label: this.curSelBookmark.label,
              pid: this.curSelBookmark.pid,
              href: this.curSelBookmark.href,
              id: this.curSelBookmark.id
            }
          ]
        };
      request({ url, method, data }).then(res => {
        this.$liveRem.showToast({ text: "修改好啦！", type: "success" });
        this.bookmark = res.bookmarksList
      });
    },

    /**
     * 搜索关键字联想
     * @param {String} val 搜索关键字
     *
     */
    getSearchSuggestList (val) {
      if (val) {
        const { type } = this.curNav
        switch (type) {
          case 'baidu':
            this.baiduSuggest(val)
            return
          case 'bilibili':
            this.biliWebsitSuggest(val)
        }
      }
    },

    // 百度关键字联想
    baiduSuggest (val) {
      jsonp('https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd=' + val)
      window.baidu = {
        sug: data => this.suggestList = data.s.slice(0, 5)
      }
    },

    // b站关键字联想
    biliWebsitSuggest (val) {
      request({
        url: 'proxy/searchSug',
        params: {
          keywords: val,
          type: 'bilibili'
        }
      }).then(res => {
        this.suggestList = res.slice(0, 5)
      })
    },

    // 搜索
    async selSugItem (val) {
      this.searchText = val
      await this.$nextTick()
      this.$refs.searchForm.submit()
    },

    // 确认新增记事本
    addNotepadComfirm () {
      if (this.curNotepad.name) {
        request({
          url: 'notepad/createNotepad',
          method: 'POST',
          data: {
            name: this.curNotepad.name
          }
        }).then(() => {
          this.$liveRem.showToast({text: '又多了个记事本哟~', type: 'lovely'})
          this.getAllData()
        }).catch(() => {
          this.curNotepad = {
            content: "",
            id: "",
            name: ""
          }
        })
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../config/css/_globalStyle.scss";
.bg-wall {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  overflow: hidden;
}

.drawe-padding /deep/{
  padding: 20px 20px 100px 20px;
  overflow: auto;
  height: 100%;
  box-sizing: border-box;

  .main__content_right {
    width: 50%;
  }

  .tree-main__body {
    margin-top: 20px;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    padding: 10px;

    button {
      padding: 5px;
      background-color: $theme-color;
      border: none;
      color: #fff;
      margin-right: 10px;
      border-radius: 6px;
    }
  }
}

.search-question /deep/ {
  position: fixed;
  top: 200px;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 30%;
  height: 300px;
  overflow-x: hidden;

  .search-tabs {
    display: flex;
    height: 40px;

    .search-items {
      position: relative;
      width: 80px;
      line-height: 40px;
      font-size: 14px;
      font-weight: bold;
      text-align: center;
      color: #fff;
      cursor: pointer;
      font-family: monospace;
      z-index: 10;

      .selected {
        color: $theme-color;
        font-size: 20px;
      }
    }

    .tabs-margin-left {
      margin-left: 5px;
    }
  }
}
.search-zone {
  position: relative;
  display: flex;
  align-items: center;

  .search-suggest {
    position: absolute;
    top: 62px;
    left: 80px;
    width: 100%;
    background-color: #fff;
    border: 1px solid $theme-color;

    .sug-item {
      padding: 5px;
      font-size: 14px;
      font-weight: bold;
    }

    .sug-item:hover {
      background-color: $theme-color;
      color: #fff;
      cursor: pointer;
    }
  }
}

.search-input {
  width: 100%;
  height: 60px;
  border-radius: 80px;
  border: 1px solid;
  opacity: 0.8;
  outline: none;
  padding: 0 0 0 80px;
  position: relative;
  z-index: 9;
  font-size: 20px;

  &::-webkit-input-placeholder {
    /* Chrome/Opera/Safari */
    color: $theme-color;
    font-size: 16px;
  }

  &::-moz-placeholder {
    /* Firefox 19+ */
    color: $theme-color;
    font-size: 16px;
  }

  &:-ms-input-placeholder {
    /* IE 10+ */
    color: $theme-color;
    font-size: 16px;
  }

  &:-moz-placeholder {
    /* Firefox 18- */
    color: $theme-color;
    font-size: 16px;
  }
}

.go-new-tab {
  padding: 0 80px 0 0;
}

.search-icon {
  position: absolute;
  right: 20px;
  z-index: 10;
  width: 30px;
  height: 30px;
  font-size: 30px;
  cursor: pointer;
}

.logo {
  position: absolute;
  left: 30px;
  z-index: 10;
  width: 20px;
  height: 20px;
  font-size: 20px;
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
  display: flex;
  flex-direction: column;
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


.notepad-content {
  padding-top: 24px;
  max-height: 600px;
  overflow: auto;

  .notepad-content__header {
    display: flex;
    justify-content: flex-end;
    color: $theme-color;
    span {
      display: inline-flex;
      align-items: center;
      margin-right: 12px;
      cursor: pointer;

      i {
        width: 16px;
        height: 16px;
        margin-left: 6px;
        font-size: 16px;
      }
    }
  }
}

.bg-vague {
  filter: blur(10px) contrast(0.8);
}

.form-item {
  display: flex;
  height: 60px;
  align-items: center;
}

.form-label {
  position: relative;
  display: inline-block;
  width: 140px;
  margin-right: 40px;
  text-align: right;
  font-weight: 700;
  color: $theme-color;
}

.form-label::before {
  content: "";
  position: absolute;
  width: 30px;
  height: 30px;
  right: -30px;
  top: -5px;
  background-image: url("../../assets/status-icon/leimu-icon.png");
  background-size: 30px 30px;
}

.login-input__input {
  height: 30px;
  padding-left: 20px;
  border: 1px solid $theme-color;
  color: $theme-color;
  background-color: transparent;
  outline: none;
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
  border: 4px solid $theme-color;
  background-color: transparent;
  color: #ffffff;
  cursor: pointer;
}

.login-btn button:nth-child(1) {
  margin-right: 60px;
  color: $theme-color;
}

.login-btn button::after,
.login-btn button::before {
  content: "";
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

.marks-operation {
  text-align: right;
  color: $theme-color;
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
  border: 1px solid $theme-color;
  font-size: 14px;
  text-align: center;
  outline: none;

  &::-webkit-input-placeholder {
    /* Chrome/Opera/Safari */
    color: $theme-color;
  }

  &::-moz-placeholder {
    /* Firefox 19+ */
    color: $theme-color;
  }

  &:-ms-input-placeholder {
    /* IE 10+ */
    color: $theme-color;
  }

  &:-moz-placeholder {
    /* Firefox 18- */
    color: $theme-color;
  }
}

.bookmarks-header__search {
  position: relative;
  width: 100px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  /* border-radius: 15px; */
  /* background-color: $theme-color; */
  color: $theme-color;
  cursor: pointer;
}

.bookmarks-header__search-icon {
  width: 14px;
  height: 14px;
  font-size: 14px;
}

.bookmarks-body__content {
  padding: 24px 0 100px;
}

.bookmarks-body__header {
  display: flex;
  justify-content: flex-end;
}

.bookmarks-header__search:after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  border: 2px solid $theme-color;
  animation: search-animation 1.5s infinite linear;
}

.bookmarks-header__search:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  border: 2px solid $theme-color;
  animation: search-animation 1s 0.5s linear infinite reverse;
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
  0%,
  100% {
    clip: rect(0, 60px, 22px, 0);
  }
  25% {
    clip: rect(0, 102px, 22px, 60px);
  }
  50% {
    clip: rect(20px, 102px, 40px, 60px);
  }
  75% {
    clip: rect(22px, 40px, 40px, 0);
  }
}
</style>
