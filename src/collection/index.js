const collapseImpl = require('./collapse');

const api = {
  isCollapsed (node) {
    return node.data('compound.collapse-collapsed');
  },
  isExpanded (node) {
    return !this.isCollapsed(node);
  },
  isMetaEdge (edge) {
    return edge.hasClass('compound.collapse-meta-edge');
  },
  collapse (eles) {
    eles.forEach(ele => collapseImpl(eles));
  },
  expand (eles) {
  }

};

module.exports = api;