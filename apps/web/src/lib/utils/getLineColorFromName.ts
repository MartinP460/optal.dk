import type { KOTCategory, KOTDataset } from 'parser'

/** Gets the color of the line in the line chart from the dataset. */
export function getLineColorFromDataset(dataset: KOTDataset) {
  if (dataset.category === 'accepted') {
    if (dataset.subcategory === 'admitted') return '#4d7c0f'
    if (dataset.subcategory === 'standby') return '#84cc16'
  }

  if (dataset.category === 'applied') {
    if (dataset.subcategory === 'total') return '#eab308'
    if (dataset.subcategory === 'firstPriority') return '#facc15'
  }

  if (dataset.category === 'quotient') {
    if (dataset.subcategory === 'primary') return '#9f1239'
    if (dataset.subcategory === 'standby') return '#f43f5e'
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
