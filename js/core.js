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
			Sandbox		= function Sandbox() { };
		
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
		
		Public.error = function( err ) {
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
		
		Public.registerSandbox = function _linkSandbox( sandbox ) {
			if( typeof sandbox === 'function' ) {
				Sandbox = sandbox;
			}
			else {
				Public.error({
					type:	'type',
					msg:	'Core: linkSandbox() requires a function reference'
				});
			}
		};
		/*----- -------------------------------------------------- ------*/
		/*----- -------------- BLOCK END ------------------------- ------*/ }
		 
		 
		/****** BASE LIBRARY ABSTRACTIONS ## JQUERY 1.5.1 ******** *******/
		/****** ************************************************** *******/ {
		Public.DOM = { };
		Public.DOM.find = function _find( selector ) {
			return $( selector );
		};
		
		Public.DOM.ready = function _ready( method ) {
			$( method );
		};
		/*----- -------------------------------------------------- ------*/
		/*----- -------------- BLOCK END ------------------------- ------*/ }
		
		return Public;
	}());
	
	IRcomponents.Core = Core;
}( window, window.document, jQuery ));
