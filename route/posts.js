const express = require('express'),
      router  = express.Router(),
      controller = require('../controller/posts'),
      Post = require('../model/post'),
      security = require('../security');

router.use(security._404Check(Post));

router.get("/", controller.GET);
router.post("/", security.roleCheck("ADMIN"), controller.POST);
router.patch("/", security.roleCheck("ADMIN"), controller.PATCH);
router.delete("/", security.roleCheck("ADMIN"), controller.DELETE);

module.exports = router;
