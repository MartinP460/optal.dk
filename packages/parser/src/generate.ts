import { getKOTData } from './core'
import { generateFiles } from './strategies'

getKOTData().then((data) => {
  generateFiles(data)
})
