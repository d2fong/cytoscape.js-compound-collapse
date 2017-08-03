const util = require('./util');

const expandEdges = (node) => {
  node.connectedEdges('.compoundcollapse-meta-edge').remove();
};

// restore nodes
// restore meta edges
// reposition nodes independant of layout option
// think about interactions between supplying a layout and not supplying a layout
const expand = (node, opts) => {
  node.trigger('compoundcollapse.before-expand');
  node.data('compoundcollapse.collapsed', false);

  expandEdges(node);

  node.data('compoundcollapse.collapsed-collection').positions(node.position());
  node.data('compoundcollapse.collapsed-collection').restore();

  node.removeData('compoundcollapse.collapsed-collection');

  node.trigger('compoundcollapse.after-expand');

};


module.exports = expand;