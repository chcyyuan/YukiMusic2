<template>
  <el-row>
    <el-col :span="span" :push="push">{{data}}</el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    data: {
      type: String,
      default: ''
    },
    span: {
      type: Number,
      default: 24
    },
    push: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variables';
@import '~common/stylus/reset';

.el-row {
  height: 36px;

  .el-col {
    background-color: $dark-primary-color;
    position: relative;
    border-radius: 5px 5px 0 0;
    color: $text;
    height: 28px;
    line-height: 28px;
    font-size: $font-size-mid;
    text-align: center;
  }
}
</style>

