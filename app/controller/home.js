'use strict';

// const Controller = require('egg').Controller;
const BaseController = require('./base')

class HomeController extends BaseController {
  async index() {
    // const { ctx } = this;
    // ctx.body = 'hi, egg';
    this.success({ hi: 'hi, egg' })
  }
}

module.exports = HomeController;
