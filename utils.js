exports._404 = (_id, collection) => `No document with _id [${_id}] found in collection [${collection.toUpperCase()}]`;

exports.hasRole = (req, res, roles) => {
    if(typeof roles === 'string'){
        roles = [roles];
    }
    if(req.isAuthenticated()){
        const isAuthorized = roles.includes(req.user.role);
        if(!isAuthorized){
            console.log(`Role ${req.user.role} not in [${roles.join(', ')}]`)
            res.status(401).send("Not Authorized");
        }
        return isAuthorized;
    } else {
        res.status(401).send("Not Authorized");
        console.log("Unauthenticated request denied access")
    }
}