<template>
  <el-row class="detail-container">
    <el-col class="loading-box" v-if="isLoading" v-loading="isLoading"></el-col>
    <el-col class="info" v-if="!isLoading">
      <el-row>
        <el-col class="img" :push="3" :span="4">
          <img :src="singer.picUrl">
        </el-col>
        <el-col class="introduction" :push="3" :span="14">
          <div class="text-container">
            <vuescroll :ops="ops">
              <div v-html="singerDesc===''?'暂无歌手介绍':singerDesc.replace(/\n/g,'<br/>')" class="text"></div>
            </vuescroll>
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
import { getSingerInfo, getSingerSong } from 'api/detail'
import { ERR_OK } from 'api/config'
import { modelizeSong } from 'api/modify'
import vuescroll from 'vuescroll/dist/vuescroll-native'

import PlayButton from 'base/m-button/play-button'
import List from 'base/list/list'

export default {
  created() {
    if (this.singer.id == undefined) {
      this.$router.replace({
        path: `/topsinger`
      })
      this.$router.go(0)
    } else {
      this._getSingerInfo(this.singer.id)
      this._getSingerSong(this.singer.id)
    }
  },
  data() {
    return {
      singerDesc: '',
      songList: [],
      isLoading: true,
      ops: {
        bar: {
          background: '#D32F2F'
        }
      }
    }
  },
  computed: {
    ...mapGetters(['singer', 'sequenceList', 'playList'])
  },
  methods: {
    _getSingerInfo(id) {
      getSingerInfo(id).then(res => {
        if (res.data.code === ERR_OK) {
          this.singerDesc = res.data.data.briefDesc
        }
      })
    },
    _getSingerSong(id) {
      getSingerSong(id).then(res => {
        if (res.data.code === ERR_OK) {
          this.songList = modelizeSong(res.data.data)
          this.isLoading = false
        }
      })
    },
    playAll() {
      const list = this.songList
      this.replacePlayList({
        list: list
      })
    },
    ...mapMutations({
      setIndex: 'SET_CURRENT_INDEX',
      setState: 'SET_PLAYING_STATE'
    }),
    ...mapActions(['addToList', 'replacePlayList'])
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
  overflow: hidden;

  .info {
    min-width: 1290px;

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