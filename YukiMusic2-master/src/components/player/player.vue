<template>
  <div class="block player-container">
    <div class="playlist-container" v-show="showList">
      <el-row class="list-header">
        <el-col class="header header-playlist" :span="12">
          播放列表&nbsp;({{playList.length}})
          <p class="header-emptylist iconfont icon-jinzhi" @click="_clearList">&nbsp;清空列表</p>
        </el-col>
        <el-col
          class="header header-songname"
          :span="11"
        >{{currentSong.name ? currentSong.name : '播放列表为空'}}</el-col>
        <el-col :span="1" class="header header-close">
          <p class="header-closelist iconfont icon-shanchu" @click="toggleListDisplay"></p>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="playlist" :span="12">
          <vuescroll :ops="ops" ref="listScroller">
            <el-row
              class="playlist-item"
              v-for="(item,idx) in sequenceList"
              :key="idx"
              :class="{'item-active':sequenceList[idx].id===currentSong.id}"
              ref="listItem"
              @mouseenter.native="toggleListHandler(idx)"
              @mouseleave.native="toggleListHandler()"
            >
              <el-col :span="11" :title="sequenceList[idx].name">{{sequenceList[idx].name}}</el-col>
              <el-col :span="2">
                <span
                  class="iconfont icon-zanting list-play-btn"
                  v-show="currentListIndex===idx"
                  @click="changeSong(idx)"
                ></span>
              </el-col>
              <el-col :span="2">
                <span
                  class="iconfont icon-jinzhi list-remove-btn"
                  v-show="currentListIndex===idx"
                  @click="_removeSong(idx)"
                ></span>
              </el-col>
              <el-col :span="3">{{_transTime(sequenceList[idx].duration)}}</el-col>
              <el-col
                :span="6"
                :title="sequenceList[idx].singer"
                tag="li"
              >{{sequenceList[idx].singer}}</el-col>
            </el-row>
          </vuescroll>
        </el-col>
        <el-col class="lyrics" :span="12">
          <vuescroll :ops="ops" ref="lyricsScroller">
            <div
              class="lyrics-container"
              v-if="currentLyrics&&currentLyrics.lines&&this.playList.length"
            >
              <div class="blank"></div>
              <ul v-if="currentLyrics&&currentLyrics.lines.length!=0">
                <li
                  class="each-lyrics"
                  v-for="(item, idx) in currentLyrics.lines"
                  :key="idx"
                  :class="{'currentLyric':idx===currentLyrics.curNum-1}"
                  ref="lyricsItem"
                >{{item.txt}}</li>
              </ul>
              <div class="each-lyrics" v-else>暂无歌词或为纯音乐</div>
              <div class="blank"></div>
            </div>
          </vuescroll>
        </el-col>
      </el-row>
    </div>
    <audio
      :src="playUrl"
      ref="player"
      @canplaythrough="ready"
      @error="error()"
      @ended="end"
      @timeupdate="sliderUpdate"
    ></audio>
    <div class="volume-adjust" v-show="volDisplay">
      <div class="block">
        <el-slider v-model="volume" vertical class="volume-slider"></el-slider>
      </div>
    </div>
    <div class="player-body">
      <el-row>
        <el-col :span="3">
          <ul class="react-left">
            <li class="left-item kuaitui iconfont icon-kuaitui" @click="prev"></li>
            <li
              class="left-item bofang iconfont"
              @click="togglePlay"
              :class="{'icon-zanting':!playing,'icon-bofang':playing}"
            ></li>
            <li class="left-item kuaijin iconfont icon-kuaijin" @click="next"></li>
          </ul>
        </el-col>
        <el-col :span="2" class="pic">
          <img :src="currentSong.albumPic" alt />
        </el-col>
        <el-col class="slider-container" :span="11">
          <el-row class="slider">
            <el-col class="song-info">
              <div class="info-name">{{currentSong.name}}</div>
              <div class="info-singer">&nbsp;&nbsp;{{currentSong.singer}}</div>
            </el-col>
            <el-slider
              v-model="progress"
              :show-tooltip="false"
              class="slider-body"
              @change="mouseChange"
            ></el-slider>
          </el-row>
        </el-col>
        <el-col class="time" :span="3">
          <span class="current-time" v-if="currentSong.id">{{currentTime}}</span>
          <span class="total-time" v-if="currentSong.id">/&nbsp;{{_transTime(currentSong.duration)}}</span>
        </el-col>
        <el-col :span="5">
          <ul class="react-right">
            <li class="right-item volume iconfont icon-shengyin" @click="toggleVol"></li>
            <li class="right-item mode iconfont" :class="iconMode" @click="toggleMode"></li>
            <li class="right-item list iconfont icon-liebiao" @click="toggleListDisplay"></li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </div>
