const removeMetaEdges = (node) => {
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