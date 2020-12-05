import { mapListToDOMElements,  createDOMElements } from './DOMActions.js'
import { getShowByKeyword, getShowById } from './request.js'

class TVMaze {
	constructor() {
		this.viewElems = {}
		this.showTitleOptions = {}
		this.selectedKeyword = ''
		this.initialiseApp()
	}

	initialiseApp = () => {
		this.connectDOMElements()
		this.setupListeners()
		// this.fetchAndDisplay()
	}

	connectDOMElements = () => {
		const listOfIds = Array.from(document.querySelectorAll('[id]')).map(elem => elem.id)
		this.viewElems = mapListToDOMElements(listOfIds, 'id')
		console.log(this.viewElems)
	}

	setupListeners = () => {
		this.viewElems.movieKeySearchInput.addEventListener('keydown', this.handleSubmit);
		this.viewElems.themesSelect.addEventListener('keydown', this.handleSubmit);
		this.viewElems.searchSubmitBtn.addEventListener('click', this.handleSubmit);
	}

	handleSubmit = () => {
		
		let movieKeyWordQuery = ''
		let dropDownKeySelect = ''
		movieKeyWordQuery = this.viewElems.movieKeySearchInput.value
		movieKeyWordQuery.trim()
		dropDownKeySelect = this.viewElems.themesSelect.value
		dropDownKeySelect.trim()

		 if(event.type === 'click' || event.key === 'Enter') {
			

			if( movieKeyWordQuery !== '' && dropDownKeySelect === '') {
				getShowByKeyword(movieKeyWordQuery).then(shows => this.renderCards(shows))			
			} else if (movieKeyWordQuery === '' && dropDownKeySelect !== '') {
				getShowByKeyword(dropDownKeySelect).then(shows => this.renderCards(shows))
			} else {
				this.selectedKeyword = movieKeyWordQuery.concat(' ', dropDownKeySelect)
				getShowByKeyword(this.selectedKeyword).then(shows => this.renderCards(shows))
			}
		}
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
		const closeBtn = document.querySelector(`[data-show-id="${showId}"]`)
		closeBtn.removeEventListener('click', this.closeDetailsView)
		this.viewElems.showModal.style.display = 'none'
		this.viewElems.showModal.innerHTML =  ''
	}

	openDetailsView = event => {

		const { showId } = event.target.dataset

		getShowById(showId).then(show => {
			const card = this.createShowCard(show, true)
			this.viewElems.showModal.appendChild(card)
			this.viewElems.showModal.style.display = 'block'
			document.querySelector('.card').style.boxShadow = 'none'
		})
	}

	createShowCard = (show, hasDetails) => {
		console.log(show)
		const divCard = createDOMElements('div', 'card')
		const divCardBody = createDOMElements('div', 'card-body')
		const h5 = createDOMElements('h5', 'card-title', show.name)
		//const button = createDOMElements('button', 'btn btn-primary', 'Show details')
		let img, p, button;

		if(show.image) {
			img = createDOMElements('img', 'card-img-top', null, show.image.medium)
		} else {
			img = createDOMElements('img', 'card-img-top', null, 'https://picsum.photos/200/295')
		}

		if(show.summary) {
			let cleanSummaryText = show.summary.replace( /(<([^>]+)>)/ig, '');
			if(hasDetails) {
				p = createDOMElements('p', 'card-text', cleanSummaryText)
			} else {
				p = createDOMElements('p', 'card-text', `${cleanSummaryText.slice(0, 80)}...`)
			}
		} else {
			p = createDOMElements('p', 'card-text', 'nop sorry')
		}
		
		button = createDOMElements('button', 'btn btn-primary', 'Show details')
		button.dataset.showId = show.id;

		

		if(hasDetails) {
			button = createDOMElements('button', 'btn btn-primary', 'close')
			button.dataset.showId = show.id;
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
