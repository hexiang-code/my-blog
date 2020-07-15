<script>
const colorArray = ["#91bef0","#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"]
const bgColorArray = ["#f5f6f7", "#2f3136"]
import { dynamicStyle } from '../../config/js/dynamicSetting'
import request from '../../utils/http'
export default {
  data () {
    return {
      colorArray, // 颜色数组
      bgColorArray, // 背景色数组
      imageList: [], // 图片列表
      imageCurPage: 1, // 图片列表当前页
      imageClassList: [
        {
          id: 1,
          className: '图片'
        },
        {
          id: 2,
          className: '视频'
        }
      ],
      albumVisibel: false, // 相册开关
      imageApplayType: '' // 图片应用类型
    }
  },

  render () {
    return (
      <div class="main">
        <div class="design-class">
          <p class="title">
            定制主题
              <div class="buttons">
                <button onClick={() => this.applyColorSetting(1)}>本次应用</button>
                <button onClick = { () => this.updateUserSetting()}>永久应用</button>
              </div>
          </p>
          <div class="manager">
            <div class="color-manager">
              <p class="step-title">
               <span class="step-content" style={`background-color: ${this.getRandomColor(colorArray)}`}>1</span>
               选择主题色
              </p>
              <ul class="colors">
                { this.colorArray.map(item => {
                  return (
                    <li class="color-item" title={item} onClick={() => this.selectColor(item, 1)} style={`background-color: ${item}`}>
                      <i vShow={this.themeColor == item} class="iconfont sel-hander sel-icon">&#xe663;</i>
                    </li>
                  )
                }) }
              </ul>
              <p class="step-title">
               <span class="step-content" style={`background-color: ${this.getRandomColor(colorArray)}`}>2</span>
               选择背景色
              </p>
              <div class="background-setting">
                <div class="left">
                  纯色背景: &nbsp;
                  <hx-switch vModel={this.nightMode} active-color="#2f3136" inactive-color="#f5f6f7">
                    <i slot="switchLeft" class="iconfont sun-moon">&#xe603;</i>
                    <i slot="switchRight" class="iconfont sun-moon">&#xe75d;</i>
                  </hx-switch>
                </div>
                <div class="right">
                  图片背景: &nbsp;
                  <button onClick={() => {
                    this.imageApplayType = 'pageBg'
                    this.albumVisibel = true
                  }}>选择文件</button>
                </div>
              </div>
              <p class="step-title">
                <span class="step-content" style={`background-color: ${this.getRandomColor(colorArray)}`}>3</span>
                选择透明度
              </p>
              <div class="opacity-slider">
                <span>透明度:</span>
                <hx-slider max={1} min={0.5} vModel={this.opacity}></hx-slider>
              </div>
              <div></div>
            </div>

            <div class="footer-manager color-manager">
              <p class="step-title">
                <span class="step-content" style={`background-color: ${this.getRandomColor(colorArray)}`}>1</span>
                个性签名
              </p>
              <div class="personal-sign">
                <input vModel={this.userDesignSetting.footerSetting.personalSign[0]} /> - <input vModel={this.userDesignSetting.footerSetting.personalSign[1]} />
              </div>
              <p class="step-title">
                <span class="step-content" style={`background-color: ${this.getRandomColor(colorArray)}`}>2</span>
                个人信息
              </p>
              <window-utils-item label="QQ">
                <input vModel={this.userDesignSetting.footerSetting.personalInfo.QQ} />
              </window-utils-item>
              <window-utils-item label="微信">
                <input vModel={this.userDesignSetting.footerSetting.personalInfo.wechat} />
              </window-utils-item>
              <window-utils-item label="地址">
                <input vModel={this.userDesignSetting.footerSetting.personalInfo.address} />
              </window-utils-item>
              <window-utils-item label="邮箱">
                <input vModel={this.userDesignSetting.footerSetting.personalInfo.email} />
              </window-utils-item>
            </div>

            <div class="start-manager color-manager">
              <p class="step-title">
                <span class="step-content" style={`background-color: ${this.getRandomColor(colorArray)}`}>1</span>
                首页海报
              </p>
              <div class="start-video">
                图片海报: &nbsp;
                <button onClick={() => {
                  this.imageApplayType = 'startPoster'
                  this.albumVisibel = true
                }}>选择文件</button>
              </div>
              <p class="step-title">
                <span class="step-content" style={`background-color: ${this.getRandomColor(colorArray)}`}>2</span>
                首页背景
              </p>
              <div class="start-video">
                视频背景: &nbsp;
                <button onClick={() => {
                  this.getImageList(2)
                  this.imageApplayType = 'startVideo'
                  this.albumVisibel = true
                }}>选择文件</button>
              </div>
            </div>
          </div>
        </div>
        <hx-album
          imageList={this.imageList}
          classList={this.imageClassList}
          visible={this.albumVisibel}
          {...{
            on:
              {
                'update:visible': val => this.albumVisibel = val,
                'fileChange': this.uploadFile,
                'confirm': this.confirmSelImage,
                'update:current-page': val => this.imageCurPage = val
              }
            }
          }>
            <hx-pagination slot="pagination" currentPage={this.imageCurPage} total={this.imageTotal}></hx-pagination>
          </hx-album>
      </div>
    )
  },

  computed: {
    userDesignSetting () {
      return this.$store.getters.getUserDesignSetting
    },
    // 透明度
    opacity: {
      get () {
        return this.$store.getters.getUserDesignSetting.themeSetting.backgroundOpacity || 1
      },

      set (val) {
        this.$store.commit('setUserDesignSetting', { backgroundOpacity: val })
      }
    },
    // 背景
    background: {
      get () {
        let background = this.$store.getters.getUserDesignSetting.themeSetting.background
        return background || ''
      },

      set (val) {
        this.$store.commit('setUserDesignSetting', { background: val })
      }
    },
    // 主题色
    themeColor: {
      get () {
        return this.$store.getters.getUserDesignSetting.themeSetting.themeColor || colorArray[0]
      },

      set (val) {
        this.$store.commit('setUserDesignSetting', { themeColor: val })
      }
    },

    // 夜间模式开关
    nightMode: {
      get () {
        let background = this.$store.getters.getUserDesignSetting.themeSetting.background
        let nightMode = false
        if (background == bgColorArray[1]) nightMode = true
        return nightMode
      },

      set (val) {
        this.background = bgColorArray[`${val ? 1 : 0}`]
      }
    }
  },

  created () {
    this.getImageList(1)
  },

  methods: {
    /**
     * 选择颜色
     * @param {Number} type 1：主题色 2：背景色
     */
    selectColor (item, type) {
      if (type == 1) {
        this.themeColor = item
        dynamicStyle('themeColor', item)
      }

      if (type == 2) {
        this.background = item
        dynamicStyle('background', item)
      }
    },

    // 获取随机颜色
    getRandomColor (colorArray) {
      let len = colorArray.length
      let random = Math.floor(Math.random() * len)
      return colorArray[random]
    },

    /**
     * 应用颜色设置
     * @param {Number} type 1：本次应用 2：永久应用
     */
    applyColorSetting (type) {
      if (type == 1) {
        this.$liveRem.showToast({text: '应用成功', type: 'error'})
      }
    },

    // 选择图片切换
    // selImageChange (event) {
    //   let [ image ] = event.target.files
    //   let url = window.URL || window.webkitURL || window.mozURL
    //   this.background = url.createObjectURL(image)
    //   this.selectColor(`url(${this.background})`, 2)
    // },

    // 确认选择图片
    confirmSelImage (imageList) {
      let [image] = imageList
      switch (this.imageApplayType) {
        case 'pageBg':
          return this.selectColor(`url(${image.resourceUrl})`, 2)
        case 'startPoster':
          return dynamicStyle('startPoster', image.resourceUrl)
        case 'stratVideo':
          return dynamicStyle('stratVideo', image.resourceUrl)
      }
    },

    /**
     * 请求图片列表
     * @param {type} 1: 图片 2: 视频
     */
    getImageList (type = 1) {
      request({
        url: 'assets/getImageList',
        params: {
          type: type == 1 ? 'image' : 'video'
        }
      }).then(res => {
        this.imageList = res.rows
        this.imageTotal = res.count
      })
    },

    // 上传文件
    uploadFile (fileList) {
      let [ file ] = fileList
      let data = new FormData()
      data.append('file', file)
      request({
        url: 'base/upload',
        data,
        method: 'POST'
      }).then(() => {
        let curFileType
        if (file.type.startsWith('video')) curFileType = 2
        if (file.type.startsWith('image')) curFileType = 1
        this.getImageList(curFileType)
      })
    },

    // 更新用户设置
    updateUserSetting () {
      let data = {
        themeColor: this.themeColor,
        background: this.background,
        backgroundOpacity: this.opacity
      }
      request({
        url: 'userSetting/updateUserSetting',
        data,
        method: 'POST'
      }).then(() => {
        this.$liveRem.showToast({text: '全局应用成功了哟', type: 'smail'})
        this.$store.dispatch('setCurLoginUserInfo')
      })
    }
  }
}
</script>

