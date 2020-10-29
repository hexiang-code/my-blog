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
      curSelCatalog: {} // 当前选中的目录
    }
  },
  created () {
    this.getNotesCatalog()
    this.modifyCatalog = debounce(function(item, type) {
                          this.updateCatalog(item, type)
                        }, 300, this)
  },
  render () {
    return (
      <div class="notes-body">
        <hx-dialog isShowWindow={this.addCatalogWindow} {...{on:{'update:dialogVisiable': this.closeWindow}}} title='新增目录' onConfirm={() => this.addCatalog()}>
          <hx-form-item label="目录名">
            <input slot="default" class="catalog-input" vModel={this.addCatalogText} type="text" placeholder="请输目录名" />
          </hx-form-item>
        </hx-dialog>
        <div class="notes-left">
          <div class="notes-catalog">
            <div class="catalog-list">
              {this.notesCatalog.length > 0 ? this.createNotesCatalog() : ''}
            </div>
            <div class="add-catalog">
              <a onClick={() => this.addCatalogWindow = true}>新增目录</a>
              <i class="iconfont notes-icon">&#xe612;</i>
            </div>
          </div>
        </div>
        <div class="notes-right">
            <div class="notes-list">
              {this.notesList.length > 0 ? this.createNotesList() : ''}
            </div>
        </div>

      </div>
    )
  },
  methods: {
    // 创建目录
    createNotesCatalog () {
      return this.notesCatalog.map(item => {
        return (
          <div class="catalog-item">
            <div class={this.curSelCatalog.id === item.id ? 'catalog-title catalog_selected' : 'catalog-title'} onClick={() => this.selCatalog(item)}>
              {item.name}
            </div>
            <div class="catalog-btn">
              <div>
                <i class="iconfont notes-icon">&#xe658;</i>
                {item.notesNumber > 0 ? item.notesNumber + '篇' : '暂无'}
              </div>
              <div vVisitor>
                <i class="iconfont notes-icon">&#xe612;</i>
                <a onClick={() => this.goEditNotes(item.id)}>新增博文</a>
              </div>
              <div vVisitor>
                <i class="iconfont notes-icon">&#xe62e;</i>
                <a onClick={() => this.modifyCatalog(item, 1)} onDblclick ={() => this.modifyCatalog(item, 2)}>修改目录</a>
              </div>
            </div>

          </div>
        )
      })
    },

    // 创建目录列表
    createNotesList () {
      return this.notesList.map(item => {
        return (
          <div class="list-item">
            <div class="notes-item">
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
      let notesInfo = {
        name: this.addCatalogText,
        pid: 0,
        mdContent: '',
        htmlContent: '',
        type: 1
      }
      request({
        url: 'notes/uploadNotes',
        method: 'POST',
        data: {notesInfo}
      }).then(() => {
          this.$liveRem.showToast({text: '目录建好啦', type: 'success'})
          this.getNotesCatalog()
      })
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
        request({
          url: 'notes/updateNotes',
          method: 'POST',
          data: {
            id,
            disabled: 1
          }
        }).then(() => {
          this.$liveRem.showToast({text: '又少了个目录哦', type: 'sad'})
          this.getNotesCatalog()
        })
      }
    },

  }
}
</script>

<style lang="scss" scoped>
  @import '../../config/css/_globalStyle.scss';
  .notes-body {
    position: relative;
    display: flex;
    width: 1300px;
    margin: 0 auto;
    height: 100%;
    z-index: 10;

    .notes-left {
      width: 300px;
      margin-top: 10px;

      .notes-catalog {
        position: relative;
        background-color: rgba($color: #fff, $alpha: $opacity);
        padding-top: 20px;

        .catalog-list {
          position: relative;
          display: flex;
          flex-direction: column;
          max-height: 500px;
          padding: 20px 20px 20px 20px;
          overflow-y: auto;
        }

        .add-catalog {
          position: absolute;
          left: 0;
          top: 0;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          padding: 10px 0 0 10px;
          width: 100%;
          font-size: 12px;
          cursor: pointer;
        }

        .catalog-item {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 5px;
          margin-bottom: 10px;

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
    }

    .notes-right {
      flex: 1;
      margin-left: 10px;
      margin-top: 10px;
      min-height: 100vh;

      .notes-list {
        flex: 1;
        padding: 20px;
        background-color: rgba($color: #fff, $alpha: $opacity);
        height: 100%;
        box-sizing: border-box;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.65);

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

</style>
