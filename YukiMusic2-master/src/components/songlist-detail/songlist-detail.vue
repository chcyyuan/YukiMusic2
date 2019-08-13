<template>
  <el-row class="detail-container">
    <el-col class="loading-box" v-if="isLoading" v-loading="isLoading"></el-col>
    <el-col class="info" v-if="!isLoading">
      <el-row>
        <el-col class="img" :push="3" :span="4">
          <img :src="currentSongList.picUrl">
        </el-col>
        <el-col class="introduction" :push="3" :span="14">
          <div class="text-container">
            <vuescroll :ops="ops">
              <div
                v-html="currentSongList.desc===''?'暂无歌手介绍':currentSongList.desc.replace(/\n/g,'<br/>')"
                class="text"
              ></div>
            </vuescroll>
            <div class="tag">{{currentSongList.name}}&nbsp;&nbsp;</div>
          </div>
        </el-col>
      </el-row>
    </el-col>
    <el-col class="song-container" v-if="!isLoading">
      <el-row>
        <el-col :push="3" :span="18">
          <play-button @click.native="playAll"/>
          <list :dataList="songList"/>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { getListSong } from 'api/songList'
import { ERR_OK } from 'api/config'
import { modelizeSong } from 'api/modify'
import { splitSingersInObj } from 'api/kit'
import Song from 'common/js/song'
import vuescroll from 'vuescroll/dist/vuescroll-native'

import PlayButton from 'base/m-button/play-button'
import List from 'base/list/list'

export default {
  created() {
    if (this.currentSongList.id == undefined) {
      this.$router.replace({
        path: `/hotsonglist`
      })
      //keep-alive的bug,需要强制刷新
      this.$router.go(0)
    } else {
      this._getListSong(this.currentSongList.id)
    }
  },
  data() {
    return {
      singerDesc: '',
      isLoading: true,
      songList: [],
      ops: {
        bar: {
          background: '#D32F2F'
        }
      }
    }
  },
  computed: {
    ...mapGetters(['currentSongList', 'sequenceList', 'playList'])
  },
  methods: {
    _getListSong(id) {
      getListSong(id).then(res => {
        this.songList = []
        if (res.data.code === 200) {
          let songs = res.data.data.tracks
          for (let i = 0; i < songs.length; i++) {
            let songObj = {}
            songObj.id = songs[i].id
            songObj.name = songs[i].name
            songObj.duration = songs[i].duration
            songObj.albumPic = songs[i].album.picUrl
            songObj.albumId = songs[i].album.id
            songObj.album = songs[i].album.name
            songObj.singer = splitSingersInObj(songs[i].artists)
            this.songList.push(new Song(songObj))
            this.isLoading = false
          }
        }
      })
    },
    playAll() {
      this.replacePlayList({ list: this.songList })
    },
    ...mapMutations({
      setIndex: 'SET_CURRENT_INDEX',
      setState: 'SET_PLAYING_STATE'
    }),
    ...mapActions(['replacePlayList'])
  },
  components: {
    List,
    PlayButton,
    vuescroll
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variables.styl';
@import '~common/stylus/reset.styl';

.detail-container {
  .info {
    min-width: 1290px;

    .introduction {
      .text-container {
        height: 140px;
      }

      .tag {
        text-align: right;
        margin-top: 10px;
        margin-left: 5px;
        border-bottom: 2px solid $dark-primary-color;
      }
    }

    .el-col {
      height: 200px;
      background-color: $grey-color;
      border-radius: 5px;
      position: relative;
    }

    .text-container {
      font-size: $font-size-small;
      height: 180px;
      color: $firstly-text;
      top: 50%;
      transform: translateY(-50%);
      position: absolute;

      .text {
        margin: 0px 20px;
        min-width: 714px;
      }
    }

    img {
      width: 180px;
      height: 180px;
      border-radius: 3px;
      position: absolute;
      top: 50%;
      left: 10px;
      transform: translateY(-50%);
    }
  }
}
</style>