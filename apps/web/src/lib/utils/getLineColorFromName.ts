import type { KOTDataset, KOTLabel } from '$lib/types/KOT'

/** Gets the color of the line in the line chart from the dataset. */
export function getLineColorFromDataset(dataset: KOTDataset) {
  if (dataset.label === 'accepted') {
    if (dataset.category === 'admitted') return '#4d7c0f'
    if (dataset.category === 'standby') return '#84cc16'
  }

  if (dataset.label === 'applied') {
    if (dataset.category === 'total') return '#eab308'
    if (dataset.category === 'firstPriority') return '#facc15'
  }

  if (dataset.label === 'quotient') {
    if (dataset.category === 'primary') return '#9f1239'
    if (dataset.category === 'standby') return '#f43f5e'
  }

  return '#ecfccb'
}

export function getLabelColorFromLabel(label: KOTLabel) {
  switch (label) {
    case 'accepted':
      return '#4d7c0f'
    case 'applied':
      return '#eab308'
    case 'quotient':
      return '#9f1239'
  }
}
