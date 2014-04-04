

///////////////////// Graph structure - Dijkstra ///////////////
Array.prototype.initWith = function (val){
	for(var i=0; i<this.length; i++) this[i]=val;
}
Array.prototype.minValInd = function (){
	var ind = 0
	for(var i=1; i<this.length; i++) 
		if(this[i]<this[ind])ind=i;
	return i;
}

//Graph
function Graph()
{
	this.nodeList = new Array();

	//voisin = node id & la distance
	Graph.prototype.Voisin = function (id, dist)
	{
		this.id = id; this.dist = dist;
	}

	Graph.prototype.addFriends = function(id, arrVoisin)
	{
		//log(this.nodeList);
		//log(this.nodeList[id]);
		if( !this.nodeList[id]) this.nodeList[id] = new Array();
		//log(this.nodeList[id]);

		for(var voisin in arrVoisin)this.nodeList[id].push(voisin);
	}

	this.dijkstra = function(src, dest) //Defined for each object
	{
		var path=new Array(this.nodeList.length);
		var explored=new Array(this.nodeList.length);
		var dist = new Array(this.nodeList.length);
		var father = new Array(this.nodeList.length);
		debugger;
		explored.initWith(false);
		dist.initWith(9999999);
		father.initWith(-1);
		dist[src] = 0;

		for(var i=0; i<this.nodeList.length; i++)
		{
			var cur = 0;
			var flag = false;
			for(var i2=1; i2<this.nodeList.length; i++){
				if(explored[i2]==false && this[i2]<this[cur]){
					cur=i2;
					flag=true;
				}
			}
			if(flag)return []; //No path found

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

}

function dijkstra(alpha, beta, src, dest)
{
	alpha[src+1] = beta.length;
	var path = []
	
	for(var i=0; i<alpha.length; i++)
	{
		for(var j= alpha[src]; j< alpha[src+1]; j++) //for all sons
		{
			//if( dist[beta[j]] == Undifined || dist[])
		}
	}

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
	if(str.length<13)throw "Date string illegal!"
	this.setFullYear(str.substr(0,4))
	this.setMonth(str.substr(4,2)-1)
	this.setDate(str.substr(6,2))
	this.setHours(str.substr(9,2))
	this.setMinutes(str.substr(11,2))
	return this
}

/////////////////////// No need to go down /////////////////////////
function log(msg){console.log(msg)}

function testAnything()
{
	var date = new Date().fromStampICS("20140507T141500Z")
	log("[testAnything]")
	//log(date.getFullYear()+" "+date.getMonth()+" "+date.getDay()+" "+ date.getHours()+" "+ date.getMinutes())
	var graph = new Graph();
	graph.addFriends(0, [{id:1, dist:1},{id:2, dist:4}])
	graph.addFriends(1, [{id:0, dist:1},{id:2, dist:2}])
	graph.addFriends(2, [{id:0, dist:4},{id:1, dist:2},{id:3, dist:2}])
	graph.addFriends(3, [{id:2, dist:2}])
	var path = graph.dijkstra(0,3)
	log(path);
}


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