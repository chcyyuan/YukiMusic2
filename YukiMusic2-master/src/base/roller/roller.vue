<template>
  <el-carousel direction="vertical" :autoplay="true">
    <el-carousel-item v-for="idx1 in rowNum" :key="idx1">
      <el-row>
        <el-col
          v-for="(item,idx2) in eachList[idx1-1]"
          :key="idx2"
          :span="4"
          @click.native="selected(item)"
          class="carousel-item"
        >
          <img v-lazy="item.picUrl" alt>
          <p class="name" :title="item.name">{{item.name}}</p>
          <p class="singer" :title="item.singer">{{item.singer}}</p>
        </el-col>
      </el-row>
    </el-carousel-item>
  </el-carousel>
</template>
<script>
export default {
  props: {
    dataList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      rowNum: 0,
      eachList: [],
      rowLength: 6
    }
  },
  methods: {
    selected(item) {
      this.$emit('selectedAlbum', item)
    }
  },
  watch: {
    'dataList.length': function(newVal) {
      this.rowNum = Math.ceil(newVal / this.rowLength)
      let eachRow = []
      for (let i = 0; i < this.rowNum; i++) {
        eachRow = this.dataList.slice(
          i * this.rowLength,
          (i + 1) * this.rowLength
        )
        this.eachList.push(eachRow)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variables';
@import '~common/stylus/reset';

.el-carousel {
  background-color: $grey-color;
  height: 180px;
  border-radius: 0 0 5px 5px;

  .el-row {
    .el-col {
      position: relative;
      height: 180px;

      img {
        position: absolute;
        width: 100px;
        height: 100px;
        left: 8px;
        top: 8px;
        border-radius: 3px;
      }

      p {
        position: absolute;
        font-size: $font-size-small;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 140px;
        left: 8px;
      }

      .name {
        bottom: 36px;
        color: $firstly-text;
      }

      .singer {
        bottom: 18px;
      }
    }
  }

  .carousel-item:hover {
    cursor: pointer;
  }
}
</style>