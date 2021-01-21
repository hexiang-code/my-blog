<script>
import request from '../../utils/http'
import { debounce } from '../../utils/utils'
export default {
  data () {
    return {
      notesCatalog: [], // 目录
      notesList: [], // 列表
      addCatalogWindow: false, // 新增目录弹框
      addCatalogText: '', // 目录
      updateCatalogId: '', // 修改目录id
      curSelCatalog: {}, // 当前选中的目录
      notesLabelList: [], // 笔记标签列表
      isVisiableNotesLabel: false, // 是否展开笔记标签窗口
      isVisiableNotesCatalog: false, // 是否展开笔记目录窗口
      delNotesLabelVisibel: false, // 是否展示笔记标签删除按钮
      addNotesLabelVisibel: false, // 是否展示新增笔记标签功能
      newNotesLabel: '', // 新增笔记标签名称
      notesLabelCtxMenu: [
        {
          label: '新增标签',
          clickCallback: () => {
            this.addNotesLabelVisibel = true
          }
        },
        {
          label: '删除标签',
          clickCallback: () => {
            this.delNotesLabelVisibel = true
          }
        }
      ], // 笔记标签右键菜单
      notesCatalogMenuList: [
        {
          label: '新增目录',
          clickCallback: () => {
            this.addCatalogWindow = true
          }
        }
      ], // 笔记目录右键菜单
    }
  },
  watch: {
    // 新增笔记标签和删除笔记标签只能存在一个
    delNotesLabelVisibel (newVal) {
      if (newVal) this.addNotesLabelVisibel = false
    },
    // 新增笔记标签和删除笔记标签只能存在一个
    addNotesLabelVisibel (newVal) {
      if (newVal) this.delNotesLabelVisibel = false
    }
  },

  created () {
    this.getNotesCatalog()
    this.getNotesLabel()
    this.modifyCatalog = debounce(function(item, type) {
      this.updateCatalog(item, type)
    }, 300, this)
  },

  render () {
    return (
      <div class="notes-body">
        <hx-dialog dialogVisiable={this.addCatalogWindow} {...{on:{'update:dialogVisiable': this.closeWindow}}} title='新增目录' onConfirm={() => this.addCatalog()}>
          <hx-form-item label="目录名" label-icon={require('../../assets/status-icon/leimu-icon.png')}>
            <input slot="default" class="catalog-input" vModel={this.addCatalogText} type="text" placeholder="请输目录名" />
          </hx-form-item>
        </hx-dialog>
        <div class="notes-left">
          <div class="notes-catalog" ref="notes-catalog">
            <div class="add-catalog">
              <div title="鼠标右键呼出菜单">
                <i class="iconfont catalog-icon">&#xe6a5;</i>
                <span vCtxmenu={{ menuList: this.notesCatalogMenuList }}>文章列表</span>
              </div>
              <i class="iconfont notes-visiable-icon" vOpen={{target: this.$refs['notes-catalog']}}>&#xe67c;</i>
            </div>
            <div class="catalog-list">
              {this.notesCatalog.length > 0 ? this.createNotesCatalog() : ''}
            </div>
          </div>
          <div class="notes-label" ref="notes-label">
            <div class="header">
              <div vCtxmenu={{menuList: this.notesLabelCtxMenu}} title="鼠标右键呼出菜单">
                <i class="iconfont label-icon">&#xe7a5;</i>
                标签
              </div>
              <i class="iconfont notes-visiable-icon" v-open={{target: this.$refs['notes-label']}}>&#xe67c;</i>
            </div>
            <div class="content">
              {
                this.notesLabelList.map(item => {
                  return <span class={this.delNotesLabelVisibel ?  'label-item_delete' : 'label-item'}>
                    <span>{item.name}</span>
                    {
                      this.delNotesLabelVisibel
                      ? <i class="iconfont label-close" onClick={() => this.delNotesLabel(item.id)}>&#xe604;</i>
                      : ''
                    }
                  </span>
                })
              }
              {
                this.delNotesLabelVisibel
                  ? (
                      <div class="label-operation">
                        <span class="label-confirm" onClick={() => this.delNotesLabelVisibel = false}>确定</span>
                      </div>
                    )
                  : ''
              }
              {
                this.addNotesLabelVisibel
                  ? (
                    <div class="label-operation">
                      <input class="add-label" vModel={this.newNotesLabel} />
                      <span class="label-confirm" onClick={() => this.addNotesLabel()}>确定</span>
                      <span class="label-cancel" onClick={() => this.addNotesLabelVisibel = false}>取消</span>
                    </div>
                  )
                  : ''
              }
            </div>
          </div>
        </div>
        <div class="notes-center">
            <div class="notes-list">
              {this.notesList.length > 0 ? this.createNotesList() : ''}
            </div>
        </div>
        <div class="notes-right">
          <div class="wait-write">
            <h3>开发代办</h3>
          </div>
        </div>
      </div>
    )
  },

  methods: {
    // 创建目录
    createNotesCatalog () {
      return this.notesCatalog.map(item => {
        const menuList = [
          {
            label: (
              <div vVisitor>
                <i class="iconfont notes-icon">&#xe612;</i>
                <a>新增博文</a>
              </div>
            ),
            clickCallback: () => this.goEditNotes(item.id)
          },
          {
            label: (
              <div vVisitor>
                <i class="iconfont notes-icon">&#xe62e;</i>
                <a>修改目录</a>
              </div>
            ),
            clickCallback: () => this.modifyCatalog(item, 1)
          },
          {
            label: (
              <div vVisitor>
                <i class="iconfont notes-icon">&#xe62e;</i>
                <a>删除目录</a>
              </div>
            ),
            clickCallback: () => this.modifyCatalog(item, 2)
          }
        ]
        return (
          <div class="catalog-item">
            <div class={this.curSelCatalog.id === item.id ? 'catalog-title catalog_selected' : 'catalog-title'}
              onClick={() => this.selCatalog(item)}
              vCtxmenu={{menuList}}>
              {item.name}
            </div>
            <div class="catalog-btn">
              <div>
                <i class="iconfont notes-icon">&#xe658;</i>
                {item.notesNumber > 0 ? item.notesNumber + '篇' : '暂无'}
              </div>
            </div>

          </div>
        )
      })
    },

    // 创建目录列表
    createNotesList () {
      return this.notesList.map(item => {
        const noteItemCtxMenu = [
          {
            label: '删除笔记',
            clickCallback: () => {
              this.deleteNote(item)
            }
          }
        ]
        return (
          <div class="list-item">
            <div class="notes-item" title="鼠标右键呼出菜单" vCtxmenu={{menuList: noteItemCtxMenu}}>
              <a onClick={() => this.goDetail(item.id)}>{item.name}</a>
            </div>
            <div class="notes-info">
              <span>
                <i class="iconfont notes-icon" title="文章阅读量">&#xe64c;</i>
                888
              </span>
              <span>
                <i class="iconfont notes-icon" title="文章收藏量">&#xe6dc;</i>
                100
              </span>
            </div>
          </div>
        )
      })
    },

    closeWindow(val) {
      this.addCatalogWindow = val
    },
    // 进入详情
    goDetail (notesId) {
      this.$router.push({
        path: 'notesDetail',
        query: {
          notesId
        }
      })
    },

    // 选择目录
    selCatalog (item) {
      this.curSelCatalog = item
      this.getNotesList(item.id)
    },

    // 进入编辑页面
    goEditNotes (catalogId) {
      this.$router.push({
        path: 'editNotes',
        query: { catalogId }
      })
    },

    // 获取笔记目录
    getNotesCatalog () {
      request({
        url: 'notes/getNotesCatalog',
        method: 'GET'
      }).then(res => {
        this.notesCatalog = res
        if (this.notesCatalog && this.notesCatalog.length > 0) {
          this.curSelCatalog = this.notesCatalog[0]
          this.getNotesList(this.curSelCatalog.id)
        }
      })
    },

    // 获取笔记列表
    getNotesList (catalogId) {
      request({
        url: 'notes/getNotesList',
        method: 'GET',
        params: { catalogId }
      }).then(res => {
        this.notesList = res
      })
    },

    // 新增笔记目录
    addCatalog () {
      if (!this.addCatalogText) {
        this.$liveRem.showToast({text: '目录名字必填哦', type: 'error'})
      }
      // TODO 防暴击优化
      if (this.addCatalogCompelte == false) {
        this.$liveRem.showToast({text: '点击太快啦！', type: 'error'})
        return
      }
      let notesInfo = {
        name: this.addCatalogText,
        pid: 0,
        mdContent: '',
        htmlContent: '',
        type: 1
      }
      this.addCatalogCompelte = false
      request({
        url: 'notes/uploadNotes',
        method: 'POST',
        data: {notesInfo}
      }).then(() => {
          this.$liveRem.showToast({text: '目录建好啦', type: 'success'})
          this.getNotesCatalog()
      }).finally(() => this.addCatalogCompelte = true)
    },

    /**
     * 更新目录
     * @param {Object} catalog
     * @param {Number} type  2: 删除目录, 1：修改目录
     */
    updateCatalog (catalog, type) {
      let { id, name } = catalog
      if (type == 1) {
        this.addCatalogWindow = true
        this.addCatalogText = name
        return
      }
      if (type == 2) {
        let notesInfo = {
          id,
          disabled: 1
        }
        request({
          url: 'notes/updateNotes',
          method: 'POST',
          data: {notesInfo}
        }).then(() => {
          this.$liveRem.showToast({text: '又少了个目录哦', type: 'sad'})
          this.getNotesCatalog()
        })
      }
    },

    /**
     * 获取笔记标签列表
     */
    getNotesLabel () {
      request({
        url: 'notesLabel/getNotesLabelList',
        methods: 'GET',
        params: {
          curPage: -1
        }
      }).then(res => {
        this.notesLabelList = res.data.rows
      })
    },

    // 删除笔记标签
    delNotesLabel (noteLabelId) {
      request({
        url: 'notesLabel/deleteNotesLabel',
        method: 'POST',
        data: {
          noteLabelId
        }
      }).then(() => {
        this.getNotesLabel()
      })
    },

    // 新增笔记标签
    addNotesLabel () {
      request({
        url: 'notesLabel/addNotesLabel',
        method: 'POST',
        data: {
          name: this.newNotesLabel
        }
      }).then(() => {
        this.$liveRem.showToast({text: '新建笔记标签成功', type: 'success'})
        this.addNotesLabelVisibel = false
        this.getNotesLabel()
      })
    },

    // 删除单个笔记
    deleteNote (noteItem) {
      let notesInfo = {
        id: noteItem.id,
        disabled: 1
      }
      request({
        url: 'notes/updateNotes',
        method: 'POST',
        data: { notesInfo }
      }).then(() => {
        this.$liveRem.showToast({text: '删除成功'})
        this.getNotesList(this.curSelCatalog.id)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../config/css/_globalStyle.scss';
  .notes-body {
    position: relative;
    display: flex;
    align-items: flex-start;
    width: 1300px;
    margin: 0 auto;
    height: 100%;
    z-index: 10;

    /deep/ .dialog-container {
      background: $background;
      background-attachment: fixed;

      .dialog__footer {
        button {
          background-color: unset;
        }
      }
    }

    .notes-left {
      display: flex;
      flex-direction: column;
      width: 300px;
      margin-top: 10px;
      flex-shrink: 0;

      .notes-catalog {
        position: relative;
        border-radius: 5px;
        height: auto;
        background-color: rgba($color: #fff, $alpha: $opacity);

        .catalog-list {
          position: relative;
          display: flex;
          flex-direction: column;
          max-height: 400px;
          margin-top: 10px;
          padding: 12px;
          overflow-y: auto;
        }

        .add-catalog {
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          width: 100%;
          font-size: 16px;
          font-weight: bold;
          border-bottom: 1px dashed #fff;
          cursor: pointer;

          .catalog-icon {
            width: 16px;
            height: 16px;
            margin-right: 12px;
            color: $theme-color;
          }
        }

        .catalog-item {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 5px;
          margin-bottom: 12px;

          .catalog-title {
            box-sizing: border-box;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 16px;
            cursor: pointer;
          }

          .catalog_selected {
            color: $theme-color;
            font-weight: bold;
          }

          .catalog-title:hover {
            color: $theme-color;
          }

          .catalog-btn {
            margin-top: 5px;
            display: flex;
            justify-content: flex-end;

            div {
              display: flex;
              align-items: center;
              height: 16px;
              margin-right: 10px;
              font-weight: 300;
              font-size: 12px;
              cursor: pointer;
            }
          }
        }
      }

      .notes-label {
        margin-top: 12px;
        position: relative;
        background-color: rgba($color: #fff, $alpha: $opacity);
        border-radius: 5px;
        font-size: 14px;

        .header {
          display: flex;
          justify-content: space-between;
          padding: 12px;
          font-size: 16px;
          border-bottom: 1px dashed #fff;
          font-weight: bold;

          .label-icon {
            width: 16px;
            height: 16px;
            margin-right: 12px;
            color: $theme-color;
          }
        }

        .content {
          display: flex;
          flex-wrap: wrap;
          padding: 16px 12px;
          max-height: 500px;
          overflow-x: hidden;
          overflow-y: auto;

          .label-item {
            position: relative;
            margin: 0 12px;
            padding: 12px 0;
            cursor: pointer;
          }

          .label-item::after {
            content: '';
            transition: all .6s;
            height: 4px;
            width: 0;
            border-radius: 1px;
            background-color: $theme-color;
          }

          .label-item:hover::after {
            content: '';
            position: absolute;
            bottom: 4px;
            left: 0;
            width: 100%;
          }

          .label-item_delete {
            display: flex;
            justify-content: space-between;
            margin-right: 12px;
            padding: 8px;
            height: 16px;
            line-height: 16px;
            border: 1px solid #e9e9eb;
            background-color: #f5f5f5;
            border-radius: 5px;
          }

          .label-item_delete span, .label-item span {
            display: inline-block;
            max-width: 120px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }

          .label-close {
            margin-left: 8px;
            font-size: 16px;
            color: $theme-color;
            cursor: pointer;
          }

          .label-operation {
            margin-top: 12px;
            width: 100%;
          }

          .label-confirm, .label-cancel {
            display: inline-block;
            padding: 4px 12px;
            font-size: 12px;
            border-radius: 5px;
            cursor: pointer;
          }

          .label-confirm {
            background-color: $theme-color;
            color: #fff;
          }

          .label-cancel{
            margin-left: 12px;
            cursor: pointer;
            background-color: #fff;
            color: $theme-color;
            border: 1px solid $theme-color;
          }

          .add-label {
            margin-right: 12px;
            width: 100px;
            line-height: 20px;
            padding-left: 12px;
            border: 1px solid $theme-color;
            outline: none;
          }
        }
      }
    }

    .notes-center {
      flex: 1;
      margin-left: 10px;
      margin-top: 10px;
      min-height: 100vh;
      background-color: rgba($color: #fff, $alpha: $opacity);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.65);
      border-radius: 5px;

      .notes-list {
        flex: 1;
        padding: 20px;
        height: 100%;
        box-sizing: border-box;

        .list-item {
          padding-bottom: 20px;
          .notes-info {
            margin-top: 10px;
            span {
              margin-right: 10px;
              font-weight: 100;
            }
          }

          .notes-item {
            display: flex;
            flex-direction: column;
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
          }

          .notes-item:hover {
            color: $theme-color;
          }
        }
      }
    }

    .notes-right {
      margin-left: 10px;
      width: 300px;
      margin-top: 10px;
      flex-shrink: 0;

      .wait-write {
        padding: 12px;
        border-radius: 5px;
        background-color: rgba($color: #fff, $alpha: $opacity);
      }
    }

    .notes-visiable-icon {
      width: 16px;
      height: 16px;
      color: $theme-color;
      cursor: pointer;
    }

    .catalog-input {
      height: 30px;
      padding-left: 20px;
      border: 1px solid $theme-color;
      color: $theme-color;
      background-color: transparent;
      outline: none;
    }

    .hx-dialog {
      background-color: #000;
    }
  }

  .tips__song-name {
    font-size: 14px;
    color: $theme-color;
    font-weight: bold;
    margin: 0 4px;
  }

</style>
