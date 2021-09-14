const express = require('express'),
      router = express.Router(),
      controller = require('../controller/comments'),
      Comment = require('../model/comment'),
      utils = require('../utils');

router.use(async (req, res, next) => {
    if(req.query._id){
    const tag = await Comment.exists({_id: req.query._id});
        if(!tag){
            return res.status(404).send(utils._404(req.query._id, "COMMENTS"));
        }
    }
    next();
});

router.get("/", controller.GET);
router.post("/", controller.POST);
router.patch("/", controller.PATCH);
router.delete("/", controller.DELETE);

module.exports = router;
