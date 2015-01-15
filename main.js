var svgNS = "http://www.w3.org/2000/svg";

var mouseX = 0, mouseY = 0;
var mouseDownX = 0; mouseDownY = 0, mouseIsDown = false;

var viewport;
var viewportScaler;
var viewportTranslater;
var viewportX = 0, viewportY = 0, viewportXStart = 0; viewportYStart = 0;
var viewportScale = 1.0;
var viewportHeight = 0, viewportWidth = 0;

var nodeLayer;
var connectionLayer;
var packetLayer;

var chainView;
var chainViewScaler;
var chainViewTranslater;
var chainViewX = 100, chainViewY = 100, chainViewXStart = 0; chainViewYStart = 0;
var chainViewScale = 1.0;

var chainConnections;
var chainNodes;

/*--- mode ---
0 - pan/select
1 - move
---*/
var mode = 0;
/*--- active modifier ---
0 - none
1 - modify connections
---*/
var modifier = 0;
var selected = null;
var moving = null;
var movingOffsetX = 0;
var movingOffsetY = 0;
var nodes = new Array();
var packets = new Array();
var blockNodes = new Array();
var nextId = 1;
var time = 0;
var simulate = true;

var genesisBlock = new Block(0,0,0,0,999000000000, "#00ff00");
genesisBlock.prevBlock = genesisBlock

var rng = new Math.seedrandom("seed");

var difficulty = 999000000000;
var target = 400;

var activeViewingBlock;

window.onload = function(){
	nodeLayer = document.getElementById("nodes");
	connectionLayer = document.getElementById("connections");
	packetLayer = document.getElementById("packets");
	
	viewport = document.getElementById("viewport");
	viewportScaler = document.getElementById("viewportScale");
	viewportTranslater = document.getElementById("viewportTranslate");
	viewportHeight = viewport.scrollHeight;
	viewportWidth = viewport.clientWidth;
	viewportX = viewportWidth/2;
	viewportY = viewportHeight/2;
	viewportTranslate.setAttribute("transform","translate("+viewportX+","+viewportY+")");
	
	viewport.addEventListener("mousedown", viewportMouseDown,false);
	viewport.addEventListener("mouseup", viewportMouseUp, false);
	viewport.addEventListener("mouseout", viewportMouseUp, false);
	viewport.addEventListener("mousewheel", viewportScroll, false);
	viewport.addEventListener("mousemove", viewportMove, false);
	
	chainView = document.getElementById("chainView");
	chainViewScaler = document.getElementById("chainViewScale");
	chainViewTranslater = document.getElementById("chainViewTranslate");
	
	chainConnections = document.getElementById("chainConnections");
	chainNodes = document.getElementById("chainNodes");
	
	chainView.addEventListener("mousedown", chainViewMouseDown,false);
	chainView.addEventListener("mouseup", chainViewMouseUp, false);
	chainView.addEventListener("mouseout", chainViewMouseUp, false);
	chainView.addEventListener("mousewheel", chainViewScroll, false);
	chainView.addEventListener("mousemove", chainViewMove, false);
	
	//ui
	var panButton = document.getElementById("panButton");
	var moveButton = document.getElementById("moveButton");
	var newButton = document.getElementById("newButton");
	var connectButton = document.getElementById("connectButton");
	
	var startButton = document.getElementById("startButton");
	var stopButton = document.getElementById("stopButton");
	
	var delayInput = document.getElementById("delayInput");
	var powerInput = document.getElementById("powerInput");
	
	panButton.addEventListener("mouseup", panClick, false);
	moveButton.addEventListener("mouseup", moveClick, false);
	newButton.addEventListener("mouseup", newClick, false);
	connectButton.addEventListener("mouseup", connectClick, false);
	
	startButton.addEventListener("mouseup", startSim, false);
	stopButton.addEventListener("mouseup", stopSim, false);
	
	delayInput.addEventListener("keyup", delayKeyUp, false);
	powerInput.addEventListener("keyup", powerKeyUp, false);
	
	setInterval(tick,25);
	//ui.appendChild(moveButton);
	// test and debug

	//---------------
}

/*window.onmousemove = function(event){
	mouseX = event.clientX;
	mouseY = event.clientY;
	
	if(mouseIsDown && mode == 0){
		viewportX = mouseX - mouseDownX + viewportXStart;
		viewportY = mouseY - mouseDownY + viewportYStart;
		
		viewportTranslate.setAttribute("transform","translate("+viewportX+","+viewportY+")");
	}
	
	if(mode == 1 && moving != null){
		moving.setPos(screenToWorldX(mouseX)+movingOffsetX,screenToWorldY(mouseY)+movingOffsetY);
	}
}*/

function tick(){
	if(!simulate){
		return;
	}
	
	//mine blocks
	for(i in nodes){
		nodes[i].mine(rng);
	}
	
	for(var i=0;i<packets.length;i++){
		if(packets[i].update() == 1){
			packets.splice(i,1);
			i--;
		}
	}
	
	time++;
}

function startSim(){
	simulate = true;
}

function stopSim(){
	simulate = false;
}

function delayKeyUp(evt){
	if(selected != null){
		selected.delay = document.getElementById("delayInput").value;
	}
}

function powerKeyUp(evt){
	if(selected != null){
		selected.power = document.getElementById("powerInput").value;
	}
}

