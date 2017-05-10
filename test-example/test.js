const TestComponent = require('./test-build-component')
const { attachQuerystringData } = require('./test-router-instance')

const component = new TestComponent({
	target: document.getElementById('target'),
	data: {
		querystringParameters: {}
	}
})

attachQuerystringData(component)
