
// 可以动态配置的样式类型
const styles = ['themeColor', 'background', 'backgroundOpacity']
const vuexs = ['startPoster', 'stratVideo']
import store from '../../store'
// 动态配置样式
const dynamicStyle = (type, value) => {
  if (styles.includes(type)) {
    document.body.style.setProperty(`--${type}`, value)
  }
  if (vuexs.includes(type)) {
    store.commit('setUserDesignSetting', { type: value })
  }
}

export {
  dynamicStyle
}