</template>


<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { transTime, shuffle } from 'api/kit'
import { getPlayUrl } from 'api/song'
import { ERR_OK } from 'api/config'
import { playMode } from 'common/js/config'
import Lyric from 'api/lyricHandler'
import vuescroll from 'vuescroll/dist/vuescroll-native'

export default {
  created() {
    if (this.sequenceList.length) {
      this.setCurrentIndex(0)
    }
  },
  data() {
    return {
      progress: 0,
      volume: 100,
      volDisplay: false,
      currentTime: '00:00',
      currentLyrics: null,
      playUrl: '',
      ListHandler: false,
      currentListIndex: null,
      // transTime:'00:00',
      ops: {
        bar: {
          background: '#D32F2F',
          keepShow: true
        }
      }
    }
  },
  methods: {
    ...mapMutations({
      toggleListDisplay: 'TOGGLE_LIST',
      setState: 'SET_PLAYING_STATE',
      giveSongUrl: 'GIVE_SONG_URL',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST',
      setSongReadyStatus: 'SET_SONG_READY_STATUS',
      setLyricsReadyStatus: 'SET_LYRICS_READY_STATUS',
      removeSong: 'REMOVE_SONG',
      setIsRandom: 'SET_IS_RANDOM'
    }),
    toggleVol() {
      this.volDisplay = !this.volDisplay
    },
    _transTime(timeStamp) {
      return transTime(timeStamp)
    },
    sliderUpdate() {
      let player = this.$refs.player
      this.progress =
        ((player.currentTime * 1000) / this.currentSong.duration) * 100
      this.currentTime = transTime(player.currentTime * 1000)
    },
    mouseChange(newVal) {
      //鼠标改变播放进度
      let player = this.$refs.player
      const newTime = ((newVal / 100) * this.currentSong.duration) / 1000
      this.currentLyrics.seek(newTime * 1000)
      if (player.paused) {
        this.currentLyrics.togglePlay()
        player.currentTime = newTime
        return
      }
      player.pause()
      player.currentTime = newTime
      player.play()
    },
    togglePlay() {
      if (this.playList.length === 0) {
        this.$message({
          message: '播放列表内没有歌曲，请进行添加',
          type: 'warning'
        })
        return
      }
      let player = this.$refs.player
      if (player.paused) {
        this.setState(true)
        player.play()
      } else {
        this.setState(false)
        player.pause()
      }
    },
    prev() {
      if (!(this.songReady && this.lyricsReady)) return
      let index
      if (this.currentIndex == 0) {
        index = this.playList.length - 1
      } else {
        index = this.currentIndex - 1
      }
      this.setState(true)
      this.setCurrentIndex(index)
    },
    next() {
      if (!(this.songReady && this.lyricsReady)) return
      let index
      if (this.currentIndex == this.playList.length - 1) {
        index = 0
      } else {
        index = this.currentIndex + 1
      }
      this.setState(true)
      this.setCurrentIndex(index)
    },
    ready() {
      this.setSongReadyStatus(true)
      if (!this.lyricsReady) {
        this._getLyrics()
      }
    },
    error() {
      if (this.playUrl === '') return
      this.$message({
        message: '版权受限，已为您跳过该歌曲',
        type: 'error'
      })
      this._removeSong(this.sequenceIndex)
    },
    toggleMode() {
      const mode = (this.mode + 1) % 3
      this.setMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
        this.resetCurrentIndex(list)
        this.setPlayList(list)
        this.setIsRandom(true)
      } else if (mode === playMode.sequence) {
        list = this.sequenceList
        this.resetCurrentIndex(list)
        this.setPlayList(list)
      }
    },
    resetCurrentIndex(list) {
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    end() {
      if (this.mode === playMode.loop || this.playList.length === 1) {
        this.currentLyrics.seek(0)
        this.$refs.lyricsScroller.scrollTo(
          {
            y: -130
          },
          100
        )
        this.loop()
      } else {
        this.next()
      }
    },
    loop() {
      this.$refs.player.currentTime = 0
      this.$refs.player.play()
    },
    lyricHandler() {
      if (this.currentLyrics instanceof Lyric) {
        let y = this.$refs.lyricsItem[this.currentLyrics.curNum - 1].offsetTop
        this.$refs.lyricsScroller.scrollTo(
          {
            y: y - 130
          },
          100
        )
      }
    },
    _getLyrics() {
      if (this.sequenceList.length === 0) return

      if (!this.currentSong.lyrics) {
        this.currentSong.getLyrics().then(lyrics => {
          if (this.currentLyrics) this.currentLyrics.stop()
          this.currentLyrics = new Lyric(lyrics, this.lyricHandler)
          this.setLyricsReadyStatus(true)
        })
      } else {
        this.currentLyrics = new Lyric(
          this.currentSong.lyrics,
          this.lyricHandler
        )
        this.setLyricsReadyStatus(true)
      }
      this.$refs.lyricsScroller.scrollTo(
        {
          y: -130
        },
        100
      )
    },
    changeSong(index) {
      if (this.mode === playMode.sequence) {
        this.setCurrentIndex(index)
        return
      }
      for (let i = 0; i < this.playList.length; i++) {
        if (this.playList[i].id === this.sequenceList[index].id) {
          this.setCurrentIndex(i)
          return
        }
      }
    },
    _clearList() {
      if (this.playList.length != 0) {
        let player = this.$refs.player
        player.pause()
        player.currentTime = 0
        this.progress = 0
        this.clearList()
        this.currentLyrics = null
        this.setState(false)
        this.$message({
          message: '已为您清空列表，请重新添加歌曲',
          type: 'success'
        })
      }
    },
    toggleListHandler(index) {
      if (index > -1) {
        this.currentListIndex = index
      } else {
        this.currentListIndex = -1
      }
    },
    _removeSong(index) {
      // 播放列表不止这一首歌
      if (this.playList.length > 1) {
        if (this.sequenceList[index].id === this.currentSong.id) {
          // 删除的歌曲就是当前在放的歌
          this.next()
        }
      } else {
        let player = this.$refs.player
        player.pause()
        this.setState(false)
        player.currentTime = 0
        this.currentLyrics = null
      }
      this.progress = 0
      this.removeSong(index)
    },
    ...mapActions(['clearList'])
  },
  props: {
    songInfo: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapGetters([
      'playList',
      'currentSong',
      'currentIndex',
      'showList',
      'playing',
      'mode',
      'sequenceList',
      'songReady',
      'lyricsReady',
      'sequenceIndex',
      'isRandom',
      'mvMode'
    ]),
    iconMode() {
      return this.mode == playMode.sequence
        ? 'icon-danquxunhuan'
        : this.mode == playMode.loop
        ? 'icon-suiji'
        : 'icon-liebiaoxunhuan'
    }
  },
  watch: {
    currentSong: function(newSong, oldSong) {
      if (newSong.id === oldSong.id) return
      if (this.currentLyrics instanceof Lyric) {
        this.currentLyrics.stop()
      }
      this.setLyricsReadyStatus(false)
      this.setSongReadyStatus(false)
      if (newSong.url === '') {
        getPlayUrl(newSong).then(res => {
          if (res.data.code == ERR_OK) {
            const index = this.currentIndex
            const url = res.data.data
            this.playUrl = url
            this.giveSongUrl({ index, url })
          }
        })
      } else {
        this.playUrl = newSong.url
      }
      //等待dom创建完成
      let timer = setTimeout(() => {
        if (this.$refs.listItem[this.sequenceIndex]) {
          let y = this.$refs.listItem[this.sequenceIndex].$el.offsetTop
          this.$refs.listScroller.scrollTo(
            {
              y: y - 130
            },
            100
          )
        }
        clearTimeout(timer)
      })
    },
    volume(newVal) {
      let newVol = newVal / 100
      this.$refs.player.volume = newVol
    },
    playing(newVal) {
      if (this.currentLyrics && this.currentLyrics.lines) {
        if (!this.playList.length) {
          this.currentLyrics.stop()
          return
        }
        this.currentLyrics.togglePlay()
      }
    },
    // 在请求完成歌曲资源后才会请求歌词信息，一旦歌词加载完成，就表示可开始播放
    lyricsReady(newVal) {
      if (newVal && this.playing) {
        this.currentLyrics.play()
        this.$refs.player.play()
      }
    },
    showList(newVal) {
      const timer = setTimeout(() => {
        if (
          newVal &&
          this.currentLyrics &&
          this.currentLyrics.lines &&
          this.$refs.lyricsItem
        ) {
          let y = this.$refs.lyricsItem[this.currentLyrics.curNum].offsetTop
          this.$refs.lyricsScroller.scrollTo(
            {
              y: y - 130
            },
            100
          )
          clearInterval(timer)
        }
      }, 100)
    },
    isRandom(newVal) {
      if (this.mode === playMode.random && !newVal) {
        const list = shuffle(this.sequenceList)
        this.resetCurrentIndex(list)
        this.setPlayList(list)
        this.setIsRandom(true)
      }
    },
    mvMode(newVal) {
      if (newVal === true) {
        this.$refs.player.pause()
        this.setState(false)
      }
    }
  },
  components: {
    vuescroll
  }
}
</script>

