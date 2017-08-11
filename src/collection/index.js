const collapseImpl = require('./collapse');
const expandImpl = require('./expand');

const api = {
  isCollapsed (node) {
    return node.data('compoundCollapse.collapsed');
  },
  isExpanded (node) {
    return !this.isCollapsed(node);
  },
  isMetaEdge (edge) {
    return edge.hasClass('compoundcollapse-meta-edge');
  },
  collapse (eles) {
    eles.forEach(ele => collapseImpl(ele));
  },
  expand (eles) {
    eles.forEach(ele => expandImpl(ele));
  }

};

module.exports = api;