const removeMetaEdges = (node) => {
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