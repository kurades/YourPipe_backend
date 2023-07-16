const Joi = require("joi")
const User = require('../database/users.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { TOKEN_SECRET } = require('../constant')
const validateUser = (data) => {
    const rule = Joi.object({
        username: Joi.string().min(3).max(100).required(),
        email: Joi.string().min(6).max(100).required().email(),
        password: Joi.string().min(6).max(100).required(),
    })
    return rule.validate(data)
}

async function register(req, res) {
    const { error } = validateUser(req.body)

    if (error) return res.status(422).send(error.details[0].message)
    const checkEmailExist = await User.findOne({ email: req.body.email })
    const checkUsernameExist = await User.findOne({ username: req.body.username })
    if (checkEmailExist) return res.status(422).send('Email already exist')
    if (checkUsernameExist) return res.status(422).send('Username already exist')

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)

    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashPassword,
    })
    try {
        const newUser = await user.save()
        await res.send(newUser)
    } catch (error) {
        res.status(400).send(error)
    }
}
async function login(req, res) {
    const user = await User.findOne({ email: req.body.email })
    console.log(req.body.email);
    console.log(user);
    if (!user) return res.status(422).send('Email not valid')

    const checkPassword = bcrypt.compare(req.body.password, user.password)
    if (!checkPassword) return res.status(422).send('Password not correct')
    user['password'] = null
    const token = jwt.sign({ _id: user._id }, TOKEN_SECRET, { expiresIn: 60 * 60 * 24 });
    return res.status(200).set('access-Control-Allow-Credentials','true').cookie('token', token).json(user)
}
module.exports = { register, login }