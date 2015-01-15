function Connection(peer1, peer2){
	this.peer1 = peer1;
	this.peer2 = peer2;
	
	this.line = document.createElementNS(svgNS,"line");
	this.line.setAttribute("stroke","grey");
	this.line.setAttribute("stroke-width","2");
	this.update();
	connectionLayer.appendChild(this.line);
}

Connection.prototype.update = function(){
	this.line.setAttribute("x1",parseInt(this.peer1.box.getAttribute("x"))+25);
	this.line.setAttribute("y1",parseInt(this.peer1.box.getAttribute("y"))+25);
	this.line.setAttribute("x2",parseInt(this.peer2.box.getAttribute("x"))+25);
	this.line.setAttribute("y2",parseInt(this.peer2.box.getAttribute("y"))+25);
}

Connection.prototype.remove = function(){
	connectionLayer.removeChild(this.line);
}