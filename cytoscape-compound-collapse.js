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
    return node.data('compoundcollapse.collapsed');
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
  node.data('compoundcollapse.collapsed', true);
  node.data('compoundcollapse.size-before', node.layoutDimensions({}));

  const compoundChildren = node.children().filter(ele => ele.isParent());
  compoundChildren.forEach(child => collapseCore(child));

  addMetaEdges(node);
  const collapsedCollection = node.children().union(node.children().connectedEdges());

  node.data('compoundcollapse.collapsed-collection', collapsedCollection);
  collapsedCollection.remove();
  node.data('compoundcollapse.size-after', node.layoutDimensions({}));
};

const collapse = (node, opts) => {
  node.trigger('compoundcollapse.before-collapse');
  collapseCore(node);
  node.trigger('compoundcollapes.after-collapse');
};

module.exports = collapse;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

const removeMetaEdges = node => {
  node.connectedEdges('.compoundcollapse-meta-edge').remove();
};

const expand = (node, opts) => {
  node.trigger('compoundcollapse.before-expand');

  node.data('compoundcollapse.collapsed', false);
  removeMetaEdges(node);
  node.data('compoundcollapse.collapsed-collection').positions(node.position());
  node.data('compoundcollapse.collapsed-collection').restore();
  node.removeData('compoundcollapse.collapsed-collection');

  node.trigger('compoundcollapse.after-expand');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA2YTdjNGJkOWU4ZmM3YmM5MjExNiIsIndlYnBhY2s6Ly8vLi9zcmMvY29sbGVjdGlvbi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29sbGVjdGlvbi9jb2xsYXBzZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29sbGVjdGlvbi9leHBhbmQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbImNvbGxhcHNlSW1wbCIsInJlcXVpcmUiLCJleHBhbmRJbXBsIiwiYXBpIiwiaXNDb2xsYXBzZWQiLCJub2RlIiwiZGF0YSIsImlzRXhwYW5kZWQiLCJpc01ldGFFZGdlIiwiZWRnZSIsImhhc0NsYXNzIiwiY29sbGFwc2UiLCJlbGVzIiwiZm9yRWFjaCIsImVsZSIsImV4cGFuZCIsIm1vZHVsZSIsImV4cG9ydHMiLCJhZGRNZXRhRWRnZXMiLCJjb2xsYXBzZWROb2RlIiwiZGVzY2VuZGFudHMiLCJjaGlsZHJlbiIsIm1ldGFFZGdlQ2FuZGlkYXRlcyIsImNvbm5lY3RlZEVkZ2VzIiwiY29udGFpbnMiLCJzb3VyY2UiLCJjeSIsImFkZCIsImdyb3VwIiwiaWQiLCJ0YXJnZXQiLCJjbGFzc2VzIiwiY29sbGFwc2VDb3JlIiwibGF5b3V0RGltZW5zaW9ucyIsImNvbXBvdW5kQ2hpbGRyZW4iLCJmaWx0ZXIiLCJpc1BhcmVudCIsImNoaWxkIiwiY29sbGFwc2VkQ29sbGVjdGlvbiIsInVuaW9uIiwicmVtb3ZlIiwib3B0cyIsInRyaWdnZXIiLCJyZW1vdmVNZXRhRWRnZXMiLCJwb3NpdGlvbnMiLCJwb3NpdGlvbiIsInJlc3RvcmUiLCJyZW1vdmVEYXRhIiwiaW1wbCIsInJlZ2lzdGVyIiwiY3l0b3NjYXBlIiwiZWRnZXMiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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V0FBVUMsU0FBVjtBQUNEOztBQUVEbEMsT0FBT0MsT0FBUCxHQUFpQmdDLFFBQWpCLEMiLCJmaWxlIjoiY3l0b3NjYXBlLWNvbXBvdW5kLWNvbGxhcHNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiY3l0b3NjYXBlQ29tcG91bmRDb2xsYXBzZVwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJjeXRvc2NhcGVDb21wb3VuZENvbGxhcHNlXCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMyk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNmE3YzRiZDllOGZjN2JjOTIxMTYiLCJjb25zdCBjb2xsYXBzZUltcGwgPSByZXF1aXJlKCcuL2NvbGxhcHNlJyk7XG5jb25zdCBleHBhbmRJbXBsID0gcmVxdWlyZSgnLi9leHBhbmQnKTtcblxuY29uc3QgYXBpID0ge1xuICBpc0NvbGxhcHNlZCAobm9kZSkge1xuICAgIHJldHVybiBub2RlLmRhdGEoJ2NvbXBvdW5kY29sbGFwc2UuY29sbGFwc2VkJyk7XG4gIH0sXG4gIGlzRXhwYW5kZWQgKG5vZGUpIHtcbiAgICByZXR1cm4gIXRoaXMuaXNDb2xsYXBzZWQobm9kZSk7XG4gIH0sXG4gIGlzTWV0YUVkZ2UgKGVkZ2UpIHtcbiAgICByZXR1cm4gZWRnZS5oYXNDbGFzcygnY29tcG91bmRjb2xsYXBzZS1tZXRhLWVkZ2UnKTtcbiAgfSxcbiAgY29sbGFwc2UgKGVsZXMpIHtcbiAgICBlbGVzLmZvckVhY2goZWxlID0+IGNvbGxhcHNlSW1wbChlbGUpKTtcbiAgfSxcbiAgZXhwYW5kIChlbGVzKSB7XG4gICAgZWxlcy5mb3JFYWNoKGVsZSA9PiBleHBhbmRJbXBsKGVsZSkpO1xuICB9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gYXBpO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb2xsZWN0aW9uL2luZGV4LmpzIiwiY29uc3QgYWRkTWV0YUVkZ2VzID0gKGNvbGxhcHNlZE5vZGUpID0+IHtcbiAgY29uc3QgZGVzY2VuZGFudHMgPSBjb2xsYXBzZWROb2RlLmNoaWxkcmVuKCk7XG4gIGNvbnN0IG1ldGFFZGdlQ2FuZGlkYXRlcyA9IGRlc2NlbmRhbnRzLmNvbm5lY3RlZEVkZ2VzKCk7XG5cbiAgbWV0YUVkZ2VDYW5kaWRhdGVzLmZvckVhY2goKGVkZ2UpID0+IHtcbiAgICBpZiAoIWRlc2NlbmRhbnRzLmNvbnRhaW5zKGVkZ2Uuc291cmNlKCkpKSB7XG4gICAgICBjb2xsYXBzZWROb2RlLmN5KCkuYWRkKHtcbiAgICAgICAgZ3JvdXA6ICdlZGdlcycsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBzb3VyY2U6IGVkZ2Uuc291cmNlKCkuaWQoKSxcbiAgICAgICAgICB0YXJnZXQ6IGNvbGxhcHNlZE5vZGUuaWQoKVxuICAgICAgICB9LFxuICAgICAgICBjbGFzc2VzOiAnY29tcG91bmRjb2xsYXBzZS1tZXRhLWVkZ2UnXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoIWRlc2NlbmRhbnRzLmNvbnRhaW5zKGVkZ2UudGFyZ2V0KCkpKSB7XG4gICAgICBjb2xsYXBzZWROb2RlLmN5KCkuYWRkKHtcbiAgICAgICAgZ3JvdXA6ICdlZGdlcycsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICB0YXJnZXQ6IGVkZ2UudGFyZ2V0KCkuaWQoKSxcbiAgICAgICAgICBzb3VyY2U6IGNvbGxhcHNlZE5vZGUuaWQoKVxuICAgICAgICB9LFxuICAgICAgICBjbGFzc2VzOiAnY29tcG91bmRjb2xsYXBzZS1tZXRhLWVkZ2UnXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufTtcblxuY29uc3QgY29sbGFwc2VDb3JlID0gKG5vZGUpID0+IHtcbiAgbm9kZS5kYXRhKCdjb21wb3VuZGNvbGxhcHNlLmNvbGxhcHNlZCcsIHRydWUpO1xuICBub2RlLmRhdGEoJ2NvbXBvdW5kY29sbGFwc2Uuc2l6ZS1iZWZvcmUnLCBub2RlLmxheW91dERpbWVuc2lvbnMoe30pKTtcblxuICBjb25zdCBjb21wb3VuZENoaWxkcmVuID0gbm9kZS5jaGlsZHJlbigpLmZpbHRlcigoZWxlKSA9PiBlbGUuaXNQYXJlbnQoKSk7XG4gIGNvbXBvdW5kQ2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IGNvbGxhcHNlQ29yZShjaGlsZCkpO1xuXG4gIGFkZE1ldGFFZGdlcyhub2RlKTtcbiAgY29uc3QgY29sbGFwc2VkQ29sbGVjdGlvbiA9IG5vZGUuY2hpbGRyZW4oKS51bmlvbihub2RlLmNoaWxkcmVuKCkuY29ubmVjdGVkRWRnZXMoKSk7XG4gIFxuICBub2RlLmRhdGEoJ2NvbXBvdW5kY29sbGFwc2UuY29sbGFwc2VkLWNvbGxlY3Rpb24nLCBjb2xsYXBzZWRDb2xsZWN0aW9uKTtcbiAgY29sbGFwc2VkQ29sbGVjdGlvbi5yZW1vdmUoKTtcbiAgbm9kZS5kYXRhKCdjb21wb3VuZGNvbGxhcHNlLnNpemUtYWZ0ZXInLCBub2RlLmxheW91dERpbWVuc2lvbnMoe30pKTtcbn07XG5cblxuY29uc3QgY29sbGFwc2UgPSAobm9kZSwgb3B0cykgPT4ge1xuICBub2RlLnRyaWdnZXIoJ2NvbXBvdW5kY29sbGFwc2UuYmVmb3JlLWNvbGxhcHNlJyk7XG4gIGNvbGxhcHNlQ29yZShub2RlKTtcbiAgbm9kZS50cmlnZ2VyKCdjb21wb3VuZGNvbGxhcGVzLmFmdGVyLWNvbGxhcHNlJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbGxhcHNlO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb2xsZWN0aW9uL2NvbGxhcHNlLmpzIiwiY29uc3QgcmVtb3ZlTWV0YUVkZ2VzID0gKG5vZGUpID0+IHtcbiAgbm9kZS5jb25uZWN0ZWRFZGdlcygnLmNvbXBvdW5kY29sbGFwc2UtbWV0YS1lZGdlJykucmVtb3ZlKCk7XG59O1xuXG5jb25zdCBleHBhbmQgPSAobm9kZSwgb3B0cykgPT4ge1xuICBub2RlLnRyaWdnZXIoJ2NvbXBvdW5kY29sbGFwc2UuYmVmb3JlLWV4cGFuZCcpO1xuIFxuICBub2RlLmRhdGEoJ2NvbXBvdW5kY29sbGFwc2UuY29sbGFwc2VkJywgZmFsc2UpO1xuICByZW1vdmVNZXRhRWRnZXMobm9kZSk7XG4gIG5vZGUuZGF0YSgnY29tcG91bmRjb2xsYXBzZS5jb2xsYXBzZWQtY29sbGVjdGlvbicpLnBvc2l0aW9ucyhub2RlLnBvc2l0aW9uKCkpO1xuICBub2RlLmRhdGEoJ2NvbXBvdW5kY29sbGFwc2UuY29sbGFwc2VkLWNvbGxlY3Rpb24nKS5yZXN0b3JlKCk7XG4gIG5vZGUucmVtb3ZlRGF0YSgnY29tcG91bmRjb2xsYXBzZS5jb2xsYXBzZWQtY29sbGVjdGlvbicpO1xuXG4gIG5vZGUudHJpZ2dlcignY29tcG91bmRjb2xsYXBzZS5hZnRlci1leHBhbmQnKTtcblxufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cGFuZDtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY29sbGVjdGlvbi9leHBhbmQuanMiLCJjb25zdCBpbXBsID0gcmVxdWlyZSgnLi9jb2xsZWN0aW9uJyk7XG5cbi8vIHJlZ2lzdGVycyB0aGUgZXh0ZW5zaW9uIG9uIGEgY3l0b3NjYXBlIGxpYiByZWZcbmxldCByZWdpc3RlciA9IGZ1bmN0aW9uKCBjeXRvc2NhcGUgKXtcbiAgaWYoICFjeXRvc2NhcGUgKXsgcmV0dXJuOyB9IC8vIGNhbid0IHJlZ2lzdGVyIGlmIGN5dG9zY2FwZSB1bnNwZWNpZmllZFxuXG4gIGN5dG9zY2FwZSggJ2NvbGxlY3Rpb24nLCAnY29sbGFwc2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgZWxlcyA9IHRoaXM7XG4gICAgaW1wbC5jb2xsYXBzZShlbGVzKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9KTsgLy8gcmVnaXN0ZXIgd2l0aCBjeXRvc2NhcGUuanNcblxuICBjeXRvc2NhcGUoICdjb2xsZWN0aW9uJywgJ2V4cGFuZCcsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBlbGVzID0gdGhpcztcbiAgICBpbXBsLmV4cGFuZChlbGVzKTtcbiAgICBcbiAgICByZXR1cm4gdGhpcztcbiAgfSk7XG5cbiAgY3l0b3NjYXBlKCAnY29sbGVjdGlvbicsICdpc0NvbGxhcHNlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBlbGVzID0gdGhpcztcbiAgICBjb25zdCBub2RlID0gZWxlc1swXTtcblxuICAgIHJldHVybiBpbXBsLmlzQ29sbGFwc2VkKG5vZGUpO1xuICB9KTtcblxuICBjeXRvc2NhcGUoICdjb2xsZWN0aW9uJywgJ2lzRXhwYW5kZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgZWxlcyA9IHRoaXM7XG4gICAgY29uc3Qgbm9kZSA9IGVsZXNbMF07XG5cbiAgICByZXR1cm4gaW1wbC5pc0V4cGFuZGVkKG5vZGUpO1xuICB9KTtcblxuICBjeXRvc2NhcGUoICdjb2xsZWN0aW9uJywgJ21ldGFFZGdlcycsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBlbGVzID0gdGhpcztcbiAgXG4gICAgcmV0dXJuIGVsZXMuZWRnZXMoKS5maWx0ZXIoZWRnZSA9PiBpbXBsLmlzTWV0YUVkZ2UoZWRnZSkpO1xuICB9KTtcblxufTtcblxuaWYoIHR5cGVvZiBjeXRvc2NhcGUgIT09ICd1bmRlZmluZWQnICl7IC8vIGV4cG9zZSB0byBnbG9iYWwgY3l0b3NjYXBlIChpLmUuIHdpbmRvdy5jeXRvc2NhcGUpXG4gIHJlZ2lzdGVyKCBjeXRvc2NhcGUgKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZWdpc3RlcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VSb290IjoiIn0=