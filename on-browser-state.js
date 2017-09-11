const callHistoryMethod = (method, ...args) => method.apply(window.history, args)

module.exports = function setUpListener(cb) {
	const originalPushState = window.history.pushState
	const originalReplaceState = window.history.replaceState

	window.history.replaceState = (...args) => {
		callHistoryMethod(originalReplaceState, ...args)
		cb()
	}

	window.history.pushState = (...args) => {
		callHistoryMethod(originalPushState, ...args)
		cb()
	}
}
