/*-------Structure----------*/
var salle_color = {
	blank:0x000000,
	class:0xFF0000};
var salle_form = {
	Square : "Square",
	Trapezoid : "Trapezoid"
};
var salle_direction = {
	Vertical : "Vertical",
	Horizontal : "Horizontal",
	Oblique : "Oblique"
};
var salle_position = function(x,y,z) {
  this.x=x;
  this.y=y;
  this.z=z;
};
var salle_size = function(length,width,height) {
	this.length = length;
	this.width=width;
	this.height=height;
};
var salle = function(id, name, position, size, form, direction){
	this.id = id;
	this.name = name;
	this.position = position;
	this.size = size;
	this.form = form;
	this.direction = direction;
};

/*------------variable--------------*/
var camera, scene, renderer, container;
var controls;

var lines=[];
var salles = [new salle("0", "Gardien",new salle_position(-87.5,61,0),new salle_size(175,125,100),salle_form.Square,salle_direction.Vertical),
			  new salle("001", "Bibliotheque", new salle_position(-437.5,125.5,0),new salle_size(525,255,100), salle_form.Trapezoid, salle_direction.Vertical),
			  new salle("0", "Cafeteria",new salle_position(-200,-660,0),new salle_size(385,150,100), salle_form.Trapezoid, salle_direction.Oblique),
			  new salle("002", "",new salle_position(507,-623,0),new salle_size(100,75,100), salle_form.Square, salle_direction.Oblique),
			  new salle("003", "",new salle_position(507,-698,0),new salle_size(100,75,100), salle_form.Square, salle_direction.Oblique),
			  new salle("004", "",new salle_position(357,-698,0),new salle_size(200,75,100), salle_form.Square, salle_direction.Oblique),
			  new salle("007", "Lavelace",new salle_position(125,-660,0),new salle_size(265,150,100), salle_form.Square, salle_direction.Oblique),
			  new salle("011","Pascal",new salle_position(1015,87.5,0),new salle_size(290,175,100),salle_form.Square,salle_direction.Horizontal),
			  new salle("013","Turning",new salle_position(722.5,87.5,0),new salle_size(295,175,100),salle_form.Square,salle_direction.Horizontal),
			  new salle("015","",new salle_position(537.5,87.5,0),new salle_size(75,175,100),salle_form.Square,salle_direction.Horizontal),
			  new salle("016","",new salle_position(462.5,105,0),new salle_size(75,140,100),salle_form.Square,salle_direction.Horizontal),
			  new salle("0", "Gardien",new salle_position(-87.5,61,100),new salle_size(175,125,100),salle_form.Square,salle_direction.Vertical),
			  new salle("101", "",new salle_position(-200,61,100),new salle_size(50,125,100),salle_form.Square,salle_direction.Vertical),
			  new salle("102", "",new salle_position(-262.5,49,100),new salle_size(75,101,100),salle_form.Square,salle_direction.Vertical),
			  new salle("103", "",new salle_position(-330,49,100),new salle_size(60,101,100),salle_form.Square,salle_direction.Vertical),
			  new salle("104", "",new salle_position(-422.5,61,100),new salle_size(125,125,100),salle_form.Square,salle_direction.Vertical),
			  new salle("105", "",new salle_position(-522.5,49,100),new salle_size(75,101,100),salle_form.Square,salle_direction.Vertical),
			  new salle("106", "",new salle_position(-630,49,100),new salle_size(140,101,100),salle_form.Trapezoid,salle_direction.Vertical),
			  new salle("107", "",new salle_position(-560.5,202.5,100),new salle_size(145,105,100),salle_form.Trapezoid,salle_direction.Vertical),
			  new salle("108", "",new salle_position(-420,202.5,100),new salle_size(135,105,100),salle_form.Square,salle_direction.Vertical),
			  new salle("109", "",new salle_position(-292.5,202.5,100),new salle_size(120,105,100),salle_form.Square,salle_direction.Vertical),
			  ];
var salles_stats = ["class","class","class","class","class","class","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank",
					"blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank"];

init();
animate();

function init() {

	container = document.getElementById( 'container' );
	// CAMERA
	camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 10000 );
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
		drawSalle(value,salles_stats[index]);
	});
	
}

