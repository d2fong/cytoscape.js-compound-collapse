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

const barrowEdges = (node) => {
  const collapsedCollection = node.union(node.descendants());
  const collapsedComplement = collapsedCollection.complement();

  const connectingEdges = collapsedCollection.edgesWith(collapsedComplement);

  connectingEdges.forEach((edge) => {
    const src = edge.source();
    const tgt = edge.target();

    if (!isMetaEdge(edge)) {
      edge.scratch('_original-endpoints', {source: src, target: tgt});
      edge.addClass('meta-edge');
    }

    edge.move({
      source: collapsedCollection.contains(src) ? src.id() : node.id(),
      target: collapsedCollection.contains(tgt) ? tgt.id() : node.id()
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

const repairEdges = (node) => {
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