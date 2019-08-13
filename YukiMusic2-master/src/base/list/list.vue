<template>
  <div class="list-container">
    <el-row class="title-container" :gutter="10">
      <el-col class="name title" :span="8" :push="1">
        <div class="content">歌曲名称</div>
      </el-col>
      <el-col class="hide" :span="3" :push="1"></el-col>
      <el-col class="duration title" :span="2" :push="1">
        <div class="content">时长</div>
      </el-col>
      <el-col class="singer title" :span="4" :push="1">
        <div class="content">歌手</div>
      </el-col>
      <el-col class="album title" :span="6" :push="1">
        <div class="content">专辑名称</div>
      </el-col>
    </el-row>
    <el-row
      v-for="(item,idx) in dataList"
      :key="idx"
      class="content-container"
      :gutter="10"
      @mouseover.native="changeDisplay(idx)"
      @mouseout.native="changeDisplay(idx)"
    >
      <el-col class="index" :span="1">
        <div class="content">{{idx+1}}</div>
      </el-col>
      <el-col class="name" :span="8" :title="item.name">
        <div class="content">{{item.name}}</div>
      </el-col>
      <el-col class="hide" :span="3">
        <div class="content" ref="hiddenBox" v-show="false">
          <ul class="react">
            <li class="react-item play iconfont icon-zanting" title="立即播放" @click="playSong(item)"></li>
            <li
              class="react-item add iconfont icon-zengjia"
              title="添加至播放列表"
              @click="simplelyAdd(item)"
            ></li>
            <li
              class="react-item favor iconfont icon-xiai"
              title="收藏至我喜欢的歌曲"
              @click="favorSong(item)"
            ></li>
            <li
              v-if="deleteBtn"
              class="react-item delete iconfont icon-jinzhi"
              title="从列表中移除该歌曲"
              @click="removeSong(idx)"
            ></li>
          </ul>
        </div>
      </el-col>
      <el-col class="duration" :span="2">
        <div class="content">{{item.normalDuration}}</div>
      </el-col>
      <el-col class="singer" :span="4" :title="item.singer">
        <div class="content">{{item.singer}}</div>
      </el-col>
      <el-col class="album" :span="6" :title="item.album">
        <div class="content">{{item.album}}</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex'

export default {
  created() {
    let display = []
    for (let i = 0; i < this.dataList.length; i++) {
      display.push(false)
    }
    this.display = display
  },
  props: {
    dataList: {
      type: Array,
      default: () => []
    },
    deleteBtn: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['playList', 'lyricsReady', 'favorList'])
  },
  methods: {
    changeDisplay(index) {
      this.display[index] = !this.display[index]
      if (this.display[index] == true) {
        this.$refs.hiddenBox[index].style.display = ''
      } else {
        this.$refs.hiddenBox[index].style.display = 'none'
      }
    },
    checkExist(song) {
      for (let i = 0; i < this.playList.length; i++) {
        if (song.id === this.playList[i].id) {
          return i
        }
      }
      return -1
    },
    playSong(song) {
      let index = this.checkExist(song)
      if (index != -1) {
        this.setIndex(index)
      } else {
        this.addToList({ item: song, play: true })
      }
    },
    simplelyAdd(song) {
      let index = this.checkExist(song)
      if (index != -1) return
      this.addToList({ item: song, play: false })
    },
    favorSong(song) {
      this.addFavorList({ messageCaller: this, song: song })
    },
    removeSong(songIndex) {
      this.$emit('removeSong', songIndex)
    },
    ...mapMutations({
      setIndex: 'SET_CURRENT_INDEX',
      addFavorList: 'ADD_FAVOR_LIST'
    }),
    ...mapActions(['addToList'])
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variables.styl';
@import '~common/stylus/reset.styl';

.list-container {
  margin-top: 15px;
  border-radius: 5px;
  font-size: $font-size-small;
  color: $secondary-text;

  .el-row:nth-child(odd) {
    background-color: $grey-color;
  }

  .content-container {
    border-top: 1px solid $grey-color;
    border-bottom: 1px solid $grey-color;
  }

  .content-container:hover {
    border-top: 1px solid $secondary-text;
    border-bottom: 1px solid $secondary-text;
    cursor: pointer;
  }

  .el-col {
    margin: 5px auto;
  }

  .content {
    position: relative;
    left: 10px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .title-container {
    .title {
      color: $dark-primary-color;
      font-weight: 700;
    }
  }
}

.react {
  height: 15px;
  position: relative;

  .react-item {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  .play {
    left: 6px;
  }

  .add {
    left: 24px;
  }

  .favor {
    left: 41px;
  }

  .delete {
    left: 60px;
  }

  .de, .react-item:hover {
    color: $dark-primary-color;
  }
}
</style>

