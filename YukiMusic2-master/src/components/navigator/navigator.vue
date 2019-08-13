<template>
  <div class="nav-container">
    <ul>
      <li
        class="nav-item"
        v-for="(tagItem,idx) in tagList"
        :key="idx"
        ref="navItem"
        @click="scrollTo(offsetTops[idx])"
      >{{tagItem[0].tag}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      scrollTop: 0,
      bgColor: '#eeeeee',
      actBgColor: '#F44336',
      fontColor: '#212121',
      actFontColor: '#fff',
      radius: '3px'
    }
  },
  mounted() {
    window.addEventListener('scroll', this.scrollHandle)
  },
  methods: {
    scrollHandle() {
      this.scrollTop = document.documentElement.scrollTop
    },
    scrollTo(offset) {
      document.documentElement.scrollTop = offset
    },
    changeStyle(dom, bgColor, color, radius) {
      dom.style.backgroundColor = bgColor
      dom.style.color = color
      if (radius) {
        dom.style.borderRadius = radius
      }
    }
  },
  watch: {
    scrollTop(newVal) {
      let navList = this.$refs.navItem
      let tagList = this.tagList
      let offsetTops = this.offsetTops

      for (let i = 0; i < offsetTops.length; i++) {
        this.changeStyle(navList[i], this.bgColor, this.fontColor)
      }
      if (newVal < offsetTops[0]) {
        this.changeStyle(
          navList[0],
          this.actBgColor,
          this.actFontColor,
          this.radius
        )
        return
      }
      for (let i = 0; i < offsetTops.length; i++) {
        if (offsetTops[i + 1]) {
          if (newVal >= offsetTops[i] && newVal < offsetTops[i + 1]) {
            this.changeStyle(
              navList[i],
              this.actBgColor,
              this.actFontColor,
              this.radius
            )
            return
          }
        } else {
          this.changeStyle(
            navList[i],
            this.actBgColor,
            this.actFontColor,
            this.radius
          )
          return
        }
      }
    }
  },
  props: {
    tagList: {
      type: Array,
      default: () => []
    },
    offsetTops: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variables';
@import '~common/stylus/reset';

.nav-container {
  position: fixed;
  z-index: 2;
  top: 5px;
  right: 5px;
  background-color: $grey-color;
  width: 30px;
  border: 2px solid $primary-text;
  border-radius: 3px;
  text-align: center;
  font-size: $font-size-small;
}

.nav-item {
  margin: 6px auto;
}

.nav-item:hover {
  cursor: pointer;
}
</style>
