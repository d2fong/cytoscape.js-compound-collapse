const util = require('./util');

const expandEdges = (node) => {
  const metaEdges = node.connectedEdges('.compoundcollapse-meta-edge');
  metaEdges.forEach((edge) => {
    const originalEndPoints = edge.data('compoundcollapse.original-endpoints');
    const curSrc = edge.source();
    const curTgt = edge.target();

    if (curSrc === node.id() && originalEndPoints.source.inside()) {
      edge.move({
        source: originalEndPoints.source
      });
    }

    if (curTgt === node.id() && originalEndPoints.target.inside()) {
      edge.move({
        target: originalEndPoints.target
      });
    }
    
    if (edge.source() === originalEndPoints.source() 
      && edge.target() === originalEndPoints.target()) {
        edge.removeClass('compoundcollapse-meta-edge');
        edge.removeData('compoundcollapse.original-endpoints');
    }
  });
};

// restore nodes
// restore meta edges
// reposition nodes independant of layout option
// think about interactions between supplying a layout and not supplying a layout
const expand = (node, opts) => {
  node.trigger('compoundcollapse.before-expand');
  node.data('compoundcollapse.collapsed', false);
  node.data('compoundcollapse.collapsed-collection').positions(node.position());
  node.data('compoundcollapse.collapsed-collection').restore();

  node.removeData('compoundcollapse.collapsed-collection');

  node.trigger('compoundcollapse.after-expand');

};


module.exports = expand;