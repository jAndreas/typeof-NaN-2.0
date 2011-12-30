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
				creationData:		{
					// rotateX, rotateY, rotate, skipInvert
					front:		[ 0, 0, 0 ],
					top:		[ 90, 0, 0 ],
					right:		[ 0, 90, 0 ],
					back:		[ 0, 180, 0 ],
					left:		[ 0, -90, 0 ],
					bottom:		[ -90, 0, 180, true ]
				},
				xAngle:				35,
				yAngle:				0,
				boxSideLocked:		false
			},
			$$		= secret.$$;

		/****** Core Methods (called by the core only) *********** *******/
		/****** ************************************************** *******/
		Public.init = function _init() {
			Sandbox.listen( [	'MenuEntryHovered',
								'MenuEntryLeft',
								'MenuEntryClicked',
								'BoxFaceClicked',
								'ThunderStroke' ], Private.eventHandler, this );
			
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
			
			Sandbox.forget( [	'MenuEntryHovered',
								'MenuEntryLeft',
								'MenuEntryClicked',
								'BoxFaceClicked',
								'ThunderStroke' ], Private.eventHandler );
		};
		/*^^^^^ ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ^^^^^^*/
		/*^^^^^ ^^^^^^^^^^^^^^ BLOCK END ^^^^^^^^^^^^^^^^^^^^^^^^^ ^^^^^^*/
		
		// eventHandler takes care of application level events
		Private.eventHandler = function _eventHandler( event ) {
			var	eventData		= event.data,
				nodes			= secret.nodes,
				rootNode		= nodes.rootNode;
			
			switch( event.name ) {
				case 'MenuEntryHovered':
					rootNode.stop().animate({
						transform:	'rotateX(%rdeg) rotateY(%rdeg) rotate(%rdeg)'.sFormat( Private.mapView( eventData.direction ) )
					}, 1000);
					break;
				case 'MenuEntryLeft':
					if(!Private.boxSideLocked ) {
						Private.boxRotate( 3000, true );
					}
					break;
				case 'MenuEntryClicked':
					Private.boxSideLocked = true;
					rootNode.stop( true, true );
					break;
				case 'BoxFaceClicked':
					Private.boxRotate( 3000 );
					Private.boxSideLocked = false;
					break;
				case 'ThunderStroke':
					Object.keys( nodes ).some(function _forSome( name ) {
						if( name !== 'rootNode' ) {
							nodes[ name ].stop().animate({
								opacity: 0.18
							}, 200, function() {
								$$( this ).animate({
									opacity: 0.75
								}, 200, function() {
									$$( this ).animate({
										opacity: 0.25
									}, 500, function() {
										$$( this ).animate({
											opacity: 0.98
										}, 600);
									}, 'ease');
								}, 'ease');
							}, 'ease');
						}
					});

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
				rootNode.on( 'mouseenter', '.boxFace', function _boxFaceMouseEnter( event ) {
					var $$this		= $$( this );
					
					$$this.css({
						background:	'-webkit-linear-gradient(#12226F,#7FBDDF) repeat scroll 0 0 #005'
					});
					
					return false;
				}).on( 'mouseleave', '.boxFace', function _boxFaceMouseLeave( event ) {
					var $$this		= $$( this );
					
					$$this.css({
						background:	'-webkit-linear-gradient(#12226F, #9FBDD9) repeat scroll 0 0 #005'
					});
					
					return false;
				}).on( 'click', '.boxFace', function _boxFaceClick( event ) {
					Sandbox.dispatch({ name: 'BoxFaceClicked' });
					return false;
				}).on( 'click', 'a', function _anchorClicked( event ) {
					event.stopPropagation();
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
				opacity:	0.15
			}, 800, function _afterOpacity() {
				rootNode.animate({
					transform:	'rotateX(%rdeg) rotateY(%rdeg)'.sFormat( Private.xAngle, Private.yAngle ),
					opacity:	0.98
				}, 800, function _afterBoxPositioning() {
					Sandbox.dispatch({ name: 'BoxInitialized' });
					Private.boxRotate();
				});
			});
			
			if( App.htmlVideo && App.htmlVideo.ogg ) {
				nodes.back.find( 'embed' ).remove();
				nodes.back.find( 'video' )[ 0 ].play();
			}
			else {
				nodes.back.find( 'video' ).remove();
			}
						
			return Private;
		};
		
		// module specific method
		Private.create3DBox = function _create3DBox( rootNode ) {
			var data;
		
			Object.keys( data = Private.creationData ).forEach(function _forEach( side ) {
				secret.nodes[ side ] = $$( '<div>', {
					'class':		'boxFace',
					'transform':	'rotateX(0deg) rotateY(0deg) translateZ(200px) rotate(0deg)',
					'html':			$$( 'div[data-target=' + side + ']' ).html()
				}).appendTo( rootNode ).animate({
					transform:	'rotateX(%rdeg) rotateY(%rdeg) translateZ(200px) rotate(%rdeg)'.sFormat( data[ side ] )
				}, 1800);
			});
			
			return Private;
		};
		
		Private.boxRotate = function _boxRotate( speed, addToQueue ) {
			var nodes		= secret.nodes,
				rootNode	= nodes.rootNode;
		console.log('boxRotate()');
			Private.xAngle = Private.xAngle * -1;
			Private.yAngle += 340;
			
			if(!addToQueue) {
				rootNode.stop();
			}
		
			rootNode.animate({
				transform:	'rotateX(%rdeg) rotateY(%rdeg)'.sFormat( Private.xAngle, Private.yAngle )
			}, speed || 16000, _boxRotate, 'linear');
			
			return Private;
		};
		
		Private.mapView = function _mapView( direction ) {
			var data		= this.creationData[ direction ],
				skipInvert	= data[ 3 ]; 
		
			return data.map(function( value ) { 
				return skipInvert ? value : value * -1;
			});
		};
		
		return Public;
	};
	
	Modules.Box3D = Box3D;
}( window, window.document ));
