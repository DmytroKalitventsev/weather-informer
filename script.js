'use strict'

class Weather {
	#url = 'https://api.openweathermap.org';
	#apiId = 'aca1888765eac88dd6aba8b4a07a1ab8';
	#json = null;

	constructor() { }

	get wrap() {
		return document.querySelector('.weather');
	}

	get dateWrap() {
		return this.wrap.querySelector('.weather-date');
	}

	get weatherCitiesList() {
		return this.wrap.querySelector('.weather-cities__list');
	}

	get weatherIcons() {
		return ['day.svg', 'night.svg', 'cloudy.svg', 'cloudy-day.svg', 'cloudy-night.svg', 'rainy.svg', 'rainy-sun.svg', 'thunder.svg', 'snowy.svg', 'snowy-sun.svg',];
	}

	get cities() {
		return [
			{ name: 'Полтава', id: 696643, },
			{ name: 'Київ', id: 703448, },
			{ name: 'Дніпро', id: 709930, },
			{ name: 'Кременчук', id: 704147, },
		];
	}

	getWeather(citiesId, callback) {
		let request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHttp');

		request.open('GET', `${this.#url}/data/2.5/weather?id=${citiesId}&appid=${this.#apiId}`);
		request.responseType = 'json';

		request.addEventListener('readystatechange', () => {
			if (request.readyState === 4 && request.status === 200) {
				this.#json = request.response;

				callback();
			}

			if (request.readyState < 4 && request.status >= 400) {
				console.error('Помилка даних');
			}
		});

		request.send();
	}

	renderCities() {
		this.cities.forEach(city => {
			this.getWeather(city.id, () => {
				const cityItem = `<li class="weather-cities__item" data-id="${city.id}">
										<div class="weather-cities__picture">
											<img src="img/weather/night.svg" alt="pic">
										</div>
										<span class="weather-cities__degrees">+25&#176;</span>
										<span class="weather-cities__name">${city.name}</span>
									</li>`;

				this.weatherCitiesList.insertAdjacentHTML('beforeEnd', cityItem);
			});
		});
	}

	getCurrentDate() {
		const nameMonths = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'];
		const daysWeek = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота', 'Неділя'];
		const date = new Date();

		const day = date.getDate().toString().padStart(2, '0');
		const month = (date.getMonth());
		const weekday = date.getDay();

		const currentDate = `<span>${nameMonths[month]} ${day}</span>
							<span>${daysWeek[weekday - 1]}</span>`;

		this.dateWrap.insertAdjacentHTML('beforeEnd', currentDate);
	}

	showCitiesList(e) {
		if (e.target.matches('.weather-cities__button img')) {
			this.weatherCitiesList.classList.toggle('active');
		}
	}

	hideCitiesList(e) {
		if (!e.target.matches('.weather-cities__button img')) {
			this.weatherCitiesList.classList.remove('active');
		}
	}

	init() {
		this.getCurrentDate();
		// this.renderCities();
		this.wrap.addEventListener('click', this.showCitiesList.bind(this));
		document.addEventListener('click', this.hideCitiesList.bind(this));
	}
}

new Weather().init();