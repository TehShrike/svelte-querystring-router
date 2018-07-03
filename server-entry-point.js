const createInstance = require('./create-instance-bundle.js')

const noop = () => {}
const bad = () => {
	throw new Error(`Wait, this function shouldn't get called`)
}
const emptyQuerystring = () => ({ querystring: ``, parameters: {} })

module.exports = createInstance({
	pushState: bad,
	replaceState: bad,
	currentQuerystring: emptyQuerystring,
	onPopState: noop,
	onPushOrReplaceState: noop,
})
