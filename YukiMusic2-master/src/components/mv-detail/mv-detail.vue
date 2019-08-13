<template>
  <el-row class="mv-container">
    <el-col>
      <m-title :data="title" :span="3" :push="3"/>
    </el-col>
    <el-col>
      <router-view @turnBack="turnBack"></router-view>
    </el-col>
  </el-row>
</template>

<script>
import MTitle from 'base/title/title'
import { mapMutations } from 'vuex'

export default {
  data() {
    return {
      title: 'MV详情'
    }
  },
  methods: {
    turnBack() {
      this.$router.push({
        path: '/mvrecommend'
      })
    },
    ...mapMutations({
      setMVMode: 'SET_MV_MODE',
      setCurrentMV: 'SET_CURRENT_MV'
    })
  },
  components: {
    MTitle
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variables';
@import '~common/stylus/reset';
</style>