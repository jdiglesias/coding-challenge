"use strict";
const bst = require("../lib/bst");
// Print all entries, across all of the sources, in chronological order.

module.exports = (logSources, printer) => {
  // initialize the tree with one log from each source. 
  // the earliest log is guaranteed to be one of these
  const tree = {};
  for(let i = 0; i<logSources.length; i++){
    const node = {
      val: logSources[i].last,
      left: null,
      right: null,
      index: i,
    };
    bst.insert(tree, node);
  }
  let logNode;
  // now display the earliest log and insert the next earliest log from the same source. 
  // as long as we have the earliest remaining log from each source in the tree at all times, popping from the tree gives us the next log to print
  do{
    logNode = bst.pop(tree);
    if(logNode){
      printer.print(logNode.val);
      const next = logSources[logNode.index].pop();
      const nextNode = {
        val: next,
        left: null,
        right: null,
        index: logNode.index
      };

      if(next){
        bst.insert(tree, nextNode);
      }
    }
  }while(logNode);

  printer.done();
  
    
  return console.log("Sync sort complete.");
};
