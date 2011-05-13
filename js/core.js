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
 * Changed: 2011-05-12
 */

!(function _core_wrap( win, doc, $, undef ) {
	"use strict";
	var IR = win.ir = win.ir || { },
		IRcomponents = IR.components = IR.components || { },
	
	Core = (function _Core() {
		var moduleData	= { },
			Public		= { },
			Private		= { },
			Application	= { },
			Sandbox		= function Sandbox() { };
		
		/****** CORE SPECIFIC METHODS (MODULE LIFECYCLE, SANDBOX)  *******/
		/****** ************************************************** *******/
		Public.registerApplication = function _registerApplication( app ) {
			if( Object.type( app ) === 'Object' ) {
				Application = app;
			}
			else {
				Public.error({
					type:	'type',
					msg:	'Core: registerApplication() requires an object'
				});
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
			
			return this;
		};
		
		Public.registerModule = function _registerModule( moduleID, creator ) {
			if( typeof moduleID === 'string' && typeof creator === 'function' ) {
				moduleData[ moduleID ] = {
					creator: creator,
					instance: null
				};
				
				return this;
			}
			else {
				throw new Error( 'Core: registerModule() -> string/function pair expected, received ' + typeof moduleID + '/' + typeof creator + ' instead' );
			}
		};
		
		Public.start = function _start( moduleID ) {
			if( moduleID in moduleData ) {
				var data = moduleData[ moduleID ];
				try {
					data.instance = data.creator( new Sandbox( this ), Application );
					data.instance.init();
				} catch( ex ) {
					throw new Error( 'Core: unable to load module "' + moduleID + '". Error was: ' + ex.message );
				}
			}
			
			return this;
		};
		
		Public.stop = function _stop( moduleID ) {
			if( moduleID in moduleData ) {
				var data = moduleData[ moduleID ];
				try {
					if( data.instance ) {
						data.instance.destroy();
						data.instance = null;
					}
				} catch( ex ) {
					throw new Error( 'Core: unable to unload module "' + moduleID + '". Error was: ' + ex.message );
				}
			}
			
			return this;
		};
		
		Public.startAll = function _startAll() {
			Object.keys( moduleData ).forEach(function _forEach( moduleID ) {
				Public.start( moduleID );
			});
			
			return this;
		};
		
		Public.stopAll = function _stopAll() {
			Object.keys( moduleData ).forEach(function _forEach( moduleID ) {
				Public.stop( moduleID );
			});
			
			return this;
		};
		
		Public.error = function _error( err ) {
			if( Object.type( err ) === 'Object' ) {
				if( typeof err.type === 'string' ) {
					switch( err.type.toLowerCase() ) {
						case 'type':
							throw new TypeError( err.msg );
						case 'reference':
							throw new ReferenceError( err.msg );
						case 'syntax':
							throw new SyntaxError( err.msg );
						default:
							throw new Error( err.msg );
					}
				}
				else {
					throw new TypeError( 'Core: error() called with wrong arguments' );
				}
			}
			
			return this;
		};
		/*^^^^^ ^^^^^^^^^^^^^^^^^^^BLOCK END^^^^^^^^^^^^^^^^^^^^^^ ^^^^^^*/
		
		Public.Promise = function _Promise() {
			return $.Deferred.apply( null, arguments );
		};
		
		Public.when	= function _when() {
			return $.when.apply( null, arguments );
		};
		
		Public.extend = function _extend() {
			return $.extend.apply( null, arguments );
		};
		
		Public.plugin = function _plugin( ext ) {
			ext.apply( Public, [win, doc, $, Private, Public, Sandbox, Application] );
			
			return this;
		};

		return Public;
	}());
	
	IRcomponents.Core = Core;
}( window, window.document, jQuery ));
