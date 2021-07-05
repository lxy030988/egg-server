const { Service } = require('egg')
const path = require('path')
const fse = require('fs-extra')

class ToolService extends Service {

  async mergeFile(filePath, filehash, size) {
    const chunkdDir = path.resolve(this.config.UPLOAD_DIR, filehash) // 切片的文件夹
    let chunks = await fse.readdir(chunkdDir)
    chunks.sort((a, b) => a.split('-')[1] - b.split('-')[1])
    chunks = chunks.map(item => ({ path: path.resolve(chunkdDir, item), size: Number(item.split('-')[2]) }))
    // console.log('chunks', chunks)
    await this.mergeChunks(chunks, filePath, size)
  }

  async mergeChunks(chunks, dest, size) {
    let cur = 0

    const pipStream = (file, writeStream) => new Promise(resolve => {
      const readStream = fse.createReadStream(file.path)
      readStream.on('end', () => {
        fse.unlinkSync(file.path)//删除切片
        resolve()
      })
      cur += (file.size || size)
      readStream.pipe(writeStream)
    })


    await Promise.all(
      chunks.map((file, index) => {
        // console.log('cur', cur)
        return pipStream(file, fse.createWriteStream(dest, {
          start: cur,
          end: cur + (file.size || size),
        }))
      })
    )
  }

}

module.exports = ToolService
