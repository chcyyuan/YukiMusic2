<template>
  <div class="row-container">
    <el-row v-for="idx1 in rowNum" :key="idx1">
      <el-col :span="24/eachLength" v-for="(item,idx2) in eachRowList[idx1-1]" :key="idx2">
        <div class="grid-content" @click="selectItem(item)">
          <img v-lazy="item.picUrl" :key="item.picUrl">
          <p class="name" :title="item.name" v-if="isName" ref="name">{{item.name}}</p>
          <p class="tag" v-if="isTag">{{item.tag||item.singer}}</p>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  created() {
    if (this.dataList.length !== 0) {
      this.rowNum = Math.ceil(this.dataList.length / this.eachLength)
      for (let i = 0; i < this.rowNum; i++) {
        this.eachRowList.push(
          this.dataList.slice(i * this.eachLength, (i + 1) * this.eachLength)
        )
      }
    }
  },
  data() {
    return {
      rowNum: 0,
      eachRowList: []
    }
  },
  props: {
    dataList: {
      type: Array,
      default: () => []
    },
    eachLength: {
      type: Number,
      default: 3
    },
    isName: {
      type: Boolean,
      default: true
    },
    isTag: {
      type: Boolean,
      default: true
    },
    nameWidth: {
      type: Number,
      default: 240
    }
  },
  methods: {
    selectItem(item) {
      this.$emit('selected', item)
    }
  },
  watch: {
    dataList(newList) {
      if (newList.length !== 0) {
        this.eachRowList = []
        this.rowNum = Math.ceil(newList.length / this.eachLength)
        for (let i = 0; i < this.rowNum; i++) {
          this.eachRowList.push(
            newList.slice(i * this.eachLength, (i + 1) * this.eachLength)
          )
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variables';
@import '~common/stylus/reset';

.row-container {
  .el-row {
    margin-top: 10px;
    height: 100px;
    border-radius: 5px;

    .grid-content {
      background-color: $grey-color;
      position: relative;
      cursor: pointer;
      margin-left: 5px;

      p {
        text-align: right;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        position: absolute;
        font-size: $font-size-small;
      }

      .name {
        top: 5px;
        right: 5px;
        width: 200px;
      }

      .tag {
        bottom: 5px;
        right: 5px;
        color: $secondary-text;
      }

      img {
        position: relative;
        top: 2px;
        left: 2px;
        width: 80px;
        height: 80px;
        border-radius: 3px;
      }
    }
  }
}
</style>

