function callHistoryMethod(method, state, title, url) {
	method.call(window.history, state, title, url)
}

module.exports = function setUpListener(cb) {
	var originalPushState = window.history.pushState
	var originalReplaceState = window.history.replaceState

	window.history.replaceState = function(state, title, url) {
		callHistoryMethod(originalReplaceState, state, title, url)
		cb()
	}

	window.history.pushState = function(state, title, url) {
		callHistoryMethod(originalPushState, state, title, url)
		cb()
	}
}
