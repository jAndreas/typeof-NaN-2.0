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
	win.ir = win.ir || { };
	win.ir.components = win.ir.components || { };
	
	if( 'Core' in win.ir.components ) {
		var Core = win.ir.components.Core;
		
		var Sandbox = (function _Sandbox() {
			var Public		= { },
				Private		= {
					messagePool:	{ }
				};
				
				
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
		}());
	
		win.ir.components.Sandbox = Sandbox;
	}
	else {
		throw new ReferenceError( 'Sandbox: Core object not found' );
	}
}( window, window.document ));