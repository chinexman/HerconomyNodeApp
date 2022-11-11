"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
/* GET home page. */
router.get('/', function (req, res, next) {
    // res.render('index', { title: 'Express' });
    res.send('respond with a resouser');
});
exports.default = router;
