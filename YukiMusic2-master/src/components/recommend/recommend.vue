<template>
  <div class="recommend-container">
    <el-row :gutter="20">
      <el-col :span="4" class="left-col">
        <div class="grid-content rank-list">
          <dl>
            <dt class="rank-title">
              <div class="title">入驻歌手</div>
            </dt>
            <dd
              v-for="(item,idx) in topSingerList"
              :key="idx"
              class="rank-item"
              @click="selectedSinger(item)"
            >
              <rank-grid :name="item.name" :picUrl="item.picUrl"/>
            </dd>
          </dl>
        </div>
      </el-col>
      <el-col :span="20" class="right-col">
        <div class="grid-content">
          <m-title :data="newAlbumTitle"/>
          <roller :dataList="newAlbumList" @selectedAlbum="selectedAlbum"/>
        </div>
        <div class="grid-content great-container">
          <m-title :data="greatListTitle"/>
          <grid :dataList="greatSongList" @selected="selectedSongList"/>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getTopSingers, getGreatSongList } from 'api/global'
import { getNewAlbum } from 'api/recommend'
import { ERR_OK } from 'api/config'
import { modelizeSinger, modelizeAlbum, modelizeSongList } from 'api/modify'
import RankGrid from 'base/rankgrid/rankgrid'
import Roller from 'base/roller/roller'
import MTitle from 'base/title/title'
import Grid from 'base/grid/grid'
import { mapMutations } from 'vuex'

export default {
  created() {
    this._getTopSingers()
    this._getNewAlbum()
    this._getGreatSongList()
  },
  data() {
    return {
      topSingerList: [],
      newAlbumList: [],
      newAlbumTitle: '新碟上架',
      greatListTitle: '精品歌单',
      greatSongList: []
    }
  },
  methods: {
    _getTopSingers() {
      getTopSingers().then(res => {
        if (res.data.code == ERR_OK) {
          this.topSingerList = modelizeSinger(res.data.data)
        }
      })
    },
    _getNewAlbum() {
      getNewAlbum().then(res => {
        if (res.data.code == ERR_OK) {
          let newAlbum = res.data.data.slice(0, 12)
          this.newAlbumList = modelizeAlbum(newAlbum)
        }
      })
    },
    _getGreatSongList() {
      getGreatSongList().then(res => {
        if (res.data.code == ERR_OK) {
          this.greatSongList = modelizeSongList(res.data.data)
        }
      })
    },
    selectedSongList(item) {
      this.setSongList(item)
      this.$router.push({
        path: `/songlist/${item.id}`
      })
    },
    selectedSinger(singer) {
      this.setSinger(singer)
      this.$router.push({
        path: `/singer/${singer.id}`
      })
    },
    selectedAlbum(album) {
      this.setAlbum(album)
      this.$router.push({
        path: `/albumdetail/${album.id}`
      })
    },
    ...mapMutations({
      setSongList: 'SET_CURRENT_SONG_LIST',
      setSinger: 'SET_SINGER',
      setAlbum: 'SET_CURRENT_ALBUM'
    })
  },
  components: {
    RankGrid,
    Roller,
    MTitle,
    Grid
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variables';
@import '~common/stylus/reset';

.left-col {
  .rank-list {
    min-width: 198px;
    background-color: $grey-color;

    .rank-title {
      font-size: $font-size-mid;
      color: $text;
      background-color: $dark-primary-color;
      border: 1px solid $dark-primary-color;
      border-radius: 5px 5px 0 0;

      .title {
        margin: 4px auto;
        margin-left: 10px;
      }
    }
  }
}

.right-col {
  .great-container {
    margin-top: 15px;
  }
}
</style>

