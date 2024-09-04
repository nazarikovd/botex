const express = require('express')
const app = express()
const port = 3000
const Botex = require('./index.js')
const {
	randomUUID
} = require('crypto')
let bots = []



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

app.get('/cotex.getShop', (req, res) => {

	let uuid = req.query.uuid
	let uid = req.query.uid

	if (!uuid && !uid) {
		bots[0].botex.getShop().then((a) => {
			res.send({
				"data": a
			})
		})

	} else {

		if (uuid && uid) {
			res.send("error only one of uuid uid can be set")
			return
		}

		let bot

		if (uuid) {
			bot = bots.filter((bott) => bott.uuid == uuid)
		}
		if (uid) {
			bot = bots.filter((bott) => bott.botex.user.id == uid)
		}

		if (!bot[0]) {
			res.send("not found")
			return
		}

		bot[0].botex.getShop().then((a) => {
			res.send({
				"data": a
			})
		})


	}
});

app.get('/cotex.tryToGetAllPoints', async (req, res) => {

	let uuid = req.query.uuid
	let uid = req.query.uid

	if (!uuid && !uid) {

		let results = []

		for (let bot of bots) {

			let res = await bot.botex.tryToGetAllPoints()
			results.push(res)

		}

		res.send({
			"results": results
		})

	} else {

		if (uuid && uid) {
			res.send("error only one of uuid uid can be set")
			return
		}

		let bot

		if (uuid) {
			bot = bots.filter((bott) => bott.uuid == uuid)
		}
		if (uid) {
			bot = bots.filter((bott) => bott.botex.user.id == uid)
		}

		if (!bot[0]) {
			res.send("not found")
			return
		}
		
		bot[0].botex.tryToGetAllPoints().then((a) => {
			res.send({
				"data": a
			})
		})


	}
});

app.listen(port, () => {
	console.log(`runnin on http://localhost:${port}`)
})