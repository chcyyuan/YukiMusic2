<template>
  <div class="grid-container highlight" :title="name">
    <img v-lazy="picUrl" alt>
    <p class="name">{{name}}</p>
    <p class="intro">{{intro}}</p>
  </div>
</template>

<script>
export default {
  props: {
    name: '',
    picUrl: '',
    intro: ''
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variables';
@import '~common/stylus/reset';
@import '~common/stylus/common';

.grid-container {
  margin-top: 8px;
  font-size: $font-size-small;
  position: relative;
  height: 81px;
  border-bottom: 3px solid $primary-color;
  color: $firstly-text;

  img {
    width: 60px;
    height: 60px;
    border: 3px solid $primary-color;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 10px;
  }

  p {
    position: absolute;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 100px;
    text-align: right;
  }

  .name {
    right: 10px;
    top: 10px;
  }

  .intro {
    right: 10px;
    bottom: 10px;
    color: $divider-color;
  }
}
</style>


