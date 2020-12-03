import { mapListToDOMElements,  createDOMElements } from './DOMActions.js'
import { 
	getShowByKeyword,
	getShowById
  } from './request.js'

class TVMaze {
	constructor() {
		this.viewElems = {}
		this.showTitleOptions = {}
		this.selectedKeyword = 'Carrots'
		this.initialiseApp()
	}

	initialiseApp = () => {
		this.connectDOMElements()
		this.setupListeners()
		this.fetchAndDisplay()
	}

	connectDOMElements = () => {
		const listOfIds = Array.from(document.querySelectorAll('[id]')).map(elem => elem.id)
		// const listOfShowTitles = Array.from(
			// document.querySelectorAll('[data-show-title]')
			// ).map(elem => elem.dataset.showTitle)
		// const listOfShowTitles = document.querySelectorById('themes-select');
		console.log('heellow ')
		console.log(listOfIds)
		// console.log(listOfShowTitles)

		this.viewElems = mapListToDOMElements(listOfIds, 'id')
		// this.showTitleOptions = mapListToDOMElements(listOfShowTitles, 'data-show-title')

		// console.log(this.viewElems.themesSelect)
		// console.log(this.showTitleOptions)
	}

	setupListeners = () => {
		// Object.keys(this.showTitleOptions).forEach(showTitle => {
			this.viewElems.themesSelect.addEventListener('change', this.setCurrentNameFilter)
		// })
	}

	setCurrentNameFilter = () => {
		this.selectedKeyword = event.target.value
		console.log('this is selcetd:' + this.selectedKeyword)
		this.fetchAndDisplay()
	}

	fetchAndDisplay = show => {
		// console.log('this is selcetd:' + this.selectedKeyword)
		getShowByKeyword(this.selectedKeyword).then(shows => this.renderCards(shows))
	}

	renderCards = shows => {
		this.viewElems.cardWrapper.innerHTML = ""

		for (const { show } of shows) {
			this.createShowCard(show)
		}

	}

	createShowCard = show => {
		const divCard = createDOMElements('div', 'card')
		const divCardBody = createDOMElements('div', 'card-body')
		const h5 = createDOMElements('h5', 'card-title', show.name)
		// const p = createDOMElements('p', 'card-text', show.summary)
		const button = createDOMElements('button', 'btn btn-primary', 'Show details')
		let img, p ;

		if(show.image) {
			img = createDOMElements('img', 'card-img-top', null, show.image.medium)
		} else {
			img = createDOMElements('img', 'card-img-top', null, 'https://picsum.photos/1700/1050')
		}

		if(show.summary) {
			p = createDOMElements('p', 'card-text', `${show.summary.slice(0, 80)}...`)
		} else {
			p = createDOMElements('p', 'card-text', 'nop sorry')
		}

		divCard.appendChild(divCardBody)
		divCardBody.appendChild(img)
		divCardBody.appendChild(h5)
		divCardBody.appendChild(p)
		divCardBody.appendChild(button)

		this.viewElems.cardWrapper.appendChild(divCard)
		
	}

}

document.addEventListener('DOMContentLoaded', new TVMaze)
