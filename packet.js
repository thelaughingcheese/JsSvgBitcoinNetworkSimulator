function Packet(sender, reciever, block){
	this.sender = sender;
	this.reciever = reciever;
	this.block = block;
	this.elapsed = 0;
	
	this.box = document.createElementNS(svgNS,"rect");
	this.box.setAttribute("fill","#00ff47");
	this.box.setAttribute("height","10");
	this.box.setAttribute("width","10");
	this.box.setAttribute("x",parseInt(this.sender.box.getAttribute("x"))+20);
	this.box.setAttribute("y",parseInt(this.sender.box.getAttribute("y"))+20);
	
	packetLayer.appendChild(this.box);
}

Packet.prototype.update = function(){
	this.elapsed++;
	var deltaX = parseInt(this.reciever.box.getAttribute("x")) - parseInt(this.sender.box.getAttribute("x"));
	var deltaY = parseInt(this.reciever.box.getAttribute("y")) - parseInt(this.sender.box.getAttribute("y"));
	var maxTime = parseInt(this.reciever.delay) + parseInt(this.sender.delay);
	var completionRatio = this.elapsed/maxTime;
	this.box.setAttribute("x",parseInt(this.sender.box.getAttribute("x")) + deltaX*completionRatio +20);
	this.box.setAttribute("y",parseInt(this.sender.box.getAttribute("y")) + deltaY*completionRatio +20);
	
	if(completionRatio >= 1){
		this.reciever.recieveBlock(this.block, this.sender);
		packetLayer.removeChild(this.box);
		return 1;
	}
	return 0;
}