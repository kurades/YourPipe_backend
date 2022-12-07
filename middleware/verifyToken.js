const jwt = require('jsonwebtoken')
const { TOKEN_SECRET } = require('../constant')
module.exports = (request, response, next) =>{
    const token = request.header('auth_token')
    // console.log(token);
    if(!token) return response.status(401).send('Token required')

    try{
        const decoded = jwt.verify(token,TOKEN_SECRET)
        request.user = decoded;
    }catch(error){
        console.log(error);
        return response.status(400).send('Invalid Token')
    }
    next()
}