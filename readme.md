A client-side router that only serializes a small amount of state to the querystring.

# Use case

[Svelte](https://svelte.technology/) is a new kind of component library, in that its footprint is so small that you can justifiably use it on a standalone HTML page that has a small amount of dynamic content.

Normally you would want to avoid pulling in a component framework to put a component or two on a single page, but since Svelte [doesn't have the overhead of runtime code to ship to the browser](https://svelte.technology/blog/frameworks-without-the-framework), you can toss a few components onto a small page without any guilt.

These single pages don't need a full router, but you should still serialize any dynamic state to the url.  That's where this library again.

*Note:*  don't use this library if you want a client-side router to display different Svelte components as pages based on the route. If you have a true single-page application with multiple pages, you should use [abstract-state-router](https://github.com/TehShrike/abstract-state-router).  Check out [Why your webapp needs a state-based router](http://joshduff.com/#!/post/2015-06-why-you-need-a-state-router.md) for more details.

# What it does

1. Gives you a `<Link>` component your components can use to generate links that update the querystring without reloading the page
2. Keeps a `querystringParameters` parameter up to date on your top-level components when the querystring changes

# Usage

To use the Link component in your components:

```html
<p>
	You can totally click <Link parameters="{{ { thingy: 'yes' } }}">this</Link>
</p>
{{#if querystringParameters.thingy === 'yes'}}
<p>
	Aw, yeah.
</p>
{{/if}}

<script>
const { Link } = require('svelte-querystring-router')

export default {
	components: {
		Link
	}
}
</script>
```

To hook up the query string to your component, so that the `querystringParameters` value is populated, do this wherever you're instantiating your component:

```js
const { attachQuerystringData, getCurrentParameters } = require('svelte-querystring-router')

const component = new YourCoolComponent({
	target: document.getElementById('whatever'),
	data: {
		querystringParameters: getCurrentParameters()
	}
})

attachQuerystringData(component) // This keeps querystringParameters updated
```

# How it works

All clicks in `<Link>` elements are intercepted and turned into [`pushState`](https://developer.mozilla.org/en-US/docs/Web/API/History_API#The_pushState()_method) calls, so that the page doesn't reload on every click.

Whenever this happens, all the components that you hooked up with `attachQuerystringData()` have their `querystringParameters` data changed - any display values based on that data will change instantly without any page reloading.

# API

When you import the module, you get a global instance based on the browser's location/history globals.

It is possible to create an instance passing in shims for these functions, but I don't know if there's any use for that yet.

Anyway, the instantiated instances come with this API:

## `attachQuerystringData(component)`

## `Link`

The component to be used in other Svelte components.

## `navigate({ querystring, parameters, element })`

Causes a `pushState`, and fires a navigate event, updating all attached components.

## `currentQuerystring = getCurrentQuerystring()`

## `currentParameters = getCurrentParameters()`

## Events

There are two event-listening methods:

- `removeListener = on(event, listener)`
- `removeListener = once(event, listener)`

These events are fired:

- `before navigate`
- `navigate` - this is when `pushState` is called
- `after navigate`

All events emit a single object as an argument, with three properties: `querystring`, `parameters`, and `element`.

# License

[WTFPL](http://wtfpl2.com)
