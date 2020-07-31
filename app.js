const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const mongoose = require('mongoose');

const UserRouter = require('./routers/User-router');
const LockerRouter = require('./routers/Locker-router');
const HttpError = require('./util/HttpError');
  
app.use(bodyparser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    next();
});

app.use('/user', UserRouter);
app.use('/locker', LockerRouter);

app.use((req,res, next) => {
    throw new HttpError("route not found.", 404);
});

app.use((error, req, res, next) => {
    if (res.headerSent) {
        next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || "Something went wrong." });
});

mongoose.connect(`mongodb+srv://${process.env.DATA_BASE_NAME}:${process.env.DATA_BASE_PASSWORD}@cluster0.yycrj.mongodb.net/password-manager?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log("DataBase is Conected.");
    app.listen( process.env.PORT || 5000);
}).catch(error => {
    console.log(error);
})