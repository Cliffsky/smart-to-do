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

modules.exports = unfuckXmlDoc;

insanity = new unfuckXmlDoc(doc);

console.log(insanity.tag('ItemSearchResponse').tag('Items').tag('Item').makeNicHappy());
