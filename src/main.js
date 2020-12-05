import { mapListToDOMElements,  createDOMElements } from './DOMActions.js'
import { getShowByKeyword, getShowById } from './request.js'

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
		this.viewElems = mapListToDOMElements(listOfIds, 'id')
	}

	setupListeners = () => {
			this.viewElems.themesSelect.addEventListener('change', this.setCurrentNameFilter)
	}

	setCurrentNameFilter = () => {
		this.selectedKeyword = event.target.value
		this.fetchAndDisplay()
	}

	fetchAndDisplay = show => {
		console.log('fetch')
		getShowByKeyword(this.selectedKeyword).then(shows => this.renderCards(shows))
	}

	renderCards = shows => {
		Array.from(
			document.querySelectorAll('[data-show-id]')
			).forEach(btn => btn.removeEventListener('click', this.openDetailsView))
		this.viewElems.cardWrapper.innerHTML = ""


		for (const { show } of shows) {
			const card = this.createShowCard(show)
			this.viewElems.cardWrapper.appendChild(card)
		}

	}

	closeDetailsView = event => {
		const { showId } = event.target.dataset
		const closeBtn = document.querySelector(`[id="showModel"] [data-show-id="${showId}"]`)
		closeBtn.removeEventListener('click', this.closeDetailsView)
		this.viewElems.showModal.style.display = 'none'
		this.viewElems.showModal.innerHTML =  ""
	}

	openDetailsView = event => {

		const { showId } = event.target.dataset

		getShowById(showId).then(show => {
			const card = this.createShowCard(show, true)
			this.viewElems.showModal.appendChild(card)
			this.viewElems.showModal.style.display = 'block'
		})
	}

	createShowCard = (show, hasDetails) => {
		const divCard = createDOMElements('div', 'card')
		const divCardBody = createDOMElements('div', 'card-body')
		const h5 = createDOMElements('h5', 'card-title', show.name)
		const button = createDOMElements('button', 'btn btn-primary', 'Show details')
		let img, p;

		if(show.image) {
			img = createDOMElements('img', 'card-img-top', null, show.image.medium)
		} else {
			img = createDOMElements('img', 'card-img-top', null, 'https://picsum.photos/200/295')
		}

		if(show.summary) {
			if(hasDetails) {
				p = createDOMElements('p', 'card-text', show.summary)
			} else {
				p = createDOMElements('p', 'card-text', `${show.summary.slice(0, 80)}...`)
			}
		} else {
			p = createDOMElements('p', 'card-text', 'nop sorry')
		}
			

		button.dataset.showId = show.id;

		if(hasDetails) {
			button.addEventListener('click', this.closeDetailsView);
		} else {
			button.addEventListener('click', this.openDetailsView);
		}


		divCard.appendChild(divCardBody)
		divCardBody.appendChild(img)
		divCardBody.appendChild(h5)
		divCardBody.appendChild(p)
		divCardBody.appendChild(button)

		return divCard
		
	}

}

document.addEventListener('DOMContentLoaded', new TVMaze)
