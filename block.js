function Block(id, depth, prev, proof, timeStamp, difficulty, color){
	this.id = id;
	this.depth = depth;
	this.prevBlock = prev;
	this.proof = proof;
	this.timeStamp = timeStamp;
	this.difficulty = difficulty;
	this.color = color;
}