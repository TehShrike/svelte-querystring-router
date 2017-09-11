const qs = require('query-string')
const createEmitter = require('better-emitter')
const onPushOrReplaceState = require('./on-browser-state')

const Link = require('./link.js')

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
	window.addEventListener('popstate', listener)
}

function parametersToQuerystring(parameters) {
	return '?' + qs.stringify(parameters)
}

function optionsWithAugmentedData(options) {
	return Object.assign({}, options, {
		data: Object.assign({}, options.data, { parametersToQuerystring }),
	})
}

const currentAnchor = () => window.location.hash.replace(/^#/, '')
const scrollToElement = element => element && element.scrollIntoView()
const getElementById = id => id && document.getElementById(id)

module.exports = function createRouterInstance(options = {}) {
	const {
		pushState,
		replaceState,
		currentQuerystring,
		onPopState,
	} = Object.assign({
		pushState: defaultPushState,
		replaceState: defaultReplaceState,
		currentQuerystring: defaultCurrentQuerystring,
		onPopState: defaultOnPopState,
	}, options)

	const emitter = createEmitter()

	let navigating = false
	const handleExternalNavigation = () => {
		if (!navigating) {
			const { querystring, parameters } = currentQuerystring()
			emitter.emit('navigate', { querystring, parameters })
		}
	}

	onPopState(handleExternalNavigation)
	onPushOrReplaceState(handleExternalNavigation)

	function navigate({ querystring, parameters, element, meta, replace, hash = '' }) {
		if (typeof querystring === 'undefined') {
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

		emit('before navigate')

		emit('navigate')

		navigating = true
		const startAnchor = currentAnchor()
		navigateFunction(parameters, '', querystring + hash)
		const newAnchor = currentAnchor()
		if (newAnchor && startAnchor !== newAnchor) {
			scrollToElement(getElementById(newAnchor))
		}
		navigating = false

		emit('after navigate')
	}

	return {
		navigate,
		Link: function linkProxy(options) {
			const linkComponent = new Link(optionsWithAugmentedData(options))

			linkComponent.on('navigate', ({ querystring, parameters, meta, hash }) => {
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
			const removeListener = emitter.on('navigate', ({ parameters }) => {
				component.set({
					querystringParameters: parameters,
				})
			})
			component.on('destroy', removeListener)
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
