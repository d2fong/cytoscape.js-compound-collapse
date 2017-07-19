const opts = {
  repositionNodesAfter: 'both' // reposition nodes on expand or reclaim space on collapse,
  // can be one of 'both', 'collapse', 'expand'
}

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
    const siblings = sameDepthNodesRelativeTo(this.cy, node);
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

// restore nodes
// restore meta edges
// reposition nodes independant of layout option
// think about interactions between supplying a layout and not supplying a layout
const expand = (node, opts) => {
  node.trigger('compoundcollapse.before-expand');
  node.data('compoundcollapse.collapsed-collection').positions(node.position());
  node.data('compoundcollapse-collapsed-collection').restore();

  if (opts.layout) {
    const layout = node.children().layout(opts.layout).run();
    layout.pon('layoutstop').then((evt) => {
      const curSize = node.layoutDimensions();
      const prevSize = node.data('compoundcollapse.size-after');


      const sizeDiff = {
        x: ( curSize.w - prevSize.w )  / 2,
        y: ( curSize.h - prevSize.h ) / 2
      };
      const nodePos = node.position();
      const siblings = sameDepthNodesRelativeTo(siblings);

      siblings.forEach((sibling) => {
        const sibPos = sibling.position();
        sibling.position({
          x: sibPos.x > nodePos.x ? sibPos.x + sizeDiff.x : sibPos.x - sizeDiff.x,
          y: sibPos.y > nodePos.y ? sibPos.y + sizeDiff.y : sibPos.y - sibPos.y 
        });
      });
      node.trigger('compoundcollapse.after-expand');
    });
  }
};

const isOuterNode = (node, root) => {
  return (node !== root) && !node.ancestors().contains(root);
};

const lowestCommonAncestor = (nodes) => nodes.commonAncestors().first();