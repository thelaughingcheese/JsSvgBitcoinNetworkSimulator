function BlockNode(_block,_x,_y){
	this.data = _block;
	this.x = 0;
	this.y = 0;
	this.spacing = 10;
	this.width = 70;
	this.parent = null;
	this.children = new Array();
	this.lines = new Array();
	
	this.box = document.createElementNS(svgNS,"rect");
	this.label = document.createElementNS(svgNS,"text");
	
	this.box.setAttribute("fill",this.data.color);
	this.box.setAttribute("id",Math.random());
	this.box.setAttribute("height","50");
	this.box.setAttribute("width","50");
	
	this.label.setAttribute("x",this.x);
	this.label.setAttribute("y",this.y);
	this.label.textContent = this.data.id;
	
	this.setPos(_x,_y);
	
	var self = this;
	this.box.addEventListener("mousemove",function(evt){self.mouseMove(evt);},false);
	this.box.addEventListener("mouseout",function(evt){self.mouseOut(evt);},false);
	this.label.addEventListener("mousemove",function(evt){self.mouseMove(evt);},false);
	this.label.addEventListener("mouseout",function(evt){self.mouseOut(evt);},false);

	chainNodes.appendChild(this.box);
	chainNodes.appendChild(this.label);
}

BlockNode.prototype.mouseMove = function(evt){
	mouseX = evt.clientX - viewportWidth*0.8;
	mouseY = evt.clientY;

	chainInfo.setAttribute("transform","translate("+(mouseX)+","+(mouseY)+")");
	chainInfo.style.visibility = "visible";
	
	document.getElementById("chainInfoId").textContent = "ID: " + this.data.id;
	document.getElementById("chainInfoProof").textContent = "Proof: " + this.data.proof;
	document.getElementById("chainInfoDifficulty").textContent = "Difficulty: " + this.data.difficulty;
}

BlockNode.prototype.mouseOut = function(evt){
	chainInfo.style.visibility = "hidden";
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
	
	for(var i=0;i<this.children.length;i++){
		this.children[i].setLocalPos(_x,_y);
		this.lines[i].setAttribute("x1",this.x+25);
		this.lines[i].setAttribute("y1",this.y+50);
		this.lines[i].setAttribute("x2",this.children[i].x+25);
		this.lines[i].setAttribute("y2",this.children[i].y);
	}
}

BlockNode.prototype.addChild = function(child){
	this.children.push(child);
	child.parent = this;
	
	var line = document.createElementNS(svgNS,"line");
	line.setAttribute("x1",this.x+25);
	line.setAttribute("y1",this.y+50);
	line.setAttribute("stroke","black");
	line.setAttribute("stroke-width","2");
	chainConnections.appendChild(line);
	this.lines.push(line);
	
	this.resize();
}

BlockNode.prototype.remove = function(){
	chainNodes.removeChild(this.box);
	chainNodes.removeChild(this.label);
	
	for(i in this.lines){
		chainConnections.removeChild(this.lines[i]);
	}
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
		
		this.lines[i].setAttribute("x2",this.children[i].x+25);
		this.lines[i].setAttribute("y2",this.children[i].y);
	}
	
	if(this.parent != null){
		this.parent.resize();
	}
	
	//alert(this.data.id);
	//console.log(blockNodes);
}