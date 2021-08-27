"use strict";

// this defines a self-balancing binary tree. 
// this tree maintains the constraint that the height difference between the left and right subtree of any node is no greater than one.
// because of this, we can insert and pop from it in log(n) time.

function addLeft(child, parent, grandparent, greatgrandparent, tree){
  return add("left", child, parent, grandparent, greatgrandparent, tree);
}

function addRight(child, parent, grandparent, greatgrandparent, tree){
  return add("right", child, parent, grandparent, greatgrandparent, tree);
}

function add(dir, child, parent, grandparent, greatgrandparent, tree){
  const oppositeDir = dir == "left" ? "right" : "left";
  const grandparentDir = grandparent && grandparent.left === parent ? "left" : "right";
  const grandparentOppositeDir =  grandparentDir === "left" ? "right" : "left";
  if(grandparent && !grandparent[grandparentOppositeDir] && !parent[oppositeDir]){
    // we now have two levels that arent full, we must rebalance to maintain log(n) tree height
    const newRoot = grandparentDir === dir ? parent : child;
    if(greatgrandparent){
      // theres a great grandparent node to attach the new root to
      if(grandparent === greatgrandparent.left){
        greatgrandparent.left = newRoot;
      }
      else{
        greatgrandparent.right = newRoot;
      }
    }
    else{
      // without a great grandparent, the new root of the subtree after rebalance is actually the root of the whole tree
      tree.root = newRoot;
    }
    if(newRoot === child){
      child[dir] = grandparent;
      child[oppositeDir] = parent;
    }
    else{
      parent[dir] = child;
      parent[oppositeDir] = grandparent;
    }
    grandparent[grandparentDir] = null;
  }
  else{
    parent[dir] = child;
  }
  return true;
}

function pop(tree){
  if(!tree.root){
    return false;
  }
  let curSmallest = tree.root;
  let parent, grandparent;
  while(curSmallest.left){
    grandparent = parent;
    parent = curSmallest;
    curSmallest = curSmallest.left;
  }
  if(curSmallest === tree.root){
    delete tree.root;
    return curSmallest;
  }
  const smallestSibling = parent.right;
  if(curSmallest.right){
    // theres a right node that can replace the smallest
    parent.left = curSmallest.right
  }
  else if(smallestSibling && (smallestSibling.left || smallestSibling.right)){
    // popping off the smallest will leave an unbalanced right tree, rebalance
    const newRoot = smallestSibling.left ? smallestSibling.left : smallestSibling;    
    if(grandparent){
      grandparent.left = newRoot;
    }
    else{
      tree.root = newRoot;
    }

    parent.right = null;

    if(smallestSibling.left){
      // the newRoot is the left node of the smallest sibling. move it to the top
      newRoot.left = parent
      newRoot.right = smallestSibling
      smallestSibling.left = null;
    }
    else{
      smallestSibling.left = parent;
    }

    parent.left = null;
  }
  else{
    // no rebalance, just pop it off
    parent.left = null;
  }

  return curSmallest;
}

function insert(tree, child, parent=null, grandparent=null, greatgrandparent=null){
  if(!tree.root){
    tree.root = child;
    return true;
  }
  if(!parent){
    parent = tree.root;
  }

  if(child.val.date <= parent.val.date){
    if(parent.left){
      return insert(tree, child, parent.left, parent, grandparent);
    }
    else{
      return addLeft(child, parent, grandparent, greatgrandparent, tree);
    }
  }
  else{
    if(parent.right){
      return insert(tree, child, parent.right, parent, grandparent);
    }
    else{
      return addRight(child, parent, grandparent, greatgrandparent, tree);
    }
  }
}
module.exports.insert = insert;
module.exports.pop = pop;
