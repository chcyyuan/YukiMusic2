<template>
  <el-row class="player-container">
    <el-col
      class="video-loading-box"
      :element-loading-text="loadingText"
      v-loading="isLoading"
      :element-loading-background="blockerColor"
      v-if="isLoading"
    ></el-col>
    <el-col class="title-container" :span="18" :push="3">
      <div class="mv-title" :title="currentMV.name">{{currentMV.name}}</div>
      <div class="mv-singer" :title="currentMV.singer">{{currentMV.singer}}</div>
    </el-col>
    <el-col class="video-player" :span="18" :push="3">
      <div class="block-layer" v-show="blockerDisplay" @click="hideBlocker">
        <p class="block-text iconfont icon-zanting">&nbsp;开始播放</p>
      </div>
      <video
        :src="currentMV.url"
        ref="videoPlayer"
        @canplay="videoReady"
        @ended="videoEnded"
        @timeupdate="sliderUpdate"
        @click="videoPause"
      ></video>
    </el-col>
    <el-col class="video-control" :span="18" :push="3">
      <el-row>
        <el-col class="volume" :span="1">
          <div class="iconfont icon-shengyin" @click="toggleVolume"></div>
          <div class="volume-adjust" v-show="volumeDisplay">
            <div class="block">
              <el-slider v-model="volume" vertical class="volume-slider"></el-slider>
            </div>
          </div>
        </el-col>
        <el-col class="play" @click.native="togglePlaying" :span="1">
          <div :class="playBtnClass"></div>
        </el-col>
        <el-col class="control-bar" :span="16">
          <el-slider
            v-model="progress"
            :show-tooltip="false"
            class="slider-body"
            @change="mouseChange"
          ></el-slider>
        </el-col>
        <el-col class="time" :span="4">
          <span class="current-time">{{currentTime}}</span>
          <span
            class="total-time"
          >/&nbsp;{{currentMV.duration?_transTime(currentMV.duration):'00:00'}}</span>
        </el-col>
        <el-col class="full-screen" :span="2" @click.native="lauchFullScreen">全屏</el-col>
      </el-row>
    </el-col>
    <el-col class="desc-title" :span="18" :push="3">视频简介</el-col>
    <el-col
      class="desc-container"
      :span="18"
      :push="3"
    >{{currentMV.desc===''?"暂无视频介绍。":currentMV.desc}}</el-col>
  </el-row>
</template>

<script>
import MTitle from 'base/title/title'
import MV from 'common/js/mv'
import { ERR_OK } from 'api/config'
import { splitSingersInObj, transTime } from 'api/kit'
import { mapMutations, mapGetters } from 'vuex'
import { getMV } from 'api/mv'
import axios from 'axios'

