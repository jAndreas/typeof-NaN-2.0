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

!(function _module_box2d_wrap( win, doc, undef ) {
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
			$$		= secret.$$;

		/****** Core Methods (called by the core only) *********** *******/
		/****** ************************************************** *******/
		Public.init = function _init() {
			Sandbox.listen( [	'MenuEntryHovered',
								'MenuEntryLeft' ], Private.eventHandler, this );
			
			Public.deployAs( 'static', Private.deploymentData ).then(function _done( rootNode ) {
				Private.cacheElements( rootNode ).bindDOMevents().initElements();
			}, function _fail( err ) {
				Public.moduleErrorHandler( err ).destroy();
			});
		};
		
		Public.destroy = function _destroy() {
			secret.clearNodeBindings();
			
			Sandbox.forget( [	'MenuEntryHovered',
								'MenuEntryLeft' ], Private.eventHandler );
		};
		/*^^^^^ ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ^^^^^^*/
		/*^^^^^ ^^^^^^^^^^^^^^ BLOCK END ^^^^^^^^^^^^^^^^^^^^^^^^^ ^^^^^^*/
		
		// eventHandler takes care of application level events
		Private.eventHandler = function _eventHandler( event ) {
			var	eventData	= event.data,
				nodes		= secret.nodes,
				rootNode	= nodes.rootNode;
			
			switch( event.name ) {
				case 'MenuEntryHovered':
					break;
				case 'MenuEntryLeft':
					break;
			}
		};
		
		// cacheElements() extends secret.nodes with DOM element references
		Private.cacheElements = function _cacheElements( rootNode ) {
			Sandbox.extend( secret.nodes, (function _extendClosure() {
				
				return {
					rootNode:		rootNode
				};
			}()));
			
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
			
			rootNode.addClass( 'boxFace' ).css({
				width:		'100%',
				padding:	'0px'
			});
			
			Private.fadeAway();
			
			return Private;
		};
		
		Private.fadeAway = function _fadeAway() {
			var nodes		= secret.nodes,
				rootNode	= nodes.rootNode;
				
			(function _loop() {
				var clone = rootNode.clone();
				
				clone.removeAttr( 'id' ).css({
					position:	'absolute',
					top:		rootNode.position().top,
					left:		rootNode.position().left,
					width:		rootNode.outerWidth( true ),
					height:		rootNode.outerHeight( true ) - win.parseInt( rootNode.css( 'margin-top' ), 10 ),
					zIndex:		-1,
					opacity:	0.65
				}).appendTo( rootNode.parent() ).animate({
					transform:	'scale(1.2,1.2) skew(11deg, -6deg)',
					opacity:	0
				}, 11000, function _animateDone() {
					clone.remove();
					_loop();
				});
			}());
		};
					
		return Public;
	};
	
	Modules.Box2D = Box2D;
}( window, window.document ));
