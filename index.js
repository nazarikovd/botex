const axios = require("axios")
const {
	VK,
	resolveResource,
	Keyboard
} = require("vk-io");


module.exports = class Botex {

	constructor(token) {
		this.vk = null
		this.token = token
		this.app_id = 6983801
		this.creds = null
		this.bearer = null
		this.user = null
		this._cotexData = null
	}

	load = async () => {

		try {

			this.vk = new VK({
				token: this.token
			});
			this.user = await this.vk.api.users.get()
			this.user = this.user[0]

		} catch {

			return {
				"success": false,
				"error": "VK INVALID TOKEN"
			}

		}

		await this.getCreds()
		await this.auth()

		return {
			"success": true,
			"user": this.user
		}

	}

	getCreds = async () => {

		let apps = await this.vk.api.call('apps.get', {
			app_id: 6983801
		});

		let webview = apps.items[0].webview_url
		let creds = webview.split("?")[1]
		this.creds = creds
		return creds

	}

	auth = async () => {

		let auth = await axios.get("https://kotex-flow.ru-prod2.kts.studio/api/user/auth?" + this.creds)
		this.bearer = auth.data.data.token
		this._cotexData = auth.data.data.user
		return auth.data.data

	}

	register = async () => {

		let result = {}
		let headers = {
			"authorization": "Bearer " + this.bearer
		}
		let data = {
			"value": true,
			"name": "policy052022"
		}
		let flagdata = await axios.post("https://kotex-flow.ru-prod2.kts.studio/api/user/flag", data, {
			headers: headers
		})
		result.flag = flagdata.data
		let date = this.getCurrentDateFormatted()
		data = {
			"birthdate": "1998-10-10",
			"email": "123@mail.ru",
			"phone": "79999999999",
			"cycle_date": date,
			"period_duration": 5,
			"cycle_duration": 28
		}
		let regdata = await axios.post("https://kotex-flow.ru-prod2.kts.studio/api/user/register_with_cycle", data, {
			headers: headers
		})
		result.reg = regdata.data
		return result

	}

	getShop = async () => {

		let headers = {
			"authorization": "Bearer " + this.bearer
		}
		let shopdata = await axios.get("https://kotex-flow.ru-prod2.kts.studio/api/shop/list", {
			headers: headers
		})
		return shopdata.data

	}

	tryToGetAllPoints = async () => {

		let results = {}
		let headers = {
			"authorization": "Bearer " + this.bearer
		}
		let data = {
			"value": true,
			"type": "app"
		}

		let pointsdata = await axios.post("https://kotex-flow.ru-prod2.kts.studio/api/user/set_notifications", data, {
			headers: headers
		})
		results.notifications = pointsdata.data

		let date = this.getCurrentDateFormatted()
		data = {
			"date": date,
			"symptoms": ["tired"]
		}

		let symptomsdata = await axios.post("https://kotex-flow.ru-prod2.kts.studio/api/calendar/add_symptoms", data, {
			headers: headers
		})
		results.symptoms = symptomsdata.data
		return results

	}

	markDays = async () => {

		let headers = {
			"authorization": "Bearer " + this.bearer
		}
		let dates = this.getMarkDateFormatted()
		let data = {
			"unmark": [],
			"mark": dates
		}
		let markdata = await axios.post("https://kotex-flow.ru-prod2.kts.studio/api/calendar/mark_days", data, {
			headers: headers
		})
		return markdata.data

	}

	getCurrentDateFormatted = () => {

		let date = new Date();
		let year = date.getFullYear();
		let month = String(date.getMonth() + 1).padStart(2, '0'); // Months r zerobsd, so add 1
		let day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`

	}

	getMarkDateFormatted = () => {

		let dates = [];
		let date = new Date();

		for (let i = 0; i < 5; i++) {

			let futureDate = new Date(date);
			futureDate.setDate(date.getDate() + i);
			let year = futureDate.getFullYear();
			let month = String(futureDate.getMonth() + 1).padStart(2, '0'); // Months r zerobsd, so add 1
			let day = String(futureDate.getDate()).padStart(2, '0');
			dates.push(`${year}-${month}-${day}`);
			
		}

		return dates;

	}

	// except = (log) => {
	// 	throw new 
	// 		Error("\x1b[31m"+log+"\x1b[0m")
	// }

}