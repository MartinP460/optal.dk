import fs from 'fs'
import Papa from 'papaparse'

export async function readCSV(filePath: string) {
  const csvFile = fs.readFileSync(filePath)
  const csvData = csvFile.toString()

  return new Promise((resolve) => {
    Papa.parse(csvData, {
      complete: (results) => {
        resolve(results.data)
      }
    })
  })
}
