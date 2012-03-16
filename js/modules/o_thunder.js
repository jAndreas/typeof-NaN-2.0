/**
 * BarFoos Module (Layer 3)
 * -----------------------------------------
 * Thunde: This module handles the ambient thunder sounds
 *
 * This code runs in strict mode (if supported by the environment).
 * -----------------------------------------
 * Author: Andreas Goebel
 * Date: 2011-12-26
 * Changed: 2011-12-26
 */

!(function _module_thunder_wrap( win, doc, undef ) {
	"use strict";
	var BF		= win.BarFoos = win.BarFoos || { },
		Modules	= BF.Modules = BF.Modules || { },
	
	Thunder = function _Thunder( Sandbox, App, secret ) {
		secret	= secret || { };
		
		var	Public	= BF.ModuleCtor( Sandbox, App, secret ) || { }, // inherit from "Module Base Pattern"
			Private	= { 
				deploymentData: { 
					targetContainer:	doc.body,
					htmlString:			'<audio autoplay src=""></audio>'
				},
				nodes:			{ },
				thunderDelay:	15000,
				thunderRand:	7000,
				thunderSounds:	[ '/sound/storm-thunder.wav', '/sound/thunder.wav', '/sound/thunder2.wav' ]
			},
			$$		= secret.$$;

		/****** Core Methods (called by the core only) *********** *******/
		/****** ************************************************** *******/
		Public.init = function _init() {
			Sandbox.listen( [	'BoxInitialized' ], Private.eventHandler, this );
			
			Public.deployAs( 'dynamic', Private.deploymentData ).then(function _done( rootNode ) {
				Private.cacheElements( rootNode ).bindDOMevents().initElements();
			}, function _fail( err ) {
				Public.moduleErrorHandler( err ).destroy();
			});
		};
		
		Public.destroy = function _destroy() {
			secret.clearNodeBindings();
			
			Sandbox.forget( [	'BoxInitialized' ], Private.eventHandler );
		};
		/*^^^^^ ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ^^^^^^*/
		/*^^^^^ ^^^^^^^^^^^^^^ BLOCK END ^^^^^^^^^^^^^^^^^^^^^^^^^ ^^^^^^*/
		
		// eventHandler takes care of application level events
		Private.eventHandler = function _eventHandler( event ) {
			var	eventData	= event.data,
				nodes		= secret.nodes,
				rootNode	= nodes.rootNode;
			
			switch( event.name ) {
				case 'BoxInitialized':
					Private.storm.call( rootNode );
					break;
			}
		};
		
		// cacheElements() extends secret.nodes with DOM element references
		Private.cacheElements = function _cacheElements( rootNode ) {
			Sandbox.extend( secret.nodes, (function _extendClosure() {
				//var ulMenu			= rootNode.find( 'ul.menuentrys' );
				
				return {
					rootNode:		rootNode
				};
			}()));
			
			return Private;
		};
		
		// bindDOMevents will take care of browser DOM level events
		Private.bindDOMevents = function _bindDOMevents() {
			var	nodes			= secret.nodes,
				ulMenu			= nodes.ulMenu;
			
			if( nodes ) {
				
			}
			
			return Private;
		};
		
		// initElements should initialize any module related task. Furthermore it is a common module entry point
		Private.initElements = function _initElements() {
			var nodes		= secret.nodes,
				rootNode	= nodes.rootNode;
			
			return Private;
		};
		
		Private.storm = function _storm() {
			var rootNode	= this;
		
			win.setTimeout(function _thunderTimeout() {
				rootNode[ 0 ].src = Private.thunderSounds[ ~~(Math.random() * Private.thunderSounds.length) ];
				
				Sandbox.dispatch({ name: 'ThunderStroke' });
				
				_storm.call( rootNode );
			}, Private.thunderDelay + Math.random() * Private.thunderRand );
		};
					
		return Public;
	};
	
	Modules.Thunder = Thunder;
}( window, window.document ));