<style lang='stylus' scoped>
@import '~common/stylus/variables';
@import '~common/stylus/reset';

.volume-adjust {
  height: 120px;
  width: 26px;
  position: absolute;
  bottom: 50px;
  left: 972px;
  background-color: $firstly-text-transparent;
  border-radius: 3px;

  .volume-slider {
    height: 90px;
    margin-top: 18px;
    margin-left: -6px;
  }
}

.playlist-container {
  border-radius: 5px 5px 0 0;
  height: 260px;
  width: 800px;
  position: fixed;
  bottom: 81px;
  left: 50%;
  transform: translateX(-50%);

  .header {
    color: $text;
    background-color: $firstly-text;
    font-size: $font-size-mid;
    text-align: center;
    height: 30px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    line-height: 30px;
    border-bottom: 2px solid $dark-primary-color;
  }

  .header-playlist {
    text-align: left;
    padding-left: 15px;
    border-radius: 3px 0 0 0;
  }

  .header-close {
    border-radius: 0 3px 0 0;
  }

  .header-closelist, .header-emptylist {
    float: right;
    position: relative;
    right: 5px;
  }

  .header-closelist:hover, .header-emptylist:hover {
    cursor: pointer;
    color: $secondary-text;
  }

  .playlist {
    background-color: $firstly-text;
    height: 260px;
  }

  .playlist {
    border-right: 1px solid $dark-primary-color;

    .playlist-item {
      font-size: $font-size-small;
      color: $secondary-text;
      width: 399px;
      border-bottom: 1px solid transparent;

      .el-col {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        padding: 8px;
      }

      .list-play-btn:hover, .list-remove-btn:hover {
        color: $secondary-text;
        cursor: pointer;
      }
    }

    .playlist-item:hover, .item-active {
      color: $text;
      border-bottom: 1px solid $dark-primary-color;
    }
  }

  .lyrics {
    border-left: 1px solid $dark-primary-color;
    background-color: $firstly-text;
    height: 260px;
    min-width: 399px;

    .empty-notice {
      color: $text;
      font-size: $font-size-mid;
    }
  }
}

