/**
 * BarFoos Module (Layer 3)
 * -----------------------------------------
 * Navigation: This module handles the top navigation
 *
 * This code runs in strict mode (if supported by the environment).
 * -----------------------------------------
 * Author: Andreas Goebel
 * Date: 2011-12-05
 * Changed: 2011-12-05
 */

!(function _module_navigation_wrap( win, doc, undef ) {
	"use strict";
	var BF		= win.BarFoos = win.BarFoos || { },
		Modules	= BF.Modules = BF.Modules || { },
	
	Navigation = function _Navigation( Sandbox, App, secret ) {
		secret	= secret || { };
		
		var	Public	= BF.ModuleCtor( Sandbox, App, secret ) || { }, // inherit from "Module Base Pattern"
			Private	= { 
				deploymentData: { 
					rootNode: '#menu'
				},
				nodes:			{ }
			},
			$$		= secret.$$;

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
			Sandbox.extend( secret.nodes, (function _extendClosure() {
				var ulMenu			= rootNode.find( 'ul.menuentrys' ),
					liAbout			= ulMenu.find( 'li.about' ),
					liBlog			= ulMenu.find( 'li.blog' ),
					liGithub		= ulMenu.find( 'li.github' ),
					liAwesomeness	= ulMenu.find( 'li.awesomeness' );
				
				return {
					rootNode:		rootNode,
					ulMenu:			ulMenu,
					liAbout:		liAbout,
					liBlog:			liBlog,
					liGithub:		liGithub,
					liAwesomeness:	liAwesomeness
				};
			}()));
			
			return Private;
		};
		
		// bindDOMevents will take care of browser DOM level events
		Private.bindDOMevents = function _bindDOMevents() {
			var	nodes			= secret.nodes,
				ulMenu			= nodes.ulMenu;
			
			if( nodes ) {
				ulMenu
					.on( 'mouseenter', 'li', function _delegateMouseEnter( event ) {
						var $$this = $$( this );
						
						Sandbox.dispatch({ name: 'MenuEntryHovered', data: {
							direction:	$$this.data( 'view' )
						}});
				})
					.on( 'mouseleave', 'li', function _delegateMouseLeave( event ) {
						Sandbox.dispatch({ name: 'MenuEntryLeft' });
				});
			}
			
			return Private;
		};
		
		// initElements should initialize any module related task. Furthermore it is a common module entry point
		Private.initElements = function _initElements() {
			var nodes		= secret.nodes,
				rootNode	= nodes.rootNode;
			
			return Private;
		};
					
		return Public;
	};
	
	Modules.Navigation = Navigation;
}( window, window.document ));
