/* 
 * core_plugin_communication.js
 * ------------------------------
 * Core plugin: Intermodule communication (mediator)
 * ------------------------------
 * Author: Andreas Goebel
 * Date: 2011-05-04
 * Changed: 2011-05-09
 */
 
!(function _core_plugin_communication_wrap( win ) {
	"use strict";
	var IR = win.ir = win.ir || { },
		IRcomponents = IR.components = IR.components || { };

	if( Object.hasKeys( IRcomponents, 'Core' ) ) {
		var Core = IRcomponents.Core;

		Core.plugin(function _plugin( win, doc, $, Private, Public, Sandbox, PagePreview, undef ) {
			Private.messagePool = { };

			Public.dispatch = function _dispatch( messageInfo ) {
				if( Object.type( messageInfo ) === 'Object' ) {
					if( typeof messageInfo.name === 'string' ) {
						if( messageInfo.name in Private.messagePool ) {
							Private.messagePool[ messageInfo.name ].forEach(function _forEach( listener ) {
								try {
									listener.callback.apply( listener.scope, [ messageInfo ] );
								} catch( ex ) {
									Public.error({
										type: 'error',
										msg: 'Core: unable to dispatch event "' + messageInfo.name + '". Original error: "' + ex.message + '"'
									});
								}
							});	
						}
					}
					else {
						Core.error({
							type:	'syntax',
							msg:	'Core: dispatch() expects an event type as string'
						});
					}
				}
				else {
					Core.error({
						type:	'syntax',
						msg:	'Core: dispatch() expects an object'
					});
				}
				
				return this;
			};

			Public.listen = function _listen( eventName, callback, scope ) {
				if( Object.type( eventName ) !== 'Array' ) {
					eventName = [ eventName ];
				}
				
				eventName.forEach(function _forEach( event ) {
					if( typeof event === 'string' ) {
						if( typeof Private.messagePool[ event ] === 'undefined' ) {
							Private.messagePool[ event ] = [ ];
						}
							
						if( typeof callback === 'function' ) {
							Private.messagePool[ event ].push( { callback: callback, scope: scope || null } );
						}
					} else {
						Core.error({
							type:	'syntax',
							msg:	'Core: listen() expects a string value (or an Array of strings)'
						});
					}
				});
				
				return this;
			};
			
			Public.forget = function _forget( eventName, callback ) {
				if( Private.messagePool[ eventName ] && Object.type( Private.messagePool[ eventName ] ) === 'Array' ) {
					if( Object.type( eventName ) !== 'Array' ) {
						eventName = [ eventName ];
					}
					
					eventName.forEach(function( event ) {
						if( typeof event === 'string' ) {
							if( callback === undef ) {
								Private.messagePool[ event ] = [ ];
							}
							else {
								Private.messagePool[ event ] = Private.messagePool[ event ].filter(function( eventObj ) {
									return eventObj.callback !== callback;
								});
							}
						}
						else {
							Core.error({
								type:	'syntax',
								msg:	'Core: forget() expects a string value (or an Array of strings)'
							});
						}
					});
				}
				
				return this;
			};
		});
	}
	else {
		throw new ReferenceError( 'Core Plugin: Communication -> Core not found.' ); 
	}
	
}( window ));
