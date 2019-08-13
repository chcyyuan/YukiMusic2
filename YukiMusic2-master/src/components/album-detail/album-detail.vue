<template>
  <el-row class="detail-container">
    <el-col class="loading-box" v-if="isLoading" v-loading="isLoading"></el-col>
    <el-col class="info" v-if="!isLoading">
      <el-row>
        <el-col class="img" :push="3" :span="4">
          <img :src="currentAlbum.picUrl">
        </el-col>
        <el-col class="introduction" :push="3" :span="14">
          <div class="text-container">
            <vuescroll :ops="ops">
              <div
                v-html="currentAlbum.desc===''?'暂无专辑介绍':currentAlbum.desc.replace(/\n/g,'<br/>')"
                class="text"
              ></div>
            </vuescroll>
            <div class="tag">{{currentAlbum.name}}&nbsp;&nbsp;</div>
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
import { getAlbumDetail } from 'api/album'
import { ERR_OK } from 'api/config'
import { splitSingersInObj } from 'api/kit'
import Song from 'common/js/song'
import vuescroll from 'vuescroll/dist/vuescroll-native'

import PlayButton from 'base/m-button/play-button'
import List from 'base/list/list'

export default {
  beforeRouteEnter(to, from, next) {
    // 避免组件复用
    next(vm => {
      if (vm.currentAlbum.id === undefined) {
        vm.$router.push({
          path: `/recommend`
        })
      }
      if (vm.albumId === '' || vm.albumId !== vm.currentAlbum.id) {
        vm._getAlbumDetail(vm.currentAlbum.id)
      }
    })
  },
  data() {
    return {
      singerDesc: '',
      songList: [],
      albumId: '',
      isLoading: true,
      ops: {
        bar: {
          background: '#D32F2F'
        }
      }
    }
  },
  computed: {
    ...mapGetters(['currentAlbum'])
  },
  methods: {
    _getAlbumDetail(id) {
      getAlbumDetail(id).then(res => {
        if ((res.code = ERR_OK)) {
          this.songList = []
          this.albumId = id
          this.giveAlbumCompany(res.data.data.album.company)
          this.giveAlbumDesc(res.data.data.album.description)
          let songList = res.data.data.songs
          for (let i = 0; i < songList.length; i++) {
            let song = {}
            let thisSong = songList[i]
            song.name = thisSong.name
            song.id = thisSong.id
            song.singer = splitSingersInObj(thisSong.ar)
            song.duration = thisSong.dt
            song.album = this.currentAlbum.name
            song.albumId = this.currentAlbum.id
            song.albumPic = this.currentAlbum.picUrl
            this.songList.push(new Song(song))
            this.isLoading = false
          }
        }
      })
    },
    playAll() {
      this.replacePlayList({ list: this.songList })
    },
    refreshAlbum(id) {},
    ...mapMutations({
      giveAlbumCompany: 'GIVE_ALBUM_COMPANY',
      giveAlbumDesc: 'GIVE_ALBUM_DESC'
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