.player-container {
  z-index: 999;
  border-top: 1px solid $firstly-text;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: $firstly-text-transparent;
  height: 50px;
  min-width: 1300px;

  .player-body {
    width: 80%;
    position: relative;
    height: 50px;
    left: 50%;
    transform: translateX(-50%);
  }

  .react-left {
    position: relative;
    height: 50px;
    width: 130px;

    .left-item {
      position: absolute;
      font-size: $font-size-big;
      transform: translateY(-50%);
      top: 50%;
      color: $secondary-text;
    }

    .bofang {
      font-size: $font-size-ultra;
      left: 50px;
    }

    .icon-bofang {
      color: $text;
    }

    .kuaitui {
      left: 14px;
    }

    .kuaijin {
      left: 93px;
    }

    .left-item:hover {
      color: $text;
      cursor: pointer;
    }
  }

  .slider-container {
    .slider {
      .song-info {
        margin: 10px auto;
        color: $text;
        width: 500px;

        .info-name, .info-singer {
          float: left;
          margin-top: -5px;
          max-width: 180px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          font-size: $font-size-small;
        }
      }

      .slider-body {
        margin-top: 15px;
        cursor: pointer;
      }
    }
  }

  .pic {
    width: 50px;
    position: relative;
    height: 50px;
    margin-right: 13px;

    img {
      width: 40px;
      height: 40px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      border: 1px solid $firstly-text;
      border-radius: 3px;
    }
  }

  .time {
    height: 50px;
    width: 110px;
    margin-left: 15px;
    color: $text;
    font-size: $font-size-small;
    margin-top: 24px;
  }

  .react-right {
    position: relative;
    height: 50px;
    width: 200px;
    margin-left: 15px;

    .right-item {
      position: absolute;
      font-size: $font-size-icon;
      color: $secondary-text;
      top: 50%;
      transform: translateY(-50%);
    }

    .right-item:hover {
      color: $text;
      cursor: pointer;
    }

    .volume {
      left: 10px;
    }

    .mode {
      left: 35px;
    }

    .list {
      left: 64px;
    }
  }
}

.lyrics-container {
  font-size: $font-size-small;
  color: $secondary-text;
  position: relative;

  .blank {
    height: 130px;
  }

  .each-lyrics {
    margin: 15px 5px;
    width: 380px;
    text-align: center;
  }

  .currentLyric {
    color: $text;
    font-size: $font-size-mid;
  }
}
</style>
