<template>
  <i style="display: none !important;">
    <slot :feature="plain"></slot>
  </i>
</template>

<script>
  /**
   * Wrapper around ol.Feature.
   *
   * @todo Add property 'visible', like in layer. If visible = false -> set null style
   */
  import ol from 'openlayers'
  import uuid from 'uuid/v4'
  import { omit } from 'lodash/fp'
  import styleTarget from 'vl-components/style/target'
  import { warn } from 'vl-utils/debug'

  const props = {
    id: {
      type: [ String, Number ],
      default: () => uuid()
    },
    data: {
      type: Object,
      default: () => ({})
    }
  }

  const methods = {
    refresh () {
      this.feature && this.feature.changed()
    },
    plain () {
      const obj = {
        id: this.id,
        layer: this.layer() && this.layer().$vm.id,
        data: this.data
      }

      const geom = this.feature.getGeometry()
      if (geom) {
        obj.geometry = {
          type: geom.getType(),
          coordinates: geom.getCoordinates()
        }
      }

      return obj
    },
    styleTarget () {
      return this.feature
    }
  }

  const watch = {
    id (value) {
      this.feature.setId(value)
    },
    data (value) {
      this.feature.setProperties(omit([ 'geometry' ], value))
    }
  }

  const { provide: styleTargetProvide } = styleTarget

  export default {
    name: 'vl-feature',
    mixins: [ styleTarget ],
    inject: [ 'layer', 'source' ],
    props,
    methods,
    watch,
    provide () {
      return {
        ...this::styleTargetProvide(),
        feature: () => this.feature
      }
    },
    created () {
      this::createFeature()
    },
    mounted () {
      if (this.source()) {
        this.source().addFeature(this.feature)
      } else if (process.env.NODE_ENV !== 'production') {
        warn("Invalid usage of feature component, should have source component among it's ancestors")
      }
    },
    destroyed () {
      this.source() && this.source().removeFeature(this.feature)
      this.feature = undefined
    }
  }

  /**
   * Create feature without inner style applying, feature level style
   * will be applied in the layer level style function.
   *
   * @return {ol.Feature}
   */
  function createFeature () {
    /**
     * @type {ol.Feature}
     * @protected
     */
    this.feature = new ol.Feature(omit([ 'geometry' ], this.data))
    this.feature.setId(this.id)
    this.feature.$vm = this

    return this.feature
  }
</script>

<style>/* stub style  */</style>