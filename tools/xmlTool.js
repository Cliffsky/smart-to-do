
var xpath = require('xpath');
var dom = require('xmldom').DOMParser;
var fs = require('fs');

var filePath = "/vagrant/smart-to-do/batteries.xml";   // Assume this returns a fully qualified XML file path
var doc;

try {
    var fileData = fs.readFileSync(filePath, 'ascii');
    doc = new dom().parseFromString(fileData.substring(2, fileData.length));
    console.log("File '" + filePath + "/ was successfully read.");
} catch (ex) {
    console.log("Unable to read file '" + filePath + "'.");
    console.log(ex);
    throw ex;
}


// console.log(Object.getPrototypeOf(doc));

// console.log(doc.);

// // var nodes = xpath.select("book", doc);

// // console.log(nodes.length);
// // console.log(nodes[0])

// console.log('----');

// console.log(doc.getElementsByTagName('ItemSearchResponse').item(0).getElementsByTagName('Items').item(0).getElementsByTagName('Item').item[0]);







// /////////////////////////////////


// itemsNodeList = doc.getElementsByTagName('ItemSearchResponse').item(0).getElementsByTagName('Items').item(0).getElementsByTagName('Item')

// itemsArray = Array.prototype.slice.call(itemsNodeList)   // array of Nodes

// item0.getElementsByTagName('Title').item(0).firstChild.data

// item0.getElementsByTagName('LargeImage').item(0).getElementsByTagName('URL').item(0).firstChild.data





// function domNodesGoInByTagName(nodes, tagname){
//   return nodes.map((node) => {
//     Array.prototype.slice.call(node.getElementsByTagName(tagname))
//   }).reduce((a, b) => a.concat(b));
// }

// function domNodeGetText(node){
//   return node.firstChild.data;
// }


function unfuckXmlDoc(xmlDoc){
  this.nodes = [xmlDoc];
}
unfuckXmlDoc.prototype.tag = function(tagname){
  // console.log("tagname: ", tagname, "where this.nodes has " + this.nodes.length + " nodes")
  // if (!this.nodes) { console.log("angry tagname: ", tagname) }
  var next = new unfuckXmlDoc();
  var new_node_array = [];
  for (let i=0; i<this.nodes.length; i++){
    var new_node_list = this.nodes[i].getElementsByTagName(tagname);
    for (let j=0; j<new_node_list.length; j++){
      new_node_array.push(new_node_list.item(j))
    }
  }
  next.nodes = new_node_array;
  return next;
}
unfuckXmlDoc.prototype.text = function(){
  // console.log("text, where this.nodes has " + this.nodes.length + " nodes")
  // if (!this.nodes) { console.log("angry text")}
  return this.nodes.map((thing) => thing.firstChild.data);
}
unfuckXmlDoc.prototype.makeNicHappy = function(){
  return this.nodes.map((node) => {
    var badIdea = new unfuckXmlDoc(node);
    var ans = {};
    ans.title = badIdea.tag('Title').text()[0];
    ans.largeImage = badIdea.tag('LargeImage').tag('URL').text()[0];
    return ans;
  })
}

module.exports = unfuckXmlDoc;

insanity = new unfuckXmlDoc(doc);

console.log(insanity.tag('ItemSearchResponse').tag('Items').tag('Item').makeNicHappy());

