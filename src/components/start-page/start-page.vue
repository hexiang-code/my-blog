<template>
  <div class="bg-wall">
    <backgroundVideo :resource="soure" @videoAlready="videoAlready"></backgroundVideo>
    <load-animation :isShow.sync="isLoadAnimation"></load-animation>
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
        v-if="!isShowlogin"
        @click="$router.push({name: 'mainPage'})"
        class="iconfont start-page-icon icon-item"
      >&#xe60d;</i>
      <i
        title="登录"
        v-if="isShowlogin"
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
        v-if="!isShowlogin"
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
        />
        <div class="bookmarks-header__search" @click="filterMarks">
          search
          <i class="iconfont start-page-icon bookmarks-header__search-icon" @keyup.enter="submit">&#xe6e6;</i>
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
    <drawer title="记事本列表" :isShow.sync="isShowNotepadList">
      <div class="drawe-padding">
        <el-input placeholder="找一找" v-model="notepadFilterText" class="bookmark-filter"></el-input>
        <el-tree
          class="bookmarks-content"
          :data="notepadList"
          :props="notepadProps"
          @node-click="clickNotepadList"
          :highlight-current="true"
          :accordion="true"
          :filter-node-method="filterNode"
          ref="notepadList"
          size="30%"
        ></el-tree>
        <el-drawer
          :title="curNotepad.name"
          :append-to-body="true"
          :visible.sync="isShowNotepadContent"
          :close-on-press-escape="true"
        >
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
        <window-utils-item
          label="ACCOUNT"
          :label-icon="require('../../assets/status-icon/leimu-icon.png')"
        >
          <input
            class="login-input__input"
            v-model="userInfo.userAccount"
            type="text"
            placeholder="请输用户名"
          />
        </window-utils-item>
        <window-utils-item
          label="PASSWORD"
          :label-icon="require('../../assets/status-icon/leimu-icon.png')"
        >
          <input
            class="login-input__input"
            v-model="userInfo.userPassword"
            type="password"
            placeholder="请输入密码"
          />
        </window-utils-item>
      </template>
    </windowUtils>

    <!-- 注册弹框 -->
    <windowUtils :isShowWindow.sync="isShowRegisterWindow" title="来啦？老弟" @confirm="register">
      <template>
        <window-utils-item
          label="NAME"
          :label-icon="require('../../assets/status-icon/leimu-icon.png')"
        >
          <input
            class="login-input__input"
            v-model="registerUserInfo.userName"
            type="text"
            placeholder="请输用户名"
          />
        </window-utils-item>
        <window-utils-item
          label="ACCOUNT"
          :label-icon="require('../../assets/status-icon/leimu-icon.png')"
        >
          <input
            class="login-input__input"
            v-model="registerUserInfo.userAccount"
            type="text"
            placeholder="请输入账号"
          />
        </window-utils-item>
        <window-utils-item
          label="PASSWORD"
          :label-icon="require('../../assets/status-icon/leimu-icon.png')"
        >
          <input
            class="login-input__input"
            v-model="registerUserInfo.userPassword"
            type="password"
            placeholder="请输入密码"
          />
        </window-utils-item>
        <window-utils-item
          label="COMFIRM PWD"
          :label-icon="require('../../assets/status-icon/leimu-icon.png')"
        >
          <input
            class="login-input__input"
            v-model="registerUserInfo.userPasswordConfirm"
            type="password"
            placeholder="请确认密码"
          />
        </window-utils-item>
      </template>
    </windowUtils>

    <window-utils :isShowWindow.sync="isShowBookmarksWindow" title="修改书签" @confirm="modifyConfirm">
      <window-utils-item
        label="书签"
        :label-icon="require('../../assets/status-icon/leimu-icon.png')"
      >
        <input class="login-input__input" type="text" v-model="curSelBookmark.label" />
      </window-utils-item>
      <window-utils-item
        label="链接"
        :label-icon="require('../../assets/status-icon/leimu-icon.png')"
      >
        <input class="login-input__input" type="text" v-model="curSelBookmark.href" />
      </window-utils-item>
    </window-utils>
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
      soure: require("../../assets/start-background-video.mp4"), //动态壁纸资源
      test: "百度一下",
      // isShowlogin: true,  // 是否展示登录按钮
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
      isShowCheckBox: false, // 是否展示复选框
      marksFilterVal: "", // 书签过滤关键字
      isShowBookmarksWindow: false, // 是否展示书签弹框
      curSelBookmark: {}, // 当前选中的书签
      suggestList: [], // 搜索建议列表
      searchText: '' // 搜索关键字
    };
  },

  components: {
    "vue-editor": VueEditor
  },

  created() {
  },

  computed: {
    isShowlogin: {
      get() {
        let { userId } = this.$store.getters.getUserInfo;
        if (userId) return false;
        return true;
      },

      set(value) {
        return value;
      }
    },

    isVagueBg() {
      return false;
    }
  },

  watch: {
    filterText(val) {
      this.$refs.bookmarks.filter(val);
    },

    notepadFilterText(val) {
      this.$refs.notepadList.filter(val);
    },

    searchText (val) {
      this.getSearchSuggestList(val)
    }
  },

  methods: {
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
    getNotepadList() {
      let userInfo = this.$store.getters.getUserInfo;
      if (!userInfo) {
        this.$liveRem.showToast({
          text: "我还不认识你呢，快去登录吧",
          type: "lovely"
        });
        this.isShowLoginWindow = true;
        return;
      }
      let url = "notepad/getNotepadCatalog";
      let method = "GET";
      request({ url, method, params: { userId: userInfo.userId } }).then(
        res => {
          this.notepadList = res;
        }
      );
    },

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
      let url = "notepad/updateNotepadContent";
      let data = {
        userId: this.$store.getters.userInfo.userId,
        id: this.curNotepad.id,
        content: this.curNotepad.content,
        name: this.curNotepad.id
      };
      request({ url, method, data }).then(() => {
        this.$liveRem.showToast({ text: "记事本更新完成啦", type: "success" });
      });
    },

    // 展示记事本列表回调函数
    openNotepadList() {
      this.isShowNotepadList = true;
      this.getNotepadList();
    },

    // 展示书签内容的回调函数
    openBookmarkList() {
      this.isShowBookmarkList = true;
      this.getBookmarksList();
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

    // 上传文件
    uploadBookmarks() {},

    // 打开书签链接链接
    openLink({ href }) {
      window.open(href);
    },

    //请求书签内容
    getBookmarksList() {
      let url = "bookmarks/getBookMarksContent";
      let method = "GET";
      request({ url, method }).then(res => {
        this.bookmark = res.bookmarksData;
        this.$liveRem.showToast({
          text: "书签拿到啦, 快去学习吧",
          type: "success"
        });
      });
    },

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
        cookieServe.setCookie("token", res.token, 1);
        this.$socket.emit("login", cookieServe.getAuthorization());
        this.$store.commit("setUserInfo", res.userData);
        this.isShowLoginWindow = false;
        this.isShowRegisterWindow = false;
        this.isShowlogin = false;
      });
    },

    // 退出登录
    logout () {
      cookieServe.clear('token')
      this.isShowlogin = true
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

    // 删除书签
    deleteMarks(treeItem) {
      let url = "bookmarks/deleteBookmarks";
      let method = "POST";
      let data = {
        bookmarksId: treeItem.id
      };
      request({ url, method, data }).then(() => {
        this.$liveRem.showToast({ text: "又少了个书签呢~", type: "error" });
        this.getBookmarksList();
      });
    },

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
      request({ url, method, data }).then(() => {
        this.$liveRem.showToast({ text: "修改好啦！", type: "success" });
        this.getBookmarksList();
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
        this.suggestList = res
      })
    },

    // 搜索
    async selSugItem (val) {
      this.searchText = val
      await this.$nextTick()
      this.$refs.searchForm.submit()
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../config/css/_globalStyle.scss";
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
      font-size: 18px;
      font-weight: bold;
      text-align: center;
      color: $leimu-color;
      cursor: pointer;
      font-family: monospace;
      z-index: 10;

      .selected {
        color: #fff;
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
    border: 1px solid $leimu-color;

    .sug-item {
      padding: 5px;
      font-size: 14px;
      font-weight: bold;
    }

    .sug-item:hover {
      background-color: $leimu-color;
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
    color: $leimu-color;
    font-size: 16px;
  }

  &::-moz-placeholder {
    /* Firefox 19+ */
    color: $leimu-color;
    font-size: 16px;
  }

  &:-ms-input-placeholder {
    /* IE 10+ */
    color: $leimu-color;
    font-size: 16px;
  }

  &:-moz-placeholder {
    /* Firefox 18- */
    color: $leimu-color;
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
  filter: blur(10px) contrast(0.8);
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
  color: $leimu-color;
}

.login-label::before {
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
  border: 1px solid $leimu-color;
  color: $leimu-color;
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
  border: 4px solid $leimu-color;
  background-color: transparent;
  color: #ffffff;
  cursor: pointer;
}

.login-btn button:nth-child(1) {
  margin-right: 60px;
  color: $leimu-color;
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
  color: $leimu-color;
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
  border: 1px solid $leimu-color;
  font-size: 14px;
  text-align: center;

  &::-webkit-input-placeholder {
    /* Chrome/Opera/Safari */
    color: $leimu-color;
  }

  &::-moz-placeholder {
    /* Firefox 19+ */
    color: $leimu-color;
  }

  &:-ms-input-placeholder {
    /* IE 10+ */
    color: $leimu-color;
  }

  &:-moz-placeholder {
    /* Firefox 18- */
    color: $leimu-color;
  }
}

.bookmarks-header__search {
  position: relative;
  width: 100px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  /* border-radius: 15px; */
  /* background-color: $leimu-color; */
  color: $leimu-color;
}

.bookmarks-header__search-icon {
  width: 14px;
  height: 14px;
  font-size: 14px;
}

.bookmarks-body__content {
  padding-bottom: 100px;
}

.bookmarks-header__search:after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  border: 2px solid $leimu-color;
  animation: search-animation 1.5s infinite linear;
}

.bookmarks-header__search:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  border: 2px solid $leimu-color;
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
