import { mapListToDOMElements } from './DOMActions.js'
// import { 
// 	getShowByKeyword,
// 	getShowById
//   } from './requests.js'

class TVMaze {
	constructor() {
		this.viewElems = {}
		this.showTitleOptions = {}
		this.selectedKey = 'Carrots'
		this.initialiseApp()
	}

	initialiseApp = () => {
		this.connectDOMElements()
	}

	connectDOMElements = () => {
		const listOfIds = Array.from(document.querySelectorAll('[id]')).map(elem => elem.id)
		const listOfShowTitles = Array.from(
			document.querySelectorAll('[data-show-title]')
			).map(elem => elem.dataset.showTitle)
		console.log('heellow ')
		console.log(listOfIds)
		console.log(listOfShowTitles)

		this.viewElems = mapListToDOMElements(listOfIds, 'id')
		this.showTitleOptions = mapListToDOMElements(listOfShowTitles, 'data-show-title')

		console.log(this.viewElems)
		console.log(this.showTitleOptions)
	}

	setupListeners = () => {
		Object.keys(this.showTitleOptions).forEach(showTitle => {
			this.showTitleOptions[showTitle].addEventListener('click', this.setCurrentNameFilter)
		})
	}

	setCurrentNameFilter = () => {
		this.selectedKey = event.target.dataset.showTitle
		console.log(this.selectedKey)
	}
}

document.addEventListener('DOMContentLoaded', new TVMaze)
