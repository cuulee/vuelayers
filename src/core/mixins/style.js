/**
 * Basic style mixin.
 */
import mergeDescriptors from '../utils/multi-merge-descriptors'
import useMapCmp from '../mixins/use-map-cmp'
import cmp from '../mixins/ol-virt-cmp'

const methods = {
  /**
   * @return {OlStyle|Promise<OlStyle>}
   * @protected
   */
  createOlObject () {
    return this.createStyle()
  },
  /**
   * @return {OlStyle|Promise<OlStyle>}
   * @protected
   * @abstract
   */
  createStyle () {
    throw new Error('Not implemented method')
  },
  /**
   * @return {Promise}
   * @protected
   */
  init () {
    return this::cmp.methods.init()
  },
  /**
   * @return {void|Promise<void>}
   * @protected
   */
  deinit () {
    return this::cmp.methods.deinit()
  },
  /**
   * @return {Object}
   * @protected
   */
  getServices () {
    const vm = this

    return mergeDescriptors(this::cmp.methods.getServices(), {
      get style () { return vm.$style },
    })
  },
  /**
   * @return {Promise}
   */
  refresh () {
    return Promise.resolve(this.unmount())
      .then(this.mount)
  },
}

export default {
  mixins: [cmp, useMapCmp],
  methods,
  stubVNode: {
    empty () {
      return this.$options.name
    },
  },
  created () {
    Object.defineProperties(this, {
      $style: {
        enumerable: true,
        get: () => this.$olObject,
      },
      $map: {
        enumerable: true,
        get: () => this.$services && this.$services.map,
      },
      $view: {
        enumerable: true,
        get: () => this.$services && this.$services.view,
      },
      $stylesContainer: {
        enumerable: true,
        get: () => this.$services && this.$services.stylesContainer,
      },
    })
  },
}
