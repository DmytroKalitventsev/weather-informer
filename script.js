'use strict'

class Weather {
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

	getCurrentDate() {
		const months = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'];
		const daysWeek = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота', 'Неділя'];
		const date = new Date();

		const day = date.getDate().toString().padStart(2, '0');
		const month = (date.getMonth());
		const weekday = date.getDay();

		const currentDate = `<span class="weather-date__month">${months[month]} ${day}</span>
							<span class="weather-date__day">${daysWeek[weekday - 1]}</span>`;

		this.dateWrap.insertAdjacentHTML('beforeEnd', currentDate);
	}

	showListCities(e) {
		if (e.target.matches('.weather-cities__button img')) {
			this.weatherCitiesList.classList.toggle('active');
		}
	}

	init() {
		this.getCurrentDate();
		this.wrap.addEventListener('click', this.showListCities.bind(this), true);
	}
}

new Weather().init();