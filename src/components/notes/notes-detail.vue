<script>
import request from '../../utils/http'
import { throttle } from '../../utils/utils'
import { externalLink } from '../../config/js/mavonEditorConfig'
export default {
  data () {
    return {
      notesId: '',
      notesDetail: {}
    }
  },
  watch: {
    'notesDetail.htmlContent': {
      handler: function (newVal) {
        let reg =/<h[1-6]{1}>(.+?)<\/h[1-6]{1}>/g
        let fragement = document.createDocumentFragment()
        newVal.replace(reg, a => {
          let root = document.createElement('div')
          root.innerHTML = a
          Array.from(root.firstChild.childNodes).forEach(item => {
            if (item.tagName === 'A') {
              let nodeAttr = item.getAttribute('id')
              item.innerText = root.firstChild.textContent
              item.setAttribute('href', `#${nodeAttr}`)
              item.removeAttribute('id')
            }
            if (item.nodeType == 3) {
              root.firstChild.removeChild(item)
            }
          })
          fragement.appendChild(root.firstChild)
        })
        this.$refs.notesCatalog.appendChild(fragement)
      }
    }
  },

  render () {
    let attrs = {
      subfield: false, // true： 双栏(编辑预览同屏)， false： 单栏(编辑预览分屏)
      defaultOpen: 'preview', // 	edit： 默认展示编辑区域 ， preview： 默认展示预览区域 , 其他 = edit
      previewBackground: 'transparent', // 预览框背景颜色
      toolbarsBackground: 'transparent', // 工具栏背景颜色
      editable: false, // 是否允许编辑
      toolbarsFlag: true, // 工具栏是否显示
      navigation: false,
      ishljs: true, // 代码高亮
      toolbars: {
        navigation: false, // 导航目录
        readmodel: true, // 沉浸式阅读
        preview: true, // 预览
        help: true // 帮助
      },
      externalLink,
    }
    return (
      <div class="notes-info">
        <div class="notes-catalog" ref="notesCatalog"></div>
        <div class="notes-content">
          <mavon-editor ref="mavonEditor" value={this.notesDetail.htmlContent} {...{attrs}} onPreviewToggle={ () => this.editNotes()}></mavon-editor>
        </div>

      </div>
    )
  },
  created () {
    this.notesId = this.$route.query && this.$route.query.notesId
    this.getNotesDetail(this.notesId)
    document.onscroll = throttle(() => {
      let cssText = `transform: translateY(${document.documentElement.scrollTop}px); transition: .3s;`
      this.$refs.notesCatalog.style.cssText = cssText
    })
  },

  destroyed () {
    document.onscroll = null
  },

  methods: {
    getNotesDetail (notesId) {
      request({
        url: 'notes/getNotesContent',
        method: 'GET',
        params: {notesId}
      }).then(res => {
        this.notesDetail = res
      })
    },

    editNotes () {
      this.$router.push({path: 'editNotes', query: {notesId: this.notesId, catalogId: this.notesDetail.pid}})
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../config/css/_globalStyle.scss';
  .notes-info /deep/{
    position: relative;
    margin: 0 auto;
    padding: 0 30px;
    z-index: 10;
    display: flex;
    justify-content: center;
    box-sizing: border-box;

    .notes-catalog {
      position: relative;
      width: 300px;
      max-height: 500px;
      margin-right: 10px;
      padding: 20px 0;
      overflow-y: auto;
      background-color: rgba($color: #fff, $alpha: $opacity);
      box-sizing: border-box;

      h1, h2, h3, h4, h5, h6 {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-size: 17px;
        font-weight: normal;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;


        a {
          color: #000;
        }
      }

      h1 {
        padding: 5px 0 5px 12px;
      }

      h2 {
        padding: 5px 0 5px 28px;
      }

      h3 {
        padding: 5px 0 5px 44px;
      }

      h4 {
        padding: 5px 0 5px 60px;
      }

      h5 {
        padding: 5px 0 5px 72px;
      }

      h6 {
        padding: 5px 0 5px 88px;
      }
    }

    .notes-content {
      width: 1000px;
      background-color: rgba($color: #fff, $alpha: $opacity);

      .v-note-wrapper {
        background-color: transparent;

        .v-note-navigation-wrapper {
          // position: fixed;
          // top: 160px;
          bottom: unset;
          height: auto;
        }
      }
    }




  }


</style>
