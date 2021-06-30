const fse = require('fs-extra')
const path = require('path')
const BaseController = require('./base')

class UtilController extends BaseController {

  async mergefile() {
    const { ext, size, hash } = this.ctx.request.body
    const filePath = path.resolve(this.config.UPLOAD_DIR, `${hash}.${ext}`)
    await this.ctx.service.tools.mergeFile(filePath, hash, size)
    this.success({
      url: `/public/${hash}.${ext}`,
    })
  }

  async checkfile() {
    const { ctx } = this
    const { ext, hash } = ctx.request.body
    const filePath = path.resolve(this.config.UPLOAD_DIR, `${hash}.${ext}`)

    let uploaded = false
    let uploadedList = []
    if (fse.existsSync(filePath)) {
      // 文件存在
      uploaded = true
    } else {
      uploadedList = await this.getUploadedList(path.resolve(this.config.UPLOAD_DIR, hash))
    }
    this.success({
      uploaded,
      uploadedList,
    })
  }

  async getUploadedList(dirPath) {
    return fse.existsSync(dirPath)
      ? (await fse.readdir(dirPath)).filter(name => name[0] !== '.')
      : []
  }

  async uploadfile() {
    // /public/hash/(hash+index)

    // 模拟报错
    // if (Math.random() < 0.3) {
    //   return this.ctx.status = 500
    // }

    const { ctx } = this
    console.log(ctx.request)
    const file = ctx.request.files[0]
    const { hash, name } = ctx.request.body
    // console.log(file, name)
    const chunkPath = path.resolve(this.config.UPLOAD_DIR, hash)

    // await fse.move(file.filepath, `${this.config.UPLOAD_DIR}/${file.filename}`)

    if (!fse.existsSync(chunkPath)) {
      await fse.mkdir(chunkPath)
    }

    await fse.move(file.filepath, `${chunkPath}/${name}`)

    this.success({
      // url: `/public/${file.filename}`
      msg: '切片上传成功'
    })
  }

}
module.exports = UtilController
