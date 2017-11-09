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
  node.data('compoundCollapse.collapsed', true);
  node.data('compoundCollapse.sizeBefore', node.layoutDimensions({}));

  const compoundChildren = node.children().filter((ele) => ele.isParent());
  compoundChildren.forEach((child) => collapseCore(child));

  addMetaEdges(node);
  const collapsedCollection = node.children().union(node.children().connectedEdges());
  
  node.data('compoundCollapse.collapsedCollection', collapsedCollection);
  collapsedCollection.remove();
  node.data('compoundCollapse.sizeAfter', node.layoutDimensions({}));
  node.addClass('compoundcollapse-collapsed-node');
};


const collapse = (node, opts) => {
  node.trigger('compoundCollapse.beforeCollapse');
  collapseCore(node);
  node.trigger('compoundCollapse.afterCollapse');
};

module.exports = collapse;