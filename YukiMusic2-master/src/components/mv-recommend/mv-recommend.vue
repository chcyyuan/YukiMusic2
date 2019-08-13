<template>
  <el-row class="recommend-mv-container">
    <el-col :span="18" :push="3">
      <m-title :data="title"/>
    </el-col>
    <el-col class="loading-box" v-loading="isLoading" v-if="isLoading" :span="18" :push="3"></el-col>
    <el-col class="mv-container" :span="18" :push="3">
      <el-row>
        <el-col class="mv-display" v-if="!isLoading">
          <mv-grid :dataList="recommendList" @selected="selectedMV"/>
        </el-col>
        <el-col class="pager">
          <pagination :pageSize="pageSize" :total="total"/>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import MTitle from 'base/title/title'
import MV from 'common/js/mv'
import { getRecommendMV } from 'api/mv'
import { ERR_OK } from 'api/config'
import { splitSingersInObj } from 'api/kit'
import MvGrid from 'base/mv-grid/mv-grid'
import Pagination from 'base/pagination/pagination'
import { mapMutations, mapGetters } from 'vuex'

export default {
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.setCurrentPage(1)
    })
  },
  created() {
    this._getRecommendMV(0, this.pageSize)
  },
  data() {
    return {
      title: 'MV热榜',
      isLoading: true,
      pageSize: 16,
      recommendList: [],
      total: 100
    }
  },
  methods: {
    _getRecommendMV(page, pageSize) {
      this.isLoading = true
      getRecommendMV(page, pageSize).then(res => {
        if (res.data.code === ERR_OK) {
          this.recommendList = []
          const dataList = res.data.data
          dataList.forEach(item => {
            let mv = {}
            mv.id = item.id
            mv.name = item.name
            mv.cover = item.cover
            mv.singer = splitSingersInObj(item.artists)
            this.recommendList.push(new MV(mv))
          })
          this.isLoading = false
        }
      })
    },
    selectedMV(mv) {
      this.setCurrentMV(mv)
      this.$router.push({
        path: `mvdetail/${mv.id}`
      })
    },
    ...mapMutations({
      setCurrentPage: 'SET_CURRENT_PAGE',
      setCurrentMV: 'SET_CURRENT_MV'
    })
  },
  watch: {
    currentPage(newPage) {
      this._getRecommendMV(newPage, this.pageSize)
    }
  },
  computed: {
    ...mapGetters(['currentPage'])
  },
  components: {
    MTitle,
    MvGrid,
    Pagination
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variables';
@import '~common/stylus/reset';

.pager {
  margin-top: 30px;
}
</style>