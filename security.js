exports._404Check = (collection) => {
    return async function(req, res, next){
        if(req.query._id){
            const doc = await collection.exists({_id: req.query._id});
            if(doc){
                req.doc = doc;
            } else {
                return res.status(404).send({
                    success: false,
                    error: `No document with _id [${req.query._id}] found in collection [${collection.modelName}]`
                })
            }
        }
        next();
    }
}

exports.roleCheck = (roles) => {
    if(typeof roles === 'string'){
        roles = [roles];
    }
    
    return function(req, res, next){
        const notAuthorized = {
            success: false,
            error: "Not authorized"
        }
        if(req.isAuthenticated()){
            if(roles.includes(req.user.role)){
                next();
            } else {
                console.log(`Role ${req.user.role} not in [${roles.join(', ')}]`)
                res.status(401).send(notAuthorized);
            }
        } else {
            res.status(401).send(notAuthorized);
            console.log("Unauthenticated request denied access")
        }
    }
}