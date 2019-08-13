<template>
  <div class="header-container">
    <el-row class="header-title">
      <el-col :span="24">
        <div class="grid-content header-text">Yuki Music</div>
      </el-col>
    </el-row>
    <el-row class="nav-bar">
      <el-col :span="4" :gutter="0" class="nav-item">
        <router-link to="/recommend" class="item-link">推荐</router-link>
      </el-col>
      <el-col :span="4" :gutter="0" class="nav-item">
        <router-link to="/topsinger" class="item-link">歌手</router-link>
      </el-col>
      <el-col :span="4" :gutter="0" class="nav-item">
        <router-link to="/hotsonglist" class="item-link">歌单</router-link>
      </el-col>
      <el-col :span="4" :gutter="0" class="nav-item">
        <router-link to="/search" class="item-link">搜索</router-link>
      </el-col>
      <el-col :span="4" :gutter="0" class="nav-item">
        <router-link to="/mvrecommend" class="item-link">MV</router-link>
      </el-col>
      <el-col :span="4" :gutter="0" class="nav-item">
        <router-link to="/collect" class="item-link">收藏</router-link>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variables';
@import '~common/stylus/reset';

.header-title {
  .header-text {
    height: 150px;
    font-size: $font-size-title;
    text-align: center;
    line-height: 150px;
    color: $text;
    background-color: $dark-primary-color;
    border-radius: 5px;
  }
}

.nav-bar {
  margin-top: 10px;
  height: 40px;
  text-align: center;

  .nav-item {
    border-top: 2px solid $divider-color;
    border-bottom: 2px solid $divider-color;
    height: 40px;
    line-height: 40px;

    .item-link {
      color: $firstly-text;
    }

    .router-link-active {
      color: $dark-primary-color;
    }

    .item-link:hover {
      color: $primary-color;
    }
  }
}
</style>


