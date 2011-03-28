/**
 * Javascript Sandbox (Layer 2)
 * -----------------------------------------
 * The Sandbox is the Module's view into the outside world and serves to keep the Module loosely-coupled.
 * It's responsible for the communication with other Modules, Ajax requests, retrieving a Module's base
 * DOM node, event handlers etc.
 * 
 * Every task a Module wants to accomplish must be marshaled through the Sandbox.
 *
 * -----------------------------------------
 * Author: Andreas Goebel
 * Date: 2011-03-17
 */

!(function _sandbox_wrap( win, doc, undef ) {
	"use strict";
	var IR = win.ir = win.ir || { },
		IRcomponents = IR.components = IR.components || { },
	
	Sandbox = function _Sandbox( Core ) {
		var Public		= { },
			Private		= {
				messagePool:	{ }
			};

		if( Object.type( Core ) === 'Object' ) {
			Public.dispatch = function _dispatch( messageInfo ) {
				if( Object.type( messageInfo ) === 'Object' ) {
					if( typeof messageInfo.type === 'string' ) {
						if( messageInfo.type in Private.messagePool ) {
							Private.messagePool[ messageInfo.type ].forEach(function( listener ) {
								listener.callback.apply( listener.scope, [ messageInfo ] );
							});	
						}
					}
					else {
						Core.error({
							type:	'syntax',
							msg:	'Sandbox: dispatch() expects an event type as string'
						});
					}
				}
				else {
					Core.error({
						type:	'syntax',
						msg:	'Sandbox: dispatch() expects an object'
					});
				}
			};
			
			Public.listen = function _listen( eventType, callback, scope ) {
				if( Object.type( eventType ) !== 'Array' ) {
					eventType = [ eventType ];
				}
				
				eventType.forEach(function _forEach( event ) {
					if( typeof event === 'string' ) {
						if( typeof Private.messagePool[ event ] === 'undefined' ) {
							Private.messagePool[ event ] = [ ];
						}
							
						if( typeof callback === 'function' ) {
							Private.messagePool[ event ].push( { callback: callback, scope: scope } );
						}
					} else {
						Core.error({
							type:	'syntax',
							msg:	'Sandbox: listen() expects a string value (or an Array of strings)'
						});
					}
				});
			};
			
			Public.error = Core.error;
			
			return Public;
		}
		else {
			throw new ReferenceError( 'Sandbox: No Core specified' );
		}
	};

	IRcomponents.Sandbox = Sandbox;
}( window, window.document ));