const util = require('./util');

// turn all incoming/outgoing edges into meta edges 
// i.e all edges coming/going from the collapsed node's children 
// will now point to the collapsed node itself
const collapseEdges = (collapsedNode) => {
  const collapsedCollection = collapsedNode.union(collapsedNode.descendants());

  const outgoerEdges = collapsedCollection.outgoers();
  const incomerEdges = collapsedCollection.incomers();
  const connectingEdges = outgoerEdges.union(incomerEdges);

  connectingEdges.filter((edge) => !util.isMetaEdge(edge)).forEach((edge) => {
    edge.addClass('meta-edge');
    edge.scratch('_original-endpoints', {source: edge.source(), target: edge.target()});
  });

  incomerEdges.forEach((incomerEdge) => {
    incomerEdge.move({
      target: collapsedNode.id()
    });
  });

  outgoerEdges.forEach((outgoerEdge) => {
    outgoerEdge.move({
      source: collapsedNode.id()
    });
  });
};

const collapse = (node, opts) => {
  node.trigger('compoundcollapse.before-collapse');
  node.data('compoundcollapse.size-before', node.layoutDimensions());

  collapseEdges(node);

  const collapsedCollection = node.descendants();
  
  node.data('compoundcollapse.collapsed-collection', collapsedCollection);
  collapsedCollection.remove();
  node.data('compoundcollapse.size-after', node.layoutDimensions());

  if (opts.repositionNodesAfter === 'both' || opts.repositionNodesAfter === 'collapse') {
    const sizeDiff = {
      x: ( node.data('compoundcollapse.size-before').w - node.data('compoundcollapse.size-after').w ) / 2,
      y: ( node.data('compoundcollapse.size-before').h - node.data('compoundcollapse.size-after').h ) / 2
    };
    const siblings = util.sameDepthNodesRelativeTo(this.cy, node);
    const nodePos = node.position();
    siblings.forEach((sibling) => {
      const sibPos = sibling.position();
      sibling.position({
        x: sibPos.x > nodePos.x ? sibPos.x - sizeDiff.x : sibPos.x + sizeDiff.x,
        y: sibPos.y > nodePos.y ? sibPos.y - sizeDiff.y : sibPos.y + sibPos.y 
      });
    });
  }

  node.trigger('compoundcollapes.after-collapse');
};


module.exports = collapse;