const qs = require('query-string')
const createEmitter = require('better-emitter')

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
	let current = currentQuerystring()

	onPopState(() => {
		const { querystring, parameters } = currentQuerystring()
		emitter.emit('navigate', { querystring, parameters })
	})

	function navigate({ querystring, parameters, element, replace }) {
		if (typeof querystring === 'undefined') {
			querystring = parametersToQuerystring(parameters)
		}
		current = { querystring, parameters }

		function emit(event) {
			emitter.emit(event, {
				querystring,
				parameters,
				element,
			})
		}

		const navigateFunction = replace ? replaceState : pushState

		emit('before navigate')

		emit('navigate')

		navigateFunction(parameters, '', querystring)

		emit('after navigate')
	}

	return {
		navigate,
		Link: function linkProxy(options) {
			const linkComponent = new Link(optionsWithAugmentedData(options))

			linkComponent.on('navigate', ({ querystring, parameters }) => {
				navigate({
					querystring,
					parameters,
					element: linkComponent.refs.link,
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
				querystringParameters: current.parameters,
			})
		},
		on(event, listener) {
			return emitter.on(event, listener)
		},
		once(event, listener) {
			return emitter.once(event, listener)
		},
		getCurrentQuerystring() {
			return current.querystring
		},
		getCurrentParameters() {
			return current.parameters
		},
	}
}
