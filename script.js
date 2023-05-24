'use strict'

class Weather {
	#api = '';
	#json = null;

	constructor() {}

	get wrap() {
		return document.querySelector('.weather');
	}

	get dateWrap() {
		return this.wrap.querySelector('.weather-date');
	}

	get weatherCitiesList() {
		return this.wrap.querySelector('.weather-cities__list');
	}

	getWeather() {
		let request;

		if (window.XMLHttpRequest) {
			request = new XMLHttpRequest();
		} else {
			request = new ActiveXObject('Microsoft.XMLHttp');
		}

		request.open('GET', this.#api);
		request.responseType = 'json';

		request.addEventListener('readystatechange', () => {
			if (request.readyState === 4 && request.status === 200) {
				this.#json = request.response;
				
				this.renderBlock();
			}
		});

		request.send();

		console.dir(request);
	}

	renderBlock() {

	}

	getCurrentDate() {
		const nameMonths = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'];
		const daysWeek = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота', 'Неділя'];
		const date = new Date();

		const day = date.getDate().toString().padStart(2, '0');
		const month = (date.getMonth());
		const weekday = date.getDay();

		const currentDate = `<span class="weather-date__month">${nameMonths[month]} ${day}</span>
							<span class="weather-date__day">${daysWeek[weekday - 1]}</span>`;

		this.dateWrap.insertAdjacentHTML('beforeEnd', currentDate);
	}

	showCitiesList(e) {
		if (e.target.matches('.weather-cities__button img')) {
			this.weatherCitiesList.classList.toggle('active');
		}
	}

	init() {
		this.getWeather();
		this.getCurrentDate();
		this.wrap.addEventListener('click', this.showCitiesList.bind(this));
	}
}

new Weather().init();