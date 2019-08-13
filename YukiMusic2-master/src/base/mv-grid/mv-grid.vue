<template>
  <el-row class="grid-container">
    <el-row v-for="idx1 in rowNum" :key="idx1" class="mv-item-container">
      <el-col
        v-for="(item,idx2) in eachRowList[idx1-1]"
        :key="idx2"
        :span="24/eachRowNum"
        class="mv-item"
        @mouseenter.native="displayBlock(idx1,idx2)"
        @mouseleave.native="hideBlock"
        @click.native="selected(item)"
      >
        <div class="pic">
          <img :src="item.picUrl">
          <div class="block-layer" v-show="idx1===displayIdx1&&idx2===displayIdx2">
            <p class="layer-play iconfont icon-zanting"></p>
          </div>
        </div>
        <p class="mv-name" :title="item.name">{{item.name}}</p>
        <p class="mv-singer" :title="item.singer">{{item.singer}}</p>
      </el-col>
    </el-row>
  </el-row>
</template>

<script>
export default {
  created() {
    this.rowNum = Math.ceil(this.dataList.length / this.eachRowNum)
  },
  data() {
    return {
      displayIdx1: -1,
      displayIdx2: -1,
      rowNum: 0
    }
  },
  props: {
    dataList: {
      type: Array,
      default: () => []
    },
    eachRowNum: {
      type: Number,
      default: 4
    }
  },
  methods: {
    displayBlock(idx1, idx2) {
      this.displayIdx1 = idx1
      this.displayIdx2 = idx2
    },
    hideBlock() {
      this.displayIdx1 = -1
      this.displayIdx2 = -1
    },
    selected(item) {
      this.$emit('selected', item)
    }
  },
  watch: {
    dataList(newList) {
      if (newList.length === 0) return
      this.rowNum = Math.ceil(this.dataList.length / this.eachRowNum)
    }
  },
  computed: {
    eachRowList() {
      let list = []
      for (let i = 0; i < this.eachRowNum; i++) {
        let temp = []
        if ((i + 1) * this.eachRowNum > this.dataList.length) {
          temp = this.dataList.slice(i)
        } else {
          temp = this.dataList.slice(i * this.eachRowNum, (i + 1) * this.eachRowNum)
        }
        list.push(temp)
      }
      return list
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variables';
@import '~common/stylus/reset';

.grid-container {
  overflow: hidden;

  .mv-item-container {
    margin: 0 auto;

    .mv-item {
      margin-top: 15px;

      .pic {
        width: 180px;
        height: 101px;
        position: relative;

        img {
          width: 180px;
          border-radius: 3px;
        }

        .block-layer {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          font-size: $font-size-big;
          color: $grey-color;
          background-color: $firstly-text-transparent;
          border-radius: 3px;

          .layer-play {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
        }
      }

      .mv-name, .mv-singer {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: $font-size-small;
        color: $secondary-text;
        margin-top: 5px;
        margin-right: 12px;
      }

      .mv-name {
        color: $dark-primary-color;
      }
    }

    .mv-item:hover {
      cursor: pointer;
    }
  }
}
</style>