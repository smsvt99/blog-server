const express = require('express'),
      router = express.Router(),
      controller = require('../controller/users'),
      User = require('../model/user'),
      security = require('../security');

router.use(security._404Check(User))

// router.get("/", controller.GET); TODO
router.post("/", controller.POST);
// router.patch("/", controller.PATCH); TODO
// router.delete("/", controller.DELETE); TODO

module.exports = router;