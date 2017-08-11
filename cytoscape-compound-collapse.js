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
  node.addClass('compoundcollapse-collapsed-node');
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
  node.removeClass('compoundcollapse-collapsed-node');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBlZjNhNzRhZTNhN2JkYzJkMDljMyIsIndlYnBhY2s6Ly8vLi9zcmMvY29sbGVjdGlvbi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29sbGVjdGlvbi9jb2xsYXBzZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29sbGVjdGlvbi9leHBhbmQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbImNvbGxhcHNlSW1wbCIsInJlcXVpcmUiLCJleHBhbmRJbXBsIiwiYXBpIiwiaXNDb2xsYXBzZWQiLCJub2RlIiwiZGF0YSIsImlzRXhwYW5kZWQiLCJpc01ldGFFZGdlIiwiZWRnZSIsImhhc0NsYXNzIiwiY29sbGFwc2UiLCJlbGVzIiwiZm9yRWFjaCIsImVsZSIsImV4cGFuZCIsIm1vZHVsZSIsImV4cG9ydHMiLCJhZGRNZXRhRWRnZXMiLCJjb2xsYXBzZWROb2RlIiwiZGVzY2VuZGFudHMiLCJjaGlsZHJlbiIsIm1ldGFFZGdlQ2FuZGlkYXRlcyIsImNvbm5lY3RlZEVkZ2VzIiwiY29udGFpbnMiLCJzb3VyY2UiLCJjeSIsImFkZCIsImdyb3VwIiwiaWQiLCJ0YXJnZXQiLCJjbGFzc2VzIiwiY29sbGFwc2VDb3JlIiwibGF5b3V0RGltZW5zaW9ucyIsImNvbXBvdW5kQ2hpbGRyZW4iLCJmaWx0ZXIiLCJpc1BhcmVudCIsImNoaWxkIiwiY29sbGFwc2VkQ29sbGVjdGlvbiIsInVuaW9uIiwicmVtb3ZlIiwiYWRkQ2xhc3MiLCJvcHRzIiwidHJpZ2dlciIsInJlbW92ZU1ldGFFZGdlcyIsInBvc2l0aW9ucyIsInBvc2l0aW9uIiwicmVzdG9yZSIsInJlbW92ZURhdGEiLCJyZW1vdmVDbGFzcyIsImltcGwiLCJyZWdpc3RlciIsImN5dG9zY2FwZSIsImVkZ2VzIl0sIm1hcHBpbmdzIjoiQUFBQTtB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Q0FBNUIsQ0FBUDtBQUNELEdBSkQ7QUFNRCxDQXJDRDs7QUF1Q0EsSUFBSSxPQUFPMkMsU0FBUCxLQUFxQixXQUF6QixFQUFzQztBQUFFO0FBQ3RDRCxXQUFVQyxTQUFWO0FBQ0Q7O0FBRURwQyxPQUFPQyxPQUFQLEdBQWlCa0MsUUFBakIsQyIsImZpbGUiOiJjeXRvc2NhcGUtY29tcG91bmQtY29sbGFwc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJjeXRvc2NhcGVDb21wb3VuZENvbGxhcHNlXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcImN5dG9zY2FwZUNvbXBvdW5kQ29sbGFwc2VcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiBcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAzKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBlZjNhNzRhZTNhN2JkYzJkMDljMyIsImNvbnN0IGNvbGxhcHNlSW1wbCA9IHJlcXVpcmUoJy4vY29sbGFwc2UnKTtcbmNvbnN0IGV4cGFuZEltcGwgPSByZXF1aXJlKCcuL2V4cGFuZCcpO1xuXG5jb25zdCBhcGkgPSB7XG4gIGlzQ29sbGFwc2VkIChub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUuZGF0YSgnY29tcG91bmRDb2xsYXBzZS5jb2xsYXBzZWQnKTtcbiAgfSxcbiAgaXNFeHBhbmRlZCAobm9kZSkge1xuICAgIHJldHVybiAhdGhpcy5pc0NvbGxhcHNlZChub2RlKTtcbiAgfSxcbiAgaXNNZXRhRWRnZSAoZWRnZSkge1xuICAgIHJldHVybiBlZGdlLmhhc0NsYXNzKCdjb21wb3VuZGNvbGxhcHNlLW1ldGEtZWRnZScpO1xuICB9LFxuICBjb2xsYXBzZSAoZWxlcykge1xuICAgIGVsZXMuZm9yRWFjaChlbGUgPT4gY29sbGFwc2VJbXBsKGVsZSkpO1xuICB9LFxuICBleHBhbmQgKGVsZXMpIHtcbiAgICBlbGVzLmZvckVhY2goZWxlID0+IGV4cGFuZEltcGwoZWxlKSk7XG4gIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBhcGk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NvbGxlY3Rpb24vaW5kZXguanMiLCJjb25zdCBhZGRNZXRhRWRnZXMgPSAoY29sbGFwc2VkTm9kZSkgPT4ge1xuICBjb25zdCBkZXNjZW5kYW50cyA9IGNvbGxhcHNlZE5vZGUuY2hpbGRyZW4oKTtcbiAgY29uc3QgbWV0YUVkZ2VDYW5kaWRhdGVzID0gZGVzY2VuZGFudHMuY29ubmVjdGVkRWRnZXMoKTtcblxuICBtZXRhRWRnZUNhbmRpZGF0ZXMuZm9yRWFjaCgoZWRnZSkgPT4ge1xuICAgIGlmICghZGVzY2VuZGFudHMuY29udGFpbnMoZWRnZS5zb3VyY2UoKSkpIHtcbiAgICAgIGNvbGxhcHNlZE5vZGUuY3koKS5hZGQoe1xuICAgICAgICBncm91cDogJ2VkZ2VzJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHNvdXJjZTogZWRnZS5zb3VyY2UoKS5pZCgpLFxuICAgICAgICAgIHRhcmdldDogY29sbGFwc2VkTm9kZS5pZCgpXG4gICAgICAgIH0sXG4gICAgICAgIGNsYXNzZXM6ICdjb21wb3VuZGNvbGxhcHNlLW1ldGEtZWRnZSdcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICghZGVzY2VuZGFudHMuY29udGFpbnMoZWRnZS50YXJnZXQoKSkpIHtcbiAgICAgIGNvbGxhcHNlZE5vZGUuY3koKS5hZGQoe1xuICAgICAgICBncm91cDogJ2VkZ2VzJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHRhcmdldDogZWRnZS50YXJnZXQoKS5pZCgpLFxuICAgICAgICAgIHNvdXJjZTogY29sbGFwc2VkTm9kZS5pZCgpXG4gICAgICAgIH0sXG4gICAgICAgIGNsYXNzZXM6ICdjb21wb3VuZGNvbGxhcHNlLW1ldGEtZWRnZSdcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59O1xuXG5jb25zdCBjb2xsYXBzZUNvcmUgPSAobm9kZSkgPT4ge1xuICBub2RlLmRhdGEoJ2NvbXBvdW5kQ29sbGFwc2UuY29sbGFwc2VkJywgdHJ1ZSk7XG4gIG5vZGUuZGF0YSgnY29tcG91bmRDb2xsYXBzZS5zaXplQmVmb3JlJywgbm9kZS5sYXlvdXREaW1lbnNpb25zKHt9KSk7XG5cbiAgY29uc3QgY29tcG91bmRDaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW4oKS5maWx0ZXIoKGVsZSkgPT4gZWxlLmlzUGFyZW50KCkpO1xuICBjb21wb3VuZENoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiBjb2xsYXBzZUNvcmUoY2hpbGQpKTtcblxuICBhZGRNZXRhRWRnZXMobm9kZSk7XG4gIGNvbnN0IGNvbGxhcHNlZENvbGxlY3Rpb24gPSBub2RlLmNoaWxkcmVuKCkudW5pb24obm9kZS5jaGlsZHJlbigpLmNvbm5lY3RlZEVkZ2VzKCkpO1xuICBcbiAgbm9kZS5kYXRhKCdjb21wb3VuZENvbGxhcHNlLmNvbGxhcHNlZENvbGxlY3Rpb24nLCBjb2xsYXBzZWRDb2xsZWN0aW9uKTtcbiAgY29sbGFwc2VkQ29sbGVjdGlvbi5yZW1vdmUoKTtcbiAgbm9kZS5kYXRhKCdjb21wb3VuZENvbGxhcHNlLnNpemVBZnRlcicsIG5vZGUubGF5b3V0RGltZW5zaW9ucyh7fSkpO1xuICBub2RlLmFkZENsYXNzKCdjb21wb3VuZGNvbGxhcHNlLWNvbGxhcHNlZC1ub2RlJyk7XG59O1xuXG5cbmNvbnN0IGNvbGxhcHNlID0gKG5vZGUsIG9wdHMpID0+IHtcbiAgbm9kZS50cmlnZ2VyKCdjb21wb3VuZENvbGxhcHNlLmJlZm9yZUNvbGxhcHNlJyk7XG4gIGNvbGxhcHNlQ29yZShub2RlKTtcbiAgbm9kZS50cmlnZ2VyKCdjb21wb3VuZENvbGxhcHNlLmFmdGVyQ29sbGFwc2UnKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gY29sbGFwc2U7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NvbGxlY3Rpb24vY29sbGFwc2UuanMiLCJjb25zdCByZW1vdmVNZXRhRWRnZXMgPSAobm9kZSkgPT4ge1xuICBub2RlLmNvbm5lY3RlZEVkZ2VzKCcuY29tcG91bmRjb2xsYXBzZS1tZXRhLWVkZ2UnKS5yZW1vdmUoKTtcbn07XG5cbmNvbnN0IGV4cGFuZCA9IChub2RlLCBvcHRzKSA9PiB7XG4gIG5vZGUudHJpZ2dlcignY29tcG91bmRDb2xsYXBzZS5iZWZvcmVFeHBhbmQnKTtcbiBcbiAgbm9kZS5kYXRhKCdjb21wb3VuZENvbGxhcHNlLmNvbGxhcHNlZCcsIGZhbHNlKTtcbiAgcmVtb3ZlTWV0YUVkZ2VzKG5vZGUpO1xuICBub2RlLmRhdGEoJ2NvbXBvdW5kQ29sbGFwc2UuY29sbGFwc2VkQ29sbGVjdGlvbicpLnBvc2l0aW9ucyhub2RlLnBvc2l0aW9uKCkpO1xuICBub2RlLmRhdGEoJ2NvbXBvdW5kQ29sbGFwc2UuY29sbGFwc2VkQ29sbGVjdGlvbicpLnJlc3RvcmUoKTtcbiAgbm9kZS5yZW1vdmVEYXRhKCdjb21wb3VuZENvbGxhcHNlLmNvbGxhcHNlZENvbGxlY3Rpb24nKTtcbiAgbm9kZS5yZW1vdmVDbGFzcygnY29tcG91bmRjb2xsYXBzZS1jb2xsYXBzZWQtbm9kZScpO1xuICBub2RlLnRyaWdnZXIoJ2NvbXBvdW5kQ29sbGFwc2UuYWZ0ZXJFeHBhbmQnKTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBleHBhbmQ7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NvbGxlY3Rpb24vZXhwYW5kLmpzIiwiY29uc3QgaW1wbCA9IHJlcXVpcmUoJy4vY29sbGVjdGlvbicpO1xuXG4vLyByZWdpc3RlcnMgdGhlIGV4dGVuc2lvbiBvbiBhIGN5dG9zY2FwZSBsaWIgcmVmXG5sZXQgcmVnaXN0ZXIgPSBmdW5jdGlvbiggY3l0b3NjYXBlICl7XG4gIGlmKCAhY3l0b3NjYXBlICl7IHJldHVybjsgfSAvLyBjYW4ndCByZWdpc3RlciBpZiBjeXRvc2NhcGUgdW5zcGVjaWZpZWRcblxuICBjeXRvc2NhcGUoICdjb2xsZWN0aW9uJywgJ2NvbGxhcHNlJywgZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGVsZXMgPSB0aGlzO1xuICAgIGltcGwuY29sbGFwc2UoZWxlcyk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSk7IC8vIHJlZ2lzdGVyIHdpdGggY3l0b3NjYXBlLmpzXG5cbiAgY3l0b3NjYXBlKCAnY29sbGVjdGlvbicsICdleHBhbmQnLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgZWxlcyA9IHRoaXM7XG4gICAgaW1wbC5leHBhbmQoZWxlcyk7XG4gICAgXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0pO1xuXG4gIGN5dG9zY2FwZSggJ2NvbGxlY3Rpb24nLCAnaXNDb2xsYXBzZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgZWxlcyA9IHRoaXM7XG4gICAgY29uc3Qgbm9kZSA9IGVsZXNbMF07XG5cbiAgICByZXR1cm4gaW1wbC5pc0NvbGxhcHNlZChub2RlKTtcbiAgfSk7XG5cbiAgY3l0b3NjYXBlKCAnY29sbGVjdGlvbicsICdpc0V4cGFuZGVkJywgZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGVsZXMgPSB0aGlzO1xuICAgIGNvbnN0IG5vZGUgPSBlbGVzWzBdO1xuXG4gICAgcmV0dXJuIGltcGwuaXNFeHBhbmRlZChub2RlKTtcbiAgfSk7XG5cbiAgY3l0b3NjYXBlKCAnY29sbGVjdGlvbicsICdtZXRhRWRnZXMnLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgZWxlcyA9IHRoaXM7XG4gIFxuICAgIHJldHVybiBlbGVzLmVkZ2VzKCkuZmlsdGVyKGVkZ2UgPT4gaW1wbC5pc01ldGFFZGdlKGVkZ2UpKTtcbiAgfSk7XG5cbn07XG5cbmlmKCB0eXBlb2YgY3l0b3NjYXBlICE9PSAndW5kZWZpbmVkJyApeyAvLyBleHBvc2UgdG8gZ2xvYmFsIGN5dG9zY2FwZSAoaS5lLiB3aW5kb3cuY3l0b3NjYXBlKVxuICByZWdpc3RlciggY3l0b3NjYXBlICk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVnaXN0ZXI7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaW5kZXguanMiXSwic291cmNlUm9vdCI6IiJ9