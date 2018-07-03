import qs from 'query-string'
import createEmitter from 'better-emitter'
import defaultOnPushOrReplaceState from './on-browser-state'

import Link from './Link.html'

function defaultReplaceState(state, title, url) {
	history.replaceState(state, title, url)
}

function defaultPushState(state, title, url) {
	history.pushState(state, title, url)
}

function defaultCurrentQuerystring() {
	const querystring = location.search

	return {
		querystring,
		parameters: qs.parse(querystring),
	}
}

function defaultOnPopState(listener) {
	window.addEventListener(`popstate`, listener)
}

function parametersToQuerystring(parameters) {
	return `?` + qs.stringify(parameters)
}

function optionsWithAugmentedData(options) {
	return Object.assign({}, options, {
		data: Object.assign({}, options.data, { parametersToQuerystring }),
	})
}

const stripOctothorpe = str => str.replace(/^#/, ``)
const stripQuestionMark = str => str.replace(/^\?/, ``)
const currentAnchor = () => stripOctothorpe(window.location.hash)
const scrollToElement = element => element && element.scrollIntoView()
const getElementById = id => id && document.getElementById(id)

export default function createRouterInstance(options = {}) {
	const {
		pushState,
		replaceState,
		currentQuerystring,
		onPopState,
		onPushOrReplaceState,
	} = Object.assign({
		pushState: defaultPushState,
		replaceState: defaultReplaceState,
		currentQuerystring: defaultCurrentQuerystring,
		onPopState: defaultOnPopState,
		onPushOrReplaceState: defaultOnPushOrReplaceState,
	}, options)

	const emitter = createEmitter()

	let navigating = false
	const handleExternalNavigation = () => {
		if (!navigating) {
			const { querystring, parameters } = currentQuerystring()
			emitter.emit(`navigate`, { querystring, parameters })
		}
	}

	onPopState(handleExternalNavigation)
	onPushOrReplaceState(handleExternalNavigation)

	function navigate({ querystring, parameters, element, meta, replace, hash = `` }) {
		if (typeof querystring === `undefined`) {
			querystring = parametersToQuerystring(parameters)
		}

		function emit(event) {
			emitter.emit(event, {
				querystring,
				parameters,
				meta,
				element,
				hash,
			})
		}

		const navigateFunction = replace ? replaceState : pushState

		emit(`before navigate`)

		emit(`navigate`)

		navigating = true
		const { querystring: startQuerystring } = currentQuerystring()

		const startAnchor = currentAnchor()
		if (stripQuestionMark(startQuerystring) !== stripQuestionMark(querystring)) {
			navigateFunction(parameters, ``, querystring + hash)
		} else if (stripOctothorpe(hash) !== currentAnchor()) {
			pushState(parameters, ``, hash)
		}

		if (currentAnchor() !== startAnchor) {
			scrollToElement(getElementById(stripOctothorpe(hash)))
		}
		navigating = false

		emit(`after navigate`)
	}

	return {
		navigate,
		Link: function linkProxy(options) {
			const linkComponent = new Link(optionsWithAugmentedData(options))

			linkComponent.on(`navigate`, ({ querystring, parameters, meta, hash }) => {
				navigate({
					querystring,
					parameters,
					meta,
					element: linkComponent.refs.link,
					hash,
				})
			})

			return linkComponent
		},
		attachQuerystringData(component) {
			const removeListener = emitter.on(`navigate`, ({ parameters }) => {
				component.set({
					querystringParameters: parameters,
				})
			})
			component.on(`destroy`, removeListener)
			component.set({
				querystringParameters: currentQuerystring().parameters,
			})
		},
		on(event, listener) {
			return emitter.on(event, listener)
		},
		once(event, listener) {
			return emitter.once(event, listener)
		},
		getCurrentQuerystring() {
			return currentQuerystring().querystring
		},
		getCurrentParameters() {
			return currentQuerystring().parameters
		},
	}
}
