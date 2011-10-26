/**
 * Javascript Module (Layer 3)
 * -----------------------------------------
 * Window: manages all window related tasks
 *
 * This code runs in strict mode (if supported by the environment).
 * -----------------------------------------
 * Author: Andreas Goebel
 * Date: 2011-07-22
 * Changed: 2011-07-22
 */

!(function _module_window_wrap( win, doc, undef ) {
	"use strict";
	var	BF		= win.BarFoos = win.BarFoos || { },
		Modules = BF.Modules = BF.Modules || { },
	
	Window = function _Window( Sandbox, App, secret ) {
		secret	= secret || { };
		
		var	Public	= BF.ModuleCtor( Sandbox, App, secret ) || { }, // inherit from "Module Base Pattern"
			Private	= { 
				deploymentData: {
					rootNode: 'window'
				}
			};

		/****** Core Methods (called by the core only) *********** *******/
		/****** ************************************************** *******/
		Public.init = function _init() {
			Sandbox.listen( [ 'EXAMPLE_EVENT_1' ], Private.eventHandler, this );
			
			Public.deployAs( 'static', Private.deploymentData ).then( function _done( rootNode ) {
				Private.cacheElements( rootNode ).bindDOMevents().initElements();
			}, function _fail( err ) {
				Public.moduleErrorHandler( err ).destroy();
			});
		};
		
		Public.destroy = function _destroy() {
			secret.clearNodeBindings();
			
			Sandbox.forget( [ 'EXAMPLE_EVENT_1' ], Private.eventHandler );
		};
		/*^^^^^ ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ^^^^^^*/
		/*^^^^^ ^^^^^^^^^^^^^^ BLOCK END ^^^^^^^^^^^^^^^^^^^^^^^^^ ^^^^^^*/
		
		// eventHandler takes care of application level events
		Private.eventHandler = function _eventHandler( event ) {
			var	eventData	= event.data,
				nodes		= secret.nodes;
			
			switch( event.name ) {
				case 'EXAMPLE_EVENT_1':
					break;
			}
		};
		
		// cacheElements() extends secret.nodes with DOM element references
		Private.cacheElements = function _cacheElements( rootNode ) {
			Sandbox.extend( secret.nodes, (function _acquireNodes() {	
				return {
					rootNode:		rootNode
				};
			}()));
			
			return Private;
		};
		
		// bindDOMevents will take care of browser DOM level events
		Private.bindDOMevents = function _bindDOMevents() {
			var nodes = secret.nodes;
			
			if( nodes ) {
				nodes.rootNode.bind( 'resize', function( event ) {
					Sandbox.dispatch({ name: 'WINDOW_RESIZED', data: {
						originalEvent:	event
					}});
				});
			}
			
			return Private;
		};
		
		Private.initElements = function _initElements() {
			alert('window module init');
			console.log('¯\_(ツ)_/¯');
			
			return Private;
		};
			
		return Public;
	};
	
	Modules.Window = Window;
}( window, window.document ));
