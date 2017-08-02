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

  // if (opts.layout) {
  //   const layout = node.children().layout(opts.layout).run();
  //   layout.pon('layoutstop').then((evt) => {
  //     const curSize = node.layoutDimensions();
  //     const prevSize = node.data('compoundcollapse.size-after');


  //     const sizeDiff = {
  //       x: ( curSize.w - prevSize.w )  / 2,
  //       y: ( curSize.h - prevSize.h ) / 2
  //     };
  //     const nodePos = node.position();
  //     const siblings = util.sameDepthNodesRelativeTo(siblings);

  //     siblings.forEach((sibling) => {
  //       const sibPos = sibling.position();
  //       sibling.position({
  //         x: sibPos.x > nodePos.x ? sibPos.x + sizeDiff.x : sibPos.x - sizeDiff.x,
  //         y: sibPos.y > nodePos.y ? sibPos.y + sizeDiff.y : sibPos.y - sibPos.y 
  //       });
  //     });
  //   });
  // }
  node.trigger('compoundcollapse.after-expand');

};


module.exports = expand;