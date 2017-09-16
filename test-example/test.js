import TestComponent from './TestComponent.html'
import instance from '../'

const { attachQuerystringData, getCurrentParameters } = instance

const component = new TestComponent({
	target: document.getElementById('target'),
	data: {
		querystringParameters: getCurrentParameters()
	}
})

attachQuerystringData(component)
