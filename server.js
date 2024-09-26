const express = require('express')
const cron = require('node-cron');

const app = express()
const port = 3000
const Botex = require('./index.js')

const {randomUUID} = require('crypto')

let bots = []
let jobs = []

cron.schedule('0 * * * *', () => doJobs(1)); // * hour
cron.schedule('0 0 * * *', () => doJobs(2)); // * day

app.use(express.static('botex-app/build'))

app.get('/accounts.add', (req, res) => {

	let token = req.query.token

	if (!token) {
		return res.status(400).send('Token is required');
	}

	let uuid = randomUUID()
	let botex = new Botex(token);

	botex.load().then((state) => {

		if (state.success) {

			bots.push({
				"uuid": uuid,
				"botex": botex
			})

			res.send({
				"result": state
			})

			if(req.query.reg == 'true'){
				console.log('reg')
				botex.register()
			}

		} else {

			res.send({
				"result": state
			})

		}

	});


});

app.get('/accounts.getAll', (req, res) => {

	let result = []

	for (let bot of bots) {

		result.push({
			"uuid": bot.uuid,
			"uid": bot.botex.user.id,
			"points": bot.botex._cotexData.points,
			"_lastCotexData": bot.botex._cotexData
		})

	}

	res.send({
		"count": bots.length,
		"bots": result
	})


});

app.get('/cotex.getShop', async (req, res) => {

	let bot = getBotByQuery(req, res)

	if(bot === null){
		
		if(!bots[0]){
			res.send({
		    	"success": false,
		    	"error": "cant get shop without accs"
		    })
		    return
		}

		bots[0].botex.getShop().then((a) => {
			res.send({
				"result": a
			})
		})

	} else {

		if (bot === false) {
			return
		}

		bot.botex.getShop().then((a) => {
			res.send({
				"result": a
			})
		})


	}

});

app.get('/cotex.tryToGetAllPoints', async (req, res) => {

	let bot = getBotByQuery(req, res)

	if(bot === null){

		let results = []

		for (let bot of bots) {

			let res = await bot.botex.tryToGetAllPoints()
			results.push(res)

		}

		res.send({
			"result": results
		})

	} else {

		if (bot === false) {
			return
		}

		bot.botex.tryToGetAllPoints().then((a) => {
			res.send({
				"result": a
			})
		})


	}

});

app.get('/cotex.addSymptoms', async (req, res) => {

	let bot = getBotByQuery(req, res)

	if(bot === null){

		let results = []

		for (let bot of bots) {

			let res = await bot.botex.addSymptoms()
			results.push(res)

		}

		res.send({
			"result": results
		})

	} else {

		if (bot === false) {
			return
		}

		bot.botex.addSymptoms().then((a) => {
			res.send({
				"result": a
			})
		})


	}

});

app.get('/cotex.markDays', async (req, res) => {

	let bot = getBotByQuery(req, res)

	if(bot === null){

		let results = []

		for (let bot of bots) {

			let res = await bot.botex.markDays()
			results.push(res)

		}

		res.send({
			"result": results
		})

	} else {

		if (bot === false) {
			return
		}

		bot.botex.markDays().then((a) => {
			res.send({
				"result": a
			})
		})


	}

});

app.get('/cotex.addJob', async (req, res) => {

	let type
	let every

	switch(req.query.type){
		case "symptoms":
			type = req.query.type
		break;
		case "markdays":
			type = req.query.type
		break;
		case "all": 
			type = req.query.type
		break;
		case "auth":
			type = req.query.type
		break;
		default:
			res.send({
		    	"success": false,
		    	"error": "cant set job without type or with unknown type"
		    })
			return false //do invalid job
		break;
	}

	switch(req.query.every){
		case "hourly":
			every = req.query.every
		break;
		case "daily":
			every = req.query.every
		break;
		default:
			res.send({
		    	"success": false,
		    	"error": "cant set job without (every) value or with unknown (every) value "
		    })
			return false //do invalid every
		break;
	}

	let bot = getBotByQuery(req, res)

	if(bot === null){

		let new_job = {
			"type": type,
			"all": true,
			"uuid": null,
			"every": every

		}

		let exists = jobs.some(job => job.type === new_job.type && job.all === new_job.all && job.uuid === new_job.uuid);

		if (exists) {

		    res.send({
		    	"success": false,
		    	"error": "allready have this type of job on this account(s)"
		    })
		    return
		}
		jobs.push(new_job)

		res.send({
			"result": {
				"success": true,
				"jobs": jobs
			}
		})

	} else {

		if (bot === false) {
			return
		}

		let new_job = {
			"type": type,
			"all": false,
			"uuid": bot.uuid,
			"every": every

		}

		jobs.push(new_job)

		res.send({
			"result": {
				"success": true,
				"jobs": jobs
			}
		})		



	}



})

app.get('/cotex.getJobs', async (req, res) => {

	let bot = getBotByQuery(req, res)

	if(bot === null){
	let ret_jobs = []
	for(let job of jobs){
		if(job.all){
			job["_lastCotexData"] = null
		}else{
			let bot = bots.filter((b) => b.uuid == job.uuid)
			job["_lastCotexData"] = bot[0].botex._cotexData
		}
		ret_jobs.push(job)
	}
		res.send({
			"result": {
				"success": true,
				"jobs": ret_jobs
			}
		})


	} else {
		if (bot === false) {
			return
		}
		let ret_jobs = []
		ret_jobs.concat(jobs.filter((j) => j.uuid == bot.uuid))


			res.send({
				"result": {
					"success": true,
					"jobs": ret_jobs
				}
			})



	

	}
})


function doJobs(every){

	switch(every){

	case 1:
	for(let job of jobs){
		if(job.every == "hourly"){
			dojobstage1(job)
		}
	}
	break;

	case 2:
	for(let job of jobs){
		if(job.every == "daily"){
			dojobstage1(job)
		}
	}
	break;

	}

	
}

function dojobstage1(job){

	let bot

	if(job.all){
		let results = []

		for (let bot of bots) {

			dojobstage2(bot, job)

		}

	}else{

		bot = bots.filter((bott) => bott.uuid == job.uuid)	

		if(!bot){
			console.log("job was outdated, cant find bot for job"+job)
			return
		}

		dojobstage2(bot, job)
		
	}




}

function dojobstage2(bot, job){

	switch(job.type){

		case "symptoms":
			bot.botex.addSymptoms().then((a) => {
				console.log(`${bot.botex.user.id} => symptoms success ` + JSON.stringify(a))
			})
		break;

		case "markdays":
			bot.botex.markDays().then((a) => {
				console.log(`${bot.botex.user.id} => markdays success ` + JSON.stringify(a))
			})
		break;

		case "all": 
			bot.botex.tryToGetAllPoints().then((a) => {
				console.log(`${bot.botex.user.id} => all success ` + JSON.stringify(a))
			})
		break;

		case "auth":
			bot.botex.auth().then((a) => {
				console.log(`${bot.botex.user.id} => auth success ` + JSON.stringify(a))
			})
		break;

	}
}

function getBotByQuery(req, res){

	let uuid = req.query.uuid
	let uid = req.query.uid

	if (!uuid && !uid) {

		return null

	} else {

		if (uuid && uid) {
			res.send({
				"success":false,
				"error":"error only one of uuid uid can be set"
			})
			return false
		}

		let bot

		if (uuid) {
			bot = bots.filter((bott) => bott.uuid == uuid)
		}
		if (uid) {
			bot = bots.filter((bott) => bott.botex.user.id == uid)
		}

		if (!bot[0]) {
			res.send({
				"success":false,
				"error":"not found"
			})
			return false
		}

		return bot[0]

	}

}

app.listen(port, () => {
	console.log(`runnin on http://localhost:${port}`)
})