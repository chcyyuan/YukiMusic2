<template>
  <el-row class="songList-container">
    <m-title :data="title" :push="3" :span="18"/>
    <el-col class="loading-box" v-if="isLoading" v-loading="isLoading" :push="3" :span="18"></el-col>
    <el-col class="hottest-songlist" v-else :push="3" :span="18">
      <grid :dataList="hottestList" @selected="selectedList"/>
    </el-col>
    <el-col :push="3" :span="18">
      <pagination :pageSize="pageSize" :total="total"/>
    </el-col>
  </el-row>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import { ERR_OK } from 'api/config'
import SongList from 'common/js/songlist'
import { getRecommendList } from 'api/songList'
import Grid from 'base/grid/grid'
import MTitle from 'base/title/title'
import Pagination from 'base/pagination/pagination'
import { divideByTag, splitTags } from 'api/kit'

export default {
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.setCurrentPage(1)
    })
  },
  created() {
    this._getRecommendList(0)
  },
  data() {
    return {
      hottestList: [],
      isLoading: true,
      pageSize: 24,
      title: '热门歌单',
      total: 240
    }
  },
  methods: {
    _getRecommendList(page) {
      getRecommendList(this.pageSize, page).then(res => {
        if (res.data.code === ERR_OK) {
          const data = res.data.data
          let hottestList = []
          data.forEach(item => {
            let listObj = {}
            listObj.name = item.name
            listObj.id = item.id
            listObj.picUrl = item.coverImgUrl
            listObj.tag = splitTags(item.tags)
            listObj.ctime = item.createTime
            listObj.desc = item.description
            hottestList.push(new SongList(listObj))
          })
          this.hottestList = hottestList
          this.isLoading = false
        }
      })
    },
    selectedList(listItem) {
      this.setSongList(listItem)
      this.$router.push({
        path: `songlist/${listItem.id}`
      })
    },
    ...mapMutations({
      setSongList: 'SET_CURRENT_SONG_LIST',
      setCurrentPage: 'SET_CURRENT_PAGE'
    })
  },
  watch: {
    currentPage(newPage) {
      this.isLoading = true
      this._getRecommendList(newPage)
    }
  },
  computed: {
    ...mapGetters(['currentPage'])
  },
  components: {
    Grid,
    MTitle,
    Pagination
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variables.styl';
@import '~common/stylus/reset.styl';


</style>
