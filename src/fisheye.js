const util = require('./util');

const fishEyeMove = (node, dx, dy) => {
  if (node.isChildless()) {
    node.position({
      x: node.position('x') + dx,
      y: node.position('y') + dy
    });
  } else {
    node.children().forEach((child) => fishEyeMove(child, dx, dy));
  }
};


// node needs:
// width before fisheye
// height before fisheye
// x before fisheye
// y before fisheye
const fishEyeExpand = (cy, node) => {
  const siblings = util.sameDepthNodesRelativeTo(node, cy);

  const fishHBefore = node.data('height-before-fisheye');
  const fishWBefore = node.data('width-before-fisheye');
  const fishXBefore = node.data('x-before-fisheye');
  const fishYBefore = node.data('y-before-fisheye');
  const ow = node.outerWidth();
  const oh = node.outerHeight();

  let d_x_left = Math.abs((fishWBefore - ow) / 2);
  let d_x_right = Math.abs((fishWBefore - ow) / 2);
  let d_y_upper = Math.abs((fishHBefore - oh) / 2);
  let d_y_lower = Math.abs((fishHBefore - oh) / 2);


  const relativePosInParent = (node) => {
    return {
      x: node.relativePosition('x') + ( node.parent().width() / 2 ),
      y: node.relativePosition('y') + ( node.parent().height() / 2 )
    };
  };

  const {x: nodeX, y: nodeY} = node.isChild() ? relativePosInParent(node) : node.position();
  const xDiff = Math.abs(fishXBefore - nodeX);
  const yDiff = Math.abs(fishYBefore - nodeY);

  // Center went to LEFT
  if (node.data('x-before-fisheye') > nodeX) {
    d_x_left = d_x_left + xDiff;
    d_x_right = d_x_right - xDiff;
  }
  // Center went to RIGHT
  else {
    d_x_left = d_x_left - xDiff;
    d_x_right = d_x_right + xDiff;
  }

  // Center went to UP
  if (node.data('y-before-fisheye') > nodeY) {
    d_y_upper = d_y_upper + yDiff;
    d_y_lower = d_y_lower - yDiff;
  }
  // Center went to DOWN
  else {
    d_y_upper = d_y_upper - yDiff;
    d_y_lower = d_y_lower + yDiff;
  }

  siblings.forEach((sibling) => {
    const {x: sibX, y: sibY} = node.isChild() ? relativePosInParent(node) : node.position();
    const slope = (sibY - nodeY) / (sibX - nodeX);

    let dx = 0;
    let dy = 0;
    let tx = 0;
    let ty = 0;

    if (nodeX > sibX) {
      dx = d_x_left;
    } else {
      dx = d_x_right;
    }

    if (nodeY > sibY) {
      dy = d_y_upper;
    } else {
      dy = d_y_lower;
    }

    if (isFinite(slope)) {
      tx = Math.min(dx, (dy / Math.abs(slope)));
    }

    if (slope !== 0) {
      ty = Math.min(dy, (dx * Math.abs(slope)));
    }

    if (nodeX > sibX) {
      tx *= -1;
    }

    if (nodeY > sibY) {
      ty *= -1;
    }
    fishEyeMove(sibling, tx, ty);
  });

};

