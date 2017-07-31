const api = {
  isCollapsed (node) {
    return node.data('compound.collapse-collapsed');
  },
  isExpanded (node) {
    return !this.isCollapsed(node);
  },
  collapse (eles) {
  },
  expand (eles) {
  }
};

module.exports = api;