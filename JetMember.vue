<template>
  <v-card>
    <v-card-title>
      <span class="headline">{{ formTitle }}</span>
    </v-card-title>

    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-file-input
              v-model="geoFile"
              accept=".xml"
              label="File input"
              @change="readGeometry"
            >
            </v-file-input>
            <template v-if="item.geometry && item.geometry.length">
              <v-chip-group
                mandatory="mandatory"
                dark="dark"
                active-class="v-slide-item--active"
              >
                <v-chip
                  v-for="(geo, i) in item.geometry.slice(0, 4)"
                  :key="i"
                  >{{ geo.join() }}</v-chip
                >
                <v-chip v-if="item.geometry.length > 4"
                  >+{{ item.geometry.length - 4 }} others</v-chip
                >
              </v-chip-group>
              <JetRouteMap v-if="isImport" :coordinates="item.geometry" />
            </template>
          </v-col>

          <v-col class="shrink" style="min-width: 220px">
            <v-text-field v-model="item.color" class="ma-0 pa-0">
              <template v-slot:append>
                <v-menu
                  v-model="menu"
                  top
                  nudge-bottom="105"
                  nudge-left="16"
                  :close-on-content-click="false"
                >
                  <template v-slot:activator="{ on }">
                    <div :style="swatchStyle" v-on="on" />
                  </template>
                  <v-card>
                    <v-card-text class="pa-0">
                      <v-color-picker v-model="color" />
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn text="" @click="noChangeColor">Cancel</v-btn>
                      <v-btn color="primary" text="" @click="saveColor"
                        >Save</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-menu>
              </template>
            </v-text-field>
          </v-col>

          <v-col cols="12" sm="6" md="4">
            <v-text-field
              v-model="item.name"
              label="Dessert name"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              v-model="item.calories"
              label="Calories"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="item.fat" label="Fat (g)"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="item.carbs" label="Carbs (g)"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              v-model="item.protein"
              label="Protein (g)"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
      <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { mapState } from 'vuex'
import JetRouteMap from '~/components/member/JetRouteMap'

export default {
  // props: {
  //   item: {
  //     type: Object,
  //     default: null,
  //   },
  // },
  components: { JetRouteMap },
  data: () => ({
    menu: false,
    color: null,
    defaultColor: '#77DDCC',
    item: {},
    geoFile: null,
  }),
  computed: {
    ...mapState('member', ['entry']),
    formTitle() {
      return this.item?.id === undefined ? 'Create Item' : 'Edit Item'
    },
    swatchStyle() {
      const colorX = this.item.color
      return {
        backgroundColor:
          colorX !== undefined && colorX !== '' ? colorX : this.defaultColor,
        cursor: 'pointer',
        height: '30px',
        width: '30px',
        borderRadius: '4px',
        transition: 'border-radius 200ms ease-in-out',
      }
    },
    isImport() {
      return this.geoFile !== null
    },
  },
  watch: {
    entry(newValue) {
      this.item = Object.assign({}, newValue)
    },
  },
  created() {
    this.item = Object.assign({}, this.entry)
  },
  methods: {
    save() {
      this.$emit('save')
    },
    close() {
      this.$emit('close')
      this.geoFile = null
    },
    saveColor() {
      console.log('color', this.color)
      this.item.color = this.color.hex
      this.menu = false
      console.log(this.item)
    },
    noChangeColor() {
      this.menu = false
    },
    async readGeometry(file) {
      if (!file) {
        this.item.geometry = []
        return
      }
      const xml = await this.getContentFile(file)
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xml, 'text/xml')
      const trkseg = xmlDoc.getElementsByTagName('trkseg')[0].children
      const geos = []
      trkseg &&
        trkseg.forEach((e) => {
          geos.push([
            parseFloat(e.getAttribute('lat')),
            parseFloat(e.getAttribute('lon')),
          ])
        })
      this.item.geometry = geos
    },
    getContentFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsText(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
      })
    },
  },
}
</script>
