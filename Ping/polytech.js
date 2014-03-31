/*-------Structure----------*/
var salle_color = {
	blank:0x000000,
	class:0xFF0000,
};
var salle_form = {
	Square : "Square",
	Trapezoid : "Trapezoid"
};
var salle_direction = {
	Vertical : "Vertical",
	Horizontal : "Horizontal",
	Oblique : "Oblique"
};
salle_position = function(x,y,z) {
	this.x=x;
	this.y=y;
	this.z=z;
};
salle_size = function(length,width,height) {
	this.length = length;
	this.width=width;
	this.height=height;
};
salle = function(id, name, position, size, form, direction){
	this.id = id;
	this.name = name;
	this.position = position;
	this.size = size;
	this.form = form;
	this.direction = direction;
};
salle_groups = function(){
	this.children = [];
};
salle_groups.prototype = {
	add: function(group){
			this.children.push(group);
		 },
	getGroupByName: function(name){
						for ( var i = 0, l = this.children.length; i < l; i ++ ) {
							var child = this.children[ i ];
							if ( child.name === name ) {
								return child;
							}
						}
					},
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
			  new salle("013","Turing",new salle_position(722.5,87.5,0),new salle_size(295,175,100),salle_form.Square,salle_direction.Horizontal),
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
			  new salle("110", "",new salle_position(507.5,-660,100),new salle_size(100,150,100), salle_form.Square, salle_direction.Oblique),
			  new salle("111", "",new salle_position(407.5,-698,100),new salle_size(100,75,100), salle_form.Square, salle_direction.Oblique),
			  new salle("112", "",new salle_position(307.5,-698,100),new salle_size(100,75,100), salle_form.Square, salle_direction.Oblique),
			  new salle("113", "",new salle_position(220,-698,100),new salle_size(75,75,100), salle_form.Square, salle_direction.Oblique),
			  new salle("118", "",new salle_position(117.5,-660,100),new salle_size(130,150,100), salle_form.Square, salle_direction.Oblique),
			  new salle("119", "",new salle_position(-15,-660,100),new salle_size(135,150,100), salle_form.Square, salle_direction.Oblique),
			  new salle("120", "",new salle_position(-305,-660,100),new salle_size(175,150,100), salle_form.Trapezoid, salle_direction.Oblique),
			  new salle("121", "",new salle_position(-150,-660,100),new salle_size(135,150,100), salle_form.Square, salle_direction.Oblique),
			  new salle("124","",new salle_position(922.5,87.5,100),new salle_size(375,175,100),salle_form.Square,salle_direction.Horizontal),
			  new salle("125","",new salle_position(655,87.5,100),new salle_size(160,175,100),salle_form.Square,salle_direction.Horizontal),
			  new salle("126","",new salle_position(500,87.5,100),new salle_size(150,175,100),salle_form.Square,salle_direction.Horizontal),
			  new salle("127","",new salle_position(390,105,100),new salle_size(70,140,100),salle_form.Square,salle_direction.Horizontal),
			  new salle("128","",new salle_position(305,105,100),new salle_size(100,140,100),salle_form.Square,salle_direction.Horizontal),
			  
			  new salle("201", "",new salle_position(-87.5,73.5,200),new salle_size(175,100,100),salle_form.Square,salle_direction.Vertical),
			  new salle("202", "",new salle_position(-225,61,200),new salle_size(100,125,100),salle_form.Square,salle_direction.Vertical),
			  new salle("203", "",new salle_position(-300,61,200),new salle_size(50,125,100),salle_form.Square,salle_direction.Vertical),
			  new salle("204", "",new salle_position(-350,61,200),new salle_size(50,125,100),salle_form.Square,salle_direction.Vertical),
			  new salle("205", "",new salle_position(-400,61,200),new salle_size(50,125,100),salle_form.Square,salle_direction.Vertical),
			  new salle("206", "",new salle_position(-450,61,200),new salle_size(50,125,100),salle_form.Square,salle_direction.Vertical),
			  new salle("207", "",new salle_position(-500,61,200),new salle_size(50,125,100),salle_form.Square,salle_direction.Vertical),
			  new salle("208", "",new salle_position(-550,61,200),new salle_size(50,125,100),salle_form.Square,salle_direction.Vertical),
			  new salle("209", "",new salle_position(-637.5,61,200),new salle_size(125,125,100),salle_form.Trapezoid,salle_direction.Vertical),
			  new salle("211", "",new salle_position(-498,202.5,200),new salle_size(59,105,100),salle_form.Square,salle_direction.Vertical),
			  new salle("212", "",new salle_position(-439,202.5,200),new salle_size(59,105,100),salle_form.Square,salle_direction.Vertical),
			  new salle("213", "",new salle_position(-380,202.5,200),new salle_size(59,105,100),salle_form.Square,salle_direction.Vertical),
			  new salle("214", "",new salle_position(-321,202.5,200),new salle_size(59,105,100),salle_form.Square,salle_direction.Vertical),
			  new salle("215", "",new salle_position(-262,202.5,200),new salle_size(59,105,100),salle_form.Square,salle_direction.Vertical),
			  new salle("216", "",new salle_position(507.5,-660,200),new salle_size(100,150,100), salle_form.Square, salle_direction.Oblique),
			  new salle("217", "",new salle_position(407.5,-698,200),new salle_size(100,75,100), salle_form.Square, salle_direction.Oblique),
			  new salle("0", "Local Serveur",new salle_position(307.5,-698,200),new salle_size(100,75,100), salle_form.Square, salle_direction.Oblique),
			  new salle("224", "",new salle_position(207.5,-660,200),new salle_size(100,150,100), salle_form.Square, salle_direction.Oblique),
			  new salle("222", "",new salle_position(97.5,-660,200),new salle_size(120,150,100), salle_form.Square, salle_direction.Oblique),
			  new salle("223", "",new salle_position(-22.5,-660,200),new salle_size(120,150,100), salle_form.Square, salle_direction.Oblique),
			  new salle("224", "",new salle_position(-237.5,-660,200),new salle_size(310,150,100), salle_form.Trapezoid, salle_direction.Oblique),
			  new salle("228","",new salle_position(675,125,200),new salle_size(120,100,100),salle_form.Square,salle_direction.Horizontal),
			  new salle("229","",new salle_position(675,37.5,200),new salle_size(120,75,100),salle_form.Square,salle_direction.Horizontal),
			  new salle("230","",new salle_position(520,105,200),new salle_size(190,140,100),salle_form.Square,salle_direction.Horizontal),
			  new salle("231","",new salle_position(340,105,200),new salle_size(170,140,100),salle_form.Square,salle_direction.Horizontal),
			  new salle("124","",new salle_position(922.5,87.5,200),new salle_size(375,175,100),salle_form.Square,salle_direction.Horizontal),
			  ];
