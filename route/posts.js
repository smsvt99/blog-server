const express = require('express'),
      router  = express.Router(),
      controller = require('../controller/posts'),
      Post = require('../model/post'),
      utils = require('../utils');

router.use(async (req, res, next) => {
    if(req.query._id){
        const tag = await Post.exists({_id: req.query._id});
        if(!tag){
            return res.status(404).send(utils._404(req.query._id, "POSTS"));
        }
    }
    next();
});

router.get("/", controller.GET);
router.post("/", controller.POST);
router.patch("/", controller.PATCH);
router.delete("/", controller.DELETE);

module.exports = router;
