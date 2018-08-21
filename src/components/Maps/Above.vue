<template>
<div>
  <h1 class="map-title">{{ title }}</h1>
  <layer-menu
    :buttons="buttons"
  ></layer-menu>
  <splash-screen
    :abstract="abstract"></splash-screen>
  <mv-map
    ref="map"
    :baseLayerOptions="baseLayerOptions"
    :baseLayer="baseLayer"
    :placeLayer="placeLayer"
    :crs="crs"
    :mapOptions="mapOptions"
  ></mv-map>
  <sidebar :mapObj="primaryMapObject"></sidebar>
  <tour class="tour" :tour="tour"></tour>
  <mv-footer></mv-footer>
</div>
</template>
<script>
/* eslint new-cap: "off" */
import _ from 'lodash'
import MapInstance from '@/components/MapInstance'
import Tour from '../Tour'

export default {
  name: 'Above',
  extends: MapInstance,
  components: {
    tour: Tour
  },
  mounted () {
    // Necessary to see the markers.
    this.$L.Icon.Default.imagePath = 'static/'
  },
  data () {
    return {
      title: 'Impacts of Environmental Change on Travel and Access to Hunting, Fishing, and Gathering in Interior Alaska',
      abstract: `
      <p>With global level climate change and evidence of the Arctic warming approximately twice the global rate, how are hunters, fishers, and people travelling on the landscape experiencing change in interior Alaska?
      Between 2016 and 2017, 26 observers from 9 communities in interior Alaska documented changes they were noticing while traveling, hunting, fishing, and gathering.</p>
      <p>This map combines examples of the submitted observations with the most current measurements related to the observed change.</p>
`,
      mapOptions: {
        zoom: 2,
        minZoom: 0,
        maxZoom: 7,
        center: [64.62756867126886, -151.58022337112894]
      },
      baseLayerOptions: {
        transparent: true,
        srs: 'EPSG:3338',
        format: 'image/png',
        version: '1.3',
        continuousWorld: true // needed for non-3857 projs
      },
      buttons: [
        {
          text: 'Dataset information',
          classes: 'iam-dataset-info',
          glyphicon: 'new-window',
          callback: this.openDatasetInformation
        }
      ],
      layers: [
        {
          'abstract': `Frozen Season, 1970s`,
          'name': 'frozenseason_1970s_tcc',
          'layerName': 'nasa_above:frozenseason_1970s_tcc',
          'title': 'Frozen Season, 1970s',
          'legend': false
        },
        {
          'abstract': `Winter temperatures, 1970s`,
          'name': 'wintertemp_1970s_tcc',
          'layerName': 'nasa_above:wintertemp_1970s_tcc',
          'title': 'Winter temperatures, 1970s',
          'legend': false
        },
        {
          'abstract': `Winter temperatures, 2010s`,
          'name': 'wintertemp_2010s_tcc',
          'layerName': 'nasa_above:wintertemp_2010s_tcc',
          'title': 'Winter temperatures, 2010s',
          'legend': false
        }
      ]
    }
  },
  computed: {
    crs () {
      return new this.$L.Proj.CRS('EPSG:3338',
      '+proj=aea +lat_1=55 +lat_2=65 +lat_0=50 +lon_0=-154 +x_0=0 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=m +no_defs',
        {
          resolutions: [4096, 2048, 1024, 512, 256, 128, 64],

          // Origin should be lower-left coordinate
          // in projected space.  Use GeoServer to
          // find this:
          // TileSet > Gridset Bounds > compute from maximum extent of SRS
          origin: [-4648005.934316417, 444809.882955059]
        }
      )
    },
    baseLayer () {
      return new this.$L.tileLayer.wms(
        process.env.GEOSERVER_WMS_URL,
        _.extend(this.baseLayerOptions, {
          layers: ['alaska_osm']
        })
      )
    },
    placeLayer () {
      return new this.$L.tileLayer.wms(
        process.env.GEOSERVER_WMS_URL,
        _.extend(this.baseLayerOptions, {
          layers: ['alaska_places_osm_3338'],
          zIndex: 1000
        })
      )
    },
    secondBaseLayer () {
      return new this.$L.tileLayer.wms(
        process.env.GEOSERVER_WMS_URL,
        _.extend(this.baseLayerOptions, {
          layers: ['alaska_osm']
        })
      )
    },
    secondPlaceLayer () {
      return new this.$L.tileLayer.wms(
        process.env.GEOSERVER_WMS_URL,
        _.extend(this.baseLayerOptions, {
          layers: ['alaska_places_osm_3338'],
          zIndex: 1000
        })
      )
    },
    tour () {
      let tour
      tour = new this.$shepherd.Tour({
        defaults: {
          classes: 'shepherd-theme-square-dark',
          showCancelLink: true
        }
      })
      return tour
    }
  }
}

</script>
<style lang="scss" scoped>

</style>
