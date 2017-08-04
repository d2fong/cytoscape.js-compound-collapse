const addMetaEdges = (collapsedNode) => {
  const descendants = collapsedNode.children();
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

const collapseCore = (node) => {
  node.data('compoundcollapse.collapsed', true);
  node.data('compoundcollapse.size-before', node.layoutDimensions({}));

  const compoundChildren = node.children().filter((ele) => ele.isParent());
  compoundChildren.forEach((child) => collapseCore(child));

  addMetaEdges(node);
  const collapsedCollection = node.children().union(node.children().connectedEdges());
  
  node.data('compoundcollapse.collapsed-collection', collapsedCollection);
  collapsedCollection.remove();
  node.data('compoundcollapse.size-after', node.layoutDimensions({}));
};


const collapse = (node, opts) => {
  node.trigger('compoundcollapse.before-collapse');
  collapseCore(node);
  node.trigger('compoundcollapes.after-collapse');
};

module.exports = collapse;