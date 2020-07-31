const fs = require('fs');
const { validationResult } = require('express-validator');
const HttpError = require('../util/HttpError');
const crypto = require('crypto-js');
const Locker = require('../Models/Locker');
const User = require('../Models/User');
const mongoose = require('mongoose');

const postNewAcc = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError("Validation Error.", 422));
    }
    const { website, websiteUrl, logoUrl, email, userName, password, creator } = req.body;
    let Acc;
    try {
        const key = 'ThisisTobeTheSecretKey';
        const encryptPassword = crypto.AES.encrypt(password, key);

        Acc = new Locker({
            website: website,
            websiteUrl: websiteUrl,
            logoUrl: logoUrl,
            email: email,
            userName: userName,
            password: encryptPassword,
            creator: creator
        });

        const user = await User.findById(creator);
        if (!user) {
            return next(new HttpError("User not Found.Please Login First", 404));
        }

        const sess = await mongoose.startSession();
        sess.startTransaction();
        await Acc.save({ session: sess });
        user.accounts.push(Acc);
        await user.save();
        await sess.commitTransaction({ session: sess });
    }
    catch (error) {
        return next(new HttpError("Something went wrong", 500));
    }
    Acc = Acc.toObject({ getters: true });
    res.json({ message: "done", newAcc: { Acc } });
}

const getAccounts = async(req, res, next) => {
    const userId = req.params.userId;
    console.log(userId);
    let user;
    try {
        user = await User
        .findById(userId)
        .populate('accounts', '-password -userName'); 
        if(!user) {
            return next(new HttpError("User not Found.", 404));
        }

    }
    catch(error) {
        return next(new HttpError("Something went wrong.", 500));
    }
    user = user.toObject({getters: true});
    res.json({accounts: user.accounts});
}

const getAccountById = async (req, res, next) => {
    const accId = req.params.accId;
    let Acc;
    let dcrypt;
    try{
        Acc = await Locker.findById(accId);
        console.log(Acc);
        if(!Acc) {
            return next(new HttpError("Can not find account info.", 404));
        }
        const key = 'ThisisTobeTheSecretKey';
        dcrypt = crypto.AES.decrypt(Acc.password, key);
        dcrypt = dcrypt.toString(crypto.enc.Utf8);
    }
    catch(error) {
        return next(new HttpError("Something went wrong.", 500));
    }
    const dAcc = Acc.toObject({getters: true});
    dAcc.password = dcrypt;
    res.json({account: dAcc}); 
}

const deleteAccount = async (req, res, next) => {
    const accId = req.params.accId;
    if(!accId) {
        return next(new HttpError("Account id in invalid.", 422)); 
    }
    let Acc;
    try{
        Acc = await Locker.findById(accId).populate('creator');
        if(!Acc || Acc.creator._id.toString() !== req.userData.userId) {
            return next(new HttpError("Account not found.", 404));
        }
        const sess = await  mongoose.startSession();
        sess.startTransaction();
        Acc.creator.accounts.pull(Acc);
        await Acc.creator.save({session: sess});
        await Acc.deleteOne({},null,{session: sess});
        await sess.commitTransaction();
    }
    catch(error) {
        return next(new HttpError("Something went wrong."));
    }

    res.json({message: "done deleting"});
}




/********************************* FUTURE UPDATE *************************************/
// const updateAccount = async (req, res, next) => {
//     const errors = validationResult(req);
//     if(!errors.isEmpty()){
//         return next(new HttpError("Validation Error.", 422));
//     }
//     const id = req.params.accId;
//     const { email, userName, password, creator} = req.body;
//     let Acc;

//     try{
//         Acc = await Locker.findById(id);
//         if(!Acc) {
//             return next(new HttpError("Account not found.", 404));
//         }
//         Acc.email = email;
//         Acc.userName = userName;
//         Acc.password = password;
//         await Acc.save();
//     }
//     catch(errors) {
//         return next(new HttpError("Something went wrong."));
//     }
//     res.json({message: "Done deleting."});
// }


exports.postNewAcc = postNewAcc;
exports.getAccounts = getAccounts;
exports.getAccountById = getAccountById;
exports.deleteAccount = deleteAccount;
// exports.updateAccount = updateAccount;