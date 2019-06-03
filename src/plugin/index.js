import inject from './inject'
import shade from './shade'
import contextual from './contextual'

export default {
  install (...args) {
    inject(...args)
    shade(...args)
    contextual(...args)
  }
}
