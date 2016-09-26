/*!
 * backgroundVideo v2.0.0
 * https://github.com/linnett/backgroundVideo
 * Use HTML5 video to create an effect like the CSS property, 'background-size: cover'. Includes parallax option.
 *
 * Copyright 2016 Sam Linnett <linnettsam@gmail.com>
 * @license http://www.opensource.org/licenses/mit-license.html MIT License
 */

(function(root, factory) {
  const pluginName = 'BackgroundVideo';

  if (typeof define === 'function' && define.amd) {
    define([], factory(pluginName));
  } else if (typeof exports === 'object') {
    module.exports = factory(pluginName);
  } else {
    root[pluginName] = factory(pluginName);
  }
}(this, function(pluginName) {
  'use strict';

  /**
   * Default options
   */
  const defaults = {
    parallax: {
      effect: 1.5
    },
    pauseVideoOnViewLoss: false
  };

  /**
   * Some private helper function
   */
  const addClass = function (el, className) {
    if (el.classList) {
      el.classList.add(className);
    }
    else {
      el.className += ' ' + className;
    }
  };

  const removeClass = function (el, className) {
    if (el.classList) {
      el.classList.remove(className);
    }
    else {
      el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  };

  /**
   * @class Plugin
   *
   * BackgroundVideo class
   */
  class Plugin {
    /**
     * Class constructor method
     *
     * @method constructor
     * @params {object} options - object passed in to override default class options
     */
    constructor(element, options) {
      this.element = document.querySelectorAll(element);
      this.options = Object.assign({}, defaults, options);

      // Set browser prefix option
      this.options.browserPrexix = this.detectBrowser();
      // Ensure requestAnimationFrame is available
      this.shimRequestAnimationFrame();
      // Detect 3d transforms
      this.options.has3d = this.detect3d();
      // Loop through each video and init

      for(let i = 0; i < this.element.length; i++) {
        this.init(this.element[i]);
      }
    }

    /**
     * Init the plugin
     *
     * @method init
     * @params element
     */
    init(element) {
      this.el = element;

      this.setVideoWrap();
      this.setVideoProperties()
      this.insertVideos();

    }

    setVideoWrap() {
      const wrapper = document.createElement('div');

      wrapper.style.position = 'relative';
      wrapper.style.overflow = 'hidden';
      wrapper.style.zIndex = '10';

      this.el.parentNode.insertBefore(wrapper, this.el);
      wrapper.appendChild(this.el);
    }

    setVideoProperties() {
      this.el.setAttribute('preload', 'metadata');
      this.el.setAttribute('loop', 'true');
      this.el.setAttribute('autoplay', 'true');
      this.el.style.position = 'absolute';
      this.el.style.zIndex = '1';
    }

    insertVideos() {
      // Add video sources
      for(let i = 0; i < this.options.src.length; i++) {
        let videoTypeArr = this.options.src[i].split('.');
        let videoType = videoTypeArr[videoTypeArr.length - 1];

        this.addSourceToVideo(this.options.src[i], `video/${videoType}`);
      }
    }

    addSourceToVideo(src, type) {
      const source = document.createElement('source');

      source.src = src;
      source.type = type;

      this.el.appendChild(source);
    }

    detectBrowser() {
      const val = navigator.userAgent.toLowerCase();
      let browserPrexix;

      if (val.indexOf('chrome') > -1 || val.indexOf('safari') > -1) {
        browserPrexix = '-webkit-';
      } else if (val.indexOf('firefox') > -1) {
        browserPrexix = '-moz-';
      } else if (val.indexOf('MSIE') !== -1 || val.indexOf('Trident/') > 0) {
        browserPrexix = '-ms-';
      } else if (val.indexOf('Opera') > -1) {
        browserPrexix = '-o-';
      }

      return browserPrexix;
    }

    shimRequestAnimationFrame() {
      /* Paul Irish rAF.js: https://gist.github.com/paulirish/1579671 */
      var lastTime = 0;
      var vendors = ['ms', 'moz', 'webkit', 'o'];

      for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
      }

      if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
          var currTime = new Date().getTime();
          var timeToCall = Math.max(0, 16 - (currTime - lastTime));
          var id = window.setTimeout(function() { callback(currTime + timeToCall); },
            timeToCall);
          lastTime = currTime + timeToCall;
          return id;
        };

      if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
          clearTimeout(id);
        };
    }

    detect3d() {
      var el = document.createElement('p'),
        t, has3d,
        transforms = {
          'WebkitTransform': '-webkit-transform',
          'OTransform': '-o-transform',
          'MSTransform': '-ms-transform',
          'MozTransform': '-moz-transform',
          'transform': 'transform'
        };

      document.body.insertBefore(el, document.body.lastChild);

      for (t in transforms) {
        if (el.style[t] !== undefined) {
          el.style[t] = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)';
          has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
        }
      }

      el.parentNode.removeChild(el);

      if (has3d !== undefined) {
        return has3d !== 'none';
      } else {
        return false;
      }
    }

  }


  // Add lightweight jQuery wrapper, if available
  if (window.jQuery) {
    const $ = window.jQuery;

    $.fn[pluginName] = function(options) {
      options = options || {};

      return this.each(function() {
        // add plugin to element data
        if (!$.data(this, 'plugin_' + pluginName)) {
          options.element = this;
          $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
        }
      });
    };
  }


  return Plugin;
}));
