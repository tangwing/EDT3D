

///Dijkstra
/// alpha : table of indices
/// beta : table of successors
function dijkstra(alpha, beta, src, dest)
{
	alpha[src+1] = beta.length;
	var path = []
	var dist = []
	var father = new Array();
	father[src] = 0;
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
	log(date.getFullYear()+" "+date.getMonth()+" "+date.getDay()+" "+ date.getHours()+" "+ date.getMinutes())
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