function panClick(evt){
	mode = 0;
}

function moveClick(evt){
	mode = 1;
	modifier = 0;
}

function newClick(evt){
	var node = new Node(screenToWorldX(650),screenToWorldY(500));
	nodes.push(node);
	
	//drawChain(node);
}

function connectClick(evt){
	if(mode == 0 && selected != null && modifier == 0){
		modifier = 1;
		document.getElementById("connectButton").setAttribute("xlink:href","http://bc-injury-law.com/blog/wp-content/uploads/bc-injury-law-real-and-substantial-connection1.jpg");
	}
	else{
		modifier = 0;
		document.getElementById("connectButton").setAttribute("xlink:href","http://www.eightforums.com/attachments/network-sharing/14091d1357164106t-internet-connection-drops-every-couple-minutes-cable-sxchu-internet.jpg");
	}
}

//main viewport

function viewportMouseDown(evt){
	if(evt.which == 1){
		mouseDownX = mouseX;
		mouseDownY = mouseY;
		viewportXStart = viewportX;
		viewportYStart = viewportY;
		mouseIsDown = true;
	}
}

function viewportMouseUp(evt){
	if(evt.which == 1){
		mouseIsDown = false;	
	}
}

function viewportScroll(evt){
	if(evt.wheelDelta >= 0){
		viewportX -= ((mouseX-viewportX)*0.2);
		viewportY -= ((mouseY-viewportY)*0.2);
		viewportScale *= 1.2;
	}
	else{
		viewportX += ((mouseX-viewportX)*0.2);
		viewportY += ((mouseY-viewportY)*0.2);
		viewportScale *= 0.8;
	}
	viewportTranslate.setAttribute("transform","translate("+viewportX+","+viewportY+")");
	viewportScaler.setAttribute("transform","scale(" + viewportScale + ")");
}

function viewportMove(evt){
	mouseX = evt.clientX;
	mouseY = evt.clientY;
	
	if(mouseIsDown && mode == 0){
		viewportX = mouseX - mouseDownX + viewportXStart;
		viewportY = mouseY - mouseDownY + viewportYStart;
		
		viewportTranslate.setAttribute("transform","translate("+viewportX+","+viewportY+")");
	}
	
	if(mode == 1 && moving != null){
		moving.setPos(screenToWorldX(mouseX)+movingOffsetX,screenToWorldY(mouseY)+movingOffsetY);
	}
}

//chain viewer
function chainViewMouseDown(evt){
	if(evt.which == 1){
		mouseDownX = mouseX;
		mouseDownY = mouseY;
		chainViewXStart = chainViewX;
		chainViewYStart = chainViewY;
		mouseIsDown = true;
	}
}

function chainViewMouseUp(evt){
	if(evt.which == 1){
		mouseIsDown = false;	
	}
}

function chainViewScroll(evt){
	if(evt.wheelDelta >= 0){
		chainViewX -= ((mouseX-chainViewX)*0.2);
		chainViewY -= ((mouseY-chainViewY)*0.2);
		chainViewScale *= 1.2;
	}
	else{
		chainViewX += ((mouseX-chainViewX)*0.2);
		chainViewY += ((mouseY-chainViewY)*0.2);
		chainViewScale *= 0.8;
	}

	chainViewTranslate.setAttribute("transform","translate("+chainViewX+","+chainViewY+")");
	chainViewScaler.setAttribute("transform","scale(" + chainViewScale + ")");
}

function chainViewMove(evt){
	mouseX = evt.clientX - viewportWidth*0.8;
	mouseY = evt.clientY;

	if(mouseIsDown){
		chainViewX = mouseX - mouseDownX + chainViewXStart;
		chainViewY = mouseY - mouseDownY + chainViewYStart;
		
		chainViewTranslate.setAttribute("transform","translate("+chainViewX+","+chainViewY+")");
	}
}

function drawChain(node){
	//remove old nodes
	for(i in blockNodes){
		blockNodes[i].remove();
	}
	blockNodes = new Array();
	
	if(node == null){
		return;
	}
	
	activeViewingBlock = node;
	blockNodes.push(new BlockNode(node.blocks[0],-25,-25));
	
	for(var i=1;i<node.blocks.length;i++){
		var blockNode = new BlockNode(node.blocks[i],0,0);
		var prevBlockNode = getBlockNode(node.blocks[i].prevBlock);
		
		blockNodes.push(blockNode);
		prevBlockNode.addChild(blockNode);
	}
}

function extendChain(block,node){
	var blockNode = new BlockNode(block,0,0);
	var prevBlockNode = getBlockNode(block.prevBlock);
	
	if(prevBlockNode == null){
		extendChain(block.prevBlock,node);
	}
	
	prevBlockNode = getBlockNode(block.prevBlock);

	blockNodes.push(blockNode);
	prevBlockNode.addChild(blockNode);
}

//util

function getBlockNode(block){
	for(i in blockNodes){
		if(blockNodes[blockNodes.length - 1 - i].data == block){
			return blockNodes[blockNodes.length - 1 - i];
		}
	}
}

function screenToWorldX(_x){
	return (_x - viewportX)/viewportScale;
}

function screenToWorldY(_y){
	return (_y - viewportY)/viewportScale;
}