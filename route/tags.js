const express = require('express'),
      router  = express.Router(),
      controller = require('../controller/tags'),
      Tag = require('../model/tag'),
      security = require('../security');


router.use(security._404Check(Tag));

router.get("/", security.roleCheck("ADMIN"),  controller.GET);
router.post("/", security.roleCheck("ADMIN"), controller.POST);
// router.patch("/", controller.PATCH); TODO
// router.delete("/", controller.DELETE); TODO

module.exports = router;