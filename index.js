"use strict";

const express = require('express');
// const bodyParser = require('body-parser');
const argv = require('yargs').argv;
const uniqid = require('uniqid');
const moment = require('moment');

const app = express();

function createUniqid(req, res, next) {
    res.locals.uniqid = uniqid();
    next();
}

function dumpIp(req, res, next) {
    console.log(`*** (${ res.locals.uniqid }) ${ moment().format('YYYY-MM-DD HH:mm:ss') } Incoming ${ req.method } request from ${ req.ip }`);
    next();
}

function dumpUserAgent(req, res, next) {
    console.log(`*** (${ res.locals.uniqid }) User-Agent: ${ req.get('user-agent') }`);
    next();
}

function dumpHeaders(req, res, next) {
    console.log(`*** (${ res.locals.uniqid }) Headers:`);
    console.log(JSON.stringify(req.headers, null, 2));
    next();
}

function dumpUrl(req, res, next) {
    console.log(`*** (${ res.locals.uniqid }) ${ req.method }: ${ req.url }`);
    next();
}

function dumpQs(req, res, next) {
    const data = argv.pretty ? JSON.stringify(req.query, null, 2) : req.query;
    console.log(`*** (${ res.locals.uniqid }) Query string:`, data);
    next();
}

function dumpBody(req, res, next) {
    // const data = argv.pretty ? JSON.stringify(req.body, null, 2) : req.body;
    const contentType = req.get('Content-Type');

    console.log(`*** (${ res.locals.uniqid }) Body (Content-Type: ${ contentType }):`, req.body );
    next();
}

function closeConnection(req, res) {
    console.log('');
    res.end('OK\n');
}

app.use(createUniqid);
// app.use(bodyParser.urlencoded({extended: true}));
app.use(express.text({ type: '*/*' }));
app.use(dumpIp);
app.use(dumpUserAgent);
app.use(dumpHeaders);
app.use(dumpUrl);
app.use(dumpQs);
app.use(dumpBody);
app.use(closeConnection);

const listenPort = argv.port || 8080;
app.listen(listenPort, function() {
    console.log('Listening on port ' + listenPort);
})