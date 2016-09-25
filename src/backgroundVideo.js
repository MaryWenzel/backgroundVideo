 /*!
  * backgroundVideo v2.0.0
  * https://github.com/linnett/backgroundVideo
  * Use HTML5 video to create an effect like the CSS property, 'background-size: cover'. Includes parallax option.
  *
  * Copyright 2016 Sam Linnett
  * @license http://www.opensource.org/licenses/mit-license.html MIT License
  * @license http://www.gnu.org/licenses/gpl.html GPL2 License
  *
  */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['buoy'], factory(root));
  } else if (typeof exports === 'object') {
    module.exports = factory(require('buoy'));
  } else {
    root.backgroundVideo = factory(root, root.buoy);
  }
})(typeof global !== "undefined" ? global : this.window || this.global, function(root) {

  'use strict';

  //
  // Variables
  //

  const backgroundVideo = {}; // Object for public APIs
  const supports = !!document.querySelector && !!root.addEventListener; // Feature test
  const settings; // Placeholder variables

  // Default settings
  const defaults = {
    video: '.background-video',
    outerWrap: window,
    preventContextMenu: false,
    parallax: true,
    parallaxOptions: {
      effect: 1.5
    },
    pauseVideoOnViewLoss: false

    someVar: 123,
    initClass: 'js-backgroundVideo',
    callbackBefore: function() {},
    callbackAfter: function() {}
  };


  //
  // Methods
  //

  // @todo add plugin methods here

  /**
   * Handle events
   * @private
   */
  var eventHandler = function(event) {
    // @todo Do something on event
  };

  /**
   * Destroy the current initialization.
   * @public
   */
  backgroundVideo.destroy = function() {

    // If plugin isn't already initialized, stop
    if (!settings) return;

    // Remove init class for conditional CSS
    document.documentElement.classList.remove(settings.initClass);

    // @todo Undo any other init functions...

    // Remove event listeners
    document.removeEventListener('click', eventHandler, false);

    // Reset variables
    settings = null;

  };

  /**
   * Initialize Plugin
   * @public
   * @param {Object} options User settings
   */
  backgroundVideo.init = function(src, options) {

    // feature test
    if (!supports) return;

    // Destroy any existing initializations
    backgroundVideo.destroy();

    // Merge user options with defaults
    settings = buoy.extend(defaults, options || {});

    // Add class to HTML element to activate conditional CSS
    document.documentElement.classList.add(settings.initClass);

    // @todo Do stuff...

    // Listen for click events
    document.addEventListener('click', eventHandler, false);

  };


  //
  // Public APIs
  //

  return backgroundVideo;

});
