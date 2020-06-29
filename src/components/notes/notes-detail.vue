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
      <div>
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
  .notes-detail {
    margin: 0 auto;
    padding: 20px;
    width: 1000px;
    font-size: 16px;
    background-color: #fff;
  }
</style>
