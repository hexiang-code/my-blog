<script>
import request from '../../utils/http.js'
import { externalLink } from '../../config/js/mavonEditorConfig'
export default {
  data () {
    return {
      htmlContent: '', // html文本
      mdContent: '', // md文本
      title: '', // 文章标题
      catalogId: '', // 目录id
      editInitContent: '' // 编辑文章时，初始内容
    }
  },

  created () {
    this.catalogId = this.$route.query && this.$route.query.catalogId
    this.notesId = this.$route.query && this.$route.query.notesId
    if (this.notesId && this.catalogId) {
      this.getNotesContent(this.notesId)
    }
  },

  render () {
    let attrs = {
      previewBackground: 'transparent', // 预览框背景颜色
      toolbarsBackground: 'transparent', // 工具栏背景颜色
      ishljs: true,
      externalLink
    }
    return (
      <div class="edit-notes">
        <div class="edit-header">
          <div class="notes-title">
            标题
            <input vModel={this.title} class="notes-title-input"></input>
          </div>
          <div class="operation-btn">
            <div class="upload-btn" onClick={this.upload}>{this.notesId ? '更新' : '上传'}</div>
          </div>
        </div>
        <mavon-editor { ...{attrs} } vModel={this.editInitContent} onSave={this.getInputText} onImgAdd={this.uploadImage} ref="mavonEditor"></mavon-editor>
      </div>
    )
  },

  methods: {
    // 获取用户输入文本
    getInputText (mdContent, htmlContent) {
      this.mdContent = mdContent
      this.htmlContent = htmlContent
      this.$liveRem.showToast({text: '暂存成功，别忘了提交哟~', type: 'lovely'})
    },

    // 编辑时请求笔记内容
    getNotesContent (notesId) {
      request({
        url: 'notes/getNotesContent',
        method: 'GET',
        params: {
          notesId,
          type: 2
        }
      }).then(res => {
        this.editInitContent = res.content
        this.title = res.name
      })
    },

    // 上传图片
    uploadImage (filename, imageFile) {
      request.defaults.timeout = 60000
      let data = new FormData()
      data.append('file', imageFile)
      request({
        url: 'base/upload',
        data,
        method: 'POST'
      }).then(res => {
        res.forEach(item => {
          this.$refs['mavonEditor'].$img2Url(filename, item)
        })

      })
    },

    // 上传文章文章
    upload () {
      if (!this.title) {
        this.$liveRem.showToast({ text: '文章标题必填哦', type: 'error' })
        return
      }
      if (typeof this.catalogId == 'undefined') {
        this.$liveRem.showToast({ text: '文章必须得有归属哦', type: 'error' })
        return
      }
      if (!this.mdContent || !this.htmlContent) {
        this.$liveRem.showToast({ text: '蕾姆什么都没收到哟, 按ctrl + s保存吧~', type: 'error' })
        return
      }
      let url = this.notesId ? 'notes/updateNotes' : 'notes/uploadNotes'
      let method = 'POST'
      let notesInfo = {
        name: this.title,
        mdContent: this.mdContent,
        htmlContent: this.htmlContent,
        pid: this.catalogId
      }
      if (this.notesId) notesInfo.id = this.notesId
      request({url, method, data: {notesInfo}}).then(() => {
        this.$liveRem.showToast({ text: '保存好啦', type: 'sccuess' })
        this.$router.back()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../config/css/_globalStyle.scss';
  .edit-notes /deep/{
    position: relative;
    padding: 20px;
    z-index: 10;

    .v-note-wrapper {
      min-height: 800px;
      background-color: rgba($color: #fff, $alpha: $opacity);

      // .v-show-content, .v-show-content-html {
      //   background-color: rgba($color: #fff, $alpha: $opacity)!important;
      // }
    }

    .edit-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding: 0 10px;
      height: 60px;
      background-color: rgba($color: #fff, $alpha: $opacity);

      .notes-title {
        display: flex;
        align-items: center;
        font-size: 20px;
        // font-weight: bold;
        flex: 1;

        .notes-title-input {
          flex: 1;
          height: 30px;
          margin-left: 10px;
          font-size: 22px;
          padding: 4px;
          border-radius: 4px;
          border: 1px solid #f3f3f3;
        }

        .notes-title-input:focus {
          outline: none;
          border: 1px solid #f3f3f3;
        }
      }

      .operation-btn {
        display: flex;
        margin-left: 30px;
        .upload-btn {
          width: 50px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          background-color: $theme-color;
          color: #fff;
          cursor: pointer;
        }

        .upload-btn:active {
          transform: scale(.95)
        }
      }
    }

    .content-input-wrapper  {
      background-color: transparent!important;

      .content-input {
        background-color: transparent!important;

        .auto-textarea-block {
          background-color: transparent!important;
        }

        .no-border {
          background-color: transparent!important;
        }
      }
    }

  }
</style>
