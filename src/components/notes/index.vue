<script>
export default {

  render () {
    return (
      <div class="notes-main">
        <router-view></router-view>
      </div>
    )
  }
}
</script>

<style lang="scss" scoped>
  .notes-main {
    position: relative;
    background-color: #e5e5e5;
    padding: 10px;
    height: 100vh;
  }
</style>