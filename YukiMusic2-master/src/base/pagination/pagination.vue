<template>
  <el-pagination
    background
    layout="prev, pager, next"
    :total="total"
    :pageSize="pageSize"
    @current-change="pageChange"
  ></el-pagination>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  props: {
    total: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 30
    }
  },
  methods: {
    pageChange(newPage) {
      this.setCurrentPage(newPage)
    },
    ...mapMutations({
      setCurrentPage: 'SET_CURRENT_PAGE'
    })
  }
}
</script>

<style lang="stylus" scoped></style>



