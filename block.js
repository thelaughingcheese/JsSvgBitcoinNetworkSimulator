function Block(id, prev, proof, timeStamp, difficulty, color){
	this.id = id;
	this.prevBlockId = prev;
	this.proof = proof;
	this.timeStamp = timeStamp;
	this.difficulty = difficulty;
	this.color = color;
}