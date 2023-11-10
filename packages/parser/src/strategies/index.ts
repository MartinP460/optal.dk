import fs from 'fs'

export async function generateFiles(data: { name: string }[]) {
  fs.writeFile('./generated/test.json', JSON.stringify(data), (err) => {
    if (err) {
      throw err
    }
  })
}
