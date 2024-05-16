import * as path from 'path'
import * as fs from 'fs'

const initPath = path.resolve(__dirname + '/../integrations')


  
async function isDirectory (paths: string) {
  try {
    await fs.readdirSync(paths)
    return true
  } catch (er) {
    return false
  }
}

// The function is scanning all allowed files to launch the sequence test's
async function generate (nextPath: string = '') {
  const currPath = path.join(initPath, nextPath)
  let listStrategy: any[] = []
  return new Promise(resolve => {
    fs.readdir(currPath, async (er, items) => {
      if(er) null
      for(let a in items) {
        if(await isDirectory(path.join(currPath, items[a]))) {
          listStrategy.push(await generate(items[a]))
        } else if (items[a].match(/([\w])+(.afx.ts)$/g)) {
          listStrategy.push(path.join(nextPath, items[a]))
        }
      }
    
      resolve(listStrategy)
    })
  })
}

export default async (globalConfig: any, projectConfig: any) => {
  const strategies = await generate()
  const flatMap: string[] = (strategies as any[]).flat(Infinity)
  
  await fs.writeFileSync(path.join(__dirname, 'register-files.json'), JSON.stringify(flatMap))
}