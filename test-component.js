'use strict';

function recompute ( state, newState, oldState, isInitial ) {
	if ( isInitial || ( 'querystringParameters' in newState && differs( state.querystringParameters, oldState.querystringParameters ) ) ) {
		state.animal = newState.animal = template.computed.animal( state.querystringParameters );
	}
}

var template = (function () {
const { Link } = require('./test-router-instance')

return {
	computed: {
		animal: querystringParameters => querystringParameters.animal === 'cat'
			? 'kitties'
			: 'doggies'
	},
	components: {
		Link
	}
}
}());

function create_main_fragment ( state, component ) {
	var text_3_value;

	var h1 = createElement( 'h1' );
	appendNode( createText( "I'm a cool component" ), h1 );
	var text_1 = createText( "\n" );
	var p = createElement( 'p' );
	appendNode( createText( "So I heard you like " ), p );
	var text_3 = createText( text_3_value = state.animal );
	appendNode( text_3, p );
	var text_4 = createText( "\n" );
	var p_1 = createElement( 'p' );
	appendNode( createText( "or was it a\n\t" ), p_1 );

	function get_block ( state ) {
		if ( state.querystringParameters.animal === 'cat' ) return create_if_block;
		return create_if_block_1;
	}

	var current_block = get_block( state );
	var if_block = current_block && current_block( state, component );

	if ( if_block ) if_block.mount( p_1, null );
	var text_6 = createText( "\n\t?!?!?!?" );
	appendNode( text_6, p_1 );
	var text_7 = createText( "\n" );
	var p_2 = createElement( 'p' );
	appendNode( createText( "I'm just a " ), p_2 );
	var link_1_yield_fragment = create_link_yield_fragment_2( state, component );

	var link_1 = new template.components.Link({
		target: p_2,
		_root: component._root,
		_yield: link_1_yield_fragment
	});

	appendNode( createText( "." ), p_2 );

	return {
		mount: function ( target, anchor ) {
			insertNode( h1, target, anchor );
			insertNode( text_1, target, anchor );
			insertNode( p, target, anchor );
			insertNode( text_4, target, anchor );
			insertNode( p_1, target, anchor );
			insertNode( text_7, target, anchor );
			insertNode( p_2, target, anchor );
		},

		update: function ( changed, state ) {
			if ( text_3_value !== ( text_3_value = state.animal ) ) {
				text_3.data = text_3_value;
			}

			if ( current_block !== ( current_block = get_block( state ) ) ) {
				if ( if_block ) if_block.destroy( true );
				if_block = current_block && current_block( state, component );
				if ( if_block ) if_block.mount( p_1, text_6 );
			}
		},

		destroy: function ( detach ) {
			if ( if_block ) if_block.destroy( false );
			link_1.destroy( false );

			if ( detach ) {
				detachNode( h1 );
				detachNode( text_1 );
				detachNode( p );
				detachNode( text_4 );
				detachNode( p_1 );
				detachNode( text_7 );
				detachNode( p_2 );
			}
		}
	};
}

function create_link_yield_fragment ( state, component ) {
	var text = createText( "dog" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_link_yield_fragment_1 ( state, component ) {
	var text = createText( "cat" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function create_if_block ( state, component ) {
	var link_1_yield_fragment = create_link_yield_fragment( state, component );

	var link_1 = new template.components.Link({
		target: null,
		_root: component._root,
		_yield: link_1_yield_fragment,
		data: { parameters: {} }
	});

	return {
		mount: function ( target, anchor ) {
			link_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			link_1.destroy( detach );
		}
	};
}

function create_if_block_1 ( state, component ) {
	var link_1_yield_fragment = create_link_yield_fragment_1( state, component );

	var link_1 = new template.components.Link({
		target: null,
		_root: component._root,
		_yield: link_1_yield_fragment,
		data: { parameters: { animal: 'cat' } }
	});

	return {
		mount: function ( target, anchor ) {
			link_1._fragment.mount( target, anchor );
		},

		destroy: function ( detach ) {
			link_1.destroy( detach );
		}
	};
}

function create_link_yield_fragment_2 ( state, component ) {
	var text = createText( "regular old anchor" );

	return {
		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
		},

		destroy: function ( detach ) {
			if ( detach ) {
				detachNode( text );
			}
		}
	};
}

function TestComponent ( options ) {
	options = options || {};
	this._state = options.data || {};
	recompute( this._state, this._state, {}, true );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;
	this._renderHooks = [];

	this._fragment = create_main_fragment( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );

	this._flush();
}

assign( TestComponent.prototype, {
	get: get,
	fire: fire,
	observe: observe,
	on: on,
	set: set,
	_flush: _flush
});

TestComponent.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	recompute( this._state, newState, oldState, false )
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );

	this._flush();
};

TestComponent.prototype.teardown = TestComponent.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

function createElement ( name ) {
	return document.createElement( name );
}

function insertNode ( node, target, anchor ) {
	target.insertBefore( node, anchor );
}

function detachNode ( node ) {
	node.parentNode.removeChild( node );
}

function createText ( data ) {
	return document.createTextNode( data );
}

function appendNode ( node, target ) {
	target.appendChild( node );
}

function assign ( target ) {
	for ( var i = 1; i < arguments.length; i += 1 ) {
		var source = arguments[i];
		for ( var k in source ) target[k] = source[k];
	}

	return target;
}

function differs ( a, b ) {
	return ( a !== b ) || ( a && ( typeof a === 'object' ) || ( typeof a === 'function' ) );
}

function dispatchObservers ( component, group, newState, oldState ) {
	for ( var key in group ) {
		if ( !( key in newState ) ) continue;

		var newValue = newState[ key ];
		var oldValue = oldState[ key ];

		if ( differs( newValue, oldValue ) ) {
			var callbacks = group[ key ];
			if ( !callbacks ) continue;

			for ( var i = 0; i < callbacks.length; i += 1 ) {
				var callback = callbacks[i];
				if ( callback.__calling ) continue;

				callback.__calling = true;
				callback.call( component, newValue, oldValue );
				callback.__calling = false;
			}
		}
	}
}

function get ( key ) {
	return key ? this._state[ key ] : this._state;
}

function fire ( eventName, data ) {
	var handlers = eventName in this._handlers && this._handlers[ eventName ].slice();
	if ( !handlers ) return;

	for ( var i = 0; i < handlers.length; i += 1 ) {
		handlers[i].call( this, data );
	}
}

function observe ( key, callback, options ) {
	var group = ( options && options.defer ) ? this._observers.post : this._observers.pre;

	( group[ key ] || ( group[ key ] = [] ) ).push( callback );

	if ( !options || options.init !== false ) {
		callback.__calling = true;
		callback.call( this, this._state[ key ] );
		callback.__calling = false;
	}

	return {
		cancel: function () {
			var index = group[ key ].indexOf( callback );
			if ( ~index ) group[ key ].splice( index, 1 );
		}
	};
}

function on ( eventName, handler ) {
	if ( eventName === 'teardown' ) return this.on( 'destroy', handler );

	var handlers = this._handlers[ eventName ] || ( this._handlers[ eventName ] = [] );
	handlers.push( handler );

	return {
		cancel: function () {
			var index = handlers.indexOf( handler );
			if ( ~index ) handlers.splice( index, 1 );
		}
	};
}

function set ( newState ) {
	this._set( assign( {}, newState ) );
	this._root._flush();
}

function _flush () {
	if ( !this._renderHooks ) return;

	while ( this._renderHooks.length ) {
		this._renderHooks.pop()();
	}
}

module.exports = TestComponent;