<style lang='scss' scoped>
  @import '../../config/css/_globalStyle.scss';
  .main /deep/{
    padding: 20px 20% 20px 20%;
    // opacity: $opacity;
    .design-class {
      padding: 10px 10px 10px 20px;
      background-color: rgba($color: #fff, $alpha: $opacity);
      .title {
        position: relative;
        display: flex;
        justify-content: space-between;
        color: #000;
        font-weight: bold;
        font-size: 20px;

        &::before {
          content: '';
          position: absolute;
          top: 20%;
          left: -16px;
          width: 8px;
          height: 60%;
          margin: auto;
          background-color: $theme-color;
        }
        .buttons {
          display: flex;
          font-size: 12px;

          button {
            padding: 5px;
            background-color: $theme-color;
            border: none;
            color: #fff;
            margin-right: 10px;
          }

          button:nth-child(2) {
            margin-right: 0;
          }
        }
      }

      .manager {
        display: flex;
        justify-content: space-around;
        margin-top: 10px;
        font-size: 12px;

        .color-manager {
          padding: 10px;
          display: flex;
          flex-direction: column;
          width: 300px;
          border: 1px solid $theme-color;
          border-radius: 5px;

          .colors {
            display: flex;
            justify-content: space-around;
            padding-top: 25px;
            .color-item {
              position: relative;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              cursor: pointer;
            }

            .sel-icon {
              position: absolute;
              top: -17px;
              animation: twinkle 1.5s linear infinite;
            }
          }

          .step-title {
            padding-top: 10px;

            .step-title:nth-child(1) {
              padding-top: 0;
            }

            .step-content {
              display: inline-block;
              width: 15px;
              height: 15px;
              text-align: center;
              line-height: 15px;
              border-radius: 50%;
              color: #fff;
              margin-right: 5px;
            }
          }

          .background-setting {
            display: flex;
            padding-top: 10px;
            justify-content: space-between;
            .left {
              flex-shrink: 0;
              display: flex;
              align-items: center;
            }

            .right {
              flex: 1;
              position: relative;
              display: flex;
              justify-content: flex-end;
              align-items: center;

              button {
                padding: 5px;
                background-color: $theme-color;
                border: none;
                color: #fff;
                margin-right: 10px;
              }

              &::before {
                content: '';
                position: absolute;
                width: 1px;
                top: 5px;
                bottom: 5px;
                left: 6px;
                background: $theme-color;
              }
            }
          }

          .opacity-slider {
            display: flex;
            align-items: center;
            margin-top: 10px;

            span {
              margin-right: 10px;
            }
            .slider {
              .slider-bar {
                background-color: $theme-color;
              }

              .slider-block {
                border: 2px solid $theme-color;
              }
            }
          }
        }

        .footer-manager {
          margin-left: 20px;

          input {
            display: inline-block;
            max-width: 130px;
            height: 20px;
            line-height: 20px;
            font-size: 14px;
            margin-right: 10px;
            border: 1px solid $theme-color;
            outline: none;
            background-color: rgba($color: #fff, $alpha: $opacity);
          }
          .personal-sign {
            margin-top: 10px;
            display: flex;

            input:nth-child(2) {
              margin-right: 0;
              margin-left: 10px;
            }
          }

          .login-input {
            height: auto;
            justify-content: flex-start;
            margin-top: 10px;

            .login-label {
              width: 30px;
            }
          }

        }

        .start-manager {
          margin-left: 20px;

          .start-video {
            margin-top: 10px;

            button {
              padding: 5px;
              background-color: $theme-color;
              border: none;
              color: #fff;
              margin-right: 10px;
            }
          }
        }
      }

    }
  }
</style>
