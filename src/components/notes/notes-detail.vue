<script>
import request from '../../utils/http'
// import { throttle } from '../../utils/utils'
import { externalLink } from '../../config/js/mavon-editor-config'
import { colorArray } from '../manager-page/manager-config'
import { formatDate } from '../../utils/utils'
let intersectionIo // dom观察器
export default {
  data () {
    return {
      notesId: '', // 笔记id
      notesDetail: {}, // 笔记详情
      notesLabelList: [] // 笔记标签列表
    }
  },
  watch: {
    'notesDetail.htmlContent': {
      handler: function (newVal) {
        let reg =/<h[1-6]{1}>(.+?)<\/h[1-6]{1}>/g
        let fragement = document.createDocumentFragment()
        if (!newVal) return
        newVal.replace(reg, a => {
          let root = document.createElement('div')
          root.innerHTML = a
          Array.from(root.firstChild.childNodes).forEach(item => {
            if (item.tagName === 'A') {
              let nodeAttr = item.getAttribute('id')
              item.innerText = root.firstChild.textContent
              item.setAttribute('href', `#${nodeAttr}`)
              item.removeAttribute('id')
              // 目录随内容高亮
              this.notesCatalogObserve(nodeAttr)
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

  computed: {
    // 笔记更新时间
    updatedAt () {
      let { updatedAt } = this.notesDetail
      return formatDate('YYYY-MM-DD hh:mm:ss', updatedAt)
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
        <div class="left" ref="noteLeft">
          {
            this.notesLabelList.length > 0
             ? (
                <div class="notes-labels">
                  {
                    this.notesLabelList.map(label => {
                      let colorIndex = Math.floor(Math.random() * colorArray.length)
                      let color = colorArray[colorIndex]
                      return (
                        <span class="label-item" style={{color: color, 'border-style': color}}>{label.name}</span>
                      )
                    })
                  }
                </div>
             )
             : ''
          }
          <div class="notes-catalog">
            <div class="catalog-text">目录</div>
            <div class="list" ref="notesCatalog"></div>
          </div>
        </div>
        <div class="notes-content">
          <div class="notes-title">
            <span class="notes-name">{ this.notesDetail.name }</span>
            <span class="notes-updated-at">更新于 { this.updatedAt }</span>
          </div>
          <mavon-editor ref="mavonEditor" value={this.notesDetail.htmlContent || ''} {...{attrs}} onPreviewToggle={ () => this.editNotes()}></mavon-editor>
        </div>
      </div>
    )
  },

  created () {
    this.notesId = this.$route.query && this.$route.query.notesId
    this.getNotesDetail(this.notesId)
    intersectionIo = new IntersectionObserver(entries => {
      for(let entry of entries) {
        // if (entry.intersectionRect.top < 200) {
        //   this.highLightCatalog(entry.target.getAttribute('id'))
        //   return
        // }
        if (entry.intersectionRatio > 0.2) {
          this.highLightCatalog(entry.target.getAttribute('id'))
          return
        }
      }
    }, {
      entries: [0, 0.5, 0.75, 1]
    })
  },

  mounted () {
    const scrollFn = () => {
      let scrollTop = document.documentElement.scrollTop
      let cssText = `transform: translateY(${scrollTop}px);`
      this.$refs.noteLeft.style.cssText = cssText
    }
    scrollFn()
    // document.onscroll = throttle(scrollFn, 50)
    document.onscroll = scrollFn
  },

  destroyed () {
    document.onscroll = null
    intersectionIo.disconnect()
  },

  methods: {
    // 获取笔记详情
    getNotesDetail (notesId) {
      request({
        url: 'notes/getNotesContent',
        method: 'GET',
        params: {notesId}
      }).then(res => {
        if (res.notesLabel && res.notesLabel.length > 0) this.notesLabelList = res.notesLabel
        this.$nextTick(() => {
          this.notesDetail = res
        })
      })
    },

    // 编辑笔记
    editNotes () {
      this.$router.push({path: 'editNotes', query: {notesId: this.notesId, catalogId: this.notesDetail.pid}})
    },

    //目录随内容高亮
    async notesCatalogObserve (id) {
      await this.$nextTick()
      intersectionIo.observe(document.getElementById(id))
    },

    // 高亮笔记目录
    highLightCatalog (id) {
      let catalogs = this.$refs.notesCatalog.childNodes
      let catalogInfo = this.$refs.notesCatalog.getBoundingClientRect()
      let listHeight = catalogInfo.height
      for (let catalog of catalogs) {
        for (let child of catalog.childNodes) {
          if (child.tagName === 'A' && child.getAttribute('href') === `#${id}`) {
            // catalog.scrollIntoView({
            //   behavior: 'auto',
            //   block: 'center'
            // })
            // let nums = Math.floor(catalog.offsetTop / listHeight)
            if (catalog.offsetTop > listHeight/ 2) {
              this.$refs.notesCatalog.scrollTo(0, Math.floor(catalog.offsetTop - listHeight/2))
            } else {
              this.$refs.notesCatalog.scrollTo(0, 0)
            }

            catalog.classList.add('catalog-select')
          } else {
            catalog.classList.remove('catalog-select')
          }
        }
      }
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
    align-items: flex-start;
    box-sizing: border-box;

    .left {
      display: flex;
      flex-direction: column;
      margin-right: 10px;

      .notes-labels {
        display: flex;
        background-color: rgba($color: #fff, $alpha: $opacity);
        padding: 12px;
        margin-bottom: 24px;
        font-size: 12px;
        border-radius: 5px;

        .label-item {
          background-color: #fff;
          display: inline-block;
          border: 1px solid;
          padding: 4px 12px;
          border-radius: 3px;
          margin-right: 12px;
        }
      }

      .notes-catalog {
        position: relative;
        width: 300px;
        max-height: 480px;
        padding: 0 5px;
        overflow-y: auto;
        background-color: rgba($color: #fff, $alpha: $opacity);
        box-sizing: border-box;
        border-radius: 5px;
        overflow: hidden;
        padding-bottom: 10px;

        .list {
          overflow-x: hidden;
          overflow-y: auto;
          margin-top: 24px;
          max-height: 380px;
        }

        .catalog-text {
          margin: 0 12px;
          padding: 12px 0;
          border-bottom: 1px dashed #f5f5f5;
          font-size: 16px;
          font-weight: bold;
        }

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
          padding: 5px 0 5px 24px;
        }

        h3 {
          padding: 5px 0 5px 36px;
        }

        h4 {
          padding: 5px 0 5px 48px;
        }

        h5 {
          padding: 5px 0 5px 60px;
        }

        h6 {
          padding: 5px 0 5px 72px;
        }
      }
    }

    .notes-content {
      width: 1000px;
      background-color: transparent;
      border-radius: 5px;

      .notes-title {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        padding: 20px;
        margin-bottom: 20px;
        font-size: 28px;
        font-weight: bold;
        border-radius: 5px;
        background-color: rgba($color: #fff, $alpha: $opacity);

        .notes-name {
          flex: 1;
          margin-right: 50px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          animation: text-twinkle 3s infinite;
          color: #fff;
        }

        .notes-name:hover {
          color: #000;
          animation: none;
        }

        .notes-updated-at {
          flex-shrink: 0;
          padding-bottom: 4px;
          font-size: 16px;
          font-weight: normal;
        }
      }

      .v-note-wrapper {
        // background-color: transparent;
        background-color: rgba($color: #fff, $alpha: $opacity);

        .v-note-navigation-wrapper {
          // position: fixed;
          // top: 160px;
          bottom: unset;
          height: auto;
        }
      }
    }

    .markdown-body h1 a:before, .markdown-body h2 a:before, .markdown-body h3 a:before,
    .markdown-body h4 a:before, .markdown-body h5 a:before, .markdown-body h6 a:before {
      content: '';
      display: block;
      margin-top: -80px;
      height: 80px;
      visibility: hidden;
    }

    .catalog-select {
      transform: translateX(12px);
      transition: all .5s;
    }

    .catalog-select a {
      color: $theme-color !important;
    }
  }
</style>
