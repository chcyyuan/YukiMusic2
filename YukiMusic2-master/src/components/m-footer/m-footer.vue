<template>
  <el-row class="footer-container">
    <el-col :span="24">
      <p class="grid-content">Designed by Tanqurey</p>
    </el-col>
  </el-row>
</template>

<script>
export default {}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variables';
@import '~common/stylus/reset';

.footer-container {
  position: relative;
  background-color: $grey-color;
  height: 130px;
  font-size: $font-size-small;
  color: $secondary-text;

  .grid-content {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>