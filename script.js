'use strict'

class Weather {
	#url = 'https://api.openweathermap.org';
	#apiId = 'aca1888765eac88dd6aba8b4a07a1ab8';
	#json = null;

	constructor() { }

	get wrap() {
		return document.querySelector('.weather');
	}

	get cityWrap() {
		return this.wrap.querySelector('.weather-city__text');
	}

	get dateWrap() {
		return this.wrap.querySelector('.weather-date');
	}

	get temperatureWrap() {
		return this.wrap.querySelector('.weather-temperature');
	}

	get weatherPictureWrap() {
		return this.wrap.querySelector('.weather-picture');
	}

	get citiesListWrap() {
		return this.wrap.querySelector('.weather-cities__list');
	}

	get weatherAdditionalWrap() {
		return this.wrap.querySelector('.weather-additional');
	}

	get pictureWeather() {
		const weather = this.#json.weather[0];
		
		return (weather.id >= 701 && weather.id <= 781) ? 'atmosphere' : weather.main.toLowerCase();
	}

	get cities() {
		return [
			{ name: 'Полтава', id: 696643, },
			{ name: 'Київ', id: 703448, },
			{ name: 'Дніпро', id: 709930, },
			{ name: 'Кременчук', id: 704147, },
		];
	}

	getWeather() {
		const request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHttp');

		request.open('GET', `${this.#url}/data/2.5/weather?id=696643&appid=${this.#apiId}&units=metric&lang=ua`);
		request.responseType = 'json';

		request.addEventListener('readystatechange', () => {
			if (request.readyState === 4 && request.status === 200) {
				this.#json = request.response;

				this.cityWrap.innerText = this.#json.name
				this.getTemperature();
				this.getPictureWeather();
				this.getAdditionalWeatherInfo();
			}

			if (request.readyState < 4 && request.status >= 400) {
				console.error('Помилка даних');
			}
		});

		request.send();
	}

	getTemperature() {
		const main = this.#json.main;

		const temperatureInfo = `<span class="weather-temperature__degrees">${Math.floor(main.temp)}&#176;</span>
								<span class="weather-temperature__feels">Відчувається як ${Math.floor(main.feels_like)}&#176;</span>`;

		this.temperatureWrap.insertAdjacentHTML('beforeEnd', temperatureInfo);
	}

	getPictureWeather() {
		const pictureAndDescr = `<div class="weather-picture__icon">
									<img src="img//weather/${this.pictureWeather}.svg" alt="weather">
								</div>
								<span>${this.#json.weather[0].description}</span>`;

		this.weatherPictureWrap.insertAdjacentHTML('beforeEnd', pictureAndDescr);
	}

	getAdditionalWeatherInfo() {
		console.dir(this.#json);

		const additionalInfo = `<li class="weather-additional__item">
							<div class="weather-additional__icon">
								<img src="img/wind.svg" alt="wind">
							</div>
							<span>10 км/ч</span>
						</li>
						<li class="weather-additional__item">
							<div class="weather-additional__icon">
								<img src="img/wind.svg" alt="wind">
							</div>
							<span>10 км/ч</span>
						</li>
						<li class="weather-additional__item">
							<div class="weather-additional__icon">
								<img src="img/wind.svg" alt="wind">
							</div>
							<span>10 км/ч</span>
						</li>
						<li class="weather-additional__item">
							<div class="weather-additional__icon">
								<img src="img/wind.svg" alt="wind">
							</div>
							<span>10 км/ч</span>
						</li>`;

		this.weatherAdditionalWrap.insertAdjacentHTML('beforeEnd', additionalInfo);
	}

	renderCities() {
		const cities = this.cities
			.map(city => {
				return `<li class="weather-cities__item" data-id="${city.id}">
							<div class="weather-cities__picture">
								<img src="img/weather/clear.svg" alt="pic">
							</div>
							<span class="weather-cities__degrees">+25&#176;</span>
							<span class="weather-cities__name">${city.name}</span>
						</li>`;
			})
			.join('');

		this.citiesListWrap.insertAdjacentHTML('beforeEnd', cities);
		this.citiesListWrap.previousElementSibling.style.cursor = 'pointer';
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
			this.citiesListWrap.classList.toggle('active');
		}
	}

	hideCitiesList(e) {
		if (!e.target.matches('.weather-cities__button img')) {
			this.citiesListWrap.classList.remove('active');
		}
	}

	init() {
		this.getWeather();
		this.getCurrentDate();
		this.renderCities();
		this.wrap.addEventListener('click', this.showCitiesList.bind(this));
		document.addEventListener('click', this.hideCitiesList.bind(this));
	}
}

new Weather().init();