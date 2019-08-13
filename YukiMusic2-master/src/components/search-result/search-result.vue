<template>
  <div class="search">
    <m-title :data="title" :span="2" :push="3"/>
    <router-view @turnBack="turnBack"></router-view>
  </div>
</template>
<script>
import MTitle from 'base/title/title'
import { SONG_PER_PAGE, OTHERS_PER_PAGE } from 'common/js/record'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      title: '检索结果'
    }
  },
  components: {
    MTitle
  },
  methods: {
    turnBack() {
      this.$router.push({
        path: '/search'
      })
      return
    }
  },
  computed: {
    ...mapGetters(['searchKeywords', 'searchCategory'])
  }
}
</script>

<style lang="stylus" scoped></style>
