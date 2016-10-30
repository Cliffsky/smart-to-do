function unfuckXmlDoc(xmlDoc){
  this.nodes = [xmlDoc];
}
unfuckXmlDoc.prototype.tag = function(tagname){
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
  return this.nodes.map((thing) => thing.firstChild.data);
}
unfuckXmlDoc.prototype.findMany = function(){
  return this.nodes.map((node) => {
    var badIdea = new unfuckXmlDoc(node);
    var ans = {};
    ans.name = badIdea.tag('Title').text()[0];
    ans.id = badIdea.tag('ASIN').text()[0];
    ans.img = badIdea.tag('LargeImage').tag('URL').text()[0];
    ans.category = 4;
    ans.length = 20;
    return ans;
  })
}

unfuckXmlDoc.prototype.findOne = function(){
  return this.nodes.map((node) => {
    var badIdea = new unfuckXmlDoc(node);
    var ans = {};
    ans.name = badIdea.tag('Title').text()[0];
    ans.id = badIdea.tag('ASIN').text()[0];
    ans.length = 20;
    ans.img = badIdea.tag('LargeImage').tag('URL').text()[0];
    ans.price = badIdea.tag('ItemAttributes').tag('ListPrice').tag('FormattedPrice').text()[0];
    ans.label = badIdea.tag('ItemAttributes').tag('Label').text()[0];
    ans.category = 4;
    return ans;
  })
}

module.exports = unfuckXmlDoc;
