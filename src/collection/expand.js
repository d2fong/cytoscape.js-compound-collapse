const util = require('./util');

const expandEdges = (node) => {
  const metaEdges = node.connectedEdges('.meta-edge');

  metaEdges.forEach((edge) => {
    const originalEndPoints = edge.scratch('_original-endpoints');
    const curSrc = edge.source();
    const curTgt = edge.target();

    if (curSrc === node.id()) {
      edge.move({
        source: util.nonRemovedParent(originalEndPoints.source).id()
      });
    } else {
      edge.move({
        target: util.nonRemovedParent(originalEndPoints.target).id()
      });
    }
    
    if (edge.source() === originalEndPoints.source() 
      && edge.target() === originalEndPoints.target()) {
        edge.removeClass('meta-edge');
        edge.removeScratch('_original-endpoints');
    }
  });
};

// restore nodes
// restore meta edges
// reposition nodes independant of layout option
// think about interactions between supplying a layout and not supplying a layout
const expand = (node, opts) => {
  node.trigger('compoundcollapse.before-expand');
  node.removeData('compundcollapse.collapsed');
  node.data('compoundcollapse.collapsed', true);
  node.data('compoundcollapse.collapsed-collection').positions(node.position());
  node.data('compoundcollapse.collapsed-collection').restore();
  node.removeData('compoundcollapse.collapsed-collection');

  node.trigger('compoundcollapse.after-expand');

};


module.exports = expand;