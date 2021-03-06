/**
 * @module tile-layer
 */
import Layer from './layer.vue'

/**
 * @alias module:tile-layer
 *
 * @example Install
 * import Vue from 'vue'
 * // import module and styles
 * import { TileLayer } from 'vuelayers'
 * // or
 * import TileLayer from 'vuelayers/lib/tile-layer'
 * // import VueLayers styles
 * import 'vuelayers/lib/style.css'
 * // register components
 * Vue.use(TileLayer)
 */
export default {
  /**
   * Layer that provide pre-rendered, tiled images in grid that are organized by zoom levels for
   * specific resolutions.
   * @alias module:tile-layer/layer
   */
  Layer,
  install (Vue) {
    Vue.component(Layer.name, Layer)
  },
}
