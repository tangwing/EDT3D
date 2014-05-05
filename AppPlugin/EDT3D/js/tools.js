/////////////////// Test ANYTHING !!! YES!!!! ANYTHING!!!!!! ////
function testAnything()
{
	var date = new Date().fromStampICS("20140507T141500Z")
	log("[testAnything]")
	//debugger;
	//log(date.getFullYear()+" "+date.getMonth()+" "+date.getDay()+" "+ date.getHours()+" "+ date.getMinutes())
	var graph = getRoomGraph();
	var path = graph.dijkstra(29,103); //从oc到turing怎么走？！
	//path = graph.dijkstra(59,60); 
	log(path.toString());

	$.post( "http://edt.univ-tours.fr/direct/gwtdirectplanning/CorePlanningServiceProxy ", { func: "getNameAndTime" }, function( data ) {
	  console.log( data); // John
	  //console.log( data.time ); // 2pm
	}, "json");
}

////////////////////////////////// Global functions ///////////////////////////////
/// Draw path according to a list of critical points
/// path: an array containing indexes of control points
function drawPath(path){
	var geometry = new THREE.Geometry();
	for(var i=0; i<path.length-1; i++){
		//drawLine(points[path[i]], points[path[i+1]]);
		geometry.vertices.push(points[path[i]]);
		geometry.vertices.push(points[path[i+1]]);
	}
	var material = new THREE.LineBasicMaterial({
        color: 0x0000ff
    });
    var line = new THREE.Line( geometry, material );

}


/// Create the graph of rooms for finding the shortest path
function getRoomGraph(){
	if(this.g) return this.g;
	else this.g = new Graph(false);
	//Rez de chaussez
	this.g.addNeighborChain(5,[4,3,70,78,1], //,71
							[0, 0,9,15,12]);//,16
	this.g.addNeighborChain(1,[72,6,2,  8,79],//, 74,80
							[20,20,40,20,40]);//,7,10
	this.g.addNeighborChain(72,[73,0,75,77,73,6],
							[ 60,35,15,15,10,45]);
	this.g.addNeighborChain(2,[73,10,9,8],[37,25,5,15]);
	this.g.addNeighbor(76,75,20);
	this.g.addNeighbor(7,79,23);
	this.g.addNeighbor(12,90,20);
	//1er Etage
	this.g.addNeighborChain(84, [81,22,23,24,25,85,84,83], //,82
		[20,5,5,20,20,5,20,5]);//,25
	this.g.addNeighborChain(83,[17,18,19,15,16,20,21,13,14,89,90],//,92,76],
							   [14, 0,15,30,0 ,0 , 0,25, 0,15,13]);//,30,70
	this.g.addNeighborChain(90, [34,33,32,31,29,28,27,26,86,85],
								[15,20,20,30,20,5,30,20,15,20]);
	this.g.addNeighbor(86,73, 70);
	this.g.addNeighborChain(31,[91], //,10,88,87,80
		[35]);//,20, 70
	this.g.addNeighbor(91,30,20);
	//2ème Etage
	this.g.addNeighborChain(97, [95,50,51],[20,5,15]); 
	this.g.addNeighborChain(97,[44,43,42,41,45,46,39,40,47,38,48,37,49,36,99],	//,102,92
							   [10,10,15,0,0,10,10,0,0,20,0,10,0,20,15]);		//,30,70
	this.g.addNeighborChain(99,[60,59,57,58,61],//,101,100,87
		[25,60,25,0,25]); //,15,20,70
	this.g.addNeighborChain(97,[53,54,55,56,59],[30,25,25,30,25]);
	//Lier les étages
	this.g.addNeighborChain(70, [81,95], [85,85]); //We've removed some points for simplity of path, so we need to augmente the distance
	this.g.addNeighborChain(75, [90,99], [85,85]);
	this.g.addNeighborChain(79, [91,58], [85,85]);
	this.g.addNeighbor(103, 29, 35);
	this.g.addNeighbor(103, 2, 17);
	this.g.addNeighbor(103, 6, 43);
	this.g.addNeighbor(103, 10, 5);
	this.g.addNeighbor(103, 73, 23);

	return this.g;
}


///////////////////// Graph structure - Dijkstra ///////////////
Array.prototype.initWith = function (val){
	for(var i=0; i<this.length; i++) this[i]=val;
}

//Graph
function Graph(isOriented){
	this.isOriented = isOriented;
	this.nodeList = new Array();
}
///
/// Add a pair of neighbors
///
Graph.prototype.addNeighbor = function(idSrc, idNei, dist)
{
	if( !this.nodeList[idSrc]) this.nodeList[idSrc] = new Array();
	var voisin ={id:idNei, dist:dist};
	if( this.nodeList[idSrc].indexOf(voisin) == -1) this.nodeList[idSrc].push( voisin);
	if(this.isOriented == false){
		if( !this.nodeList[idNei]) this.nodeList[idNei] = new Array();
	    voisin ={id:idSrc, dist:dist};
		if( this.nodeList[idNei].indexOf(voisin) == -1)
			this.nodeList[idNei].push( voisin);
	}
}


