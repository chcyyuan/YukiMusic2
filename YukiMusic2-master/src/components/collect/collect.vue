<template>
  <el-row class="collect-container">
    <el-col :push="3" :span="18">
      <m-title :data="title" />
      <m-button :text="clearText" :type="iconStatus.clear" @click.native="clearAll" />
      <m-button @click.native="playAll" />
    </el-col>
    <el-col class="amount-tips" :push="3" :span="18">温馨提示：收藏夹容量有限，容量达到上限时收藏歌曲系统将自动移除最早收藏的歌曲</el-col>
    <el-col class="amount-display" :push="3" :span="18">当前容量：{{favorList.length}}/{{maxAmount}}</el-col>
    <el-col class="favor-songList" :push="3" :span="18" v-if="favorList.length">
      <list :dataList="favorList" :deleteBtn="deleteBtn" @removeSong="removeSong" />
    </el-col>
    <el-col class="empty-songList" :push="10" :span="8" v-if="!favorList.length">您的收藏夹为空，快去收藏喜欢的歌曲吧~</el-col>
  </el-row>
</template>

<script>
import MTitle from 'base/title/title'
import MButton from 'base/m-button/play-button'
import List from 'base/list/list'
import { LIST_MAX_LENGTH } from 'common/js/cache'
import { iconStatus } from 'common/js/config'
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  data() {
    return {
      title: '收藏夹',
      clearText: '清空收藏',
      iconStatus: iconStatus,
      maxAmount: LIST_MAX_LENGTH,
      deleteBtn: true
    }
  },
  components: {
    MTitle,
    MButton,
    List
  },
  computed: {
    ...mapGetters(['favorList'])
  },
  methods: {
    clearAll() {
      this.setFavorList([])
    },
    playAll() {
      if (!this.favorList.length) return
      this.replacePlayList({ list: this.favorList })
    },
    removeSong(songIndex) {
      this.removeFavorSong(songIndex)
    },
    ...mapMutations({
      setFavorList: 'SET_FAVOR_LIST',
      removeFavorSong: 'REMOVE_FAVOR_SONG'
    }),
    ...mapActions(['replacePlayList'])
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variables';
@import '~common/stylus/reset';

.collect-container {
  overflow: hidden;

  .amount-tips, .amount-display, .empty-songList {
    font-size: $font-size-small;
    margin-top: 10px;
  }

  .amount-display, .empty-songList {
    color: $dark-primary-color;
  }

  .empty-songList {
    height: 100px;
    line-height: 100px;
  }
}
</style>


