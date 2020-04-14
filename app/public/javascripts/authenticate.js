module.exports = (request, response, next) => {
    //GET auth header value
    const authHeader = request.headers['authorizaton'];
    //CHeck if bearer is undefined
    if(typeof authHeader !== 'undefined'){
        //Split at the space
        const bearer = authHeader.split(' ');
        //Get token from Array
        const bearerToken = bearer[1];
        request.token = bearerToken;
        next();
    }else{
        //Forbidden
        request.flash('error', "First log in");
        response.redirect('/index')
    }
};