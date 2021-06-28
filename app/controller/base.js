const { Controller } = require('egg')
class BaseController extends Controller {
  success(resData) {
    this.ctx.body = {
      resCode: 1,
      resData,
    }
  }
  message(message) {
    this.ctx.body = {
      resCode: 1,
      message,
    }
  }
  error(message, resCode = -1, errors = {}) {
    this.ctx.body = {
      resCode,
      message,
      errors,
    }
  }
}

module.exports = BaseController
