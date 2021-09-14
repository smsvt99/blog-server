const express = require('express'),
      router = express.Router(),
      controller = require('../controller/users'),
      User = require('../model/user'),
      utils = require('../utils');

router.use(async (req, res, next) => {
    if(req.query._id){
        const user = await User.exists({_id: req.query._id});
        if(!user){
            return res.status(404).send(utils._404(req.query._id, "USERS"));
        }
    }
    next();
})

router.get("/", controller.GET);
router.post("/", controller.POST);
router.patch("/", controller.PATCH);
router.delete("/", controller.DELETE);

module.exports = router;