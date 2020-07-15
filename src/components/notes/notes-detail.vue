<script>
import request from '../../utils/http'
export default {
  data () {
    return {
      notesId: '',
      notesDetail: {}
    }
  },

  render () {
    return (
      <div class="notes-info">
        <a vVisitor onClick={() => this.$router.push({path: 'editNotes', query: {notesId: this.notesId, catalogId: this.notesDetail.pid}})}>编辑</a>
        <div class="notes-detail" domPropsInnerHTML={this.notesDetail.htmlContent}></div>
      </div>
    )
  },
  created () {
    this.notesId = this.$route.query && this.$route.query.notesId
    this.getNotesDetail(this.notesId)
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
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../config/css/_globalStyle.scss';
  .notes-info {
    position: relative;
    margin: 0 auto;
    padding: 30px;
    z-index: 10;
    width: 1000px;
    display: flex;
    justify-content: center;
    background-color: rgba($color: #fff, $alpha: $opacity);
    box-sizing: border-box;
    .notes-detail {
      width: 100%;
      min-height: 100vh;
      padding: 20px;
      font-size: 16px;
    }
  }


</style>
