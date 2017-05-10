A client-side router that only serializes a small amount of state to the querystring.

# Use case

[Svelte](https://svelte.technology/) is a new kind of component library, in that its footprint is so small that you can justifiably use it on a standalone HTML page that has a small amount of dynamic content.

Normally you would want to avoid pulling in a component framework to put a component or two on a single page, but since Svelte [doesn't have the overhead of runtime code to ship to the browser](https://svelte.technology/blog/frameworks-without-the-framework), you can toss a few components onto a small page without any guilt.

These single pages don't need a full router, but you should still serialize any dynamic state to the url.  That's where this library comes in.

*Note:*  don't use this library if you want a client-side router to display different Svelte components as pages based on the route. If you have a true single-page application with multiple pages, you should use [abstract-state-router](https://github.com/TehShrike/abstract-state-router).  Check out [Why your webapp needs a state-based router](http://joshduff.com/#!/post/2015-06-why-you-need-a-state-router.md) for more details.

# What it does

1. Gives you a `<Link>` component your components can use to generate links that update the querystring without reloading the page
2. Keeps a `querystringParameters` parameter up to date on your top-level components when the querystring changes

# Usage

To use the Link component in your components:


