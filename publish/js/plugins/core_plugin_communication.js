/* 
 * core_plugin_communication.js
 * ------------------------------
 * Core plugin: Intermodule communication (mediator)
 * 
 * Message object structure:
 * {
 * 		name: <name of event>,
 * 		data: <any data>
 * }
 * ------------------------------
 * Author: Andreas Goebel
 * Date: 2011-05-04
 * Changed: 2011-06-01
 */

!(function _core_plugin_ajax_wrap() {
	"use strict";
	
	Object.lookup( 'ir.components.Core.plugin', 0 ).execute(function( win, doc, $, Private, Public, Sandbox, PagePreview, undef ) {
		Private.messagePool = { };

		Public.dispatch = function _dispatch( messageInfo ) {
			Private.verify( this );
			
			if( Object.type( messageInfo ) === 'Object' ) {
				if( typeof messageInfo.name === 'string' ) {
					if( messageInfo.name in Private.messagePool ) {
						Private.messagePool[ messageInfo.name ].forEach(function _forEach( listener ) {
							try {
								listener.callback.apply( listener.scope, [ messageInfo ] );
							} catch( ex ) {
								Public.error({
									type:	'error',
									origin:	'Core COM',
									name:	'_dispatch -> _forEach',
									msg:	'unable to dispatch event "' + messageInfo.name + '". Original error: "' + ex.message + '"'
								});
							}
						});	
					}
				}
				else {
					Public.error({
						type:	'syntax',
						origin:	'Core COM',
						name:	'_dispatch',
						msg:	'expected an event type as string'
					});
				}
			}
			else {
				Public.error({
					type:	'syntax',
					origin:	'Core COM',
					name:	'_dispatch',
					msg:	'expected an object'
				});
			}
			
			return Public;
		};

		Public.listen = function _listen( eventName, callback, scope ) {
			Private.verify( this );
			
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
					Public.error({
						type:	'syntax',
						origin:	'Core COM',
						name:	'_listen',
						msg:	'expected a string value (or an Array of strings), received ' + Object.type( event ) + ' instead'
					});
				}
			});
			
			return Public;
		};
		
		Public.forget = function _forget( eventName, callback ) {
			Private.verify( this );
			
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
						Public.error({
							type:	'syntax',
							origin:	'Core COM',
							name:	'_forget',
							msg:	'expected a string value (or an Array of strings)'
						});
					}
				});
			}
			
			return Public;
		};
	});
}());