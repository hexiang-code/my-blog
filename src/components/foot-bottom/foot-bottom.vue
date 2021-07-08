<template>
  <div class="foot-zone">
    <div class="footer-info">
      <div class="foot-left">
        <p class="font-left">{{footerSetting.personalSign[0]}}</p>
        <p class="font-right">{{footerSetting.personalSign[1]}}</p>
      </div>
      <div class="foot-right">
        <div class="bottom-nav">
          <div
            class="bottom-nav-item"
            v-for="(item,index) in bottomNavArr"
            :key="index"
            @click="clickNav(index, item.name)"
          >{{item.title}}</div>
        </div>
        <div class="person-info">
          <p>
            <span>QQ: {{footerSetting.QQ}}</span>
            <span>微信：{{footerSetting.wechat}}</span>
          </p>
          <p>
            <span>地址: {{footerSetting.address}}</span>
            <span>邮箱: {{footerSetting.email}}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="record-info">
      备案号： 皖ICP备19024215号
    </div>
  </div>
</template>
<script>
import bottomNavArr from "../../config/js/first-nav-config";

export default {
  data() {
    return {
      bottomNavArr: bottomNavArr
    };
  },

  computed: {
    footerSetting() {
      return this.$store.getters.getUserDesignSetting.footerSetting;
    },

    selectedNav: {
      get() {
          return this.bottomNavArr.findIndex(item => this.$route.path.indexOf(item.name) > -1)
      },
      set (val) {
          return val
      }
    }
  },

  methods: {
    clickNav(index, name) {
      this.selectedNav = index;
      this.$router.push({name})
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../config/css/_globalStyle";
.foot-zone {
  width: 100%;
  height: 200px;
  background: #333333;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .footer-info {
    display: flex;
    align-items: center;
    justify-content: space-around;
    .foot-left {
      .font-left {
        font-size: 30px;
        margin: 0;
      }

      .font-right {
        margin: 0;
        font-size: 20px;
        color: $theme-color;
        margin-left: 100px;
      }
    }

    .foot-right {
      display: flex;
      flex-direction: column;
      justify-content: center;
      .bottom-nav {
        width: 300px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .bottom-nav-item {
          color: #ffffff;
          font-size: 13px;
          cursor: pointer;
        }

        .selected {
          background: $theme-color;
          color: #ffffff;
        }
      }

      .person-info {
        color: #ffffff;
        min-width: 350px;
        height: 70px;
        margin-top: 20px;

        p {
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }

  .record-info {
    text-align: center;
    font-size: 20px;
    color: #fff;
  }

}
</style>
