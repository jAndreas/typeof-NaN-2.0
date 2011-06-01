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
 * Changed: 2011-05-16
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
					origin:	'Core',
					name:	'_registerApplication',
					msg:	'object was expected, received ' + Object.type( app ) + ' instead'
				});
			}
			
			return Public;
		};
		
		Public.registerSandbox = function _registerSandbox( sandbox ) {
			if( typeof sandbox === 'function' ) {
				Sandbox = sandbox;
			}
			else {
				Public.error({
					type:	'type',
					origin:	'Core',
					name:	'_registerSandbox',
					msg:	'function was expected, received ' + Object.type( sandbox ) + ' instead'
				});
			}
			
			return Public;
		};
		
		Public.registerModule = function _registerModule( moduleID, creator ) {
			if( typeof moduleID === 'string' && typeof creator === 'function' ) {
				if( !(moduleID in moduleData) ) {
					moduleData[ moduleID ] = {
						creator: creator,
						instance: null
					};
				}
				else {
					Public.error({
						type:	'custom',
						origin:	'Core',
						name:	'_registerModule',
						msg:	'Module name "' + moduleID + '" already registered'
					});
				}
				
				return this;
			}
			else {
				Public.error({
					type:	'type',
					origin:	'Core',
					name:	'_registerModule',
					msg:	'string/function pair expected, received ' + Object.type( moduleID ) + '/' + Object.type( creator ) + ' instead'
				});
			}
			
			return Public;
		};
		
		Public.start = function _start( moduleID ) {
			if( moduleID in moduleData ) {
				var data = moduleData[ moduleID ];
				try {
					if( data.instance && !data.instance.multipleInstances ) {
						throw new Error( 'Module "' + moduleID + '" does not allow multiple instances' );
					}
					
					data.instance = data.creator( new Sandbox( this ), Application );
					data.instance.init();
				} catch( ex ) {
					Public.error({
						type:	'unknown',
						origin:	'Core',
						name:	'_start',
						msg:	'unable to load module "' + moduleID + '". Error was: ' + ex.message + '\n\n' + 'Stacktrace:\n' + Private.formatStacktrace( ex.stack || ex.stacktrace )
					});
				}
			}
			
			return Public;
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
					Public.error({
						type:	'unknown',
						origin:	'Core',
						name:	'_stop',
						msg:	'unable to unload module "' + moduleID + '". Error was: ' + ex.message + '\n\n' + 'Stacktrace: ' + (ex.stack || ex.stacktrace)
					});
				}
			}
			
			return Public;
		};
		
		Public.startAll = function _startAll() {
			Object.keys( moduleData ).forEach(function _forEach( moduleID ) {
				Public.start( moduleID );
			});
			
			return Public;
		};
		
		Public.stopAll = function _stopAll() {
			Object.keys( moduleData ).forEach(function _forEach( moduleID ) {
				Public.stop( moduleID );
			});
			
			return Public;
		};
		
		Public.error = function _error( err ) {
			if( Object.type( err ) === 'Object' ) {
				if( typeof err.type === 'string' ) {
					var output = '\n\n' + 'Origin: ' + (err.origin || 'General') + '\n' + 'Calling context: ' + (err.name || 'Unknown') + '\n' + 'Message: ' +  (err.msg || '');

					switch( err.type.toLowerCase() ) {
						case 'type':
							throw new TypeError( output );
						case 'reference':
							throw new ReferenceError( output );
						case 'syntax':
							throw new SyntaxError( output );
						default:
							throw new Error( err.type + output );
					}
				}
				else {
					throw new TypeError( 'Core: error() called with wrong arguments' );
				}
			}
			
			return Public;
		};
		/*^^^^^ ^^^^^^^^^^^^^^^^^^^BLOCK END^^^^^^^^^^^^^^^^^^^^^^ ^^^^^^*/
		
		Public.Promise = function _Promise() {
			Private.verify( this );
			
			return $.Deferred.apply( null, arguments );
		};
		
		Public.when	= function _when() {
			Private.verify( this );
			
			return $.when.apply( null, arguments );
		};
		
		Public.extend = function _extend() {
			Private.verify( this );
			
			return $.extend.apply( null, arguments );
		};
		
		Public.plugin = function _plugin( ext ) {
			ext.apply( Public, [win, doc, $, Private, Public, Sandbox, Application] );
			
			return Public;
		};
		/*^^^^^ ^^^^^^^^^^^^^^^^^^^BLOCK END^^^^^^^^^^^^^^^^^^^^^^ ^^^^^^*/
		
		Private.verify = function( ctx ) {
			if( ctx.sb !== Sandbox ) {
				Public.error({
					type:	'reference',
					origin:	'Core',
					name:	'verify() -> ' + ( ctx.name || '(no caller available)' ),
					msg:	'Unauthorized call of Core method. Call this method through the Sandbox only'
				});
			}
		};
		
		Private.formatStacktrace = function( strace ) {
			if( Object.type( strace ) === 'String' ) {
				var lines = strace.split( /\n/ );
				
				if( lines && lines.length ) {
					return lines.map(function( line ) {
						var parts = line.split( /@/ );
						
						if( parts && parts.length ) {
							if( Object.type( parts[ 1 ] ) === 'String' ) {
								return parts[0].substr(0, 40) + '\t->\t' + parts[ 1 ].substr( parts[ 1 ].lastIndexOf( '/' ) ).slice(1, 40);
							}
						}
					}).join( '\n' );
				}
			}
		};

		return Public;
	}());
	
	IRcomponents.Core = Core;
}( window, window.document, jQuery ));
