<script>
import request from '../../utils/http'
export default {
  data () {
    return {
      notesCatalog: [], // 目录
      notesList: [], // 列表
      addCatalogWindow: false, // 新增目录弹框
      addCatalogText: '' // 目录
    }
  },
  created () {
    this.getNotesCatalog()
  },
  render () {
    return (
      <div class="notes-body">
        <window-utils isShowWindow_sync={this.addCatalogWindow} title='新增目录' onConfirm={() => this.addCatalog()}>
          <window-utils-item label="目录名">
            <input slot="default" class="catalog-input" vModel={this.addCatalogText} type="text" placeholder="请输目录名" />
          </window-utils-item>
        </window-utils>
        <div class="notes-left">
          <div class="notes-catalog">
            {this.notesCatalog.length > 0 ? this.createNotesCatalog() : ''}
            <a class="add-catalog" onClick={() => this.addCatalogWindow = true}>新增目录</a>
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
            <a class="catalog-title">{item.name}</a>
            <a onClick={() => this.goEditNotes(item.id)}>新增博文</a>
          </div>
        )
      })
    },

    // 创建目录列表
    createNotesList () {
      return this.notesList.map(item => {
        return (
          <a class="list-item" onClick={() => this.goDetail(item.id)}>{item.name}</a>
        )
      })
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
          this.getNotesList(this.notesCatalog[0].id)
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
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../config/_globalStyle.scss';
  .notes-body {
    display: flex;
    width: 1000px;
    margin: 0 auto;
    height: 100%;

    .notes-left {
      width: 300px;
      margin-top: 10px;

      .notes-catalog {
        position: relative;
        display: flex;
        flex-direction: column;
        background-color: #fff;
        max-height: 300px;
        padding: 20px 20px 40px 20px;
        // border: 1px solid $leimu-color;

        .add-catalog {
          position: absolute;
          right: 0;
          bottom: 0px;
          font-size: 12px;
          cursor: pointer;
        } 

        .catalog-item {
          display: flex;
          justify-content: space-between;

          .catalog-title {
            box-sizing: border-box;
            overflow: hidden;
            text-overflow: ellipsis;
            padding: 5px;
            color: $leimu-color;
            font-size: 16px;
            cursor: pointer;
          }

          .catalog-add {
            font-size: 12px;
            cursor: pointer;
          }
        }
        
      }
    }

    .notes-right {
      flex: 1;
      margin-left: 10px;
      margin-top: 10px;

      .notes-list {
        flex: 1;
        padding: 20px;
        background-color: #fff;
        height: 100%;
        box-sizing: border-box;

        .list-item {
          display: flex;
          flex-direction: column;
          color: $leimu-color;
          cursor: pointer;
          font-size: 16px;
        }
      }
    }

    .catalog-input {
      height: 30px;
      padding-left: 20px;
      border: 1px solid $leimu-color;
      color: $leimu-color;
      background-color: transparent;
      outline: none;
    }
  }
  
</style>