<template lang="pug">
  <div id="mapDiv" style="height: 50vh">
    <client-only>
      <l-map v-if='loaded' :zoom='zoom' :center='center'>
        <l-tile-layer :url='url'></l-tile-layer>
        <l-geo-json :geojson='route' :optionsStyle='optionsStyle'></l-geo-json>
      </l-map>
    </client-only>
  </div>
</template>
<script>
export default {
  props: {
    coordinates: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      url: 'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png',
      center: [35.8935, 137.252197],
      zoom: 7,
      type: 'LineString',
      optionsStyle: {
        color: '#EB0B0B',
        weight: 5,
        opacity: 0.65,
      },
      loaded: false,
    }
  },
  computed: {
    route() {
      return [
        {
          type: this.type,
          coordinates: this.coordinates,
        },
      ]
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.loaded = true
    })
  },
  methods: {},
}
</script>
