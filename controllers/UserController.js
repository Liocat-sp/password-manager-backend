const { validationResult } = require('express-validator');
const HttpError = require('../util/HttpError');
const bcrypt = require('bcrypt');
const User = require('../Models/User');
const jwt = require('jsonwebtoken');

const postSignup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError("Validation Error.", 422));
    }
    const { email, name, password } = req.body;
    let user;
    try {
        const hasEmail = await User.findOne({ email: email });
        if (hasEmail) {
            return next(new HttpError("Email already exist.Please try another one.", 422));
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        user = new User({
            email: email,
            name: name,
            password: hashedPassword,
            userounts: []
        });
        await user.save();
    }
    catch (error) {
        next(new HttpError("Something went wrong", 500));
    }
    user = user.toObject({ getters: true });
    res.json({ message: "done", userEmail: user.email, userName: user.name, id: user.id });
};

const postLogin = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError("Validation error.", 422));
    }
    const { email, password } = req.body;
    let user;
    let token;
    try {
        user = await User.findOne({ email: email });
        const isValidUser = await bcrypt.compare(password, user.password);
        if (!user || !isValidUser) {
            return next(new HttpErro("Email not found.", 404));
        }
        user = user.toObject({ getters: true });
        token = jwt.sign({
            userId: user.id,
            email: user.email 
        },
            'superdupersecret',
            { expiresIn: '2h' });
    }
    catch (error) {
        return next(new HttpError("Something went Wrong. Please check your inputs.", 500));
    }
    res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
}


exports.postSignup = postSignup
exports.postLogin = postLogin;