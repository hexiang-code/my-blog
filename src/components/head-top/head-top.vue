<template>
  <div class="head-top-zone">
    <div class="nav-list">
      <div
        :class="['nav-item', selectedNav === index ? 'selected' : '']"
        v-for="(item,index) in firstNavConfig"
        :key="index"
        @click="clickNav(index, item.name)"
      >{{item.title}}</div>
    </div>
  </div>
</template>
<script>
import firstNavConfig from "../../config/js/first-nav-config";
export default {
  data() {
    return {
      firstNavConfig: firstNavConfig //一级导航配置
    };
  },

  computed: {
    selectedNav: {
      get() {
        return this.firstNavConfig.findIndex(item => this.$route.path.indexOf(item.name) > -1)
      },

      set(val) {
        return val;
      }
    }
  },

  methods: {
    clickNav(index, name) {
      this.selectedNav = index;
      this.$router.push({ name });
    }
  }
};
</script>
<style lang='scss' scoped>
@import "../../config/css/_globalStyle.scss";
.head-top-zone /deep/ {
  height: 80px;
  position: fixed;
  top: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  z-index: 10;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.05);
  overflow: hidden;
  // background-color: #fff;

  .nav-list {
    position: relative;
    right: 20%;
    display: flex;

    .nav-item {
      border-radius: 20px;
      width: 100px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      margin-left: 20px;
      cursor: pointer;
      color: #ffffff;
    }

    .nav-item:first-child {
      margin-left: 0;
    }

    .nav-item:hover {
      background: $theme-color;
      color: #ffffff;
    }
  }

  .selected {
    background: $theme-color;
    color: #ffffff;
  }
}

.head-top-zone::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: -1;
  background: $background no-repeat;
  background-size: cover;
  background-attachment: fixed;
  -webkit-filter: blur(20px);
  -o-filter: blur(20px);
  -moz-filter: blur(20px);
  filter: blur(20px);
  margin: -30px;
}
</style>
