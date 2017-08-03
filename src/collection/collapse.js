// turn all incoming/outgoing edges into meta edges 
// i.e all edges coming/going from the collapsed node's children 
// will now point to the collapsed node itself
const collapseEdges = (collapsedNode) => {
  const descendants = collapsedNode.descendants();
  const metaEdgeCandidates = descendants.connectedEdges();

  metaEdgeCandidates.forEach((edge) => {
    if (!descendants.contains(edge.source())) {
      collapsedNode.cy().add({
        group: 'edges',
        data: {
          source: edge.source().id(),
          target: collapsedNode.id()
        },
        classes: 'compoundcollapse-meta-edge'
      });
    }

    if (!descendants.contains(edge.target())) {
      collapsedNode.cy().add({
        group: 'edges',
        data: {
          target: edge.target().id(),
          source: collapsedNode.id()
        },
        classes: 'compoundcollapse-meta-edge'
      });
    }
  });
};

const collapse = (node, opts) => {
  node.trigger('compoundcollapse.before-collapse');
  node.data('compoundcollapse.collapsed', true);
  node.data('compoundcollapse.size-before', node.layoutDimensions({}));

  collapseEdges(node);

  const collapsedCollection = node.descendants().union(node.descendants().connectedEdges());
  
  node.data('compoundcollapse.collapsed-collection', collapsedCollection);
  collapsedCollection.remove();
  node.data('compoundcollapse.size-after', node.layoutDimensions({}));

  node.trigger('compoundcollapes.after-collapse');
};


module.exports = collapse;