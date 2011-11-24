/**
 * BarFoos Module (Layer 3)
 * -----------------------------------------
 * Box3D: This module handles the center box with help of CSS3 in 3D
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
	
	Box3D = function _Box3D( Sandbox, App, secret ) {
		secret	= secret || { };
		
		var	Public	= BF.ModuleCtor( Sandbox, App, secret ) || { }, // inherit from "Module Base Pattern"
			Private	= { 
				deploymentData: 	{ 
					rootNode: '#box'
				},
				nodes:				{ },
				creationData:		[
					[ 0, 0, 0, 'front' ],
					[ 90, 0, 0, 'top' ],
					[ 0, 90, 0, 'right' ],
					[ 0, 180, 0, 'back' ],
					[ 0, -90, 0, 'left' ],
					[ -90, 0, 180, 'bottom' ]
				],
				xAngle:				35,
				yAngle:				0
			},
			$$		= Sandbox.$;

		/****** Core Methods (called by the core only) *********** *******/
		/****** ************************************************** *******/
		Public.init = function _init() {
			Sandbox.listen( [	'Dummy' ], Private.eventHandler, this );
			
			Public.deployAs( 'static', Private.deploymentData ).then(function _done( rootNode ) {
				Private
					.create3DBox( rootNode )
					.cacheElements( rootNode )
					.bindDOMevents()
					.initElements();
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
				rootNode:	rootNode
			});
			
			return Private;
		};
		
		// bindDOMevents will take care of browser DOM level events
		Private.bindDOMevents = function _bindDOMevents() {
			var	nodes			= secret.nodes,
				rootNode		= nodes.rootNode;
			
			if( nodes ) {
				rootNode.on( 'mouseenter', '.boxFace', function _boxFaceMouseEnter( e ) {
					var $$this		= secret.findCachedNode( this ) || $$( this );
					
					$$this.stop( true ).animate({
						opacity:	0.15
					}, 600 );
				}).on( 'mouseleave', '.boxFace', function _boxFaceMouseLeave( e ) {
					var $$this		= secret.findCachedNode( this ) || $$( this );
					
					$$this.stop( true ).animate({
						opacity:	1
					}, 400 );
				});
			}
			
			return Private;
		};
		
		// initElements should initialize any module related task. Furthermore it is a common module entry point
		Private.initElements = function _initElements() {
			var nodes		= secret.nodes,
				rootNode	= nodes.rootNode;
			
			rootNode.css({
				transformStyle:	'preserve-3d'
			}).animate({
				opacity:	0.3
			}, 3000, function _afterOpacity() {
				rootNode.animate({
					transform:	'rotateX(' + Private.xAngle + 'deg) rotateY(' + Private.yAngle + 'deg)',
					opacity:	0.9
				}, 2000, Private.boxRotate);
			});
			
			return Private;
		};
		
		// module specific method
		Private.create3DBox = function _create3DBox( rootNode ) {
			Private.creationData.forEach(function _forEach( side, index ) {
				secret.nodes[ side[ 3 ] ] = $$( '<div>', {
					'class':	'boxFace',
					'css':		{
						transform:	'rotateX(' + side[ 0 ] + 'deg) rotateY(' + side [ 1 ] + 'deg) translateZ(200px) rotate(' + side[ 2 ] + 'deg)'
					}
				}).appendTo( rootNode );
			});
			
			return Private;
		};
		
		Private.boxRotate = function _boxRotate() {
			var nodes		= secret.nodes,
				rootNode	= nodes.rootNode;
				
			Private.xAngle = Private.xAngle * -1;
			Private.yAngle += 340;
		
			rootNode.animate({
				transform:	'rotateX(' + Private.xAngle + 'deg) rotateY(' + Private.yAngle + 'deg)'
			}, 20000, _boxRotate, 'linear');
			
			return Private;
		};
		
		return Public;
	};
	
	Modules.Box3D = Box3D;
}( window, window.document ));
