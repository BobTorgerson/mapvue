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
    :local-layers="localLayers"
  ></mv-map>
  <sidebar :mapObj="primaryMapObject"></sidebar>
  <tour class="tour" :tour="tour"></tour>
  <mv-footer></mv-footer>
</div>
</template>
<script>
/* eslint new-cap: "off" */
import { extend, template } from 'lodash'
import MapInstance from '@/components/MapInstance'
import Tour from '../Tour'
import Fulcrum from 'fulcrum-app'

// Holds reference to community observation popup markers
var observationMarkerGroup

// Reference to Fulcrum API mediator
var fulcrum

export default {
  name: 'AAOKH',
  extends: MapInstance,
  components: {
    tour: Tour
  },
  created () {
    // Necessary to see the markers.
    this.$L.Icon.Default.imagePath = 'static'

    // Start the load process to fetch the markers.
    fulcrum = new Fulcrum({
      api_key: process.env.AAOKH_FULCRUM_API_KEY
    })

    var formatPopup = (record) => {
      var html = template(`
<p class="observation"><%= observation %></p>
        `)({
          observation: record.form_values['819f']
        })
      return html
    }

    var markers = []
    observationMarkerGroup = this.$L.layerGroup()
    fulcrum.records.search(
      {
        form_id: process.env.AAOKH_FULCRUM_FORM_ID,
        timeout: 30000
      },
      // Transform into a layer of markers
      (error, records) => {
        if (error) {
          console.error('Error when fetching data ', error)
          return
        }
        records.records.forEach(record => {
          markers.push(
            this.$L.marker(
              new this.$L.latLng([record.latitude, record.longitude])
            ).bindPopup(formatPopup(record))
          )
        })
        console.log('markers is ', markers)
        observationMarkerGroup.addLayer(this.$L.layerGroup(markers))
      }
    )
  },
  data () {
    return {
      title: 'AAOKH',
      abstract: `
<h1>Alaska Arctic Observatory and Knowledge Hub</h1>
<p>
The Alaska Arctic Observatory and Knowledge Hub (AAOKH) was established to build capacity in sharing information from community-based observations on cryosphere change conducted by northern Alaska communities. Observations that could be linked to the seasonal cycle of harvesting activities was identified as an important focus for prioritizing observations.
</p>
<p class="photo-credit">UAF Photo by Todd Paris</p>
`,
      mapOptions: {
        zoom: 1,
        minZoom: 1,
        maxZoom: 5,
        center: [68, -165]
      },
      baseLayerOptions: {
        transparent: true,
        srs: 'EPSG:3572',
        format: 'image/png',
        version: '1.3',
        continuousWorld: true // needed for non-3857 projs
      },
      buttons: [
        {
          text: 'AAOKH web site',
          classes: 'iam-dataset-info',
          glyphicon: 'new-window',
          callback: this.openAaokhWebsite
        }
      ],
      layers: [
        {
          'abstract': `
<p>This is a paragraph about the community observations.</p>
<p>Include some temporal info too!!</p>
          `,
          'name': 'community_observations',
          'title': 'Community observations',
          'legend': false,
          'local': true
        }
      ]
    }
  },
  computed: {
    crs () {
      // We need to modify the default pan-Arctic
      // projection to avoid a bug.
      var proj = new this.$L.Proj.CRS('EPSG:3572',
        '+proj=laea +lat_0=90 +lon_0=-150 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
        {
          resolutions: [4096, 2048, 1024, 512, 256, 128, 64],
          origin: [-4234288.146966308, -4234288.146966307]
        }
      )

      // trust me.
      // Without this (= pi/2), proj4js returns an undefined
      // value for tiles requested at the North Pole and
      // it causes a runtime exception.
      proj.projection._proj.oProj.phi0 = 1.5708
      return proj
    },
    baseLayer () {
      return new this.$L.tileLayer.wms(
        process.env.GEOSERVER_WMS_URL,
        extend(this.baseLayerOptions, {
          layers: ['arctic_osm_3572']
        })
      )
    },
    placeLayer () {
      return new this.$L.tileLayer.wms(
        process.env.GEOSERVER_WMS_URL,
        extend(this.baseLayerOptions, {
          layers: ['arctic_places_osm_3572'],
          zIndex: 1000
        })
      )
    },
    secondBaseLayer () {
      return new this.$L.tileLayer.wms(
        process.env.GEOSERVER_WMS_URL,
        extend(this.baseLayerOptions, {
          layers: ['arctic_osm_3572']
        })
      )
    },
    secondPlaceLayer () {
      return new this.$L.tileLayer.wms(
        process.env.GEOSERVER_WMS_URL,
        extend(this.baseLayerOptions, {
          layers: ['arctic_places_osm_3572'],
          zIndex: 1000
        })
      )
    },
    localLayers () {
      console.log('>>>RIGHT NOW getting localLayers', observationMarkerGroup)
      return {
        'community_observations': {
          first: observationMarkerGroup,
          second: observationMarkerGroup
        }
      }
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
  },
  methods: {
    openAaokhWebsite () {
      window.open('https://arctic-aok.org')
    }
  }
}
</script>
<style lang="scss" scoped>
div /deep/ .leaflet-popup-content-wrapper {
  h1 {
    font-size: 14pt;
  }
  ul {
    margin: 1em 2em 1.5em;
    padding: 0;
    font-size: 10pt;
  }
}
div /deep/ .tour_marker, div /deep/ .place_marker {
  visibility: hidden;
}
// The `/deep/` syntax allows for modifying
// child component CSS.
// https://vue-loader.vuejs.org/en/features/scoped-css.html
.splash-screen /deep/ .billboard {
  max-width: 933px;
  background: url("~@/assets/uaf-todd-paris-iam.jpg") white top left / cover no-repeat;
  h1 {
    color: #ffffee;
    padding-top: 2em; // A little extra to position correctly on photo
  }
  p {
    font-size: 14pt;
    color: #ffffee;
    a {
      color: #bdcdfa;
    }
    &.photo-credit {
      font-size: 10pt;
      color: #cfcfc0;
    }
  }
}
</style>
<style lang="scss">
// Not scoped so we can modify some Tour styles
.iam-tour.shepherd-step .shepherd-text h4 {
  color: #efefef;
}
</style>
