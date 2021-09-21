const express = require('express'),
      router = express.Router(),
      controller = require('../controller/comments'),
      Comment = require('../model/comment'),
      security = require('../security');

router.use(security._404Check(Comment));

router.get("/", controller.GET);
router.post("/", security.roleCheck(["ADMIN", "USER"]), controller.POST);
// router.patch("/", controller.PATCH); TODO
// router.delete("/", controller.DELETE); TODO

module.exports = router;