//Add a chain of neighbors
//id : the first node of the chain
//arrNeighborChine : arr of ids of neighbors
//arrDists : distances between every pair of neighbors
Graph.prototype.addNeighborChain = function(id, arrNeighborChain, arrDist){
	if(arrNeighborChain.length<1 || arrNeighborChain.length!=arrDist.length) 
		throw "Bad usage of Graph.addNeighborChain";

	var voisin;
	if( !this.nodeList[id]) this.nodeList[id] = new Array(); //Create node if necessary
	voisin ={id:arrNeighborChain[0], dist:arrDist[0]};
	if( this.nodeList[id].indexOf(voisin) == -1) this.nodeList[id].push( voisin);
	if(this.isOriented == false){
		if( !this.nodeList[arrNeighborChain[0]]) this.nodeList[arrNeighborChain[0]] = new Array();
	    voisin ={id:id, dist:arrDist[0]};
		if( this.nodeList[arrNeighborChain[0]].indexOf(voisin) == -1)
			this.nodeList[arrNeighborChain[0]].push( voisin);
	}

	for(var i=0; i<arrNeighborChain.length-1; i++){
		var vid = arrNeighborChain[i];
		var vid2 = arrNeighborChain[i+1];
		if( !this.nodeList[vid]) this.nodeList[vid] = new Array();
		var voisin ={id:vid2, dist:arrDist[i+1]}; 
		if( this.nodeList[vid].indexOf(voisin) == -1)
			this.nodeList[vid].push( voisin);
		if(this.isOriented == false){ //Add the reverse relation
			if( !this.nodeList[vid2]) this.nodeList[vid2] = new Array();
			voisin ={id:vid, dist:arrDist[i+1]};
			if( this.nodeList[vid2].indexOf(voisin) == -1)
				this.nodeList[vid2].push(voisin);
		}
	}
}
///
/// Dijkstra: shortest path
///
Graph.prototype.dijkstra = function(src, dest) //Defined for each object
{
	var path=new Array;
	var explored=new Array(this.nodeList.length);
	var dist = new Array(this.nodeList.length);
	var father = new Array(this.nodeList.length);
	explored.initWith(false);
	dist.initWith(9999999);
	father.initWith(-1);
	dist[src] = 0;

	
	for(var i=0; i<this.nodeList.length; i++)
	{
		var cur = -1;
		var tmpDist = 999999;
		//Find the nearest node in the dist array
		for(var i2=0; i2<this.nodeList.length; i2++){
			if(this.nodeList[i2] && explored[i2]==false && dist[i2]<tmpDist){
				cur=i2;
				tmpDist=dist[i2];
			}
		}
		if(cur==-1)return []; //All node explored, no path found

		if(cur == dest)
		{//finish
			var tmp=dest;
			while( father[tmp] != -1)
			{
				path.push(tmp);
				tmp = father[tmp];
			}
			path.push(src);
			path.reverse();
			return path;
		}else{
			//debugger
			this.nodeList[cur].forEach(function(voisin){
				if(dist[cur]+voisin.dist < dist[voisin.id]){
					father[voisin.id] = cur;
					dist[voisin.id]=dist[cur]+voisin.dist;
				}
			});
			explored[cur]=true;
		}
	}
	return path;
}

/////////////////////// Date conversion /////////////////////
// from dd-mm-yyyy to yyyymmdd
function yyyymmdd(date){
	var dd = date.substr(0,2);
	var mm = date.substr(3,2);
	var yyyy = date.substr(6,4);
	return yyyy+mm+dd;
}

/////////////////////// Date conversion /////////////////////
Date.prototype.yyyymmdd = function() {
   var yyyy = this.getFullYear().toString();
   var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = this.getDate().toString();
   return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
};

Date.prototype.fromStampICS = function(str)
{
	if(str.length<13)throw "Date string illegal!";
	this.setUTCFullYear(str.substr(0,4));
	this.setUTCMonth(str.substr(4,2)-1);
	this.setUTCDate(str.substr(6,2));
	this.setUTCHours(str.substr(9,2));
	this.setUTCMinutes(str.substr(11,2));
	return this;
}

/////////////////////// No need to go down /////////////////////////
function log(msg){console.log(msg)}

function test3js()
{
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	var geometry = new THREE.CubeGeometry(1,1,1);
	var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	var cube = new THREE.Mesh( geometry, material );
	scene.add( cube );

	camera.position.z = 5;

	function render() {
		requestAnimationFrame(render);
		renderer.render(scene, camera);
		cube.rotation.x += 0.01;
		cube.rotation.y += 0.01;

	}
	render();
}