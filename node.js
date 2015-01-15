function Node(_x, _y){
	this.delay = 30;
	this.power = 5;
	this.peers = new Array();
	this.blocks = new Array();
	this.blocks.push(genesisBlock);
	this.currentBlock = genesisBlock;
	this.currentBlockDepth = 0;
	
	this.connections = new Array();
	this.box = document.createElementNS(svgNS,"rect");
	this.box.setAttribute("fill","#00c2ff");
	this.box.setAttribute("stroke","#98e2ff");
	this.box.setAttribute("stroke-width","5px");
	this.box.setAttribute("height","50");
	this.box.setAttribute("width","50");
	this.box.setAttribute("x",-25);
	this.box.setAttribute("y",-25);
	nodeLayer.appendChild(this.box);
	
	var self = this;
	this.box.addEventListener("mouseup",function(){self.mouseUp();},false);
	this.box.addEventListener("mousedown",function(){self.mouseDown();},false);
	
	this.setPos(_x, _y);
}

Node.prototype.mouseUp = function(evt){
	if(mode == 0 && mouseX == mouseDownX && mouseY == mouseDownY && modifier == 0){
		if(selected != this){
			this.select();
		}
		else{
			this.deselect();
		}
	}
	else if(mode == 0 && modifier == 1){
		var index = selected.isPeer(this);
		if(index < 0){
			selected.addPeer(this);
		}
		else{
			selected.removePeer(index);
		}
	}
	else if(mode == 1){
		moving = null;
	}
}

Node.prototype.mouseDown = function(evt){
	mouseX = event.clientX;
	mouseY = event.clientY;
	
	if(mode == 1){
		moving = this;
		movingOffsetX = this.box.getAttribute("x") - screenToWorldX(mouseX);
		movingOffsetY = this.box.getAttribute("y") - screenToWorldY(mouseY);
	}
}

Node.prototype.update = function(){
	for(i in this.connections){
		this.connections[i].update();
	}
}

Node.prototype.select = function(){
	if(selected != null){
		selected.deselect();
	}
	selected = this;
	this.box.setAttribute("stroke","#00ffc2");
	
	document.getElementById("delayInput").value = this.delay;
	document.getElementById("powerInput").value = this.power;
	
	drawChain(this);
}

Node.prototype.deselect = function(){
	selected = null;
	this.box.setAttribute("stroke","#98e2ff");
	
	document.getElementById("delayInput").value = "";
	document.getElementById("powerInput").value = "";
	
	drawChain(null);
}

Node.prototype.mine = function(generator){
	for(var i=0;i<this.power;i++){
		var proof = Math.round(generator()*1000000000000);
		if(proof < this.currentBlock.difficulty){
			this.createBlock(proof);
			return;
		}
	}
}

Node.prototype.createBlock = function(proof){
	var difficultyTarget;
	
	if((this.currentBlock.depth+1) % adjustmentInterval == 0){
		var lastAdjustBlock = this.currentBlock;
		for(var i=1;i<adjustmentInterval;i++){
			lastAdjustBlock = lastAdjustBlock.prevBlock;
		}
		var difficultyTarget = this.currentBlock.difficulty*((time - lastAdjustBlock.timeStamp)/(target*adjustmentInterval));
		difficultyTarget = Math.max(difficultyTarget,this.currentBlock.difficulty/4);
		difficultyTarget = Math.min(difficultyTarget,this.currentBlock.difficulty*4);
	}
	else{
		var difficultyTarget = this.currentBlock.difficulty;
	}
	
	var block = new Block(nextId++,this.currentBlock.depth+1,this.currentBlock,proof,time,difficultyTarget,"#00ff00");
	this.recieveBlock(block,this);
	this.currentBlock = block;
}

Node.prototype.addPeer = function(peer){
	this.peers.push(peer);
	peer.peers.push(this);
	
	var connect = new Connection(this,peer);
	this.connections.push(connect);
	peer.connections.push(connect);
}

Node.prototype.removePeer = function(index){
	var peer = this.peers[index];
	var peerIndex = peer.isPeer(this);
	peer.peers.splice(peerIndex,1);
	peer.connections.splice(peerIndex,1);
	
	this.connections[index].remove();
	
	this.peers.splice(index,1);
	this.connections.splice(index,1);
}

Node.prototype.isPeer = function(peer){
	for(i in this.peers){
		if(this.peers[i] == peer){
			return i;
		}
	}
	return -1;
}

Node.prototype.recieveBlock = function(block, sender){
	if(this.hasBlock(block)){
		return;	
	}
	
	if(!this.hasBlock(block.prevBlock)){
		this.requestBlock(block.prevBlock.id,sender);
	}
	this.blocks.push(block);
	
	for(i in this.peers){
		if(sender != this.peers[i]){
			packets.push(new Packet(this,this.peers[i],block));
		}
	}
	
	if(activeViewingBlock == this){
		extendChain(block,this);
	}
	
	//change curently mining block
	var depth = this.getBlockDepth(block);
	if(depth > this.currentBlockDepth){
		this.currentBlock = block;
		this.currentBlockDepth = depth;
	}
}

Node.prototype.hasBlock = function(block){
	for(i in this.blocks){
		if(this.blocks[this.blocks.length - 1 - i] == block){
			return true;
		}
	}
	return false;
}

Node.prototype.requestBlock = function(blockId,sender){
	var newBlock = sender.getBlock(blockId);
	if(!this.hasBlock(newBlock.prevBlock)){
		this.requestBlock(newBlock.prevBlock.id,sender);
	}
	this.blocks.push(newBlock);
}

Node.prototype.getBlock = function(blockId){
	for(i in this.blocks){
		if(this.blocks[this.blocks.length - 1 - i].id == blockId){
			return this.blocks[this.blocks.length - 1 - i];
		}
	}
	return null;
}

Node.prototype.getBlockDepth = function(block){
	var depth = 0;
	
	var checkBlock = block;
	while(checkBlock.id != 0){
		checkBlock = checkBlock.prevBlock;
		depth++;
	}
	
	return depth;
}

Node.prototype.setPos = function(_x, _y){
	this.box.setAttribute("x",_x);
	this.box.setAttribute("y",_y);
	this.update();
}