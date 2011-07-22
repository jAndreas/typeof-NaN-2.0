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
			Public.deployAs( 'static', Private.deploymentData ).done( Private.cacheElements );
			
			Sandbox.listen( [ 'EXAMPLE_EVENT_1' ], Private.eventHandler, this );
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
				//var EXAMPLE_NODE	= rootNode.find('#EXAMPLE_NODE'),
				//	FOO_BAR			= rootNode.find('#FOO_BAR');
					
				return {
					rootNode:		rootNode
					//EXAMPLE_NODE:	EXAMPLE_NODE,
					//FOO_BAR:		FOO_BAR
				};
			}()));
			
			Private.bindDOMevents();
			Private.initElements();
		};
		
		// bindDOMevents will take care of browser DOM level events
		Private.bindDOMevents = function _bindDOMevents() {
			var nodes = secret.nodes;
			
			if( nodes ) {
				nodes.rootNode.bind( 'mouseleave', function( event ) {
					Sandbox.dispatch({ name: 'DISPATCH_EXAMPLE_EVENT', data: {
						targetNode:		nodes.rootNode,
						originalEvent:	event
					}});
				});
			}
		};
		
		Private.initElements = function _initElements() {
		};
			
		return Public;
	};
	
	Modules.Window = Window;
}( window, window.document ));
