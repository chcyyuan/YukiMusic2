<template>
  <div class="album">
    <m-title :data="title" :span="2" :push="3"/>
    <router-view :key="key"></router-view>
  </div>
</template>
<script>
import MTitle from 'base/title/title'

export default {
  data() {
    return {
      title: '专辑详情'
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
  //避免无参进入组件
  beforeRouteEnter: (to, from, next) => {
    if (to.path === '/album') {
      next({ path: '/recommend' })
      return
    }
    next()
  },
  beforeRouteUpdate: (to, from, next) => {
    if (to.path === '/album') {
      next({ path: '/recommend' })
      return
    }
    next()
  }
}
</script>

<style lang="stylus" scoped></style>
