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

const collapseImpl = __webpack_require__(1);
const expandImpl = __webpack_require__(2);

const api = {
  isCollapsed(node) {
    return node.data('compoundCollapse.collapsed');
  },
  isExpanded(node) {
    return !this.isCollapsed(node);
  },
  isMetaEdge(edge) {
    return edge.hasClass('compoundcollapse-meta-edge');
  },
  collapse(eles) {
    eles.forEach(ele => collapseImpl(ele));
  },
  expand(eles) {
    eles.forEach(ele => expandImpl(ele));
  }

};

module.exports = api;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

const addMetaEdges = collapsedNode => {
  const descendants = collapsedNode.children();
  const metaEdgeCandidates = descendants.connectedEdges();

  metaEdgeCandidates.forEach(edge => {
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

const collapseCore = node => {
  node.data('compoundCollapse.collapsed', true);
  node.data('compoundCollapse.sizeBefore', node.layoutDimensions({}));

  const compoundChildren = node.children().filter(ele => ele.isParent());
  compoundChildren.forEach(child => collapseCore(child));

  addMetaEdges(node);
  const collapsedCollection = node.children().union(node.children().connectedEdges());

  node.data('compoundCollapse.collapsedCollection', collapsedCollection);
  collapsedCollection.remove();
  node.data('compoundCollapse.sizeAfter', node.layoutDimensions({}));
  node.addClass('compouncollapse-collapsed-node');
};

const collapse = (node, opts) => {
  node.trigger('compoundCollapse.beforeCollapse');
  collapseCore(node);
  node.trigger('compoundCollapse.afterCollapse');
};

module.exports = collapse;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

const removeMetaEdges = node => {
  node.connectedEdges('.compoundcollapse-meta-edge').remove();
};

const expand = (node, opts) => {
  node.trigger('compoundCollapse.beforeExpand');

  node.data('compoundCollapse.collapsed', false);
  removeMetaEdges(node);
  node.data('compoundCollapse.collapsedCollection').positions(node.position());
  node.data('compoundCollapse.collapsedCollection').restore();
  node.removeData('compoundCollapse.collapsedCollection');

  node.trigger('compoundCollapse.afterExpand');
};

module.exports = expand;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const impl = __webpack_require__(0);

// registers the extension on a cytoscape lib ref
let register = function (cytoscape) {
  if (!cytoscape) {
    return;
  } // can't register if cytoscape unspecified

  cytoscape('collection', 'collapse', function () {
    const eles = this;
    impl.collapse(eles);

    return this;
  }); // register with cytoscape.js

  cytoscape('collection', 'expand', function () {
    const eles = this;
    impl.expand(eles);

    return this;
  });

  cytoscape('collection', 'isCollapsed', function () {
    const eles = this;
    const node = eles[0];

    return impl.isCollapsed(node);
  });

  cytoscape('collection', 'isExpanded', function () {
    const eles = this;
    const node = eles[0];

    return impl.isExpanded(node);
  });

  cytoscape('collection', 'metaEdges', function () {
    const eles = this;

    return eles.edges().filter(edge => impl.isMetaEdge(edge));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAxMmY1Y2FkZmZmZDAzNzVhNWI2NCIsIndlYnBhY2s6Ly8vLi9zcmMvY29sbGVjdGlvbi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29sbGVjdGlvbi9jb2xsYXBzZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29sbGVjdGlvbi9leHBhbmQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbImNvbGxhcHNlSW1wbCIsInJlcXVpcmUiLCJleHBhbmRJbXBsIiwiYXBpIiwiaXNDb2xsYXBzZWQiLCJub2RlIiwiZGF0YSIsImlzRXhwYW5kZWQiLCJpc01ldGFFZGdlIiwiZWRnZSIsImhhc0NsYXNzIiwiY29sbGFwc2UiLCJlbGVzIiwiZm9yRWFjaCIsImVsZSIsImV4cGFuZCIsIm1vZHVsZSIsImV4cG9ydHMiLCJhZGRNZXRhRWRnZXMiLCJjb2xsYXBzZWROb2RlIiwiZGVzY2VuZGFudHMiLCJjaGlsZHJlbiIsIm1ldGFFZGdlQ2FuZGlkYXRlcyIsImNvbm5lY3RlZEVkZ2VzIiwiY29udGFpbnMiLCJzb3VyY2UiLCJjeSIsImFkZCIsImdyb3VwIiwiaWQiLCJ0YXJnZXQiLCJjbGFzc2VzIiwiY29sbGFwc2VDb3JlIiwibGF5b3V0RGltZW5zaW9ucyIsImNvbXBvdW5kQ2hpbGRyZW4iLCJmaWx0ZXIiLCJpc1BhcmVudCIsImNoaWxkIiwiY29sbGFwc2VkQ29sbGVjdGlvbiIsInVuaW9uIiwicmVtb3ZlIiwiYWRkQ2xhc3MiLCJvcHRzIiwidHJpZ2dlciIsInJlbW92ZU1ldGFFZGdlcyIsInBvc2l0aW9ucyIsInBvc2l0aW9uIiwicmVzdG9yZSIsInJlbW92ZURhdGEiLCJpbXBsIiwicmVnaXN0ZXIiLCJjeXRvc2NhcGUiLCJlZGdlcyJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7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QUFPMEMsU0FBUCxLQUFxQixXQUF6QixFQUFzQztBQUFFO0FBQ3RDRCxXQUFVQyxTQUFWO0FBQ0Q7O0FBRURuQyxPQUFPQyxPQUFQLEdBQWlCaUMsUUFBakIsQyIsImZpbGUiOiJjeXRvc2NhcGUtY29tcG91bmQtY29sbGFwc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJjeXRvc2NhcGVDb21wb3VuZENvbGxhcHNlXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcImN5dG9zY2FwZUNvbXBvdW5kQ29sbGFwc2VcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiBcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAzKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAxMmY1Y2FkZmZmZDAzNzVhNWI2NCIsImNvbnN0IGNvbGxhcHNlSW1wbCA9IHJlcXVpcmUoJy4vY29sbGFwc2UnKTtcbmNvbnN0IGV4cGFuZEltcGwgPSByZXF1aXJlKCcuL2V4cGFuZCcpO1xuXG5jb25zdCBhcGkgPSB7XG4gIGlzQ29sbGFwc2VkIChub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUuZGF0YSgnY29tcG91bmRDb2xsYXBzZS5jb2xsYXBzZWQnKTtcbiAgfSxcbiAgaXNFeHBhbmRlZCAobm9kZSkge1xuICAgIHJldHVybiAhdGhpcy5pc0NvbGxhcHNlZChub2RlKTtcbiAgfSxcbiAgaXNNZXRhRWRnZSAoZWRnZSkge1xuICAgIHJldHVybiBlZGdlLmhhc0NsYXNzKCdjb21wb3VuZGNvbGxhcHNlLW1ldGEtZWRnZScpO1xuICB9LFxuICBjb2xsYXBzZSAoZWxlcykge1xuICAgIGVsZXMuZm9yRWFjaChlbGUgPT4gY29sbGFwc2VJbXBsKGVsZSkpO1xuICB9LFxuICBleHBhbmQgKGVsZXMpIHtcbiAgICBlbGVzLmZvckVhY2goZWxlID0+IGV4cGFuZEltcGwoZWxlKSk7XG4gIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBhcGk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NvbGxlY3Rpb24vaW5kZXguanMiLCJjb25zdCBhZGRNZXRhRWRnZXMgPSAoY29sbGFwc2VkTm9kZSkgPT4ge1xuICBjb25zdCBkZXNjZW5kYW50cyA9IGNvbGxhcHNlZE5vZGUuY2hpbGRyZW4oKTtcbiAgY29uc3QgbWV0YUVkZ2VDYW5kaWRhdGVzID0gZGVzY2VuZGFudHMuY29ubmVjdGVkRWRnZXMoKTtcblxuICBtZXRhRWRnZUNhbmRpZGF0ZXMuZm9yRWFjaCgoZWRnZSkgPT4ge1xuICAgIGlmICghZGVzY2VuZGFudHMuY29udGFpbnMoZWRnZS5zb3VyY2UoKSkpIHtcbiAgICAgIGNvbGxhcHNlZE5vZGUuY3koKS5hZGQoe1xuICAgICAgICBncm91cDogJ2VkZ2VzJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHNvdXJjZTogZWRnZS5zb3VyY2UoKS5pZCgpLFxuICAgICAgICAgIHRhcmdldDogY29sbGFwc2VkTm9kZS5pZCgpXG4gICAgICAgIH0sXG4gICAgICAgIGNsYXNzZXM6ICdjb21wb3VuZGNvbGxhcHNlLW1ldGEtZWRnZSdcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICghZGVzY2VuZGFudHMuY29udGFpbnMoZWRnZS50YXJnZXQoKSkpIHtcbiAgICAgIGNvbGxhcHNlZE5vZGUuY3koKS5hZGQoe1xuICAgICAgICBncm91cDogJ2VkZ2VzJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHRhcmdldDogZWRnZS50YXJnZXQoKS5pZCgpLFxuICAgICAgICAgIHNvdXJjZTogY29sbGFwc2VkTm9kZS5pZCgpXG4gICAgICAgIH0sXG4gICAgICAgIGNsYXNzZXM6ICdjb21wb3VuZGNvbGxhcHNlLW1ldGEtZWRnZSdcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59O1xuXG5jb25zdCBjb2xsYXBzZUNvcmUgPSAobm9kZSkgPT4ge1xuICBub2RlLmRhdGEoJ2NvbXBvdW5kQ29sbGFwc2UuY29sbGFwc2VkJywgdHJ1ZSk7XG4gIG5vZGUuZGF0YSgnY29tcG91bmRDb2xsYXBzZS5zaXplQmVmb3JlJywgbm9kZS5sYXlvdXREaW1lbnNpb25zKHt9KSk7XG5cbiAgY29uc3QgY29tcG91bmRDaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW4oKS5maWx0ZXIoKGVsZSkgPT4gZWxlLmlzUGFyZW50KCkpO1xuICBjb21wb3VuZENoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiBjb2xsYXBzZUNvcmUoY2hpbGQpKTtcblxuICBhZGRNZXRhRWRnZXMobm9kZSk7XG4gIGNvbnN0IGNvbGxhcHNlZENvbGxlY3Rpb24gPSBub2RlLmNoaWxkcmVuKCkudW5pb24obm9kZS5jaGlsZHJlbigpLmNvbm5lY3RlZEVkZ2VzKCkpO1xuICBcbiAgbm9kZS5kYXRhKCdjb21wb3VuZENvbGxhcHNlLmNvbGxhcHNlZENvbGxlY3Rpb24nLCBjb2xsYXBzZWRDb2xsZWN0aW9uKTtcbiAgY29sbGFwc2VkQ29sbGVjdGlvbi5yZW1vdmUoKTtcbiAgbm9kZS5kYXRhKCdjb21wb3VuZENvbGxhcHNlLnNpemVBZnRlcicsIG5vZGUubGF5b3V0RGltZW5zaW9ucyh7fSkpO1xuICBub2RlLmFkZENsYXNzKCdjb21wb3VuY29sbGFwc2UtY29sbGFwc2VkLW5vZGUnKTtcbn07XG5cblxuY29uc3QgY29sbGFwc2UgPSAobm9kZSwgb3B0cykgPT4ge1xuICBub2RlLnRyaWdnZXIoJ2NvbXBvdW5kQ29sbGFwc2UuYmVmb3JlQ29sbGFwc2UnKTtcbiAgY29sbGFwc2VDb3JlKG5vZGUpO1xuICBub2RlLnRyaWdnZXIoJ2NvbXBvdW5kQ29sbGFwc2UuYWZ0ZXJDb2xsYXBzZScpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb2xsYXBzZTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY29sbGVjdGlvbi9jb2xsYXBzZS5qcyIsImNvbnN0IHJlbW92ZU1ldGFFZGdlcyA9IChub2RlKSA9PiB7XG4gIG5vZGUuY29ubmVjdGVkRWRnZXMoJy5jb21wb3VuZGNvbGxhcHNlLW1ldGEtZWRnZScpLnJlbW92ZSgpO1xufTtcblxuY29uc3QgZXhwYW5kID0gKG5vZGUsIG9wdHMpID0+IHtcbiAgbm9kZS50cmlnZ2VyKCdjb21wb3VuZENvbGxhcHNlLmJlZm9yZUV4cGFuZCcpO1xuIFxuICBub2RlLmRhdGEoJ2NvbXBvdW5kQ29sbGFwc2UuY29sbGFwc2VkJywgZmFsc2UpO1xuICByZW1vdmVNZXRhRWRnZXMobm9kZSk7XG4gIG5vZGUuZGF0YSgnY29tcG91bmRDb2xsYXBzZS5jb2xsYXBzZWRDb2xsZWN0aW9uJykucG9zaXRpb25zKG5vZGUucG9zaXRpb24oKSk7XG4gIG5vZGUuZGF0YSgnY29tcG91bmRDb2xsYXBzZS5jb2xsYXBzZWRDb2xsZWN0aW9uJykucmVzdG9yZSgpO1xuICBub2RlLnJlbW92ZURhdGEoJ2NvbXBvdW5kQ29sbGFwc2UuY29sbGFwc2VkQ29sbGVjdGlvbicpO1xuXG4gIG5vZGUudHJpZ2dlcignY29tcG91bmRDb2xsYXBzZS5hZnRlckV4cGFuZCcpO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cGFuZDtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY29sbGVjdGlvbi9leHBhbmQuanMiLCJjb25zdCBpbXBsID0gcmVxdWlyZSgnLi9jb2xsZWN0aW9uJyk7XG5cbi8vIHJlZ2lzdGVycyB0aGUgZXh0ZW5zaW9uIG9uIGEgY3l0b3NjYXBlIGxpYiByZWZcbmxldCByZWdpc3RlciA9IGZ1bmN0aW9uKCBjeXRvc2NhcGUgKXtcbiAgaWYoICFjeXRvc2NhcGUgKXsgcmV0dXJuOyB9IC8vIGNhbid0IHJlZ2lzdGVyIGlmIGN5dG9zY2FwZSB1bnNwZWNpZmllZFxuXG4gIGN5dG9zY2FwZSggJ2NvbGxlY3Rpb24nLCAnY29sbGFwc2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgZWxlcyA9IHRoaXM7XG4gICAgaW1wbC5jb2xsYXBzZShlbGVzKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9KTsgLy8gcmVnaXN0ZXIgd2l0aCBjeXRvc2NhcGUuanNcblxuICBjeXRvc2NhcGUoICdjb2xsZWN0aW9uJywgJ2V4cGFuZCcsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBlbGVzID0gdGhpcztcbiAgICBpbXBsLmV4cGFuZChlbGVzKTtcbiAgICBcbiAgICByZXR1cm4gdGhpcztcbiAgfSk7XG5cbiAgY3l0b3NjYXBlKCAnY29sbGVjdGlvbicsICdpc0NvbGxhcHNlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBlbGVzID0gdGhpcztcbiAgICBjb25zdCBub2RlID0gZWxlc1swXTtcblxuICAgIHJldHVybiBpbXBsLmlzQ29sbGFwc2VkKG5vZGUpO1xuICB9KTtcblxuICBjeXRvc2NhcGUoICdjb2xsZWN0aW9uJywgJ2lzRXhwYW5kZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgZWxlcyA9IHRoaXM7XG4gICAgY29uc3Qgbm9kZSA9IGVsZXNbMF07XG5cbiAgICByZXR1cm4gaW1wbC5pc0V4cGFuZGVkKG5vZGUpO1xuICB9KTtcblxuICBjeXRvc2NhcGUoICdjb2xsZWN0aW9uJywgJ21ldGFFZGdlcycsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBlbGVzID0gdGhpcztcbiAgXG4gICAgcmV0dXJuIGVsZXMuZWRnZXMoKS5maWx0ZXIoZWRnZSA9PiBpbXBsLmlzTWV0YUVkZ2UoZWRnZSkpO1xuICB9KTtcblxufTtcblxuaWYoIHR5cGVvZiBjeXRvc2NhcGUgIT09ICd1bmRlZmluZWQnICl7IC8vIGV4cG9zZSB0byBnbG9iYWwgY3l0b3NjYXBlIChpLmUuIHdpbmRvdy5jeXRvc2NhcGUpXG4gIHJlZ2lzdGVyKCBjeXRvc2NhcGUgKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZWdpc3RlcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VSb290IjoiIn0=