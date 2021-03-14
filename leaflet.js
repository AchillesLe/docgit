import Vue from 'vue'
import { LMap, LTileLayer, LMarker, LGeoJson } from 'vue2-leaflet'
// import Vue2LeafletMarkercluster from 'vue2-leaflet-markercluster'
import 'leaflet/dist/leaflet.css'

Vue.component('l-map', LMap)
Vue.component('l-tile-layer', LTileLayer)
Vue.component('l-marker', LMarker)
Vue.component('l-geo-json', LGeoJson)
// Vue.component('l-marker-cluster', Vue2LeafletMarkercluster)
