<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
require('./global.scss')
import { metaDescriptions, metaTitles } from '@/main'

export default {
  name: 'app',
  metaInfo: {
    title: 'Mapventures',
    titleTemplate: (titleChunk) => {
      return titleChunk ? `${titleChunk} - Mapventures` : 'Mapventures'
    },
    htmlAttrs: {
      prefix: 'og: http://ogp.me/ns#'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@iarc_alaska' },
      ...metaDescriptions('This site features interactive maps with different topics to facilitate the discovery, access and use of different Arctic and Alaska data sets.'),
      ...metaTitles('MapVentures: interactive maps to show and explain Arctic data')
    ]
  }
}
</script>

<style lang="scss">
// Any styles belonging to the global scope should instad be in `global.scss`
</style>
