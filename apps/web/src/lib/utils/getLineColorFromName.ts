import type { KOTCategory, KOTDataset } from 'parser'

/** Gets the color of the line in the line chart from the dataset. */
export function getLineColorFromDataset({ categories: { category, subcategory } }: KOTDataset) {
  if (category === 'accepted') {
    if (subcategory === 'admitted') return '#4d7c0f'
    if (subcategory === 'standby') return '#84cc16'
  }

  if (category === 'applied') {
    if (subcategory === 'total') return '#eab308'
    if (subcategory === 'firstPriority') return '#facc15'
  }

  if (category === 'quotient') {
    if (subcategory === 'primary') return '#9f1239'
    if (subcategory === 'standby') return '#f43f5e'
  }

  return '#ecfccb'
}

export function getLabelColorFromLabel(label: KOTCategory) {
  switch (label) {
    case 'accepted':
      return '#4d7c0f'
    case 'applied':
      return '#eab308'
    case 'quotient':
      return '#9f1239'
  }
}
