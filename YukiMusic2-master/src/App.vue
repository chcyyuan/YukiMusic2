<template>
  <el-container id="app">
    <el-header>
      <m-header/>
    </el-header>
    <el-main>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </el-main>
    <el-footer>
      <m-footer/>
    </el-footer>
    <player v-show="!mvMode"/>
  </el-container>
</template>

<script>
import MHeader from 'components/m-header/m-header'
import MFooter from 'components/m-footer/m-footer'
import Player from 'components/player/player'
import { saveListStorage } from 'common/js/cache'
import { mapGetters } from 'vuex'

export default {
  created() {
    const self = this
    window.onbeforeunload = function() {
      saveListStorage(self.sequenceList)
    }
  },
  components: {
    MHeader,
    MFooter,
    Player
  },
  computed: {
    ...mapGetters(['sequenceList', 'favorList', 'mvMode'])
  }
}
</script>

<style>
@import './common/font/iconfont.css';
html {
  overflow-x: hidden;
}
.el-container {
  min-width: 1200px;
}
.el-header {
  height: 200px !important;
}

.el-main {
  margin-top: 5px;
}
.loading-box {
  height: 300px;
  z-index: -1;
}

.player-container {
  z-index: 999;
}
</style>


