(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["cytoscapeCompoundCollapse"] = factory();
	else
		root["cytoscapeCompoundCollapse"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var collapseImpl = __webpack_require__(1);
var expandImpl = __webpack_require__(2);

var api = {
  isCollapsed: function isCollapsed(node) {
    return node.data('compoundCollapse.collapsed');
  },
  isExpanded: function isExpanded(node) {
    return !this.isCollapsed(node);
  },
  isMetaEdge: function isMetaEdge(edge) {
    return edge.hasClass('compoundcollapse-meta-edge');
  },
  collapse: function collapse(eles) {
    var _this = this;

    eles.filter(function (ele) {
      return _this.isExpanded(ele);
    }).forEach(function (ele) {
      return collapseImpl(ele);
    });
  },
  expand: function expand(eles) {
    var _this2 = this;

    eles.filter(function (ele) {
      return _this2.isCollapsed(ele);
    }).forEach(function (ele) {
      return expandImpl(ele);
    });
  }
};

module.exports = api;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var addMetaEdges = function addMetaEdges(collapsedNode) {
  var descendants = collapsedNode.children();
  var metaEdgeCandidates = descendants.connectedEdges();

  metaEdgeCandidates.forEach(function (edge) {
    if (!descendants.contains(edge.source())) {
      collapsedNode.cy().add({
        group: 'edges',
        data: {
          source: edge.source().id(),
          target: collapsedNode.id()
        },
        classes: 'compoundcollapse-meta-edge'
      });
    }

    if (!descendants.contains(edge.target())) {
      collapsedNode.cy().add({
        group: 'edges',
        data: {
          target: edge.target().id(),
          source: collapsedNode.id()
        },
        classes: 'compoundcollapse-meta-edge'
      });
    }
  });
};

var collapseCore = function collapseCore(node) {
  node.data('compoundCollapse.collapsed', true);
  node.data('compoundCollapse.sizeBefore', node.layoutDimensions({}));

  var compoundChildren = node.children().filter(function (ele) {
    return ele.isParent();
  });
  compoundChildren.forEach(function (child) {
    return collapseCore(child);
  });

  addMetaEdges(node);
  var collapsedCollection = node.children().union(node.children().connectedEdges());

  node.data('compoundCollapse.collapsedCollection', collapsedCollection);
  collapsedCollection.remove();
  node.data('compoundCollapse.sizeAfter', node.layoutDimensions({}));
  node.addClass('compoundcollapse-collapsed-node');
};

var collapse = function collapse(node, opts) {
  node.trigger('compoundCollapse.beforeCollapse');
  collapseCore(node);
  node.trigger('compoundCollapse.afterCollapse');
};

module.exports = collapse;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var removeMetaEdges = function removeMetaEdges(node) {
  node.connectedEdges('.compoundcollapse-meta-edge').remove();
};

var expand = function expand(node, opts) {
  node.trigger('compoundCollapse.beforeExpand');

  node.data('compoundCollapse.collapsed', false);
  removeMetaEdges(node);
  node.data('compoundCollapse.collapsedCollection').positions(node.position());
  node.data('compoundCollapse.collapsedCollection').restore();
  node.removeData('compoundCollapse.collapsedCollection');
  node.removeClass('compoundcollapse-collapsed-node');
  node.trigger('compoundCollapse.afterExpand');
};

module.exports = expand;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var impl = __webpack_require__(0);

// registers the extension on a cytoscape lib ref
var register = function register(cytoscape) {
  if (!cytoscape) {
    return;
  } // can't register if cytoscape unspecified

  cytoscape('collection', 'collapse', function () {
    var eles = this;
    impl.collapse(eles);

    return this;
  }); // register with cytoscape.js

  cytoscape('collection', 'expand', function () {
    var eles = this;
    impl.expand(eles);

    return this;
  });

  cytoscape('collection', 'isCollapsed', function () {
    var eles = this;
    var node = eles[0];

    return impl.isCollapsed(node);
  });

  cytoscape('collection', 'isExpanded', function () {
    var eles = this;
    var node = eles[0];

    return impl.isExpanded(node);
  });

  cytoscape('collection', 'metaEdges', function () {
    var eles = this;

    return eles.edges().filter(function (edge) {
      return impl.isMetaEdge(edge);
    });
  });
};

if (typeof cytoscape !== 'undefined') {
  // expose to global cytoscape (i.e. window.cytoscape)
  register(cytoscape);
}

module.exports = register;

/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBhZGQ3ZDA5NTZlOGVkNDEwMzIxYiIsIndlYnBhY2s6Ly8vLi9zcmMvY29sbGVjdGlvbi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29sbGVjdGlvbi9jb2xsYXBzZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29sbGVjdGlvbi9leHBhbmQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbImNvbGxhcHNlSW1wbCIsInJlcXVpcmUiLCJleHBhbmRJbXBsIiwiYXBpIiwiaXNDb2xsYXBzZWQiLCJub2RlIiwiZGF0YSIsImlzRXhwYW5kZWQiLCJpc01ldGFFZGdlIiwiZWRnZSIsImhhc0NsYXNzIiwiY29sbGFwc2UiLCJlbGVzIiwiZmlsdGVyIiwiZWxlIiwiZm9yRWFjaCIsImV4cGFuZCIsIm1vZHVsZSIsImV4cG9ydHMiLCJhZGRNZXRhRWRnZXMiLCJjb2xsYXBzZWROb2RlIiwiZGVzY2VuZGFudHMiLCJjaGlsZHJlbiIsIm1ldGFFZGdlQ2FuZGlkYXRlcyIsImNvbm5lY3RlZEVkZ2VzIiwiY29udGFpbnMiLCJzb3VyY2UiLCJjeSIsImFkZCIsImdyb3VwIiwiaWQiLCJ0YXJnZXQiLCJjbGFzc2VzIiwiY29sbGFwc2VDb3JlIiwibGF5b3V0RGltZW5zaW9ucyIsImNvbXBvdW5kQ2hpbGRyZW4iLCJpc1BhcmVudCIsImNoaWxkIiwiY29sbGFwc2VkQ29sbGVjdGlvbiIsInVuaW9uIiwicmVtb3ZlIiwiYWRkQ2xhc3MiLCJvcHRzIiwidHJpZ2dlciIsInJlbW92ZU1ldGFFZGdlcyIsInBvc2l0aW9ucyIsInBvc2l0aW9uIiwicmVzdG9yZSIsInJlbW92ZURhdGEiLCJyZW1vdmVDbGFzcyIsImltcGwiLCJyZWdpc3RlciIsImN5dG9zY2FwZSIsImVkZ2VzIl0sIm1hcHBpbmdzIjoiQUFBQTtB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QUFFQSxXQUFPc0MsS0FBSzlDLFdBQUwsQ0FBaUJDLElBQWpCLENBQVA7QUFDRCxHQUxEOztBQU9BK0MsWUFBVyxZQUFYLEVBQXlCLFlBQXpCLEVBQXVDLFlBQVk7QUFDakQsUUFBTXhDLE9BQU8sSUFBYjtBQUNBLFFBQU1QLE9BQU9PLEtBQUssQ0FBTCxDQUFiOztBQUVBLFdBQU9zQyxLQUFLM0MsVUFBTCxDQUFnQkYsSUFBaEIsQ0FBUDtBQUNELEdBTEQ7O0FBT0ErQyxZQUFXLFlBQVgsRUFBeUIsV0FBekIsRUFBc0MsWUFBWTtBQUNoRCxRQUFNeEMsT0FBTyxJQUFiOztBQUVBLFdBQU9BLEtBQUt5QyxLQUFMLEdBQWF4QyxNQUFiLENBQW9CO0FBQUEsYUFBUXFDLEtBQUsxQyxVQUFMLENBQWdCQyxJQUFoQixDQUFSO0FBQUEsS0FBcEIsQ0FBUDtBQUNELEdBSkQ7QUFNRCxDQXJDRDs7QUF1Q0EsSUFBSSxPQUFPMkMsU0FBUCxLQUFxQixXQUF6QixFQUFzQztBQUFFO0FBQ3RDRCxXQUFVQyxTQUFWO0FBQ0Q7O0FBRURuQyxPQUFPQyxPQUFQLEdBQWlCaUMsUUFBakIsQyIsImZpbGUiOiJjeXRvc2NhcGUtY29tcG91bmQtY29sbGFwc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJjeXRvc2NhcGVDb21wb3VuZENvbGxhcHNlXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcImN5dG9zY2FwZUNvbXBvdW5kQ29sbGFwc2VcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiBcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAzKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBhZGQ3ZDA5NTZlOGVkNDEwMzIxYiIsImNvbnN0IGNvbGxhcHNlSW1wbCA9IHJlcXVpcmUoJy4vY29sbGFwc2UnKTtcbmNvbnN0IGV4cGFuZEltcGwgPSByZXF1aXJlKCcuL2V4cGFuZCcpO1xuXG5jb25zdCBhcGkgPSB7XG4gIGlzQ29sbGFwc2VkIChub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUuZGF0YSgnY29tcG91bmRDb2xsYXBzZS5jb2xsYXBzZWQnKTtcbiAgfSxcbiAgaXNFeHBhbmRlZCAobm9kZSkge1xuICAgIHJldHVybiAhdGhpcy5pc0NvbGxhcHNlZChub2RlKTtcbiAgfSxcbiAgaXNNZXRhRWRnZSAoZWRnZSkge1xuICAgIHJldHVybiBlZGdlLmhhc0NsYXNzKCdjb21wb3VuZGNvbGxhcHNlLW1ldGEtZWRnZScpO1xuICB9LFxuICBjb2xsYXBzZSAoZWxlcykge1xuICAgIGVsZXMuZmlsdGVyKGVsZSA9PiB0aGlzLmlzRXhwYW5kZWQoZWxlKSkuZm9yRWFjaChlbGUgPT4gY29sbGFwc2VJbXBsKGVsZSkpO1xuICB9LFxuICBleHBhbmQgKGVsZXMpIHtcbiAgICBlbGVzLmZpbHRlcihlbGUgPT4gdGhpcy5pc0NvbGxhcHNlZChlbGUpKS5mb3JFYWNoKGVsZSA9PiBleHBhbmRJbXBsKGVsZSkpO1xuICB9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gYXBpO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb2xsZWN0aW9uL2luZGV4LmpzIiwiY29uc3QgYWRkTWV0YUVkZ2VzID0gKGNvbGxhcHNlZE5vZGUpID0+IHtcbiAgY29uc3QgZGVzY2VuZGFudHMgPSBjb2xsYXBzZWROb2RlLmNoaWxkcmVuKCk7XG4gIGNvbnN0IG1ldGFFZGdlQ2FuZGlkYXRlcyA9IGRlc2NlbmRhbnRzLmNvbm5lY3RlZEVkZ2VzKCk7XG5cbiAgbWV0YUVkZ2VDYW5kaWRhdGVzLmZvckVhY2goKGVkZ2UpID0+IHtcbiAgICBpZiAoIWRlc2NlbmRhbnRzLmNvbnRhaW5zKGVkZ2Uuc291cmNlKCkpKSB7XG4gICAgICBjb2xsYXBzZWROb2RlLmN5KCkuYWRkKHtcbiAgICAgICAgZ3JvdXA6ICdlZGdlcycsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBzb3VyY2U6IGVkZ2Uuc291cmNlKCkuaWQoKSxcbiAgICAgICAgICB0YXJnZXQ6IGNvbGxhcHNlZE5vZGUuaWQoKVxuICAgICAgICB9LFxuICAgICAgICBjbGFzc2VzOiAnY29tcG91bmRjb2xsYXBzZS1tZXRhLWVkZ2UnXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoIWRlc2NlbmRhbnRzLmNvbnRhaW5zKGVkZ2UudGFyZ2V0KCkpKSB7XG4gICAgICBjb2xsYXBzZWROb2RlLmN5KCkuYWRkKHtcbiAgICAgICAgZ3JvdXA6ICdlZGdlcycsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICB0YXJnZXQ6IGVkZ2UudGFyZ2V0KCkuaWQoKSxcbiAgICAgICAgICBzb3VyY2U6IGNvbGxhcHNlZE5vZGUuaWQoKVxuICAgICAgICB9LFxuICAgICAgICBjbGFzc2VzOiAnY29tcG91bmRjb2xsYXBzZS1tZXRhLWVkZ2UnXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufTtcblxuY29uc3QgY29sbGFwc2VDb3JlID0gKG5vZGUpID0+IHtcbiAgbm9kZS5kYXRhKCdjb21wb3VuZENvbGxhcHNlLmNvbGxhcHNlZCcsIHRydWUpO1xuICBub2RlLmRhdGEoJ2NvbXBvdW5kQ29sbGFwc2Uuc2l6ZUJlZm9yZScsIG5vZGUubGF5b3V0RGltZW5zaW9ucyh7fSkpO1xuXG4gIGNvbnN0IGNvbXBvdW5kQ2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuKCkuZmlsdGVyKChlbGUpID0+IGVsZS5pc1BhcmVudCgpKTtcbiAgY29tcG91bmRDaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4gY29sbGFwc2VDb3JlKGNoaWxkKSk7XG5cbiAgYWRkTWV0YUVkZ2VzKG5vZGUpO1xuICBjb25zdCBjb2xsYXBzZWRDb2xsZWN0aW9uID0gbm9kZS5jaGlsZHJlbigpLnVuaW9uKG5vZGUuY2hpbGRyZW4oKS5jb25uZWN0ZWRFZGdlcygpKTtcbiAgXG4gIG5vZGUuZGF0YSgnY29tcG91bmRDb2xsYXBzZS5jb2xsYXBzZWRDb2xsZWN0aW9uJywgY29sbGFwc2VkQ29sbGVjdGlvbik7XG4gIGNvbGxhcHNlZENvbGxlY3Rpb24ucmVtb3ZlKCk7XG4gIG5vZGUuZGF0YSgnY29tcG91bmRDb2xsYXBzZS5zaXplQWZ0ZXInLCBub2RlLmxheW91dERpbWVuc2lvbnMoe30pKTtcbiAgbm9kZS5hZGRDbGFzcygnY29tcG91bmRjb2xsYXBzZS1jb2xsYXBzZWQtbm9kZScpO1xufTtcblxuXG5jb25zdCBjb2xsYXBzZSA9IChub2RlLCBvcHRzKSA9PiB7XG4gIG5vZGUudHJpZ2dlcignY29tcG91bmRDb2xsYXBzZS5iZWZvcmVDb2xsYXBzZScpO1xuICBjb2xsYXBzZUNvcmUobm9kZSk7XG4gIG5vZGUudHJpZ2dlcignY29tcG91bmRDb2xsYXBzZS5hZnRlckNvbGxhcHNlJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbGxhcHNlO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb2xsZWN0aW9uL2NvbGxhcHNlLmpzIiwiY29uc3QgcmVtb3ZlTWV0YUVkZ2VzID0gKG5vZGUpID0+IHtcbiAgbm9kZS5jb25uZWN0ZWRFZGdlcygnLmNvbXBvdW5kY29sbGFwc2UtbWV0YS1lZGdlJykucmVtb3ZlKCk7XG59O1xuXG5jb25zdCBleHBhbmQgPSAobm9kZSwgb3B0cykgPT4ge1xuICBub2RlLnRyaWdnZXIoJ2NvbXBvdW5kQ29sbGFwc2UuYmVmb3JlRXhwYW5kJyk7XG4gXG4gIG5vZGUuZGF0YSgnY29tcG91bmRDb2xsYXBzZS5jb2xsYXBzZWQnLCBmYWxzZSk7XG4gIHJlbW92ZU1ldGFFZGdlcyhub2RlKTtcbiAgbm9kZS5kYXRhKCdjb21wb3VuZENvbGxhcHNlLmNvbGxhcHNlZENvbGxlY3Rpb24nKS5wb3NpdGlvbnMobm9kZS5wb3NpdGlvbigpKTtcbiAgbm9kZS5kYXRhKCdjb21wb3VuZENvbGxhcHNlLmNvbGxhcHNlZENvbGxlY3Rpb24nKS5yZXN0b3JlKCk7XG4gIG5vZGUucmVtb3ZlRGF0YSgnY29tcG91bmRDb2xsYXBzZS5jb2xsYXBzZWRDb2xsZWN0aW9uJyk7XG4gIG5vZGUucmVtb3ZlQ2xhc3MoJ2NvbXBvdW5kY29sbGFwc2UtY29sbGFwc2VkLW5vZGUnKTtcbiAgbm9kZS50cmlnZ2VyKCdjb21wb3VuZENvbGxhcHNlLmFmdGVyRXhwYW5kJyk7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZXhwYW5kO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb2xsZWN0aW9uL2V4cGFuZC5qcyIsImNvbnN0IGltcGwgPSByZXF1aXJlKCcuL2NvbGxlY3Rpb24nKTtcblxuLy8gcmVnaXN0ZXJzIHRoZSBleHRlbnNpb24gb24gYSBjeXRvc2NhcGUgbGliIHJlZlxubGV0IHJlZ2lzdGVyID0gZnVuY3Rpb24oIGN5dG9zY2FwZSApe1xuICBpZiggIWN5dG9zY2FwZSApeyByZXR1cm47IH0gLy8gY2FuJ3QgcmVnaXN0ZXIgaWYgY3l0b3NjYXBlIHVuc3BlY2lmaWVkXG5cbiAgY3l0b3NjYXBlKCAnY29sbGVjdGlvbicsICdjb2xsYXBzZScsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBlbGVzID0gdGhpcztcbiAgICBpbXBsLmNvbGxhcHNlKGVsZXMpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0pOyAvLyByZWdpc3RlciB3aXRoIGN5dG9zY2FwZS5qc1xuXG4gIGN5dG9zY2FwZSggJ2NvbGxlY3Rpb24nLCAnZXhwYW5kJywgZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGVsZXMgPSB0aGlzO1xuICAgIGltcGwuZXhwYW5kKGVsZXMpO1xuICAgIFxuICAgIHJldHVybiB0aGlzO1xuICB9KTtcblxuICBjeXRvc2NhcGUoICdjb2xsZWN0aW9uJywgJ2lzQ29sbGFwc2VkJywgZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGVsZXMgPSB0aGlzO1xuICAgIGNvbnN0IG5vZGUgPSBlbGVzWzBdO1xuXG4gICAgcmV0dXJuIGltcGwuaXNDb2xsYXBzZWQobm9kZSk7XG4gIH0pO1xuXG4gIGN5dG9zY2FwZSggJ2NvbGxlY3Rpb24nLCAnaXNFeHBhbmRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBlbGVzID0gdGhpcztcbiAgICBjb25zdCBub2RlID0gZWxlc1swXTtcblxuICAgIHJldHVybiBpbXBsLmlzRXhwYW5kZWQobm9kZSk7XG4gIH0pO1xuXG4gIGN5dG9zY2FwZSggJ2NvbGxlY3Rpb24nLCAnbWV0YUVkZ2VzJywgZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGVsZXMgPSB0aGlzO1xuICBcbiAgICByZXR1cm4gZWxlcy5lZGdlcygpLmZpbHRlcihlZGdlID0+IGltcGwuaXNNZXRhRWRnZShlZGdlKSk7XG4gIH0pO1xuXG59O1xuXG5pZiggdHlwZW9mIGN5dG9zY2FwZSAhPT0gJ3VuZGVmaW5lZCcgKXsgLy8gZXhwb3NlIHRvIGdsb2JhbCBjeXRvc2NhcGUgKGkuZS4gd2luZG93LmN5dG9zY2FwZSlcbiAgcmVnaXN0ZXIoIGN5dG9zY2FwZSApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlZ2lzdGVyO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LmpzIl0sInNvdXJjZVJvb3QiOiIifQ==