export default {
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (!vm.currentMV.id) {
        vm.$emit('turnBack')
        return
      }
      if (vm.$refs.videoPlayer.readyState === 0) {
        vm.isLoading = true
      }
      vm.mvId = vm.currentMV.id
      vm.blockerDisplay = true
      vm.setMVMode(true)
    })
  },
  data() {
    return {
      isLoading: true,
      loadingText: '视频资源加载中',
      blockerColor: '#eeeeee',
      mvId: 0,
      progress: 0,
      mvPlaying: false,
      currentTime: '00:00',
      blockerDisplay: true,
      volumeDisplay: false,
      volume: 100,
      volDisplay: false
    }
  },
  methods: {
    _getMV(id) {
      getMV(id).then(
        axios.spread((detailData, urlData) => {
          if (detailData.data.code === ERR_OK && urlData.data.code === ERR_OK) {
            const mvDetail = detailData.data.data.data
            const playUrl = urlData.data.data
            let mv = this.currentMV
            this.setCurrentMV({})
            mv.duration = mvDetail.duration
            mv.desc = mvDetail.desc
            mv.url = playUrl
            this.setCurrentMV(mv)
          }
        })
      )
    },
    videoReady() {
      const resetIsLoading = setTimeout(() => {
        this.isLoading = false
        clearTimeout(resetIsLoading)
      }, 1000)
    },
    togglePlaying() {
      if (this.isLoading) return
      let player = this.$refs.videoPlayer
      if (this.mvPlaying) {
        player.pause()
        this.mvPlaying = false
      } else {
        this.blockerDisplay = false
        player.play()
        this.mvPlaying = true
      }
    },
    toggleVolume() {
      this.volumeDisplay = !this.volumeDisplay
    },
    sliderUpdate() {
      let player = this.$refs.videoPlayer
      this.progress =
        ((player.currentTime * 1000) / this.currentMV.duration) * 100
      this.currentTime = transTime(player.currentTime * 1000)
    },
    _transTime(timeStamp) {
      return transTime(timeStamp)
    },
    mouseChange(newVal) {
      //鼠标改变播放进度
      let player = this.$refs.videoPlayer
      const newTime = ((newVal / 100) * this.currentMV.duration) / 1000
      if (!this.mvPlaying) {
        player.currentTime = newTime
        return
      }
      player.pause()
      player.currentTime = newTime
      player.play()
    },
    videoPause() {
      if (this.mvPlaying) {
        this.$refs.videoPlayer.pause()
        this.mvPlaying = false
      } else {
        this.$refs.videoPlayer.play()
        this.mvPlaying = true
      }
    },
    lauchFullScreen() {
      const player = this.$refs.videoPlayer
      if (player.requestFullScreen) {
        player.requestFullScreen()
      } else if (player.mozRequestFullScreen) {
        player.mozRequestFullScreen()
      } else if (player.webkitRequestFullScreen) {
        player.webkitRequestFullScreen()
      }
    },
    hideBlocker() {
      this.blockerDisplay = false
      this.mvPlaying = true
      this.$refs.videoPlayer.play()
    },
    videoEnded() {
      this.blockerDisplay = true
      this.mvPlaying = false
    },
    ...mapMutations({
      setCurrentMV: 'SET_CURRENT_MV',
      setMVMode: 'SET_MV_MODE'
    })
  },
  watch: {
    mvId(newId) {
      if (!newId) {
        return
      }
      this._getMV(newId)
    },
    volume(newVal) {
      let newVol = newVal / 100
      this.$refs.videoPlayer.volume = newVol
    }
  },
  computed: {
    playBtnClass() {
      return [
        'iconfont',
        { 'icon-zanting': !this.mvPlaying, 'icon-bofang': this.mvPlaying }
      ]
    },
    ...mapGetters(['currentMV'])
  },
  beforeRouteLeave(to, from, next) {
    this.$refs.videoPlayer.pause()
    this.$refs.videoPlayer.currentTime = 0
    this.mvPlaying = false
    this.setMVMode(false)
    next()
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variables';
@import '~common/stylus/reset';

.player-container {
  height: 600px;

  .video-loading-box {
    height: 550px;
    position: absolute;
    z-index: 999;
  }

  .title-container {
    height: 60px;

    .mv-title, .mv-singer {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .mv-title {
      font-size: $font-size-big;
      color: $dark-primary-color;
      max-width: 600px;
      float: left;
    }

    .mv-singer {
      font-size: $font-size-small;
      color: $secondary-text;
      float: left;
      max-width: 200px;
      margin-top: 21px;
      margin-left: 15px;
    }
  }

  .video-player {
    height: 500px;
    position: relative;

    .block-layer {
      cursor: pointer;
      width: 866px;
      height: 490px;
      position: absolute;
      background-color: $firstly-text-transparent;
      left: 50%;
      transform: translateX(-50%);
      z-index: 99;
      border-radius: 3px;

      .block-text {
        color: $secondary-text;
        position: absolute;
        bottom: 10px;
        left: 10px;
        font-size: $font-size-mid;
      }
    }

    video {
      border: 3px solid $dark-primary-color;
      border-radius: 3px;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: 860px;
    }
  }

  .video-control {
    background-color: $grey-color;
    border-radius: 3px;

    .play, .volume {
      font-size: $font-size-icon;

      .iconfont {
        text-align: center;
        height: 40px;
        line-height: 40px;
      }

      .icon-bofang {
        color: $dark-primary-color;
      }
    }

    .control-bar {
      padding-left: 15px;
    }

    .time, .full-screen {
      font-size: $font-size-small;
      text-align: center;
      height: 40px;
      line-height: 40px;

      .current-time {
        color: $dark-primary-color;
      }
    }

    .full-screen {
      color: $dark-primary-color;
    }

    .full-screen:hover {
      cursor: pointer;
    }

    .volume {
      .volume-adjust {
        height: 120px;
        width: 26px;
        position: absolute;
        bottom: 40px;
        left: 8px;
        background-color: $firstly-text-transparent;
        border-radius: 3px;

        .volume-slider {
          height: 90px;
          margin-top: 18px;
          margin-left: -6px;
        }
      }
    }
  }

  .desc-title {
    margin-top: 15px;
    color:$dark-primary-color
  }

  .desc-container {
    margin-top: 15px;
    font-size: $font-size-small;
  }
}

.iconfont {
  cursor: pointer;
}
</style>