const axios = require("axios")
const {
	VK,
	resolveResource,
	Keyboard
} = require("vk-io");


module.exports = class Botex {

	#vk;
	#token;
	#app_id;
	#creds;
	#bearer;

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
				"error": "Something went wrong during [VK AUTH]: Invalid or expired token"
			}

		}

		try {

			await this.getCreds()
			await this.auth()

			return {
				"success": true,
				"user": this.user
			}

		} catch {

			return {
				"success": false,
				"error": "Something went wrong during [VK GET CREDS] or [KTS AUTH]"
			}
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

		let data = {
			"value": true,
			"name": "policy052022"
		}

		let flagdata = await this.makeApiRequest("user/flag", data)
		result.flag = flagdata
		let date = this.getCurrentDateFormatted()
		data = {
			"birthdate": "1998-10-10",
			"email": "123@mail.ru",
			"phone": "7"+ Math.floor(Math.random() * 9999999999),
			"cycle_date": date,
			"period_duration": 5,
			"cycle_duration": 28
		}

		let regdata = await this.makeApiRequest("user/register_with_cycle", data)
		result.reg = regdata
		return result

	}

	getShop = async () => {

		let shopdata = await this.makeApiRequest("shop/list")
		return shopdata

	}

	tryToGetAllPoints = async () => {

		let results = {}

		results.auth = await this.auth();
		await this.delay(1000);

		results.notifications = await this.getNotificationsCoins();
		await this.delay(1000);

		results.symptoms = await this.addSymptoms();
		await this.delay(1000);

		results.markDays = await this.markDays();
		await this.delay(1000);

		return results


	}

	getNotificationsCoins = async () => {

		let data = {
			"value": true,
			"type": "app"
		}

		let pointsdata = await this.makeApiRequest("user/set_notifications", data)
		return pointsdata

	}

	addSymptoms = async () => {

		let date = this.getCurrentDateFormatted()
		let data = {
			"date": date,
			"symptoms": ["tired"]
		}

		let symptomsdata = await this.makeApiRequest("calendar/add_symptoms", data)
		return symptomsdata

	}

	markDays = async () => {

		let dates = this.getMarkDateFormatted()
		let data = {
			"unmark": [],
			"mark": dates
		}

		let markdata = await this.makeApiRequest("calendar/mark_days", data)
		return markdata

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

	delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

	makeApiRequest = async (method, data = null) => {

		let headers = {
			"authorization": "Bearer " + this.bearer
		}

		try {

			if(data){
				
				let response = await axios.post("https://kotex-flow.ru-prod2.kts.studio/api/" + method, data, {
					headers: headers
				})

				return response.data

			}else{

				let response = await axios.get("https://kotex-flow.ru-prod2.kts.studio/api/" + method, {
					headers: headers
				})

				return response.data
			}

		}catch(e){
			console.log("request failed "+e)
		}

	}

	// except = (log) => {
	// 	throw new 
	// 		Error("\x1b[31m"+log+"\x1b[0m")
	// }

}