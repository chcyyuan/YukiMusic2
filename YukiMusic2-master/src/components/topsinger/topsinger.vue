<template>
  <div class="topsinger-container">
    <m-title :data="hotTitle" class="header"/>
    <div class="loading-box" v-if="isLoading" v-loading="isLoading"></div>
    <navigator v-if="!isLoading" :tagList="tagList" :offsetTops="offsetTops"/>
    <div class="list-container" v-if="!isLoading">
      <div class="list-item" v-for="(item,idx) in tagList" :key="idx" ref="listItem">
        <m-title :data="item[0].tag" :span="2"/>
        <grid :isTag="false" :dataList="item" :eachLength="6" @selected="selectedSinger"/>
      </div>
    </div>
  </div>
</template>

<script>
import MTitle from 'base/title/title'
import Grid from 'base/grid/grid'
import Navigator from 'components/navigator/navigator'
import { getTopSingers } from 'api/global'
import { ERR_OK } from 'api/config'
import { modelizeSinger } from 'api/modify'
import { addTag, divideByTag } from 'api/kit'
import { mapMutations } from 'vuex' // 语法糖

export default {
  created() {
    this._getTopSingers()
  },
  data() {
    return {
      hotTitle: '热门歌手',
      queryNum: 100,
      tagList: [],
      offsetTops: [],
      isLoading: true
    }
  },
  components: {
    MTitle,
    Navigator,
    Grid
  },
  methods: {
    _getTopSingers() {
      getTopSingers(this.queryNum).then(res => {
        if ((res.data.code = ERR_OK)) {
          let noTagList = modelizeSinger(res.data.data)
          let tagList = addTag(noTagList)
          this.tagList = divideByTag(tagList)
          this.isLoading = false
          this.$nextTick(() => {
            let listItem = this.$refs.listItem
            for (let i = 0; i < listItem.length; i++) {
              this.offsetTops.push(listItem[i].offsetTop)
            }
          })
        }
      })
    },
    selectedSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variables';
@import '~common/stylus/reset';

.header {
  margin-bottom: 15px;
}
</style>

