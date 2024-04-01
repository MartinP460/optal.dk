import Papa from 'papaparse'
import fs from 'fs'

export async function readCSV(filePath: string): Promise<string[][]> {
  const csvFile = fs.readFileSync(filePath)
  const csvData = csvFile.toString()

  return new Promise((resolve) => {
    Papa.parse(csvData, {
      complete: (results) => {
        resolve(results.data as string[][])
      }
    })
  })
}
