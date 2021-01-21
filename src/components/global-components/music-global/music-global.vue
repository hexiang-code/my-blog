<script>
import request  from '../../../utils/http'
import codeHeUI from 'codehe-ui'
const pointAnimation = codeHeUI.pointAnimation

export default {
  name: 'globalMusic',

  data () {
    return {
      musicList: [], // 音乐列表
      currentMusicInfo: {
        musicLyric: '', // 歌词
        musicSrc: '', // 歌曲url
        musicFaceSrc: '', // 歌曲封面地址
        singer: '', // 歌手
        song: '' // 歌名
      }, // 当前音乐信息
      musicVolume: 50, // 音乐盒初始音量
      musicPlayMode: 'sequence', // 音乐播放顺序
      musicVisiable: false, // 音乐盒展示开关
      isMusicStart: false // 音乐盒是否开始播放
    }
  },

  created () {
    this.getMusicList()
    this.init()
  },

  mounted () {
    this.musicBindLiveRem()
  },

  render () {
    return (
      <div class="music-zone" vDrag={{limit: 'window'}} ref="music-zone">
        <i class="iconfont music-switch" onClick={$event => this.openMusic($event)}>&#xe6a1;</i>
        <transition name="music-box">
          <div class="music-box" ref="music" vShow={this.musicVisiable}>
            <hx-music
              ref="hx-music"
              playMode={this.musicPlayMode}
              onEnd={mode =>  mode !== 'circulation' && this.changeMusic(mode, 2)}
              onUp={mode => this.changeMusic(mode, 1)}
              onNext={mode => this.changeMusic(mode, 2)}
              volume={this.musicVolume}
              {...{
                attrs: this.currentMusicInfo,
                on: {
                  'music-start': () => this.musicStart(),
                  'music-pause': () => this.isMusicStart = false,
                  'update:volume': val => this.musicVolume = val,
                  'music-error': mode => this.musicError(mode)
                }
              }}>
            </hx-music>
            <div class="container">
              <div class="container-header">
                歌单
                <i class="iconfont list-visiable-icon" vOpen={{target: this.$refs['music-list'], height: 0}}>&#xe67c;</i>
              </div>
              <ul class="music-list" ref="music-list">
                {
                  this.musicList.map(item => {
                    return (
                      <li
                        class={{ 'selected': this.currentMusicInfo.songId == item.songId }}
                        title="item.songName"
                        onClick={() => this.checkMusic(item)}
                      >{item.songName}</li>
                    )
                  })
                }
              </ul>
            </div>
          </div>
        </transition>
      </div>
    )
  },

  methods: {
    // 音乐盒初始化
    init () {
      this.musicVolume = this.$store.getters.getMusicBoxSetting.musicVolume
      this.musicPlayMode = this.$store.getters.getMusicBoxSetting.musicPlayMode
    },

    // 展示音乐盒
    async openMusic ($event) {
      $event.stopPropagation()
      if (!this.musicVisiable) this.musicVisiable = true
      else {
        // 将Drag指令绑定的样式移除
        this.$refs['music-zone'].style = ""
        !this.isMusicStart && await pointAnimation(this.$refs['music'], { isRemoveTargetNode: true })
        this.musicVisiable = false
      }
    },

    // 网易云音乐盒,请求音乐列表
    async getMusicList () {
      let musicList = await request({
        url: 'proxy/getMusicList',
        method: 'GET',
      })
      this.musicList = musicList
      let musicId = this.$store.getters.getMusicBoxSetting.musicId
      let currentMusic
      if (musicId) {
        currentMusic = this.musicList.find(item => item.songId == musicId) || this.musicList[0]
      } else {
        currentMusic = this.musicList[0]
      }
      if (currentMusic) {
        this.currentMusicInfo = await this._getCurrentMusicFromMusicList(currentMusic)
      }

    },

    // 播放音乐
    async checkMusic (music) {
      this.$refs['hx-music'].pauseMusic()
      this.currentMusicInfo = await this._getCurrentMusicFromMusicList(music)
      await this.$nextTick()
      this.playMusic()
    },

    // 播放音乐
    playMusic() {
      this.$refs['hx-music'].playMusic()
    },

    // 监听音乐开始播放
    musicStart () {
      let text = (<span>
        当前播放的是
        <span class="tips__song-name">{`${this.currentMusicInfo.singer}`}</span>的
        <span class="tips__song-name">{`${this.currentMusicInfo.song}`}</span>, 很好听哟
      </span>)
      this.$liveRem.showToast({text, type: 'shy'})
      this.isMusicStart = true
    },

    /**
     * 切换音乐
     * @param {String} playMode 播放模式 random:随机播放，circulation:单曲循环，sequence:顺序播放
     * @param {Number} type 1: 上一曲 2:下一曲
     */
    async changeMusic (playMode, type) {
      if (playMode === 'random') {
        this.currentMusicInfo = await this._getCurrentMusicFromMusicList(this._getRandomMusic())
      } else if (playMode == 'sequence' || playMode === 'circulation') {
        let index = this.musicList.findIndex(music => music.songId === this.currentMusicInfo.songId)
        if (index == 0 && type == 1) index == this.musicList.length - 1
        if (index > this.musicList.length - 1) index = 0
        this.currentMusicInfo = type == 2
          ? await this._getCurrentMusicFromMusicList(this.musicList[index + 1])
          : await this._getCurrentMusicFromMusicList(this.musicList[index - 1])
      }
      this.playMusic()
    },

    // 随机获取歌曲
    _getRandomMusic () {
      let len = this.musicList.length
      let random = Math.floor(Math.random() * len)
      return this.musicList[random]
    },

    /**
     * 从音乐列表中获取一条音乐数据
     */
    async _getCurrentMusicFromMusicList (music) {
      let lyric = await request({
        url: 'proxy/getMusicLyric',
        params: {
          songId: music.songId
        }
      })
      let currentMusicInfo = {
          musicLyric: lyric, // 歌词
          musicSrc: music.songUrl, // 歌曲url
          musicFaceSrc: `${music.picUrl}?param=80y80`, // 歌曲封面地址
          singer: music.singer, // 歌手
          song: music.songName, // 歌名
          songId: music.songId // 歌曲id
      }
      return currentMusicInfo
    },

    // 音乐播放出错
    musicError (mode) {
      console.log(mode, 'music error')
      this.changeMusic(mode, 2)
    },

    // 将音乐盒控制绑定到liveRem菜单
    musicBindLiveRem () {
      let liveRemMeauList = [
        {
          name: '上一曲',
          icon: '&#xe61f;',
          clickCallback: () => {
            this.changeMusic(1)
          }
        },
        {
          name: '下一曲',
          icon: '&#xe651;',
          clickCallback: () => {
            this.changeMusic(2)
          }
        },
        {
          name: this.isMusicStart ? '暂停' : '开始',
          icon: this.isMusicStart ? '&#xe60f;' : '&#xe617;',
          type: this.isMusicStart ? 'musicStart' : 'musicPause',
          clickCallback: () => {
            let { type } = liveRemMeauList[2]
            if (type == 'musicStart') {
              this.pauseMusic()
              liveRemMeauList[2] = Object.assign(liveRemMeauList[2], {name: '开始', icon: '&#xe617;', type: 'musicPause'})
            }
            if (type == 'musicPause') {
              this.playMusic()
              liveRemMeauList[2] = Object.assign(liveRemMeauList[2], {name: '开始', icon: '&#xe60f;', type: 'musicStart'})
            }
          }
        }
      ]
      this.$store.commit('setLiveRemMeauList', liveRemMeauList)
    },

    // 将音乐盒记录保存到服务器
    deactivated () {
      let payload = {
        musicId: this.currentMusicInfo.songId,
        musicVolume: this.musicVolume,
        musicMode: this.musicPlayMode
      }
      let hasModify
      let musicBoxSetting = this.$store.getters.getMusicBoxSetting
      for (let key in payload) {
        if(payload[key] !== undefined && payload[key] !== null && payload[key] !== musicBoxSetting[key]) {
          hasModify = true
          break
        }
      }
      if (hasModify) {
          request({
            url: 'userSetting/updateUserSetting',
            method: 'POST',
            data: payload
          }).then(() => {
            this.$store.commit('setMusicBoxSetting', Object.assign({}, payload))
          })
        }
    },
  }

}
</script>

