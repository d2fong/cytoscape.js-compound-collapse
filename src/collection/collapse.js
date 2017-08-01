const util = require('./util');

// turn all incoming/outgoing edges into meta edges 
// i.e all edges coming/going from the collapsed node's children 
// will now point to the collapsed node itself
const collapseEdges = (collapsedNode) => {
  const descendants = collapsedNode.descendants();
  const metaEdgeCandidates = descendants.connectedEdges();

  metaEdgeCandidates.forEach((edge) => {
    if (!descendants.contains(edge.source())) {
      edge.move({
        target: collapsedNode.id() 
      });
      edge.addClass('compoundcollapse.meta-edge');
    }

    if (!descendants.contains(edge.target())) {
      edge.move({
        source: collapsedNode.id()
      });
      edge.addClass('compoundcollapse.meta-edge');
    }
  });
};

const collapse = (node, opts) => {
  node.trigger('compoundcollapse.before-collapse');
  node.data('compoundcollapse.size-before', node.layoutDimensions({}));

  collapseEdges(node);

  const collapsedCollection = node.descendants();
  
  node.data('compoundcollapse.collapsed-collection', collapsedCollection);
  collapsedCollection.remove();
  node.data('compoundcollapse.size-after', node.layoutDimensions({}));

  node.trigger('compoundcollapes.after-collapse');
};


module.exports = collapse;