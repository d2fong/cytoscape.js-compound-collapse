const util = {
  // get nodes that don't have a parent or nodes with a parent not found in
  // the input collection
  topLevelNodes(eles) {
    return eles.nodes().filter((ele) => {
      return ele.isOrphan() || (ele.isChild() && !eles.contain(ele.parent()));
    });
  },
  // node is a child -> node's siblings
  // node is an orphan -> all the orphans
  sameDepthNodesRelativeTo(cy, node) {
    if (node.isChild()) {
      return node.siblings();
    } else {
      return cy.nodes().orphans();
    }
  },
  isMetaEdge(edge) {
    return edge.hasClass('meta-edge');
  },
  nonRemovedParent(node) {
    let current = node;

    while (current.removed()) {
      current = current.parent();
    }

    return current;
  },
  isOuterNode(node, root) {
    return (node !== root) && !node.ancestors().contains(root);
  },
  lowestCommonAncestor(nodes) {
    return  nodes.commonAncestors().first();
  }

};

module.exports = util;