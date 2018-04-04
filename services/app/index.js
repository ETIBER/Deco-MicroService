const express = require('express')
const addRequestId = require('express-request-id')();
const morgan = require('morgan')
const path = require('path')

const StreamLog = require('./StreamLog')

const SERVER_PORT = process.env.SERVER_PORT || 3000
const APACHE_LOG_PORT = process.env.APACHE_LOG_PORT || 5101

const SERVICE_ROUTE = process.env.SERVICE_ROUTE || "api/v1/"
const SERVICE_NAME = process.env.SERVICE_NAME || "unknow"

const app = express()

const morganFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :request_id :service_name'

morgan.token(' content_lenth', function (req, res) {
	if (res[content-length] !== undefined) {
		return res[content-length]
	} else {
		return 0
	}
})
morgan.token('request_id', function (req, res) { return req.id })
morgan.token('service_name', function (req, res) { return SERVICE_NAME })

app.use(addRequestId);
app.use(morgan(morganFormat,{stream: new StreamLog(APACHE_LOG_PORT)}))

app.get(`/${SERVICE_ROUTE}`, function (req, res) {
	res.sendStatus(200)
})

app.listen(SERVER_PORT, function () {
  console.log(`My monolyte listen on ${SERVER_PORT}`)
})