<style lang="scss">
  @import '../../../config/css/_globalStyle.scss';
  .music-zone {
    position: fixed !important;
    top: 100px;
    right: 0px;
    z-index: 10001;
    max-width: 320px;

    .music-box {
      width: 300px;
      padding: 0 10px;
      transition: all .3s;

      .container {
        margin-top: 12px;
        background-color: rgba($color: #fff, $alpha: $opacity);
        box-sizing: border-box;
        border-radius: 5px;

        .container-header {
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 12px;
          font-size: 16px;
          font-weight: bold;
          border-bottom: 1px dashed #fff;
          cursor: pointer;

          .list-visiable-icon {
            width: 16px;
            height: 16px;
            color: $theme-color;
            cursor: pointer;
          }
        }

        .music-list {
          max-height: 350px;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 5px 12px;

          li {
            width: 100%;
            max-height: 274px;
            padding: 0 12px;
            overflow-y: auto;
            overflow-x: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            margin-top: 8px;
            font-size: 12px;
            cursor: pointer;
          }

          .selected {
            font-weight: bold;
            color: $theme-color;
          }
        }

      }
    }

    .music-switch {
      position: absolute;
      top: 0;
      left: -50px;
      font-size: 40px;
      color: #fff;
      animation: move 3s infinite;
      cursor: pointer;
    }

    @keyframes move {
      0% {
        opacity:0.3;
      }
      100% {
        opacity:1;
        text-shadow:0 0 80px #91bef0, 0 0 30px #33B5E5, 0 0 6px #669900;
      }
    }
  }

  .music-box-enter-active {
    animation: open-right .3s forwards;
  }

  .music-box-leave-active {
    animation: open-right .3s reverse forwards;
  }

  @keyframes open-right {
    from {
      transform: translateX(100%)
    }

    to {
      transform: translateX(0)
    }
  }
</style>
