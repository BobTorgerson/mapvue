<template>
  <div id="top_item">
    <draggable v-model="layers" id="layer-list" class="layer-list">
      <transition-group name="list-complete">
        <div class="list-complete-item" v-for="layer in layers" :key="layer.name">
          <map-layer
            :name="layer.name"
            :title="layer.title"
            :abstract="layer.abstract"
            :visible="layer.visible"
            :secondVisible="layer.secondVisible"
            :nodata="layer.nodata"
            :nodataMessage="layer.nodataMessage"
          ></map-layer>
        </div>
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import MapLayer from './MapLayer'
import draggable from 'vuedraggable'

export default {
  name: 'LayerList',
  components: {
    'map-layer': MapLayer,
    draggable
  },
  computed: {
    layers: {
      get () {
        return this.$store.state.layers
      },
      set (value) {
        this.$store.commit('reorderLayers', value)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.list-complete-item {
  transition: all .35s;
}

.list-complete-enter, .list-complete-leave-active {
  opacity: 0;
}
</style>
