import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 异步加载组件
const Recommend = (resolve) => {
  import('components/recommend/recommend').then((module) => {
    resolve(module)
  })
}

const TopSinger = (resolve) => {
  import('components/topsinger/topsinger').then((module) => {
    resolve(module)
  })
}

const Singer = (resolve) => {
  import('components/singer/singer').then((module) => {
    resolve(module)
  })
}

const SingerDetail = (resolve) => {
  import('components/singer-detail/singer-detail').then((module) => {
    resolve(module)
  })
}

const SonglistDetail = (resolve) => {
  import('components/songlist-detail/songlist-detail').then((module) => {
    resolve(module)
  })
}

const SongList = (resolve) => {
  import('components/songlist/songlist').then((module) => {
    resolve(module)
  })
}

const HotSongList = (resolve) => {
  import('components/hotsonglist/hotsonglist').then((module) => {
    resolve(module)
  })
}

const Album = (resolve) => {
  import('components/album/album').then((module) => {
    resolve(module)
  })
}

const AlbumDetail = (resolve) => {
  import('components/album-detail/album-detail').then((module) => {
    resolve(module)
  })
}

const SearchResult = (resolve) => {
  import('components/search-result/search-result').then((module) => {
    resolve(module)
  })
}

const Search = (resolve) => {
  import('components/search/search').then((module) => {
    resolve(module)
  })
}

const ResultDisplay = (resolve) => {
  import('components/result-display/result-display').then((module) => {
    resolve(module)
  })
}

const Collect = (resolve) => {
  import('components/collect/collect').then((module) => {
    resolve(module)
  })
}

const MVRecommend = (resolve) => {
  import('components/mv-recommend/mv-recommend').then((module) => {
    resolve(module)
  })
}

const MVDetail = (resolve) => {
  import('components/mv-detail/mv-detail').then((module) => {
    resolve(module)
  })
}

const MVPlayer = (resolve) => {
  import('components/mv-player/mv-player').then((module) => {
    resolve(module)
  })
}

export default new Router({
  routes: [{
    path: '/',
    redirect: '/recommend'
  }, {
    path: '/recommend',
    component: Recommend
  }, {
    path: '/topsinger',
    component: TopSinger
  }, {
    path: '/singer',
    component: Singer,
    children: [{
      path: ':id',
      component: SingerDetail
    }]
  }, {
    path: '/songlist',
    component: SongList,
    children: [{
      path: ':id',
      component: SonglistDetail
    }]
  }, {
    path: '/hotsonglist',
    component: HotSongList
  }, {
    path: '/albumdetail',
    component: Album,
    children: [{
      path: ':id',
      component: AlbumDetail
    }]
  }, {
    path: '/search',
    component: Search
  },
  {
    path: '/albumdetail',
    component: Album,
    children: [{
      path: ':id',
      component: AlbumDetail
    }]
  },
  {
    path: '/searchresult',
    component: SearchResult,
    children: [{
      path: ':keyword/:type',
      component: ResultDisplay
    }]
  },
  {
    path: '/collect',
    component: Collect
  },
  {
    path: '/mvrecommend',
    component: MVRecommend
  },
  {
    path: '/mvdetail',
    component: MVDetail,
    children: [{
      path: ':id',
      component: MVPlayer
    }]
  }
  ]
})
