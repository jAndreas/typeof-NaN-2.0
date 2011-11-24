/**
 * BarFoos Module (Layer 3)
 * -----------------------------------------
 * Box2D: This module handles the center box with help of CSS3 in good old fashion 2D
 *
 * This code runs in strict mode (if supported by the environment).
 * -----------------------------------------
 * Author: Andreas Goebel
 * Date: 2011-11-12
 * Changed: 2011-11-12
 */

!(function _module_box3d_wrap( win, doc, undef ) {
	"use strict";
	var BF		= win.BarFoos = win.BarFoos || { },
		Modules	= BF.Modules = BF.Modules || { },
	
	Box2D = function _Box2D( Sandbox, App, secret ) {
		secret	= secret || { };
		
		var	Public	= BF.ModuleCtor( Sandbox, App, secret ) || { }, // inherit from "Module Base Pattern"
			Private	= { 
				deploymentData: { 
					rootNode: '#box'
				},
				nodes:				{ }
			},
			$$		= Sandbox.$;

		/****** Core Methods (called by the core only) *********** *******/
		/****** ************************************************** *******/
		Public.init = function _init() {
			Sandbox.listen( [	'Dummy' ], Private.eventHandler, this );
			
			Public.deployAs( 'static', Private.deploymentData ).then(function _done( rootNode ) {
				Private.cacheElements( rootNode ).bindDOMevents().initElements();
			}, function _fail( err ) {
				Public.moduleErrorHandler( err ).destroy();
			});
		};
		
		Public.destroy = function _destroy() {
			secret.clearNodeBindings();
			
			Sandbox.forget( [	'Dummy' ], Private.eventHandler );
		};
		/*^^^^^ ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ^^^^^^*/
		/*^^^^^ ^^^^^^^^^^^^^^ BLOCK END ^^^^^^^^^^^^^^^^^^^^^^^^^ ^^^^^^*/
		
		// eventHandler takes care of application level events
		Private.eventHandler = function _eventHandler( event ) {
			var	eventData	= event.data,
				nodes		= secret.nodes,
				rootNode	= nodes.rootNode;
			
			switch( event.name ) {
				case 'Dummy':
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
				rootNode		= nodes.rootNode;
			
			if( nodes ) {
			}
			
			return Private;
		};
		
		// initElements should initialize any module related task. Furthermore it is a common module entry point
		Private.initElements = function _initElements() {
			var nodes		= secret.nodes,
				rootNode	= nodes.rootNode;
			
			alert('Without a webkit browser, there is not much to see for you right now');
			
			return Private;
		};
					
		return Public;
	};
	
	Modules.Box2D = Box2D;
}( window, window.document ));
