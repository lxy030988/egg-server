'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index)

  router.post('/uploadfile', controller.util.uploadfile)
  router.post('/mergefile', controller.util.mergefile)
  router.post('/checkfile', controller.util.checkfile)
};
