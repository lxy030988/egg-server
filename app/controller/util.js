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
  // .DS_Strore
  async getUploadedList(dirPath) {
    return fse.existsSync(dirPath)
      ? (await fse.readdir(dirPath)).filter(name => name[0] !== '.')
      : []
  }

  async uploadfile1() {
    // /public/hash/(hash+index)
    // 报错
    // if(Math.random()>0.3){
    //   return this.ctx.status = 500
    // }
    const { ctx } = this
    console.log(ctx.request)
    const file = ctx.request.files[0]
    const { hash, name } = ctx.request.body

    const chunkPath = path.resolve(this.config.UPLOAD_DIR, hash)
    // const filePath = path.resolve() // 文件最终存储的位置。合并之后

    // console.log(name,file)

    // console.log(file.filepath)
    // console.log(this.config.UPLOAD_DIR)
    if (!fse.existsSync(chunkPath)) {
      await fse.mkdir(chunkPath)
    }

    await fse.move(file.filepath, `${chunkPath}/${name}`)

    this.message('切片上传成功')
    // this.success({
    //   url:'xx'
    // })
  }

  async uploadfile() {
    const { ctx } = this
    console.log(ctx.request)
    const file = ctx.request.files[0]
    const { name } = ctx.request.body
    console.log(file, name)
    await fse.move(file.filepath, `${this.config.UPLOAD_DIR}/${file.filename}`)

    this.success({
      url: `/public/${file.filename}`
    })
  }

}
module.exports = UtilController
