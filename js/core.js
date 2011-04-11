/**
 * Javascript Application Core (Layer 1)
 * -----------------------------------------
 * The core is the only part from the application which has direct access to the base library.
 * Any access to the base library (from a Module) is marshaled down through the Sandbox.
 * Furthermore, the Core is responsible for Module lifecycles, communication between modules,
 * error handling and extensions.
 * 
 * Last thing to mention, the Core should be the only global object (we need someplace to register Modules)
 * -----------------------------------------
 * Author: Andreas Goebel
 * Date: 2011-03-17
 */

!(function _core_wrap( win, doc, $, undef ) {
	"use strict";
	var IR = win.ir = win.ir || { },
		IRcomponents = IR.components = IR.components || { },
	
	Core = (function _Core() {
		var moduleData	= { },
			Public		= { },
			Private		= { },
			Sandbox		= function Sandbox() { },
			push		= Array.prototype.push,
			slice		= Array.prototype.slice;
		
		/****** MODULE SPECIFIC METHODS (LIFECYCLE, COMMUNICATION) *******/
		/****** ************************************************** *******/ {
		Public.register	= function _register( moduleID, creator ) {
			moduleData[ moduleID ] = {
				creator: creator,
				instance: null
			};
		};
		
		Public.start = function _start( moduleID ) {
			if( moduleID in moduleData ) {
				var data = moduleData[ moduleID ];
				data.instance = data.creator( new Sandbox( this ) );
				data.instance.init();
			}
		};
		
		Public.stop = function _stop( moduleID ) {
			if( moduleID in moduleData ) {
				var data = moduleData[ moduleID ];
				if( data.instance ) {
					data.instance.destroy();
					data.instance = null;
				}
			}
		};
		
		Public.startAll = function _startAll() {
			Object.keys( moduleData ).forEach(function _forEach( moduleID ) {
				Public.start( moduleID );
			});
		};
		
		Public.stopAll = function _stopAll() {
			Object.keys( moduleData ).forEach(function _forEach( moduleID ) {
				Public.stop( moduleID );
			});
		};
		
		Public.error = function _error( err ) {
			if( Object.type( err ) === 'Object' ) {
				if( typeof err.type === 'string' ) {
					switch( err.type.toLowerCase() ) {
						case 'type': {
							throw new TypeError( err.msg );
							break;
						}
						case 'reference': {
							throw new ReferenceError( err.msg );
							break;
						}
						case 'syntax': {
							throw new SyntaxError( err.msg );
							break;
						}
						default: {
							throw new Error( err.msg );
							break;
						}
					}
				}
				else {
					throw new TypeError( 'Core: error() called with wrong arguments' );
				}
			}
		};
		
		Public.registerSandbox = function _registerSandbox( sandbox ) {
			if( typeof sandbox === 'function' ) {
				Sandbox = sandbox;
			}
			else {
				Public.error({
					type:	'type',
					msg:	'Core: registerSandbox() requires a function reference'
				});
			}
		};
		/*----- -------------------------------------------------- ------*/
		/*----- -------------- BLOCK END ------------------------- ------*/ }


		/****** BASE LIBRARY ABSTRACTIONS ## JQUERY 1.5.1 ******** *******/
		/****** ************************************************** *******/ {
		Public.$ = function _$( selector ) {
			function init( sel ) {
				this.constructor = _$;
				push.apply( this, $( selector ).get() );
			}

			init.prototype = Private.DOM;
			init.constructor = _$;
			
			return new init( selector );
		};
		
		Private.DOM = { };
		Private.DOM.ready = function _ready( method ) {
			$.fn.ready.call( this, method );
			return this;
		};

		Private.DOM.bind = function _bind( ev, handler ) {
			$.fn.bind.call( this, ev, handler );
			return this;
		};

		Private.DOM.unbind = function _unbind( node, ev, handler ) {
			$.fn.unbind.call( this, ev, handler );
			return this;
		};
		
		Private.DOM.slice = function( ) {
			var newRef	= this.constructor(),
				args	= arguments;
				
			push.apply( newRef, ( slice.apply( this, args ) ) );
			
			return newRef;
		};

		Private.DOM.delegate = function _delegate( selector, ev, handler ) {
			$.fn.live.call( this, ev, handler, undef, selector );
			return this;
		}
		
		Private.DOM.undelegate = function _die( selector, ev, handler ) {
			if( arguments.length === 0 ) {
				$.fn.unbind.call( this, 'live' );
			}
			else {
				$.fn.die.call( this, ev, null, handler, selector );
			}
			return this;
		};
		
		Private.DOM.remove = function _remove() {
			$.fn.remove.call( this );
		};

		Private.DOM.snapshot = function _snapshot( root ) {
			if( Object.type( root ) === 'Node' ) {
				var snap 	= [ ],
					$root 	= $( root );
					
				$root.children().each(function _snapshot_each( node ) {
					
				});
			}
			else {
				Public.error({
					type:	'type',
					msg:	'Core: snapshot() expects a DOM node'
				});
			}
		};
		/*----- -------------------------------------------------- ------*/
		/*----- -------------- BLOCK END ------------------------- ------*/ }

		return Public;
	}());
	
	IRcomponents.Core = Core;
}( window, window.document, jQuery ));
