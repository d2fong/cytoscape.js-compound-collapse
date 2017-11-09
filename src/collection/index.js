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
    eles.filter(ele => this.isExpanded(ele)).forEach(ele => collapseImpl(ele));
  },
  expand (eles) {
    eles.filter(ele => this.isCollapsed(ele)).forEach(ele => expandImpl(ele));
  }

};

module.exports = api;