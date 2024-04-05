import type { KOTDataset } from 'parser'

/** Gets the color of the line in the line chart from the dataset. */
export function getColorFromDataset({ categories: { category, subcategory } }: KOTDataset) {
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

  if (category === 'genderApplied') {
    if (subcategory === 'men') return '#38bdf8'
    if (subcategory === 'women') return '#e879f9'
  }

  return '#ecfccb'
}

export function getLabelColorFromLabel(label: KOTDataset['categories']['category']) {
  switch (label) {
    case 'accepted':
      return '#4d7c0f'
    case 'applied':
      return '#eab308'
    case 'quotient':
      return '#9f1239'
    case 'genderApplied':
      return '#e879f9'
  }
}
