const fs = require('fs')
const path = require('path')
const gm = require('gm')


function findImage(path) {
  if(fs.statSync(path).isDirectory()){
    findImage()
  }
}

let imageInfos = []
async function findImage(filepath) {
  if(fs.statSync(filepath).isDirectory()) {
    fs.readdir(path.join(filepath), async function (err, files) {
      if(err) {
        console.error('找不到指定目录或文件')
      }
      for(let i = 0; i < files.length; i++) {
        let innerfile = path.join(filepath, files[i])
        if(fs.statSync(innerfile).isDirectory()) {
          findImage(innerfile)
        } else {
          if(files[i].endsWith('.jpg') || files[i].endsWith('.jpeg') || files[i].endsWith('.png')|| filepath.endsWith('.git')) {
            let imgobj = await getHeightAndWidth(innerfile)
            // console.log(JSON.stringify(imgobj))
            writeFile(imgobj)
          }
        }
      }
    })
  }else {
    if(filepath.endsWith('.jpg') || filepath.endsWith('.jpeg') || filepath.endsWith('.png') || filepath.endsWith('.git')) {
      let imgobj = await getHeightAndWidth(filepath)
      // console.log(JSON.stringify(imgobj))
      writeFile(imgobj)
    }
  }
}

var arguments = process.argv.splice(2)
console.log(arguments[0])
console.log(isNaN(Number(arguments[0])))
let rootpath = './'
let rem = 32.0
if(arguments[0] !== undefined && isNaN(Number(arguments[0]))) {
  rootpath = arguments[0].replace('//', '/')
} else if(arguments[0] !== undefined && !isNaN(Number(arguments[0]))){
  rem = parseFloat(arguments[0])
}

if(arguments[1] !== undefined && !isNaN(Number(arguments[1]))) {
  rem = parseFloat(arguments[1])
}

async function main() {
  fs.unlink('./output.txt', function() {

  })
  await findImage(rootpath)
}



function getHeightAndWidth(file) {
  return new Promise((resolve, reject) => {
    gm(file)
    .size(function (err, size) {
      if (err) {
        reject(err)
      }
      if (!err)
        resolve({
          filename: path.relative(rootpath, file),
          width: size.width,
          height: size.height,
          widthrem: size.width / rem,
          heightrem: size.height / rem
        })
    });
  })
}

function writeFile (data) {
  // console.log(data)
  var output = `
    ${data.filename} | ${data.width} ${data.height} | ${data.widthrem}  ${data.heightrem}
  `
  fs.appendFileSync('./output.txt', output, 'utf-8')
}

main()
