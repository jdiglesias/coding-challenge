"use strict";
const bst = require("../lib/bst");

// Print all entries, across all of the *async* sources, in chronological order.
//
// This functions similarly to the synchronous implementation except that initially requests logs from all the log sources at once using Promise.all()
// and then awaits popAsync thereafter
//

module.exports = (logSources, printer) => {
  return new Promise((resolve, reject) => {
    const tree = {};
    Promise.all(logSources.map((src, i) => Promise.all([src.popAsync(), Promise.resolve(i)])))
      .then(async (results) =>  { 
        results.map(([log, index]) => {
          const node = {
            val: log,
            left: null,
            right: null,
            index: index,
          };
          bst.insert(tree, node);
        });
        let logNode;
        do{
          logNode = bst.pop(tree);
          if(logNode){
            printer.print(logNode.val);
            const next = await logSources[logNode.index].popAsync();
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

      });
    
    printer.done();
    resolve(console.log("Async sort complete."));
  });
};
