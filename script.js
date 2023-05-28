'use strict'

class Weather {
	#url = 'https://api.openweathermap.org';
	#apiId = 'aca1888765eac88dd6aba8b4a07a1ab8';
	#json = null;
	#currentCity = this.cities[0].name;

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

	get mainInfo() {
		return this.#json.main;
	}

	get currentTemp() {
		return Math.round(this.mainInfo.temp);
	}

	get cities() {
		return [
			{ name: 'Полтава', id: 696643, },
			{ name: 'Київ', id: 703448, },
			{ name: 'Дніпро', id: 709930, },
			{ name: 'Кременчук', id: 704147, },
		];
	}

	getRequest(idCity, callback) {
		const request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHttp');

		request.open('GET', `${this.#url}/data/2.5/weather?id=${idCity}&appid=${this.#apiId}&units=metric&lang=ua`);
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

	getDetailWeather(e) {
		const t = e.target.closest('.weather-cities__item');

		if (t) {
			const idCity = t.dataset.id;
			this.#currentCity = t.lastElementChild.innerText;

			this.getRequest(idCity, () => this.initWeather(this.#currentCity));
		}
	}

	initWeather(nameCity) {
		this.cityWrap.innerText = nameCity;
		this.getTemperature();
		this.getPictureWeather();
		this.getAdditionalWeatherInfo();
	}

	getTemperature() {
		this.temperatureWrap.innerHTML = '';

		const temperatureInfo = `<div class="weather-temperature__icon">
									<img src="img/temperature.svg" alt="temp">
								</div>
								<span class="weather-temperature__degrees">${this.currentTemp}&#176;</span>
								<span>Відчувається <br> як ${Math.round(this.mainInfo.feels_like)}&#176;</span>`;

		this.temperatureWrap.insertAdjacentHTML('beforeEnd', temperatureInfo);
	}

	getPictureWeather() {
		this.weatherPictureWrap.innerHTML = '';

		const pictureAndDescr = `<div class="weather-picture__icon">
									<img src="img//weather/${this.pictureWeather}.svg" alt="weather">
								</div>
								<span>${this.#json.weather[0].description}</span>`;

		this.weatherPictureWrap.insertAdjacentHTML('beforeEnd', pictureAndDescr);
	}

	renderCities() {
		this.cities.forEach(city => {
			this.getRequest(city.id, () => {
				const cityItem = `<li class="weather-cities__item" data-id="${city.id}">
										<div class="weather-cities__picture">
											<img src="img/weather/${this.pictureWeather}.svg" alt="pic">
										</div>
										<span class="weather-cities__degrees">${this.currentTemp}&#176;</span>
										<span class="weather-cities__name">${city.name}</span>
									</li>`;

				this.citiesListWrap.insertAdjacentHTML('beforeEnd', cityItem);
			});
		});

		this.citiesListWrap.previousElementSibling.style.cursor = 'pointer';
	}

	getAdditionalWeatherInfo() {
		this.weatherAdditionalWrap.innerHTML = '';

		const windSpeed = this.#json.wind.speed.toFixed(1);
		const clouds = this.#json.clouds.all;
		const rain = (this.#json.rain) ? this.#json.rain['1h'].toFixed(1) : 0;
		const humidity = this.mainInfo.humidity;

		const additionalInfo = `<li class="weather-additional__item">
									<div class="weather-additional__icon">
										<img src="img/wind.svg" alt="wind">
									</div>
									<span>Вітер: ${windSpeed} м/сек</span>
								</li>
								<li class="weather-additional__item">
									<div class="weather-additional__icon">
										<img src="img/cloud.svg" alt="wind">
									</div>
									<span>Хмарність: ${clouds}%</span>
								</li>
								<li class="weather-additional__item">
									<div class="weather-additional__icon">
										<img src="img/precipitation.svg" alt="wind">
									</div>
									<span>Опади: ${rain} мм</span>
								</li>
								<li class="weather-additional__item">
									<div class="weather-additional__icon">
										<img src="img/humidity.svg" alt="wind">
									</div>
									<span>Вологість: ${humidity}%</span>
								</li>`;

		this.weatherAdditionalWrap.insertAdjacentHTML('beforeEnd', additionalInfo);
	}

	getCurrentDate() {
		const nameMonths = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'];
		const daysWeek = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота'];
		const date = new Date();

		const day = date.getDate().toString().padStart(2, '0');
		const month = (date.getMonth());
		const weekday = date.getDay();

		const currentDate = `<span>${nameMonths[month]} ${day}</span>
							<span>${daysWeek[weekday]}</span>`;

		this.dateWrap.insertAdjacentHTML('beforeEnd', currentDate);
	}

	showCitiesList(e) {
		if (e.target.closest('.weather-cities__button')) {
			this.citiesListWrap.classList.toggle('active');
		} else {
			this.citiesListWrap.classList.remove('active');
		}
	}

	init() {
		this.getRequest(this.cities[0].id, () => this.initWeather(this.#currentCity));
		this.getCurrentDate();
		this.renderCities();
		document.addEventListener('click', this.showCitiesList.bind(this), false);
		this.citiesListWrap.addEventListener('click', this.getDetailWeather.bind(this), false);
	}
}

new Weather().init();

