var camera, scene, renderer, container;
var mesh;
var controls;

var lines=[];
var salle_color = {
	blank:0x000000,
	class:0xFFFF00};
var position = function(x,y,z) {
  this.x=x;
  this.y=y;
  this.z=z;
};
var size = function(length,width,height) {
	this.length = length;
	this.width=width;
	this.height=height;
};
var salle = function(id, position, size, form, direction){
	this.id = id;
	this.position = position;
	this.size = size;
	this.form = form;
	this.direction = direction;
};
var salles = [new salle(0,new position(-150,0,0),new size(100,50,100)),
			  new salle(1,new position(-150,-50,0),new size(100,50,100)),
			  new salle(2,new position(-150,-125,0),new size(100,100,100)),
			  new salle(3,new position(-150,-225,0),new size(100,100,100)),
			  new salle(4,new position(-150,-375,0),new size(100,200,100)),
			  new salle(5,new position(-150,100,0),new size(150,150,100)),
			  new salle(5,new position(-50,50,0),new size(100,50,100)),
			  new salle(5,new position(50,50,0),new size(100,50,100)),
			  new salle(5,new position(150,50,0),new size(100,50,100))];
var salles_stats = ["blank","blank","class","blank","blank","blank","blank","blank","blank"];

init();
animate();

function init() {

	container = document.getElementById( 'container' );
	// CAMERA
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set( 0, 0, 500 );
	
	// CONTROLS
	controls = new THREE.TrackballControls ( camera );
	
	// SCENE
	scene = new THREE.Scene();

	// RENDERER
	renderer = new THREE.WebGLRenderer( { antialias: true } ); // WebGLRenderer CanvasRenderer
	renderer.setClearColor( 0xf0f0f0 );
	renderer.setSize( window.innerWidth, window.innerHeight );
	
	container.appendChild( renderer.domElement );
	/*
	var ambient = new THREE.AmbientLight( 0x555555 );
	scene.add(ambient);*/
	//
	window.addEventListener( 'resize', onWindowResize, false );

	salles.forEach(function(value, index, ar){
		drawSalle(value.position,value.size,salles_stats[index]);
	});
	
}

function drawSalle(salle,stats)
{
	size = salle.size;
	position = salle.position;
	
	var geometry = new THREE.CubeGeometry( size.length, size.width, size.height );
	//alert(1);alert(position[0]+" "+position[1]+" "+position[2]+" "+color);
	//geometry.position.x = 100;
	//geometry.position.y = position[1];
	//geometry.position.z = position[2];
	var material = new THREE.MeshBasicMaterial( { color: salle_color[stats], transparent: true, opacity: 0.5 } );//alert(2);
	
	mesh = new THREE.Mesh( geometry, material );
	mesh.position.x = position.x;
	mesh.position.y = position.y;
	mesh.position.z = position.z;
	mesh.matrixAutoUpdate = false;
	mesh.updateMatrix();
	scene.add( mesh );
	
	var material = new THREE.LineBasicMaterial({color: salle_color[stats]});
	
	var positions = [ new THREE.Vector3(position.x+size.length/2, position.y+size.width/2,position.z+size.height/2),
					  new THREE.Vector3(position.x+size.length/2, position.y+size.width/2,position.z-size.height/2),
					  new THREE.Vector3(position.x+size.length/2, position.y-size.width/2,position.z+size.height/2),
					  new THREE.Vector3(position.x+size.length/2, position.y-size.width/2,position.z-size.height/2),
					  new THREE.Vector3(position.x-size.length/2, position.y+size.width/2,position.z+size.height/2),
					  new THREE.Vector3(position.x-size.length/2, position.y+size.width/2,position.z-size.height/2),
					  new THREE.Vector3(position.x-size.length/2, position.y-size.width/2,position.z+size.height/2),
					  new THREE.Vector3(position.x-size.length/2, position.y-size.width/2,position.z-size.height/2),
					  /*
					  new THREE.Vector3(50,50,50),
	                  new THREE.Vector3(50,50,-50),
					  new THREE.Vector3(50,-50,50),
					  new THREE.Vector3(50,-50,-50),
					  new THREE.Vector3(-50,50,50),
					  new THREE.Vector3(-50,50,-50),
					  new THREE.Vector3(-50,-50,50),
					  new THREE.Vector3(-50,-50,-50) */];
	
	var indexs = [[1,2,4],[3,5],[3,6],[7],[5,6],[7],[7]];

	indexs.forEach(function(value, index, ar){
		value.forEach(function(val){
			var geometry = new THREE.Geometry();
			geometry.vertices.push( positions[index] );
			geometry.vertices.push( positions[val] );
			var line = new THREE.Line( geometry, material );
			scene.add( line );
			lines.push(line);
		});
	});
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}

			//

function animate() {
	requestAnimationFrame( animate );
	controls.update();
	render();
}

function render() {
	renderer.render( scene, camera );
}