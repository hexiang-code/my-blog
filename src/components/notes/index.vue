<script>
import request from '../../utils/http'
export default {
  data () {
    return {
      notesCatalog: []
    }
  },
  created () {
    this.getNotesCatalog()
  },
  render () {
    return (
      <div class="notes-main">
        <div class="notes-body">
          <div class="notes-catalog">
            {this.notesCatalog.length > 0 ? this.createNotesCatalog() : ''}
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
          <a class="catalog-item">{item.name}</a>
        )
      })
    },
    
    // 获取笔记目录
    getNotesCatalog () {
      request({
        url: 'notes/getNotesCatalog',
        method: 'GET'
      }).then(res => {
        this.notesCatalog = res
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../config/_globalStyle.scss';
  .notes-main {
    position: relative;

    .notes-body {
      width: 800px;
      margin: 0 auto;
      height: 100vh;

      .notes-catalog {
        display: flex;
        flex-direction: column;
        width: 300px;
        min-height: 300px;
        // border: 1px solid $leimu-color;

        .catalog-item {
          box-sizing: border-box;
          width: 300px;
          overflow: hidden;
          text-overflow: ellipsis;
          padding: 5px;
          color: $leimu-color;
          cursor: pointer;
        }
      }
    }
  }
</style>