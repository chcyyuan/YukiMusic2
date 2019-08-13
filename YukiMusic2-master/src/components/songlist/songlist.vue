<template>
  <div class="singer">
    <m-title :data="title" :span="2" :push="3"/>
    <router-view :key="key"></router-view>
  </div>
</template>

<script>
import MTitle from 'base/title/title'

export default {
  data() {
    return {
      title: '歌单详情'
    }
  },
  components: {
    MTitle
  },
  computed: {
    key() {
      // 避免组件复用导致组件不更新
      return this.$route.path + Math.random()
    }
  },
  beforeRouteEnter: (to, from, next) => {
    if (to.path === '/songlist') {
      next({ path: '/hotsonglist' })
      return
    }
    next()
  },
  beforeRouteUpdate: (to, from, next) => {
    if (to.path === '/songlist') {
      next({ path: '/hotsonglist' })
      return
    }
    next()
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variables.styl';
@import '~common/stylus/reset.styl';
</style>