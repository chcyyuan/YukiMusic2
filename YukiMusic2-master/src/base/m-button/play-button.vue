<template>
  <el-button type="primary" class="play-all iconfont" :class="btnClass">&nbsp;{{text}}</el-button>
</template>

<script>
import { iconStatus } from 'common/js/config'
export default {
  props: {
    text: {
      type: String,
      default: '播放全部'
    },
    type: {
      type: Number,
      default: iconStatus.play
    }
  },
  computed: {
    btnClass() {
      return [
        'play-all',
        'iconfont',
        { 'icon-zanting': this.type === iconStatus.play },
        { 'icon-jinzhi': this.type === iconStatus.clear }
      ]
    }
  }
}
</script>


<style lang="stylus" scoped>
@import '~common/stylus/variables.styl';

.play-all {
  background-color: $dark-primary-color;
  border: none;
  font-size: $font-size-mid;
  margin-top: 12px;
}
</style>
