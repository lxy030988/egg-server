const { Service } = require('egg')
const path = require('path')
const fse = require('fs-extra')

class ToolService extends Service {

  async mergeFile(filepPath, filehash, size) {
    const chunkdDir = path.resolve(this.config.UPLOAD_DIR, filehash) // 切片的文件夹
    let chunks = await fse.readdir(chunkdDir)
    chunks.sort((a, b) => a.split('-')[1] - b.split('-')[1])
    chunks = chunks.map(cp => path.resolve(chunkdDir, cp))
    await this.mergeChunks(chunks, filepPath, size)
  }

  async mergeChunks(files, dest, size) {
    const pipStream = (filePath, writeStream) => new Promise(resolve => {
      const readStream = fse.createReadStream(filePath)
      readStream.on('end', () => {
        fse.unlinkSync(filePath)//删除切片
        resolve()
      })
      readStream.pipe(writeStream)
    })

    await Promise.all(
      files.map((file, index) => pipStream(file, fse.createWriteStream(dest, {
        start: index * size,
        end: (index + 1) * size,
      })))
    )
  }

}

module.exports = ToolService
