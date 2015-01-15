function BlockNode(_block,_x,_y){
	this.data = _block;
	this.x = 0;
	this.y = 0;
	this.spacing = 10;
	this.width = 70;
	this.parent = null;
	this.children = new Array();
	
	this.box = document.createElementNS(svgNS,"rect");
	this.label = document.createElementNS(svgNS,"text");
	
	this.box.setAttribute("fill","#00ff00");
	this.box.setAttribute("id",Math.random());
	this.box.setAttribute("height","50");
	this.box.setAttribute("width","50");
	
	this.label.setAttribute("x",this.x);
	this.label.setAttribute("y",this.y);
	this.label.textContent = this.data.id;
	
	this.setPos(_x,_y);
	
	chainNodes.appendChild(this.box);
	chainNodes.appendChild(this.label);
}

BlockNode.prototype.setPos = function(_x,_y){
	var deltaX = _x - this.x;
	var deltaY = _y - this.y;
	
	this.setLocalPos(deltaX,deltaY);
}

BlockNode.prototype.setLocalPos = function(_x,_y){
	this.x += _x;
	this.y += _y;
	
	this.label.setAttribute("x",this.x+20);
	this.label.setAttribute("y",this.y+28);
	
	this.box.setAttribute("x",this.x);
	this.box.setAttribute("y",this.y);
	
	for(i in this.children){
		this.children[i].setLocalPos(_x,_y);
	}
}

BlockNode.prototype.addChild = function(child){
	this.children.push(child);
	child.parent = this;
	
	this.resize();
	/*this.width = 0;
	for(i in this.children){
		this.width += this.children[i].width;
	}
	this.width = Math.max(70,this.width);
	
	//child.setPos(this.x + 0,this.y + 50 + this.spacing);
	
	if(this.parent != null){
		this.parent.resize();
	}*/
}

BlockNode.prototype.remove = function(){
	chainNodes.removeChild(this.box);
	chainNodes.removeChild(this.label);
}

BlockNode.prototype.resize = function(){
	this.width = 0;
	for(i in this.children){
		this.width += this.children[i].width;
	}
	this.width = Math.max(70,this.width);
	
	var usedWidth = 0;
	var len = this.children.length;
	//for(i in this.children){
	for(var i=0;i<this.children.length;i++){
		this.children[i].setPos(this.x - this.width/2 + usedWidth + this.children[i].width/2,this.y + 50 + this.spacing);
		usedWidth += this.children[i].width;
	}
	
	if(this.parent != null){
		this.parent.resize();
	}
	
	//alert(this.data.id);
	//console.log(blockNodes);
}