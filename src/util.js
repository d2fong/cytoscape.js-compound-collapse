// get nodes that don't have a parent or nodes with a parent not found in
// the input collection
const topLevelNodes = (eles) => {
  return eles.nodes().filter((ele) => {
    return ele.isOrphan() || (ele.isChild() && !eles.contain(ele.parent()));
  });
};

// node is a child -> node's siblings
// node is an orphan -> all the orphans
const sameDepthNodesRelativeTo =  (cy, node) => {
  if (node.isChild()) {
    return node.siblings();
  } else {
    return cy.nodes().orphans();
  }
};

const isMetaEdge = (edge) => edge.hasClass('meta-edge');

// turn all incoming/outgoing edges into meta edges 
// i.e all edges coming/going from the collapsed node's children 
// will now point to the collapsed node itself
const collapseEdges = (collapsedNode) => {
  const collapsedCollection = collapsedNode.union(collapsedNode.descendants());

  const outgoerEdges = collapsedCollection.outgoers();
  const incomersEdges = collapsedCollection.incomers();
  const connectingEdges = outgoerEdges.union(incomerEdges);

  connectingEdges.filter((edge) => !isMetaEdge(edge)).forEach((edge) => {
    edge.addClass('meta-edge');
    edge.scratch('_original-endpoints', {source: edge.source(), target: edge.target()});
  });

  incomerEdges.forEach((incomerEdge) => {
    incomerEdge.move({
      target: collapsedNode.id()
    });
  });

  outgoerEdges.forEach((outGoerEdge) => {
    outgoerEdges.move({
      source: collapsedNode.id()
    });
  });
};

// find first non-removed ancestor including the node
const nonRemovedParent = (node) => {
  let current = node;

  while (current.removed()) {
    current = current.parent();
  }

  return current;
}

const expandEdges = (node) => {
  const metaEdges = node.connectedEdges('.meta-edge');

  metaEdges.forEach((edge) => {
    const originalEndPoints = edge.scratch('_original-endpoints');
    const curSrc = edge.source();
    const curTgt = edge.target();

    if (curSrc === node.id()) {
      edge.move({
        source: nonRemovedParent(originalEndPoints.source).id()
      });
    } else {
      edge.move({
        target: nonRemovedParent(originalEndPoints.target).id()
      });
    }
    
    if (edge.source() === originalEndPoints.source() 
      && edge.target() === originalEndPoints.target()) {
        edge.removeClass('meta-edge');
        edge.removeScratch('_original-endpoints');
    }
  });
};

const isOuterNode = (node, root) => {
  return (node !== root) && !node.ancestors().contains(root);
};

const lowestCommonAncestor = (nodes) => nodes.commonAncestors().first();