var salles_stats = ["blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank",
					"blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank",
					"blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank",
					"blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank","blank"];
var groups = new salle_groups();

init();
animate();

function init() {
	
	container = document.getElementById( 'container' );
	// CAMERA
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
	
	camera.position.set( 0, 0, 1000 );
	
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
		draw_salle(value,"blank");
	});
	
	//change_salle_stats("Pascal","class");
	//draw_etage(3);
}

function change_salle_stats(name,stats)
{
	var group = groups.getGroupByName(name);
	
	group.children.forEach(function(value){
		var color = salle_color[stats];
		value.material.color.setHex(color);
	})
}
	
function draw_salle(salle,stats)
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
		
		var cube = new THREE.Mesh( geometry, material );
		cube.position.x = position.x;
		cube.position.y = position.y;
		cube.position.z = position.z;

		cube.matrixAutoUpdate = false;
		cube.updateMatrix();
		group.add( cube );

	
		var line_positions = [ new THREE.Vector3(position.x+size.length/2, position.y+size.width/2,position.z+size.height/2),
							   new THREE.Vector3(position.x+size.length/2, position.y+size.width/2,position.z-size.height/2),
							   new THREE.Vector3(position.x+size.length/2, position.y-size.width/2,position.z+size.height/2),
							   new THREE.Vector3(position.x+size.length/2, position.y-size.width/2,position.z-size.height/2),
							   new THREE.Vector3(position.x-size.length/2, position.y+size.width/2,position.z+size.height/2),
							   new THREE.Vector3(position.x-size.length/2, position.y+size.width/2,position.z-size.height/2),
							   new THREE.Vector3(position.x-size.length/2, position.y-size.width/2,position.z+size.height/2),
							   new THREE.Vector3(position.x-size.length/2, position.y-size.width/2,position.z-size.height/2)];
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
	
	group.name = salle.name;

	groups.add(group);
	
}

function draw_etage(couche){

	if(couche >= 1)
	{
		var premier_etage = new THREE.Geometry(),
		vertices = [new THREE.Vector3(-100,-100,-51),
					new THREE.Vector3(1300,-100,-51),
					new THREE.Vector3(-100,1300,-51)];
		premier_etage.vertices = vertices;
		premier_etage.faces.push(new THREE.Face3(0, 1, 2),new THREE.Face3(0,2,1));
		premier_etage.computeBoundingSphere();
		var material = new THREE.LineBasicMaterial({color: 0x00FF00});
		var mesh = new THREE.Mesh(premier_etage, material);
		scene.add(mesh);
		if(couche >= 2)
		{
			var deuxieme_etage = new THREE.Geometry(),
			vertices = [new THREE.Vector3(0,0,51),
						new THREE.Vector3(255,0,51),
						new THREE.Vector3(255,571,51),
						new THREE.Vector3(0,825,51),
						new THREE.Vector3(255,200,51),
						new THREE.Vector3(1200,0,51),
						new THREE.Vector3(1200,200,51),
						];
			euxieme_etage.vertices = vertices;
			deuxieme_etage.faces.push(new THREE.Face3(0, 1, 2),new THREE.Face3(0,2,3),
								      new THREE.Face3(0, 2, 1),new THREE.Face3(0,3,2),
									  new THREE.Face3(1, 5, 6),new THREE.Face3(1,6,4),
									  new THREE.Face3(1, 6, 5),new THREE.Face3(1,4,6));
			deuxieme_etage.computeBoundingSphere();
			var mesh = new THREE.Mesh(deuxieme_etage, material);
			scene.add(mesh);
		}
	}
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