function NodeExport(_id, _x, _y, _delay, _power, _peers){
	this.id = _id;
	this.x = _x;
	this.y = _y;
	this.delay = _delay;
	this.power = _power;
	this.peers = new Array();
	
	for(var i=0;i<_peers.length;i++){
		this.peers.push(_peers[i].id);
	}
}