function drawSalle(salle,stats)
{
	var size = salle.size;
	var position = salle.position;
	var form = salle.form;
	var direction = salle.direction;
	
	var group = new THREE.Object3D();

	if(form == salle_form.Square)
	{
	var geometry = new THREE.CubeGeometry( size.length, size.width, size.height );
	//alert(1);alert(position[0]+" "+position[1]+" "+position[2]+" "+color);
	//geometry.position.x = 100;
	//geometry.position.y = position[1];
	//geometry.position.z = position[2];
	var material = new THREE.MeshBasicMaterial( { color: salle_color[stats], transparent: true, opacity: 0.5 } );//alert(2);
	
	var salle = new THREE.Mesh( geometry, material );
	salle.position.x = position.x;
	salle.position.y = position.y;
	salle.position.z = position.z;

	salle.matrixAutoUpdate = false;
	salle.updateMatrix();
	group.add( salle );
	
	var line_positions = [ new THREE.Vector3(position.x+size.length/2, position.y+size.width/2,position.z+size.height/2),
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
	}
	else if (form == salle_form.Trapezoid)
	{
		/*
		var geometry = new THREE.PlaneGeometry( 5, 20 );
		var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
		var material = new THREE.MeshFaceMaterial({color: salle_color[stats]});
		var face_position = [new ];*/
		
		var geometry = new THREE.Geometry(),
        vertices = [new THREE.Vector3(position.x+size.length/2, position.y+size.width/2,position.z+size.height/2),
					  new THREE.Vector3(position.x+size.length/2, position.y+size.width/2,position.z-size.height/2),
					  new THREE.Vector3(position.x+size.length/2, position.y-size.width/2,position.z+size.height/2),
					  new THREE.Vector3(position.x+size.length/2, position.y-size.width/2,position.z-size.height/2),
					  new THREE.Vector3(position.x-size.length/2+size.width*Math.tan(Math.PI*0.25), position.y+size.width/2,position.z+size.height/2),
					  new THREE.Vector3(position.x-size.length/2+size.width*Math.tan(Math.PI*0.25), position.y+size.width/2,position.z-size.height/2),
					  new THREE.Vector3(position.x-size.length/2, position.y-size.width/2,position.z+size.height/2),
					  new THREE.Vector3(position.x-size.length/2, position.y-size.width/2,position.z-size.height/2)];
        geometry.vertices = vertices;

    	// Generate the faces of the n-gon.
        geometry.faces.push(new THREE.Face3(0, 2, 1),new THREE.Face3(1, 2, 3),
							new THREE.Face3(2, 6, 7),new THREE.Face3(2, 7, 3),
							new THREE.Face3(0, 5, 4),new THREE.Face3(0, 1, 5),
							new THREE.Face3(1, 3, 7),new THREE.Face3(1, 7, 5),
							new THREE.Face3(2, 0, 4),new THREE.Face3(2, 4, 6),
							new THREE.Face3(4, 5, 7),new THREE.Face3(4, 7, 6));

    	geometry.computeBoundingSphere();
		var material = new THREE.LineBasicMaterial({color: salle_color[stats], transparent: true, opacity: 0.5});
		var mesh = new THREE.Mesh(geometry, material);
    	group.add(mesh)
		
		
		var line_positions = [ 
						new THREE.Vector3(position.x+size.length/2, position.y+size.width/2,position.z+size.height/2),
					  new THREE.Vector3(position.x+size.length/2, position.y+size.width/2,position.z-size.height/2),
					  new THREE.Vector3(position.x+size.length/2, position.y-size.width/2,position.z+size.height/2),
					  new THREE.Vector3(position.x+size.length/2, position.y-size.width/2,position.z-size.height/2),
					  new THREE.Vector3(position.x-size.length/2+size.width*Math.tan(Math.PI*0.25), position.y+size.width/2,position.z+size.height/2),
					  new THREE.Vector3(position.x-size.length/2+size.width*Math.tan(Math.PI*0.25), position.y+size.width/2,position.z-size.height/2),
					  new THREE.Vector3(position.x-size.length/2, position.y-size.width/2,position.z+size.height/2),
					  new THREE.Vector3(position.x-size.length/2, position.y-size.width/2,position.z-size.height/2)];
	}
	var indexs = [[1,2,4],[3,5],[3,6],[7],[5,6],[7],[7]];
	var material = new THREE.LineBasicMaterial({color: salle_color[stats]});
	indexs.forEach(function(value, index, ar){
		value.forEach(function(val){
			var geometry = new THREE.Geometry();
			geometry.vertices.push( line_positions[index] );
			geometry.vertices.push( line_positions[val] );
			var line = new THREE.Line( geometry, material );
			group.add( line );
			lines.push(line);
		});
	});
	
	if(direction == salle_direction.Vertical){
		group.rotation.z = - Math.PI * 0.5;;
	}
	else if(direction == salle_direction.Oblique){
		group.rotation.z = Math.PI * 0.75;
	}
	scene.add(group);
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