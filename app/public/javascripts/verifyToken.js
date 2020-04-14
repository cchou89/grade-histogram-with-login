//FORMAT OF TOKEN
//Authorization: Bearer <access_token>

module.exports = (request, response, next) => {
    //GET auth header value
    const bearerHeader = request.headers['authorizaton'];
    //CHeck if bearer is undefined
    if(typeof bearerHeader !== 'undefined'){
        //Split at the space
        const bearer = bearerHeader.split(' ');
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