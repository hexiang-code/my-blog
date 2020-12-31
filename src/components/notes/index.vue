<script>
export default {
  name: 'notesIndex',
  render () {
    return (
      <div class="notes-main">
        <canvas-bg></canvas-bg>
        <router-view></router-view>
      </div>
    )
  }
}
</script>

<style lang="scss" scoped>
  @import '../../config/css/_globalStyle.scss';
  .notes-main {
    position: relative;
    padding: 0 10px 10px 10px;
    z-index: 9;
    min-height: 100vh;

    .canvas-bg {
      position: fixed;
      z-index: 9;
    }
  }
</style>
