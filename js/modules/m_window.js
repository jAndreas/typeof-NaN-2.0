/**
 * BarFoos Module (Layer 3)
 * -----------------------------------------
 * Window: This module handles all browser window/tab specific tasks. 
 *
 * This code runs in strict mode (if supported by the environment).
 * -----------------------------------------
 * Author: Andreas Goebel
 * Date: 2011-11-10
 * Changed: 2011-11-10
 */

!(function _module_window_wrap( win, doc, undef ) {
	"use strict";
	var BF		= win.BarFoos = win.BarFoos || { },
		Modules	= BF.Modules = BF.Modules || { },
	
	Window = function _Window( Sandbox, App, secret ) {
		secret	= secret || { };
		
		var	Public	= BF.ModuleCtor( Sandbox, App, secret ) || { }, // inherit from "Module Base Pattern"
			Private	= { 
				deploymentData: { 
					rootNode: function _rootNode() {
						return Sandbox.$( win );
					}
				},
				nodes:				{ },
				delayTime:			250,
				currentDimensions:	{ },
				currentOffsets:		{ }
			},
			$$		= Sandbox.$;

		/****** Core Methods (called by the core only) *********** *******/
		/****** ************************************************** *******/
		Public.init = function _init() {
			Sandbox.listen( [	'GetWindowDimensions',
								'GetWindowScrollOffsets' ], Private.eventHandler, this );
			
			Public.deployAs( 'static', Private.deploymentData ).then(function _done( rootNode ) {
				Private.cacheElements( rootNode ).bindDOMevents().initElements();
			}, function _fail( err ) {
				Public.moduleErrorHandler( err ).destroy();
			});
		};
		
		Public.destroy = function _destroy() {
			secret.clearNodeBindings();
			
			Sandbox.forget( [	'GetWindowDimensions',
								'GetWindowScrollOffsets' ], Private.eventHandler );
		};
		/*^^^^^ ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ^^^^^^*/
		/*^^^^^ ^^^^^^^^^^^^^^ BLOCK END ^^^^^^^^^^^^^^^^^^^^^^^^^ ^^^^^^*/
		
		// eventHandler takes care of application level events
		Private.eventHandler = function _eventHandler( event ) {
			var	eventData	= event.data,
				nodes		= secret.nodes,
				rootNode	= nodes.rootNode;
			
			switch( event.name ) {
				case 'GetWindowDimensions':
					event.response = Private.currentDimensions;
					break;
				case 'GetWindowScrollOffsets':
					event.response = Private.currentOffsets;
					break;
			}
		};
		
		// cacheElements() extends secret.nodes with DOM element references
		Private.cacheElements = function _cacheElements( rootNode ) {
			Sandbox.extend( secret.nodes, {
				rootNode:			rootNode
			});
			
			return Private;
		};
		
		// bindDOMevents will take care of browser DOM level events
		Private.bindDOMevents = function _bindDOMevents() {
			var	nodes			= secret.nodes,
				rootNode		= nodes.rootNode,
				scrollBalancer	= null;
			
			if( nodes ) {
				rootNode.bind( 'scroll', function _scrollContentContainer( event ) {
					// "balance" scrolling speed to max 250ms
					Private.areaScrolled = true;
				}).bind( 'resize', function _resizeWindow( event ) {
					// "balance" resizing speed to max 250ms
					Private.windowResized = true;
				}).bind( 'keypress', function _keypressInWindow( event ) {
					// window wide keypress handler
					switch( event.keyCode ) {
						case 27:
							Sandbox.dispatch({ name: 'WindowEscape' });
							return false;
					}
				}).bind( 'beforeunload', function _beforeUnload() {
					// let the application know we are going to leave
					Sandbox.dispatch({ name: 'AppExit' });
				});
			}
			
			return Private;
		};
		
		// initElements should initialize any module related task. Furthermore it is a common module entry point
		Private.initElements = function _initElements() {
			var nodes		= secret.nodes,
				rootNode	= nodes.rootNode;
			
			// "balance" scrolling && resizing event speed to max 250ms
			Private.scrollResizeBalancer = win.setInterval(function _scrollResizeBalancer() {
				if( Private.areaScrolled ) {
					Private.areaScrolled = false;
					
					Private.updateOffsets( rootNode );
					
					Sandbox.dispatch({ name: 'WindowScroll', data: Private.currentOffsets });
				}
				
				if( Private.windowResized ) {
					Private.windowResized = false;
					
					Private.updateDimensions( rootNode );
					
					Sandbox.dispatch({ name: 'WindowResize', data: Private.currentDimensions });
				}
			}, Private.delayTime);
			
			// initialize data for the first time
			Private.updateDimensions( rootNode ).updateOffsets( rootNode );
			
			return Private;
		};
		
		// update window dimensions
		Private.updateDimensions = function _updateDimensions( node ) {
			Private.currentDimensions = {
				width:	node.width(),
				height:	node.height()
			};
			
			return Private;
		};
		
		// update scrollLeft & scrollTop window scroll offsets
		Private.updateOffsets = function _updateOffsets( node ) {
			Sandbox.extend( Private.currentOffsets, {
				scrollTop:		node.scrollTop(),
				scrollLeft:		node.scrollLeft()
			});
			
			return Private;
		}
			
		return Public;
	};
	
	Modules.Window = Window;
}( window, window.document ));
