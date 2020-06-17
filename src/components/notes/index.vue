<script>
export default {

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
  .notes-main {
    position: relative;
    padding: 10px;
    height: 100vh;

    .canvas-bg {
      position: absolute;
      background-color: #f5f6f7;
    }
  }
</style>