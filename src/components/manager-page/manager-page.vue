<script>
import { colorArray, bgColorArray, hardwareTitle, loggerTitle } from './manager-config'
import { dynamicStyle } from '../../config/js/dynamic-setting'
import { debounce } from '../../utils/utils'
import request from '../../utils/http'
import userMode from '../../config/js/user-mode'
import { formatDate } from '../../utils/utils'
export default {
  name: 'managerPage',
  data () {
    return {
      colorArray, // 颜色数组
      bgColorArray, // 背景色数组
      imageList: [], // 图片列表
      imageCurPage: 1, // 图片列表当前页
      imageListPageSize: 10, // 图片列表页数据数量
      imageClassList: [
        {
          id: 1,
          className: '图片',
        },
        {
          id: 2,
          className: '视频'
        }
      ],
      albumVisibel: false, // 相册开关
      imageApplayType: '', // 图片应用类型
      inputLabelIcon: require('../../assets/status-icon/leimu-icon.png'),
      hardwareList: [], // 硬件信息数组
      hardwareTitle, // 硬件信息表格标题数组
      timesArray: [], // 查询硬件监控列表时间段
      hardwareTotal: 0, // 硬件信息总数
      hardawrePageSize: 10, // 单位页数据
      hardwareCurPage: 1, // 当前页
      fileType: 1, // 相册类型 1: 图片 2: 视频
      hardwareSort: 'id=ASC', // 硬件信息排序方式
      // 日志查询参数
      loggerFilter: {
        method: '', // 请求方式
        url: '', // 请求地址
        timesArray: [], // 时间段
        isError: false, // 是否只查错误信息
        pageSize: 10,
        curPage: 1,
        total: 1,
        sort: '', // 拍讯方式
        errorInfo: '', // 错误信息
        userAccount: '', // 用户账户
        userId: '', // 用户Id
        mode: '' // 用户身份
      },
      loggerList: [],
      loggerTitle, // 日志表格头
      isDeployingVue: false, // 前端项目是否部署中
      isDeployingNode: false, // 后端项目是否部署中
      isDeployingAll: false, // 是否全部再部署
      deployMessage: '全力部署中...',
    }
  },

  render () {
    return (
      <div class="main">
        <div class="design-class">
          <div class="manage-module">
            <p class="title">
              定制主题
                <div class="buttons">
                  <button onClick={() => this.applyColorSetting(1)}>本次应用</button>
                  <button onClick = { () => this.updateUserSetting()}>永久应用</button>
                </div>
            </p>
            <transition-group name="design" appear tag="div" class="manage">
              <div class="color-manage" key="colorManager">
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

              <div class="footer-manage color-manage" key="footerManager">
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
                <hx-form-item label="QQ" labelIcon={this.inputLabelIcon}>
                  <input vModel={this.userDesignSetting.footerSetting.personalInfo.QQ} />
                </hx-form-item>
                <hx-form-item label="微信" labelIcon={this.inputLabelIcon}>
                  <input vModel={this.userDesignSetting.footerSetting.personalInfo.wechat} />
                </hx-form-item>
                <hx-form-item label="地址" labelIcon={this.inputLabelIcon}>
                  <input vModel={this.userDesignSetting.footerSetting.personalInfo.address} />
                </hx-form-item>
                <hx-form-item label="邮箱" labelIcon={this.inputLabelIcon}>
                  <input vModel={this.userDesignSetting.footerSetting.personalInfo.email} />
                </hx-form-item>
              </div>

              <div class="start-manage color-manage" key="startManager">
                <p class="step-title">
                  <span class="step-content" style={`background-color: ${this.getRandomColor(colorArray)}`}>1</span>
                  首页海报
                </p>
                <div class="start-video">
                  图片海报: &nbsp;
                  <button onClick={() => {
                    this.getImageList(1)
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
            </transition-group>
          </div>

          <div class="manage-module" vVisitor>
            <p class="title">
              部署应用
            </p>
            <div class="manage deploy-manage" >
              <div class="deploy-btn"
                onClick={() => this.deployProject(1)} onDblclick={() => this.deployProject(1, true)}
                vLoading={{isLoading: this.isDeployingVue, message: this.deployMessage}}>
                  部署前台
              </div>
              <div class="deploy-btn"
                onClick={() => this.deployProject(2)} onDblclick={() => this.deployProject(2, true)}
                vLoading={{isLoading: this.isDeployingNode, message: this.deployMessage}}>
                  部署后台
              </div>
              <div class="deploy-btn"
                onClick={() => this.deployProject(0)} onDblclick={() => this.deployProject(0, true)}
                vLoading={{isLoading: this.isDeployingAll, message: this.deployMessage}}>
                  全部部署
              </div>
            </div>
          </div>

          <div class="manage-module" vVisitor>
            <p class="title">
              硬件监控
            </p>
            <transition-group class="manage hardware-manage" tag="div" appear name="hardware">
              <div class="hardware-manager__filter" key="filter">
                <hx-date-picker onSelectComplete={this.dateSeleteComplete} value={this.timesArray}></hx-date-picker>
              </div>
              <div class="hardware-manager__table" key="table" >
                <hx-table tableData={this.hardwareList} {...{
                    on: {
                      'sort-change': this.hardwareSortChange
                    }
                  }}
                  ref="hardwareList"
                >
                  {
                    this.hardwareTitle.map(item => {
                      return (
                        <hx-table-column prop={item.props} label={item.label} sortable={true}></hx-table-column>
                      )
                    })
                  }
                </hx-table>
                <div class="hardware-manager__bottom">
                  <hx-pagination {...{
                      on: {
                        'current-change': this.hardwarePagerChange
                      }

                    }}
                    ref="pagination"
                    total={this.hardwareTotal}
                    page-size={this.hardawrePageSize}
                    current-page={this.hardwareCurPage}>
                  </hx-pagination>
                </div>
              </div>
            </transition-group>
          </div>

          <div class="manage-module" vVisitor>
            <p class="title">
              日志查询
            </p>
            <transition-group class="manage logger-manage" tag="div" appear name="logger">
              <div class="logger-manage__filter" key="filter">
                <hx-form-item label="请求方式" labelIcon={this.inputLabelIcon}>
                  <input class="logger-manager__input" placeholder="请输入请求方式" vModel={this.loggerFilter.method}/>
                </hx-form-item>
                <hx-form-item label="请求地址" labelIcon={this.inputLabelIcon}>
                  <input class="logger-manager__input" placeholder="请输入请求地址" vModel={this.loggerFilter.url}/>
                </hx-form-item>
                <hx-form-item label="是否只包含错误信息" labelIcon={this.inputLabelIcon}>
                  <hx-select placeholder="请选择" vModel={this.loggerFilter.isError}>
                    <hx-option label="是" value={true}></hx-option>
                    <hx-option label="否" value={false}></hx-option>
                  </hx-select>
                </hx-form-item>
                <hx-form-item label="错误信息" labelIcon={this.inputLabelIcon}>
                  <input class="logger-manager__input" placeholder="请输入错误信息" vModel={this.loggerFilter.errorInfo}/>
                </hx-form-item>
                <hx-form-item label="用户账户" labelIcon={this.inputLabelIcon}>
                  <input class="logger-manager__input" placeholder="请输入用户账户" vModel={this.loggerFilter.userAccount}/>
                </hx-form-item>
                <hx-form-item label="请求方式" labelIcon={this.inputLabelIcon}>
                  <input class="logger-manager__input" placeholder="请输入请求方式" vModel={this.loggerFilter.method}/>
                </hx-form-item>
                <hx-form-item label="用户id" labelIcon={this.inputLabelIcon}>
                  <input class="logger-manager__input" placeholder="请输入用户id" vModel={this.loggerFilter.userId}/>
                </hx-form-item>
                <hx-form-item label="用户身份" labelIcon={this.inputLabelIcon}>
                  <hx-select placeholder="请选择用户身份" vModel={this.loggerFilter.mode}>
                    {
                      userMode.map(item => {
                        return (
                          <hx-option label={item.label} value={item.mode}></hx-option>
                        )
                      })
                    }
                  </hx-select>
                </hx-form-item>
                <hx-form-item label="查询时间" labelIcon={this.inputLabelIcon}>
                  <hx-date-picker vModel={this.loggerFilter.timesArray}></hx-date-picker>
                </hx-form-item>
              </div>
              <div class="search-btns" key="search">
                <div class="search-logger" onClick={() => { this.getLoggerList() }} >查询</div>
                <div class="search-cancel" onClick={() => { this.resetSearchLogger()}}>重置</div>
              </div>
              <div class="logger-manage__table" key="table" >
                <hx-table tableData={this.loggerList} {...{
                    on: {
                      'sort-change': this.loggerSortChange
                    }
                  }}
                  ref="loggerList"
                >
                  {
                    this.loggerTitle.map(item => {
                      if (item.props == 'token') {
                        return <hx-table-column prop={item.props} label={item.label} sortable={item.sortable} align="center" width="300"></hx-table-column>
                      } else if (item.props == 'createdAt') {
                        return <hx-table-column prop={item.props} label={item.label} sortable={item.sortable} align="center"
                        scopedSlots={{
                          columnContent: function ({createdAt}) {
                            return <span>{formatDate('YYYY-MM-DD HH:MM:SS', createdAt)}</span>
                          }
                        }}>

                        </hx-table-column>
                      } else {
                        return <hx-table-column prop={item.props} label={item.label} sortable={item.sortable} align="center"></hx-table-column>
                      }


                    })
                  }
                </hx-table>
                <div class="logger-manage__bottom">
                  <hx-pagination {...{
                      on: {
                        'current-change': this.loggerPagerChange
                      }

                    }}
                    ref="pagination"
                    total={this.loggerFilter.total}
                    page-size={this.loggerFilter.pageSize}
                    current-page={this.loggerFilter.curPage}>
                  </hx-pagination>
                </div>
              </div>
            </transition-group>
          </div>
        </div>
        <hx-album
          imageList={this.imageList}
          classList={this.imageClassList}
          visible={this.albumVisibel}
          accept='image/jpeg,image/png,video/mp4,image/gif'
          {...{
            on:
              {
                'update:visible': val => this.albumVisibel = val,
                'fileChange': this.uploadFile,
                'confirm': this.confirmSelImage,
                'update:current-page': val => this.imageCurPage = val,
                'deleteImage': this.deleteImage,
                'classChange': this.classChange
              }
            }
          }>
            <hx-pagination {...{
              on: {
                'current-change': this.albumPagerChange
              }
            }} slot="pagination" current-page={this.imageCurPage} page-size={this.imageListPageSize} total={this.imageTotal}></hx-pagination>
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
        if (val) document.getElementById('app').style.color = '#fff'
        else document.getElementById('app').style.color = '#000'
        this.background = bgColorArray[`${val ? 1 : 0}`]
      }
    }
  },

  created () {
    this.getImageList(1)
    this.deployProject = debounce(this._deployProject, 300)
    this.getHardwareList()
    this.getLoggerList()
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
        case 'startVideo':
          return dynamicStyle('startVideo', image.resourceUrl)
      }
    },

    // 删除图片
    deleteImage (imageList) {
      let idArray = imageList.map(item => item.id)
      request({
        url: 'assets/deleteImage',
        method: 'POST',
        data: { ids: idArray.join() }
      }).then(() => {
        this.$liveRem.showToast({text: '删除成功！'})
        this.getImageList()
      })
    },

    // 图片分类切换
    classChange (classId) {
      this.imageCurPage = 1
      this.getImageList(classId)
    },

    /**
     * 请求图片列表
     * 下次更新图片列表功能优化 不在用type == 1, 2作为请求参数
     * @param {type} 1: 图片 2: 视频
     */
    getImageList (type = 1) {
      this.fileType = type
      request({
        url: 'assets/getImageList',
        params: {
          type: type == 1 ? 'image' : 'video',
          pageSize: this.imageListPageSize,
          curPage: this.imageCurPage,
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
    },


    /**
     * 部署项目
     * @param {Number} type 1: 部署前台 2: 部署后台 0: 全部部署
     * @param {Boolean} isDbClick true: 双击 false: 单击
     */
    _deployProject (type, isDbClick = false) {
      if(this.isDeploying) {
        this.$liveRem.showToast({text: '已经再部署啦！'})
        return
      }
      if (isDbClick) {
        this.postDeployRequest(type)
      } else {
        let message = `确认部署${type == 1 ? '前端' : type == 0 ? '所有' : '后台'}项目?`
        this.$liveRem.showConfirm({message}).then(() => {
          this.postDeployRequest(type)
        })
      }
    },

    /**
     * 发送部署请求
     * @param {Number} type 1: 部署前台 2: 部署后台 0: 全部部署
     */
    postDeployRequest (type) {
      this._deployStatus(true, type)
      request.defaults.timeout = 60000
      request({
        url: 'manager/deployProject',
        method: 'POST',
        data: {
          type
        }
      }).then(res => {
        let {
          vueEnd: {
            vue, vueRedeployTimes
          } = {},
          nodeEnd: {
            nodeRedeployTimes,
            node
          } = {}
        } = res
        let text = ''
        switch (type) {
          case 1:
            text = vue &&
                  // `前台部署成功,部署节点为${vue.subject},提交者为${vue.authorName},部署重试次数${vueRedeployTimes}`
                  (
                    <span>
                      前台部署成功<br/>
                      部署节点为：
                      <B class="deploy-title">{`${vue.subject}`}</B>
                      <br/>
                      提交者为：
                      <B class="deploy-title">{`${vue.authorName}`}</B>
                      <br/>
                      部署重试次数：
                      <B class="deploy-title">{`${vueRedeployTimes}`}</B>
                    </span>
                  )
            break
          case 2:
            text =  node &&
                    // `后台部署成功,部署节点为${node.subject},提交者为${node.authorName},部署重试次数${nodeRedeployTimes}`
                    (
                      <span>
                        后台部署成功<br/>
                        部署节点为：
                        <B class="deploy-title">{`${node.subject}`}</B>
                        <br/>
                        提交者为：
                        <B class="deploy-title">{`${node.authorName}`}</B>
                        <br/>
                        部署重试次数：
                        <B class="deploy-title">{`${nodeRedeployTimes}`}</B>
                      </span>
                    )
            break
          case 0:
            text = vue && node &&
                    // `前台部署成功,部署节点为${vue.subject},提交者为${vue.authorName},部署重试次数${vueRedeployTimes} +
                    // 后台部署成功,部署节点为${node.subject},提交者为${node.authorName},部署重试次数${nodeRedeployTimes}`
                    (
                      <span>
                        前台部署成功<br/>
                        部署节点为：
                        <B class="deploy-title">{`${vue.subject}`}</B>
                        <br/>
                        提交者为：
                        <B class="deploy-title">{`${vue.authorName}`}</B>
                        <br/>
                        部署重试次数：
                        <B class="deploy-title">{`${vueRedeployTimes}`}</B>
                        <br/>
                        后台部署成功,部署节点为：
                        <B class="deploy-title">{`${node.subject}`}</B>
                        <br/>
                        提交者为：
                        <B class="deploy-title">{`${node.authorName}`}</B>
                        <br/>
                        部署重试次数：
                        <B class="deploy-title">{`${nodeRedeployTimes}`}</B>
                      </span>
                    )
            break
          default:
            break
        }
        this.$liveRem.showToast({text, time: 10000})
      }).finally(() => {
        this._deployStatus(false, type)
      })
    },

    /**
     * 部署状态切换
     * @param {Boolean} value 需要切换的值
     * @param {Number} type 部署类型
     */
    _deployStatus (value, type) {
      switch (type) {
        case 1:
          this.isDeployingVue = value
          break
        case 2:
          this.isDeployingNode = value
          break
        case 3:
          this.isDeployingAll = value
          break
        default:
          return
      }
    },

    // 获取硬件信息列表
    getHardwareList () {
      request({
        url: 'manager/getHardwareList',
        method: 'GET',
        params: {
          timesArray: JSON.stringify(this.timesArray),
          sort: this.hardwareSort,
          pageSize: this.hardawrePageSize,
          curPage: this.hardwareCurPage
        }
      }).then(res => {
        this.hardwareList = res.rows
        this.hardwareTotal = res.count
        this.timesArray = res.timesArray
      })
    },

    // 选择日期完成
    dateSeleteComplete (val) {
      this.timesArray = val
      this.getHardwareList()
    },

    // 硬件信息表格切换分页
    async hardwarePagerChange (val) {
      this.hardwareCurPage = val
      await this.$refs['pagination'].pointAnimation(this.$refs['hardwareList'])
      this.getHardwareList()
    },

    // 相册分页切换
    albumPagerChange (val) {
      this.imageCurPage = val
      this.getImageList(this.fileType)
    },

    // 硬件信息表格排序
    hardwareSortChange (props, sort) {
      this.hardwareSort = `${props}=${sort}`
      this.getHardwareList()
    },

    // 日志排序查询
    loggerSortChange (prop, sort) {
      this.loggerFilter.sort = `${prop}=${sort}`
      this.getLoggerList()
    },

    // 日志分页切换
    loggerPagerChange (val) {
      this.loggerFilter.curPage = val
      this.getLoggerList()
    },

    // 获取日志列表
    getLoggerList () {
      let params = {}
      Object.keys(this.loggerFilter).forEach(key => {
        if (key !== 'total' && this.loggerFilter[key]) params[key] = this.loggerFilter[key]
      })
      params.timesArray = JSON.stringify(this.loggerFilter.timesArray)
      request({
        url: 'logger/getLoggerList',
        method: 'GET',
        params,
      }).then(res => {
        this.loggerList = res.rows
        this.loggerFilter.total = res.count
      })
    },

    // 重置日志查询条件
    resetSearchLogger () {
      this.loggerFilter =  {
        method: '', // 请求方式
        url: '', // 请求地址
        timesArray: [], // 时间段
        isError: false, // 是否只查错误信息
        pageSize: 10,
        curPage: 1,
        total: 1,
        sort: '', // 拍讯方式
        errorInfo: '', // 错误信息
        userAccount: '', // 用户账户
        userId: '', // 用户Id
        mode: '' // 用户身份
      }
      this.getLoggerList()
    }
  }
}
</script>

<style lang='scss' scoped>
  @import '../../config/css/_globalStyle.scss';
  .main /deep/{
    padding: 20px 5% 20px 5%;
    min-width: 350px;

    .design-class {
      padding: 20px;
      background-color: rgba($color: #fff, $alpha: $opacity);
      // overflow: hidden;
      border-radius: 5px;

      .manage-module {

      }

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
            border-radius: 6px;
          }

          button:nth-child(2) {
            margin-right: 0;
          }
        }
      }

      .manage {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        margin-top: 10px;
        font-size: 12px;

        .color-manage {
          padding: 10px;
          display: flex;
          flex-direction: column;
          min-width: 300px;
          border: 1px solid $theme-color;
          border-radius: 5px;
          margin: 0 20px 20px 0;

          .colors {
            display: flex;
            justify-content: space-around;
            padding-top: 25px;
            list-style: none;
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

        .footer-manage {

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

        .start-manage {

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

      .deploy-manage {
        justify-content: flex-start;
        padding-bottom: 20px;

        .deploy-btn {
          padding: 0 10px;
          height: 30px;
          margin-right: 20px;
          line-height: 30px;
          text-align: center;
          font-size: 14px;
          border-radius: 5px;
          background-color: $theme-color;
          color: #fff;
          cursor: pointer;
        }
      }

      .hardware-manage {
        position: relative;
        padding-bottom: 24px;
        .hardware-manager__filter {
          position: relative;
          width: 100%;
          justify-content: flex-start;
          display: flex;
          padding-bottom: 24px;

          .date-pick {
            position: relative;
            z-index: 1;
            background-color: #fff;

            .date-pick__container {
              background-color: #fff;
            }

            .date-picker__dialog {
              background-color: #fff;
            }
          }
        }

        .hardware-manager__table {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;

          .table-container {
            position: relative;
          }
          .table-container .table {
            font-size: 12px;
          }

          .hardware-manager__bottom {
            margin-top: 10px;
          }
        }
      }

      .logger-manage {
        flex-direction: column;

        .logger-manage__filter {
          display: flex;
          flex-wrap: wrap;
          // justify-content: space-between;
          padding-bottom: 24px;

          .login-input {
            margin-right: 30px;
          }

          .logger-manager__input {
            height: 30px;
            border: 1px solid $theme-color;
            border-radius: 5px;
            padding: 0 10px;
          }

          .select .select__input {
            width: 130px;
            height: 30px;
            line-height: 30px;
          }
          .login-label {
            width: unset;
            color: #000;
          }

          .date-pick {
            display: flex;
            position: relative;
            z-index: 1;
            background-color: #fff;

            .date-pick__container {
              background-color: #fff;
            }

            .date-picker__dialog {
              background-color: #fff;
            }
          }
        }

        .search-btns {
          display: flex;
          align-items: center;
          padding-bottom: 24px;

          .search-logger {
            width: 80px;
            height: 30px;
            text-align: center;
            line-height: 30px;
            font-size: 16px;
            background-color: $theme-color;
            border: none;
            color: #fff;
            margin-right: 20px;
            border-radius: 6px;
            cursor: pointer;
          }

          .search-cancel {
            display: inline;
            color: #000;
            font-size: 14px;
            cursor: pointer;
          }
        }


        .logger-manage__table {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;

          .logger-manage__bottom {
            margin-top: 24px;
          }
        }
      }
    }

    .design-enter-active {
      animation: open-translate-right 1.5s forwards;
    }

    .hardware-enter-active {
      animation: open-translate-bottom 1.5s forwards;
    }

    .logger-enter-active {
      animation: open-translate-left 1.5s forwards;
    }
  }

  .deploy-title {
    font-size: 14px;
    color: $theme-color;
  }
</style>
