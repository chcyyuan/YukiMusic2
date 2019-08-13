<template>
  <el-row>
    <el-col class="search-container">
      <el-row class="search-header">
        <el-col>全局搜索</el-col>
      </el-row>
      <el-row class="search-body">
        <el-col class="body-keywords" :span="8" :push="2">
          <el-autocomplete
            class="inline-input"
            v-model="keywords"
            :fetch-suggestions="getSearchHistory"
            placeholder="请输入搜索关键字"
            size="mini"
            :clearable="true"
            @select="deleteHistory"
            prefix-icon="el-icon-search"
          ></el-autocomplete>
        </el-col>
        <el-col class="body-category" :span="6" :push="11">
          <el-select v-model="category" size="mini">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col class="search-btn" :span="6" :push="20">
          <el-button type="danger" size="mini" @click.native="beginSearch(keywords)">搜索</el-button>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { searchCategory } from 'common/js/config'

export default {
  data() {
    return {
      keywords: '',
      category: '',
      deleteTips: '清空搜索记录',
      options: [
        {
          value: searchCategory.song,
          label: '单曲'
        },
        {
          value: searchCategory.singer,
          label: '歌手'
        },
        {
          value: searchCategory.songList,
          label: '歌单'
        },
        {
          value: searchCategory.album,
          label: '专辑'
        },
        {
          value: searchCategory.mv,
          label: 'MV'
        }
      ]
    }
  },
  methods: {
    getSearchHistory(queryString, cb) {
      let history = this.searchHistory
      let results = queryString
        ? this.searchHistory.filter(this.createFilter(queryString))
        : this.searchHistory
      if (this.searchHistory.length) {
        if (this.searchHistory[0].value !== this.deleteTips)
          results.unshift({ value: this.deleteTips })
      }
      cb(results)
    },
    createFilter(queryString) {
      return history => {
        return (
          history.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
      }
    },
    beginSearch(keywords) {
      if (keywords === '') {
        this.$message({
          message: '检索内容不可为空',
          type: 'error'
        })
        return
      }
      if (keywords.length > 24) {
        this.$message({
          message: '检索内容过长,请提取必要关键字',
          type: 'error'
        })
        return
      }
      if (this.category === '') {
        this.$message({
          message: '您还未选择检索类别',
          type: 'error'
        })
        return
      }
      this.setKeywords(keywords), this.setCategory(this.category)
      this._saveSearchHistory({ query: keywords })
      this.$router.push({
        path: `/searchresult/${keywords}/${this.category}`
      })
    },
    deleteHistory(item) {
      if (item.value === this.deleteTips) {
        this._saveSearchHistory({ empty: true })
        this.keywords = ''
      }
    },
    ...mapActions(['_saveSearchHistory']),
    ...mapMutations({
      setKeywords: 'SET_SEARCH_KEYWORDS',
      setCategory: 'SET_SEARCH_CATEGORY'
    })
  },
  computed: {
    ...mapGetters(['searchHistory', 'searchKeywords', 'searchCategory'])
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variables';
@import '~common/stylus/reset';

.search-container {
  overflow: hidden;

  .search-header {
    margin: 0 auto;
    width: 600px;
    height: 150px;
    line-height: 150px;
    color: $grey-color;
    font-size: $font-size-ultra;
    text-align: center;
    background: url('../../common/image/search-bg.jpg');
    border-radius: 5px;
  }

  .search-body {
    margin: 0 auto;
    width: 600px;
    height: 150px;
    background-color: $grey-color;
    margin-top: 15px;
    border-radius: 5px;

    .el-col {
      height: 150px;
      position: relative;
    }

    .body-keywords, .search-btn, .body-category {
      position: absolute;
      top: 50%;
      margin-top: -14px;

      .el-input {
        font-size: $font-size-mid;
      }
    }
  }
}

.el-select-dropdown__item {
  font-size: $font-size-small;
  text-align: center;
}

.el-button {
  background-color: $dark-primary-color;
  border: none;
}
</style>


