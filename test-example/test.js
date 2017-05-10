const TestComponent = require('./test-build-component')
const { attachQuerystringData, getCurrentParameters } = require('../')

const component = new TestComponent({
	target: document.getElementById('target'),
	data: {
		querystringParameters: getCurrentParameters()
	}
})

attachQuerystringData(component)
