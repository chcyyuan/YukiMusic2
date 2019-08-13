<template>
  <el-row class="result-container">
    <el-col class="not-found iconfont icon-shanchu" v-if="isNotFound">&nbsp;服务器上没有相关资源</el-col>
    <el-col class="loading-box" v-show="isLoading" v-loading="isLoading"></el-col>
    <el-col class="result" v-show="!isNotFound&&!isLoading">
      <el-row class="record-count">
        <el-col :span="21" :push="3">共找到"{{searchKeywords}}"相关的记录共{{recordCount}}条</el-col>
      </el-row>
      <el-col v-if="searchCategory===1" :push="3" :span="18">
        <list :dataList="displayList"/>
      </el-col>
      <el-col v-if="searchCategory===2||searchCategory===3||searchCategory===4" :push="3" :span="18">
        <grid
          :dataList="displayList"
          :each-length="eachLength"
          @selected="selected"
          :isTag="isTag"
        />
      </el-col>
      <el-col v-if="searchCategory===5" :push="3" :span="18">
        <mv-grid :dataList="displayList" @selected="selectedMV"/>
      </el-col>
      <el-col class="pager" :push="3">
        <pagination :total="searchResult.count" :pageSize="perPage"/>
      </el-col>
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { ERR_OK } from 'api/config'
import { search } from 'api/search'
import Record from 'common/js/record'
import { SONG_PER_PAGE, OTHERS_PER_PAGE } from 'common/js/record'
import List from 'base/list/list'
import Grid from 'base/grid/grid'
import MvGrid from 'base/mv-grid/mv-grid'
import Pagination from 'base/pagination/pagination'
import { searchCategory } from 'common/js/config'

export default {
  created() {
    if (!this.searchKeywords.length || !this.searchCategory) {
      this.$emit('turenBack')
      return
    }
    this._search(this.searchKeywords, this.searchCategory, 0, this.perPage)
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (!vm.searchKeywords.length || !vm.searchCategory) {
        vm.$router.push({
          path: '/search'
        })
        return
      }
      vm.setCurrentPage(1)
    })
  },
  data() {
    return {
      pagerDisplay: 0,
      isNotFound: false,
      recordCount: 0,
      displayList: [],
      isLoading: true,
      eachLength: 3
    }
  },
  methods: {
    _search(keywords, category, page, perPage) {
      this.isLoading = true
      search(keywords, category, page, perPage).then(res => {
        if (res.data.code === ERR_OK && res.data.data) {
          this.dataHandler(res.data.data)
          this.displayList = this.searchResult.analyzeSearchData(category)
          this.isLoading = false
        } else {
          this.isLoading = false
          this.isNotFound = true
          this.setSearchResult({})
        }
      })
    },
    dataHandler(data) {
      const result = data
      this.recordCount =
        result.songCount ||
        result.artistCount ||
        result.playlistCount ||
        result.albumCount ||
        result.mvCount ||
        0
      const dataArr =
        result.songs ||
        result.artists ||
        result.playlists ||
        result.albums ||
        result.mvs
      this.setSearchResult(
        new Record({
          count: this.recordCount,
          category: this.searchCategory,
          data: dataArr
        })
      )
    },
    selected(item) {
      if (this.searchCategory === searchCategory.singer) {
        this.setSinger(item)
        this.$router.push({
          path: `/singer/${item.id}`
        })
      }
      if (this.searchCategory === searchCategory.songList) {
        this.setSongList(item)
        this.$router.push({
          path: `/songlist/${item.id}`
        })
      }
      if (this.searchCategory === searchCategory.album) {
        this.setAlbum(item)
        this.$router.push({
          path: `/albumdetail/${item.id}`
        })
      }
      if (this.searchCategory === searchCategory.album) {
        this.setAlbum(item)
        this.$router.push({
          path: `/albumdetail/${item.id}`
        })
      }
    },
    selectedMV(mv) {
      // 新增的MV查找功能
      this.setCurrentMV(mv)
      this.$router.push({
        path: `/mvdetail/${mv.id}`
      })
    },
    ...mapMutations({
      setSearchResult: 'SET_SEARCH_RESULT',
      setSinger: 'SET_SINGER',
      setSongList: 'SET_CURRENT_SONG_LIST',
      setAlbum: 'SET_CURRENT_ALBUM',
      setMV: 'SET_CURRENT_MV',
      setCurrentPage: 'SET_CURRENT_PAGE',
      setCurrentMV:'SET_CURRENT_MV'
    })
  },
  watch: {
    currentPage(newVal) {
      this._search(
        this.searchKeywords,
        this.searchCategory,
        newVal,
        this.perPage
      )
    },
    searchKeywords(newVal) {
      this._search(newVal, this.searchCategory, 0, this.perPage)
    },
    searchCategory(newVal) {
      this._search(this.searchKeywords, newVal, 0, this.perPage)
    }
  },
  computed: {
    perPage() {
      return this.searchCategory === searchCategory.song
        ? SONG_PER_PAGE
        : OTHERS_PER_PAGE
    },
    isTag() {
      return this.searchCategory === searchCategory.album
    },
    ...mapGetters([
      'searchKeywords',
      'searchCategory',
      'currentPage',
      'searchResult'
    ])
  },
  components: {
    List,
    Grid,
    Pagination,
    MvGrid
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variables.styl';
@import '~common/stylus/reset.styl';

.result-container {
  overflow: hidden;

  .not-found {
    text-align: center;
    margin: 20px auto;
    color: $dark-primary-color;
    font-size: $font-size-mid;
  }

  .result {
    .record-count {
      color: $dark-primary-color;
      font-size: $font-size-small;
      margin: 4px 0;
    }
  }

  .pager {
    margin-top: 18px;
  }
}
</style>

