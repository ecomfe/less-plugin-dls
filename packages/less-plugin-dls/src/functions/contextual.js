import kolor from 'kolor'
import memoize from 'lodash.memoize'
import { isInRanges } from '../utils'

const CONTEXTUAL_RANGES = {
  info: [[210, 225]],
  success: [[95, 155]],
  warning: [[30, 45]],
  error: [
    [0, 10],
    [350, 360]
  ]
}

const CONTEXTUAL_COLORS = {
  info: [216, 100, 80],
  success: [149, 100, 75],
  warning: [34, 100, 100],
  error: [7, 100, 80]
}

function isInContextualRanges (h, type) {
  return isInRanges(h, CONTEXTUAL_RANGES[type])
}

function getContextual (color, type) {
  const [h] = color
  if (isInContextualRanges(h, type)) {
    return [...color]
  }

  return CONTEXTUAL_COLORS[type].map((v, i) => (i === 0 ? v : v / 100))
}

const getColorValue = memoize((rgb, type) => {
  const color = getContextual(
    kolor
      .rgb(rgb)
      .hsv()
      .toArray(),
    type
  )
  return kolor
    .hsv(color)
    .hex()
    .slice(1)
}, (rgb, type) => `${rgb}#${type}`)

export default function install (less, _, functions) {
  functions.add('dls-contextual', (base = {}, type = {}) => {
    if (
      !type.value ||
      ['info', 'success', 'warning', 'error'].indexOf(
        type.value.trim().toLowerCase()
      ) === -1
    ) {
      throw new Error(
        '`type` must be one of `info`, `success`, `warning` and `error`.'
      )
    }

    return less.color(getColorValue(base.rgb, type.value))
  })
}