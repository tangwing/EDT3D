/*-------Structure----------*/
var salle_color = {
	Blank:0xFFFFFF,
	Class:0x0000FF,
	NotStarted:0x86B404,
	Finished:0xD8F781,
	Finded: 0xFF0000,
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
var salle = function(id, no, name, position, size, form, direction){
	this.id = id;
	this.number =no;
	this.name = name;
	this.position = position;
	this.size = size;
	this.form = form;
	this.direction = direction;
};

var point = function(id, position){
	this.id = id;
	this.position = position;
};

var salle_groups = function(){
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
var camera, splineCamera, scene, renderer, container, pointLight;
var controls;
var animCamEnabled =false;
var tube, tubeMesh; 				//Path view
var binormal = new THREE.Vector3();
var normal = new THREE.Vector3();
var upnormal = new THREE.Vector3(0,0,1);
//TextGeometry


var lines=[];
var v2=50; //le décalage vers la droite pour la 2ème partie de la partie Verticale.
var salles = [new salle("0","0", "",new salle_position(-87.5,61,0),new salle_size(175,125,100),salle_form.Square,salle_direction.Vertical),
			  new salle("1","001", "Bibliotheque", new salle_position(-437.5-v2 ,125.5 + v2,0),new salle_size(525+v2/2 ,255,100), salle_form.Trapezoid, salle_direction.Vertical),
			  new salle("2","008", "Cafeteria",new salle_position(-200,-660,0),new salle_size(385,150,100), salle_form.Trapezoid, salle_direction.Oblique),
			  new salle("3","002", "",new salle_position(507,-623,0),new salle_size(100,75,100), salle_form.Square, salle_direction.Oblique),
			  new salle("4","003", "",new salle_position(507,-698,0),new salle_size(100,75,100), salle_form.Square, salle_direction.Oblique),
			  new salle("5","004", "",new salle_position(357,-698,0),new salle_size(200,75,100), salle_form.Square, salle_direction.Oblique),
			  new salle("6","007", "Lovelace",new salle_position(125,-660,0),new salle_size(265,150,100), salle_form.Square, salle_direction.Oblique),
			  new salle("7","011","Pascal",new salle_position(1015,87.5,0),new salle_size(290,175,100),salle_form.Square,salle_direction.Horizontal),
			  new salle("8","013","Turing",new salle_position(722.5,87.5,0),new salle_size(295,175,100),salle_form.Square,salle_direction.Horizontal),
			  new salle("9","015","Babagge",new salle_position(537.5,87.5,0),new salle_size(75,175,100),salle_form.Square,salle_direction.Horizontal),
			  new salle("10","016","BDE",new salle_position(462.5,105,0),new salle_size(75,140,100),salle_form.Square,salle_direction.Horizontal),
			            //"11
			  new salle("12","0", "",new salle_position(-87.5,61,101.5),new salle_size(175,125,100),salle_form.Square,salle_direction.Vertical),
			  new salle("13","101", "",new salle_position(-200,61,101.5),new salle_size(50,125,100),salle_form.Square,salle_direction.Vertical),
			  new salle("14","102", "",new salle_position(-262.5,49,101.5),new salle_size(75,101,100),salle_form.Square,salle_direction.Vertical),
			  new salle("15","103", "",new salle_position(-330,49,101.5),new salle_size(60,101,100),salle_form.Square,salle_direction.Vertical),
			  new salle("16","104", "",new salle_position(-422.5,61,101.5),new salle_size(125,125,100),salle_form.Square,salle_direction.Vertical),
			  new salle("17","105", "",new salle_position(-522.5,49,101.5),new salle_size(75,101,100),salle_form.Square,salle_direction.Vertical),
			  new salle("18","106", "",new salle_position(-630,49,101.5),new salle_size(140,101,100),salle_form.Trapezoid,salle_direction.Vertical),
			  new salle("19","107", "",new salle_position(-560.5,202.5 + v2,101.5),new salle_size(145,105,100),salle_form.Trapezoid,salle_direction.Vertical),
			  new salle("20","108", "",new salle_position(-420,202.5 + v2,101.5),new salle_size(135,105,100),salle_form.Square,salle_direction.Vertical),
			  new salle("21","109", "",new salle_position(-292.5,202.5 + v2,101.5),new salle_size(120,105,100),salle_form.Square,salle_direction.Vertical),
			  new salle("22","110", "",new salle_position(507.5,-660,101.5),new salle_size(100,150,100), salle_form.Square, salle_direction.Oblique),
			  new salle("23","111", "",new salle_position(407.5,-698,101.5),new salle_size(100,75,100), salle_form.Square, salle_direction.Oblique),
			  new salle("24","112", "",new salle_position(307.5,-698,101.5),new salle_size(100,75,100), salle_form.Square, salle_direction.Oblique),
			  new salle("25","113", "",new salle_position(220,-698,101.5),new salle_size(75,75,100), salle_form.Square, salle_direction.Oblique),
			  new salle("26","118", "Boole",new salle_position(117.5,-660,101.5),new salle_size(130,150,100), salle_form.Square, salle_direction.Oblique),
			  new salle("27","119", "Von Neumann",new salle_position(-15,-660,101.5),new salle_size(135,150,100), salle_form.Square, salle_direction.Oblique),
			  new salle(28,"120", "Shannon",new salle_position(-305,-660,101.5),new salle_size(175,150,100), salle_form.Trapezoid, salle_direction.Oblique),
			  new salle("29","121", "",new salle_position(-150,-660,101.5),new salle_size(135,150,100), salle_form.Square, salle_direction.Oblique),
			  new salle("30","124","Chaîne Production",new salle_position(922.5,87.5,101.5),new salle_size(375,175,100),salle_form.Square,salle_direction.Horizontal),
			  new salle("31","125","Windows B",new salle_position(655,87.5,101.5),new salle_size(160,175,100),salle_form.Square,salle_direction.Horizontal),
			  new salle("32","126","Windows A",new salle_position(500,87.5,101.5),new salle_size(150,175,100),salle_form.Square,salle_direction.Horizontal),
			  new salle("33","127","",new salle_position(390,105,101.5),new salle_size(70,140,100),salle_form.Square,salle_direction.Horizontal),
			  new salle("34","128","Scolarité",new salle_position(305,105,101.5),new salle_size(100,140,100),salle_form.Square,salle_direction.Horizontal),
			            //"35
			  new salle("36","201", "",new salle_position(-87.5,73.5,203),new salle_size(175,100,100),salle_form.Square,salle_direction.Vertical),
			  new salle("37","202", "",new salle_position(-225,61,203),new salle_size(100,125,100),salle_form.Square,salle_direction.Vertical),
			  new salle("38","203", "",new salle_position(-300,61,203),new salle_size(50,125,100),salle_form.Square,salle_direction.Vertical),
			  new salle("39","204", "",new salle_position(-350,61,203),new salle_size(50,125,100),salle_form.Square,salle_direction.Vertical),
			  new salle("40","205", "",new salle_position(-400,61,203),new salle_size(50,125,100),salle_form.Square,salle_direction.Vertical),
			  new salle("41","206", "",new salle_position(-450,61,203),new salle_size(50,125,100),salle_form.Square,salle_direction.Vertical),
			  new salle("42","207", "",new salle_position(-500,61,203),new salle_size(50,125,100),salle_form.Square,salle_direction.Vertical),
			  new salle("43","208", "",new salle_position(-550,61,203),new salle_size(50,125,100),salle_form.Square,salle_direction.Vertical),
			  new salle("44","209", "",new salle_position(-637.5,61,203),new salle_size(125,125,100),salle_form.Trapezoid,salle_direction.Vertical),
			  new salle("45","211", "",new salle_position(-498,202.5 + v2,203),new salle_size(59,105,100),salle_form.Square,salle_direction.Vertical),
			  new salle("46","212", "",new salle_position(-439,202.5 + v2,203),new salle_size(59,105,100),salle_form.Square,salle_direction.Vertical),
			  new salle("47","213", "",new salle_position(-380,202.5 + v2,203),new salle_size(59,105,100),salle_form.Square,salle_direction.Vertical),
			  new salle("48","214", "",new salle_position(-321,202.5 + v2,203),new salle_size(59,105,100),salle_form.Square,salle_direction.Vertical),
			  new salle("49","215", "",new salle_position(-262,202.5 + v2,203),new salle_size(59,105,100),salle_form.Square,salle_direction.Vertical),
			  new salle("50","216", "",new salle_position(507.5,-660,203),new salle_size(100,150,100), salle_form.Square, salle_direction.Oblique),
			  new salle("51","217", "",new salle_position(407.5,-698,203),new salle_size(100,75,100), salle_form.Square, salle_direction.Oblique),
			  new salle("52","0", "Local Serveur",new salle_position(307.5,-698,203),new salle_size(100,75,100), salle_form.Square, salle_direction.Oblique),
			  new salle("53","224", "",new salle_position(207.5,-660,203),new salle_size(100,150,100), salle_form.Square, salle_direction.Oblique),
			  new salle("54","222", "OC",new salle_position(97.5,-660,203),new salle_size(120,150,100), salle_form.Square, salle_direction.Oblique),
			  new salle("55","223", "RFAI",new salle_position(-22.5,-660,203),new salle_size(120,150,100), salle_form.Square, salle_direction.Oblique),
			  new salle("56","224", "TP Systèmes",new salle_position(-237.5,-660,203),new salle_size(310,150,100), salle_form.Trapezoid, salle_direction.Oblique),
			  new salle("57","228","S 228-229",new salle_position(675,125,203),new salle_size(120,100,100),salle_form.Square,salle_direction.Horizontal),
			  new salle("58","229","",new salle_position(675,37.5,203),new salle_size(120,75,100),salle_form.Square,salle_direction.Horizontal),
			  new salle("59","230","Unix A",new salle_position(520,105,203),new salle_size(190,140,100),salle_form.Square,salle_direction.Horizontal),
			  new salle("60","231","Unix B",new salle_position(340,105,203),new salle_size(170,140,100),salle_form.Square,salle_direction.Horizontal),
			  new salle("61","124","Chaîne Production",new salle_position(922.5,87.5,203),new salle_size(375,175,100),salle_form.Square,salle_direction.Horizontal),
			  ];

//Path key points
var points = {	0: {pos:new THREE.Vector3( 140,120,-30), direction:  salle_direction.Vertical},
				1: {pos: new THREE.Vector3( 180,630,-30), direction:  salle_direction.Oblique},
			    2: {pos: new THREE.Vector3( 540,260,-30), direction:  salle_direction.Oblique},
			    3: {pos: new THREE.Vector3( 110,740,-30), direction:  salle_direction.Oblique},
			    4: {pos: new THREE.Vector3( 130,760,-30), direction:  salle_direction.Oblique},
				5: {pos: new THREE.Vector3( 140,770,-30), direction:  salle_direction.Oblique},
				6: {pos: new THREE.Vector3( 360,440,-30), direction:  salle_direction.Oblique},
				7: {pos: new THREE.Vector3( 900,190,-30), direction:  salle_direction.Horizontal},
				8: {pos: new THREE.Vector3( 600,190,-30), direction:  salle_direction.Horizontal},
				9: {pos: new THREE.Vector3( 520,190,-30), direction:  salle_direction.Horizontal},
				10: {pos: new THREE.Vector3( 480,190,-30), direction:  salle_direction.Horizontal},
				12: {pos: new THREE.Vector3( 137,120,70), direction:  salle_direction.Vertical},
				13: {pos: new THREE.Vector3( 137,255,70), direction:  salle_direction.Vertical},
				14: {pos: new THREE.Vector3( 137,255,70), direction:  salle_direction.Vertical},
				15: {pos: new THREE.Vector3( 137,350,70), direction:  salle_direction.Vertical},
				16: {pos: new THREE.Vector3( 137,350,70), direction:  salle_direction.Vertical},
				17: {pos: new THREE.Vector3( 137,550,70), direction:  salle_direction.Vertical},
				18: {pos: new THREE.Vector3( 137,550,70), direction:  salle_direction.Vertical},
				19: {pos: new THREE.Vector3( 137,500,70), direction:  salle_direction.Vertical},
			  	20: {pos: new THREE.Vector3(137,350,70), direction:  salle_direction.Vertical},
			    21: {pos: new THREE.Vector3(137,350,70), direction:  salle_direction.Vertical},
				22: {pos: new THREE.Vector3(110,740,70), direction:  salle_direction.Oblique},
				23: {pos: new THREE.Vector3(140,770,70), direction:  salle_direction.Oblique},
				24: {pos: new THREE.Vector3(220,695,70), direction:  salle_direction.Oblique},
				25: {pos: new THREE.Vector3(260,640,70), direction:  salle_direction.Oblique},
				26: {pos: new THREE.Vector3(350,460,70), direction:  salle_direction.Oblique},
				27: {pos: new THREE.Vector3(450,360,70), direction:  salle_direction.Oblique},
				28: {pos: new THREE.Vector3(550,260,70), direction:  salle_direction.Oblique},
				29: {pos: new THREE.Vector3(720,80,70), direction:  salle_direction.Oblique},
				30: {pos: new THREE.Vector3(830,190,70), direction:  salle_direction.Horizontal},
				31: {pos: new THREE.Vector3(665,190,70), direction:  salle_direction.Horizontal},
				32: {pos: new THREE.Vector3(450,190,70), direction:  salle_direction.Horizontal},
				33: {pos: new THREE.Vector3(365,190,70), direction:  salle_direction.Horizontal},
				34: {pos: new THREE.Vector3(265,190,70), direction:  salle_direction.Horizontal},
				36: {pos: new THREE.Vector3(137,190,170), direction:  salle_direction.Vertical},
				37: {pos: new THREE.Vector3(137,250,170), direction:  salle_direction.Vertical},
				38: {pos: new THREE.Vector3(137,300,170), direction:  salle_direction.Vertical},
				39: {pos: new THREE.Vector3(137,370,170), direction:  salle_direction.Vertical},
				40: {pos: new THREE.Vector3(137,370,170), direction:  salle_direction.Vertical},
				41: {pos: new THREE.Vector3(137,470,170), direction:  salle_direction.Vertical},
				42: {pos: new THREE.Vector3(137,470,170), direction:  salle_direction.Vertical},
				43: {pos: new THREE.Vector3(137,550,170), direction:  salle_direction.Vertical},
				44: {pos: new THREE.Vector3(137,580,170), direction:  salle_direction.Vertical},
				45: {pos: new THREE.Vector3(137,470,170), direction:  salle_direction.Vertical},
				46: {pos: new THREE.Vector3(137,430,170), direction:  salle_direction.Vertical},
				47: {pos: new THREE.Vector3(137,370,170), direction:  salle_direction.Vertical},
				48: {pos: new THREE.Vector3(137,300,170), direction:  salle_direction.Vertical},
				49: {pos: new THREE.Vector3(137,250,170), direction:  salle_direction.Vertical},
				50: {pos: new THREE.Vector3(110,740,170), direction:  salle_direction.Oblique},
				51: {pos: new THREE.Vector3(140,770,170), direction:  salle_direction.Oblique},
				53: {pos: new THREE.Vector3(260,550,170), direction:  salle_direction.Oblique},
				54: {pos: new THREE.Vector3(350,460,170), direction:  salle_direction.Oblique},
				55: {pos: new THREE.Vector3(450,360,170), direction:  salle_direction.Oblique},
				56: {pos: new THREE.Vector3(564,245,170), direction:  salle_direction.Oblique},
				57: {pos: new THREE.Vector3(715,190,170), direction:  salle_direction.Horizontal},
				58: {pos: new THREE.Vector3(715,190,170), direction:  salle_direction.Horizontal},
				59: {pos: new THREE.Vector3(615,190,170), direction:  salle_direction.Horizontal},
				60: {pos: new THREE.Vector3(330,190,170), direction:  salle_direction.Horizontal},
				61: {pos: new THREE.Vector3(830,190,170), direction:  salle_direction.Horizontal},
				
				70: {pos: new THREE.Vector3(90,720,-30), direction:  salle_direction.Oblique},
				71: {pos: new THREE.Vector3(110,620,-30), direction:  salle_direction.Oblique},
				72: {pos: new THREE.Vector3(265,545,-30), direction:  salle_direction.Oblique},
				73: {pos: new THREE.Vector3(170,190,-30), direction:  salle_direction.Horizontal},
				74: {pos: new THREE.Vector3(830,210,-30), direction:  salle_direction.Oblique},
				75: {pos: new THREE.Vector3(230,120,-30), direction:  salle_direction.Vertical},
				76: {pos: new THREE.Vector3(190,35,20), direction:  salle_direction.Vertical},
				77: {pos: new THREE.Vector3(340,120,-30), direction:  salle_direction.Horizontal},
				78: {pos: new THREE.Vector3(150,660,-30), direction:  salle_direction.Oblique},
				79: {pos: new THREE.Vector3(830,190,-30), direction:  salle_direction.Horizontal},
				80: {pos: new THREE.Vector3(750,220,20), direction:  salle_direction.Oblique},

				81: {pos: new THREE.Vector3(90,720,70), direction:  salle_direction.Oblique},
				82: {pos: new THREE.Vector3(50,680,20), direction:  salle_direction.Oblique},
				83: {pos: new THREE.Vector3(137,600,70), direction:  salle_direction.Oblique},
				84: {pos: new THREE.Vector3(137,670,70), direction:  salle_direction.Oblique},
				85: {pos: new THREE.Vector3(210,600,70), direction:  salle_direction.Oblique},
				86: {pos: new THREE.Vector3(265,505,70), direction:  salle_direction.Oblique},
				//86: {pos: new THREE.Vector3(215,585,70), direction:  salle_direction.Oblique},
				87: {pos: new THREE.Vector3(700,220,120), direction:  salle_direction.Oblique},
				88: {pos: new THREE.Vector3(750,220,70), direction:  salle_direction.Oblique},
				89: {pos: new THREE.Vector3(137,190,70), direction:  salle_direction.Vertical},
				90: {pos: new THREE.Vector3(190,190,70), direction:  salle_direction.Vertical},
				91: {pos: new THREE.Vector3(760,190,70), direction:  salle_direction.Horizontal},
				92: {pos: new THREE.Vector3(190,35,120), direction:  salle_direction.Vertical},
				95: {pos: new THREE.Vector3(90,720,170), direction:  salle_direction.Oblique},
				96: {pos: new THREE.Vector3(50,680,120), direction:  salle_direction.Oblique},
				97: {pos: new THREE.Vector3(137,620,170), direction:  salle_direction.Oblique},
				98: {pos: new THREE.Vector3(110,620,170), direction:  salle_direction.Oblique},
				99: {pos: new THREE.Vector3(190,190,170), direction:  salle_direction.Vertical},
				100: {pos: new THREE.Vector3(700,220,120), direction:  salle_direction.Oblique},
				101: {pos: new THREE.Vector3(750,220,170), direction:  salle_direction.Oblique},
				102: {pos: new THREE.Vector3(190,35,170), direction:  salle_direction.Vertical},
				//New stair!
				103: {pos: new THREE.Vector3(440,260,-10), direction:  "null"}
};
	  

//adapt postions. positive => outside
var deltaV = 100, 
	deltaO = 100,
	deltaH = 100;
salles.forEach(function(v){
	if(v.direction == salle_direction.Vertical){
		v.position.y -= deltaV;
	}else if(v.direction == salle_direction.Oblique){
		v.position.x += 50;
		v.position.y-= deltaO;
	}else {
		v.position.y -= deltaH;
		v.position.x += deltaO;
	}
});
for(var index in points){
	var v = points[index];
	if(v.direction == salle_direction.Vertical){
		points[index].pos.x -= 0.9*deltaV;
	}else if(v.direction == salle_direction.Oblique){
		points[index].pos.y += 0.9*deltaO*0.7;
		points[index].pos.x += 0.9*deltaO*0.7;
		points[index].pos.x -= 50;
		points[index].pos.y += 50;
	}else {
		points[index].pos.y -= 0.9*deltaH;
		points[index].pos.x += deltaO;
	}
}

var groups = new salle_groups();

init();
animate();

function init() {
	
	container = document.getElementById( 'container' );
	// CAMERA
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
	splineCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set( 0, 0, 1000 );
	// CONTROLS
	controls = new THREE.TrackballControls ( camera );
	// SCENE
	scene = new THREE.Scene();

	//Light
	pointLight = new THREE.PointLight( 0xff0000, 1, 100 );
	pointLight.position.set( 50, 50, 50 );
	//scene.add( pointLight );

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
		draw_salle(value,"Blank");
	});
	
	/*
	points.forEach(function(value, index, ar){
		draw_salle(new salle('','','',value.position,new salle_size(1,1,1),salle_form.Square,salle_direction.Horizontal),"Blank");
	});*/
 //TODO
	change_salle_stats("Pascal","Class");
	change_salle_stats("TP Systèmes","Class");
	draw_etage(1);
	draw_etage(2);
	//draw_etage(3);
	draw_etage(12);
	
	var graph = getRoomGraph();
	var path = graph.dijkstra(54,2); 
	path = graph.dijkstra(26,8); 
	log(path.toString());
	draw_path(path);

	//I'd like to translate the whole scene
	//scene.translateX(1000)
	//camera.position.x+=500;
	//camera.lookAt(new THREE.Vector3(500,0,0));
	//camera.lookAt(new THREE.Vector3(500,0,0));
	//scene.add(camera);
	//scene.position.x -= 500;
	scene.children.forEach(function(obj){
		//var axe = obj.worldToLocal(new THREE.Vector3(-1,0,0));
		//obj.position.x-=450;
		//obj.position.y-=350;
		//obj.translateX(obj.worldToLocal(new THREE.Vector3(-1,0,0)));
		//obj.translateOnAxis(axe, 100);
	});
	//groups.children.
}

function search_point_by_name(name){
	if(name == "Entrance")
		return 77;
	else if(name != ""){
		for(var i=0; i<salles.length; i++){
			if(salles[i].name == name)
				return salles[i].id;
		}
	}
	return -1;
}

function draw_path(path){
 /*
	var material = new THREE.LineDashedMaterial( { color: 0xffaa00, dashSize: 2, gapSize: 2, linewidth: 1 } );

	var geometry = new THREE.Geometry();
	for(var i=0; i<path.length; i++)
	{
		geometry.vertices.push(points[path[i]]);
	}
	geometry.computeLineDistances();
	var line = new THREE.Line( geometry, material, THREE.LinePieces );
	scene.add( line );*/
	scene.remove(tubeMesh);
	var geometry = new THREE.Geometry();
	var vertices = [];
	for(var i=0; i<path.length; i++)
	{
		vertices.push(points[path[i]].pos);
		geometry.vertices.push(points[path[i]].pos);
	}
	var path_line = new THREE.SplineCurve3(vertices);

	tube = new THREE.TubeGeometry(path_line, 100, 2, 3, false, false);
	var tubecolor = 0xffff0000;
	tubeMesh = THREE.SceneUtils.createMultiMaterialObject( tube, [
				new THREE.MeshLambertMaterial({
					color: tubecolor,
					transparent: true
				}),
				new THREE.MeshBasicMaterial({
					color: tubecolor,
					opacity: 0.3,
					wireframe: true,
					transparent: true
			})]);
	scene.add( tubeMesh );
}

function change_salle_stats(name,stats){
	if(name != "")
	{
		var group = groups.getGroupByName(name);
		group.children.forEach(function(value){
			if(stats == "Blank" && value.geometry.vertices.length == 2 ) ///?
				value.material.color.setHex(0x000000);
			else{
				var color = salle_color[stats];
				value.material.color.setHex(color);
			}
		});
	}
}


function draw_salle(salle,stats)
{
	var size = salle.size;
	var position = salle.position;
	var form = salle.form;
	var direction = salle.direction;
	var salleObj = new THREE.Object3D(); //A room, with cube and borders in it
	var material = new THREE.MeshBasicMaterial( 
	{ 
		color: salle_color[stats], 
		transparent: true, 
		opacity: position.z<100? 0.95 :
				 position.z<200? 0.8 : 0.7
		//map: THREE.ImageUtils.loadTexture('img/wall.jpg')
	} );
	var line_material = new THREE.LineBasicMaterial({color: 0x000000});
	var line_positions; //Borders
//Variables for text geo	
var text = salle.name,
	height = 1,
	tsize = 10,
	curveSegments = 4,
	bevelThickness = 2,
	bevelSize = 1.5,
	bevelSegments = 3,
	bevelEnabled = false,
	font = "optimer", // helvetiker, optimer, gentilis, droid sans, droid serif
	weight = "normal", // normal bold
	style = "normal"; // normal italic
	if(text != "") //if have text
	{
		var textMaterial = new THREE.MeshFaceMaterial( [ 
					new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading } ), // front
					new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.SmoothShading } ) // side
				] );
		//Draw text
		var textGeo = new THREE.TextGeometry( text, {
					 size: tsize,
					 height: height,
					curveSegments: curveSegments,
					font: font,
					weight: weight,
					style: style,
					bevelThickness: bevelThickness,
					bevelSize: bevelSize,
					bevelEnabled: bevelEnabled,
					material: 0,
					extrudeMaterial: 1
				});

		textGeo.computeBoundingBox();
		textGeo.computeVertexNormals();
	}
	if(form == salle_form.Square)
	{
		var geometry = new THREE.CubeGeometry( size.length, size.width, size.height );
		//alert(1);alert(position[0]+" "+position[1]+" "+position[2]+" "+color);
		var cube = new THREE.Mesh( geometry, material );
		cube.position.x = position.x;
		cube.position.y = position.y;
		cube.position.z = position.z;
		cube.matrixAutoUpdate = false;
		cube.updateMatrix();
		
		if(text != "") {
			var textMesh = new THREE.Mesh( textGeo, textMaterial );
			textMesh.position.x += size.length/4;
			textMesh.position.y += size.width/2;
			textMesh.position.z -= size.height/4;
			textMesh.rotation.x = -Math.PI/2;
			textMesh.rotation.z = Math.PI;
			cube.add(textMesh);
		}
		salleObj.add( cube );

		//Border
		line_positions = [ new THREE.Vector3(position.x+size.length/2, position.y+size.width/2,position.z+size.height/2),
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
		var geometry = new THREE.Geometry(),
        vertices = [new THREE.Vector3(position.x+size.length/2, position.y+size.width/2,position.z+size.height/2),
					  new THREE.Vector3(position.x+size.length/2, position.y+size.width/2,position.z-size.height/2),
					  new THREE.Vector3(position.x+size.length/2, position.y-size.width/2,position.z+size.height/2),
					  new THREE.Vector3(position.x+size.length/2, position.y-size.width/2,position.z-size.height/2),
					  new THREE.Vector3(position.x-size.length/2+size.width*Math.tan(Math.PI*0.25), position.y+size.width/2,position.z+size.height/2),
					  new THREE.Vector3(position.x-size.length/2+size.width*Math.tan(Math.PI*0.25), position.y+size.width/2,position.z-size.height/2),
					  new THREE.Vector3(position.x-size.length/2, position.y-size.width/2,position.z+size.height/2),
					  new THREE.Vector3(position.x-size.length/2, position.y-size.width/2,position.z-size.height/2)];

		//patch for bibliothèque...
		if(salle.id == "1"){
			vertices[2].y -= v2;
			vertices[3].y -= v2;
			vertices[6].x -= v2;
			vertices[7].x -= v2;
			vertices[6].y -= v2;
			vertices[7].y -= v2;
		}

        geometry.vertices = vertices;

    	// Generate the faces of the n-gon.
        geometry.faces.push(new THREE.Face3(0, 2, 1),new THREE.Face3(1, 2, 3),
							new THREE.Face3(2, 6, 7),new THREE.Face3(2, 7, 3),
							new THREE.Face3(0, 5, 4),new THREE.Face3(0, 1, 5),
							new THREE.Face3(1, 3, 7),new THREE.Face3(1, 7, 5),
							new THREE.Face3(2, 0, 4),new THREE.Face3(2, 4, 6),
							new THREE.Face3(4, 5, 7),new THREE.Face3(4, 7, 6));

    	geometry.computeBoundingSphere();
		var mesh = new THREE.Mesh(geometry, material);
		// if(text != "") {
		// 	var textMesh = new THREE.Mesh( textGeo, textMaterial );
		// 	// textMesh.position.x += size.length/4;
		// 	// textMesh.position.y += size.width/2;
		// 	// textMesh.position.z -= size.height/4;
		// 	// textMesh.rotation.x = -Math.PI/2;
		// 	// textMesh.rotation.z = Math.PI;
		// 	mesh.add(textMesh);
		// }
    	salleObj.add(mesh);
    	line_positions = vertices;
	}

	var indexs = [[1,2,4],[3,5],[3,6],[7],[5,6],[7],[7]];
	//var material = new THREE.LineBasicMaterial({color: salle_color[stats]});
	indexs.forEach(function(value, index, ar){
		value.forEach(function(val){
			var geometry = new THREE.Geometry();
			geometry.vertices.push( line_positions[index] );
			geometry.vertices.push( line_positions[val] );
			var line = new THREE.Line( geometry, line_material );
			salleObj.add( line );
			lines.push(line);
		});
	});
	
	//Transformations to put the room to the right position
	if(direction == salle_direction.Vertical){
		//salleObj.position.x -= 100;
		salleObj.rotation.z = - Math.PI * 0.5;
	}
	else if(direction == salle_direction.Oblique){
		//salleObj.position.x += 100;
		//salleObj.position.y += 100;
		salleObj.rotation.z = Math.PI * 0.75;
	}else{
		//salleObj.position.y -= 100;
	}
	scene.add(salleObj);
	salleObj.name = salle.name;
	groups.add(salleObj);
	
}

function draw_etage(couche){
	
	if(couche == 1)
	{
		var premier_etage = new THREE.Geometry(),
		vertices = [new THREE.Vector3(-100,-100,-51),
					new THREE.Vector3(1300,-100,-51),
					new THREE.Vector3(-100,1300,-51)];
		premier_etage.vertices = vertices;
		premier_etage.faces.push(new THREE.Face3(0, 1, 2),
			new THREE.Face3(0,2,1));
		premier_etage.faceVertexUvs[0] = []
		premier_etage.faceVertexUvs[ 0 ].push( [
	        new THREE.Vector2( 0, 0 ),
	        new THREE.Vector2( 0, 1 ),
	        new THREE.Vector2( 1, 1 )
	    ] );


		premier_etage.computeBoundingSphere();

		var texture = THREE.ImageUtils.loadTexture('img/floor.jpg');
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		var material = new THREE.MeshBasicMaterial({ 
			color: 0x9C9579
			//map: texture
		});
		var mesh = new THREE.Mesh(premier_etage, material);
		scene.add(mesh);
	}
 	var trans = 100;
	if(couche == 2)
	{
		var deuxieme_etage = new THREE.Geometry(),
		vertices = [new THREE.Vector3(0,0,51),
					new THREE.Vector3(255,0,51),
					new THREE.Vector3(255,535,51),
					new THREE.Vector3(0,790,51),
					new THREE.Vector3(255,170,51),
					new THREE.Vector3(1200,0,51),   //5
					new THREE.Vector3(1200,170,51), //6
					new THREE.Vector3(126,915,51),
					new THREE.Vector3(620,170,51),
					new THREE.Vector3(870,170,51)];
		//Translations
		vertices[0].x += -trans;
		vertices[0].y += -trans;
		vertices[1].x += -trans;
		vertices[1].y += -trans;
		vertices[2].x += -trans;
		vertices[2].y += 2*trans;
		vertices[3].x += -trans;
		vertices[3].y += 2*trans;
		vertices[4].x += -trans;
		vertices[4].y += -0.5*trans;
		vertices[5].y += -trans;
		vertices[6].y += -0.5*trans;
		vertices[7].x += -trans;
		vertices[7].y += 2*trans;
		 vertices[8].x += 2*trans;
		 vertices[8].y += -trans;
		 vertices[9].x += 2*trans;
		// //vertices[9].x += trans;
		 vertices[9].y += -trans;


		deuxieme_etage.vertices = vertices;
		deuxieme_etage.faces.push(new THREE.Face3(0, 1, 2),new THREE.Face3(0,2,3),
							      new THREE.Face3(0, 2, 1),new THREE.Face3(0,3,2),
								  new THREE.Face3(1, 5, 6),new THREE.Face3(1,6,4),
								  new THREE.Face3(1, 6, 5),new THREE.Face3(1,4,6),
								  new THREE.Face3(7, 3, 8),new THREE.Face3(7,8,9),
								  new THREE.Face3(7, 8, 3),new THREE.Face3(7,9,8));
		deuxieme_etage.computeBoundingSphere();
		var material = new THREE.MeshBasicMaterial({color: 0xD5D6D2,transparent: false, opacity:0.8
			//,map: THREE.ImageUtils.loadTexture('img/wall.jpg')0xFADE07
		 });
		var mesh = new THREE.Mesh(deuxieme_etage, material);
		scene.add(mesh);
	}
	else if(couche == 3)
	{
		var troisieme_etage = new THREE.Geometry(),
		vertices = [new THREE.Vector3(0,0,152),
					new THREE.Vector3(255,0,152),
					new THREE.Vector3(255,535,152),
					new THREE.Vector3(0,790,152),
					new THREE.Vector3(255,170,152),
					new THREE.Vector3(1200,0,152),
					new THREE.Vector3(1200,170,152),
					new THREE.Vector3(126,915,152),
					new THREE.Vector3(620,170,152),
					new THREE.Vector3(870,170,152)];
		//Translations
		vertices[0].x += -trans;
		vertices[0].y += -trans;
		vertices[1].x += -trans;
		vertices[1].y += -trans;
		vertices[2].x += -trans;
		vertices[2].y += 2*trans;
		vertices[3].x += -trans;
		vertices[3].y += 2*trans;
		vertices[4].x += -trans;
		vertices[4].y += -0.5*trans;
		vertices[5].y += -trans;
		vertices[6].y += -0.5*trans;
		vertices[7].x += -trans;
		vertices[7].y += 2*trans;
		 vertices[8].x += 2*trans;
		 vertices[8].y += -trans;
		 vertices[9].x += 2*trans;
		// //vertices[9].x += trans;
		 vertices[9].y += -trans;
		troisieme_etage.vertices = vertices;
		troisieme_etage.faces.push(new THREE.Face3(0, 1, 2),new THREE.Face3(0,2,3),
							       new THREE.Face3(0, 2, 1),new THREE.Face3(0,3,2),
								   new THREE.Face3(1, 5, 6),new THREE.Face3(1,6,4),
								   new THREE.Face3(1, 6, 5),new THREE.Face3(1,4,6),
								   new THREE.Face3(7, 3, 8),new THREE.Face3(7,8,9),
								   new THREE.Face3(7, 8, 3),new THREE.Face3(7,9,8));
		troisieme_etage.computeBoundingSphere();
		var material = new THREE.MeshBasicMaterial({color: 0xFADE70,transparent: true, opacity:0.4});
		var mesh = new THREE.Mesh(troisieme_etage, material);
		scene.add(mesh);
	}
	else if(couche == 12) //stair 12
	{
		//accèss handicap
		var stair = new THREE.Geometry(),
		vertices = [new THREE.Vector3(255,180, -60),
					new THREE.Vector3(340,180, -60),
					new THREE.Vector3(255,635,50),
					new THREE.Vector3(340,550,50)];
		//Translations
		vertices[0].x += -trans + v2;
		vertices[0].y += -trans;
		vertices[1].x += -trans + v2;
		vertices[1].y += -trans;
		vertices[2].x += -trans + v2;
		vertices[2].y += trans - v2;
		vertices[3].x += -trans + v2;
		vertices[3].y += trans - v2;


		stair.vertices = vertices;
		// stair.faces.push(new THREE.Face3(0, 1, 2),new THREE.Face3(1,3,2),
		// 		       new THREE.Face3(0, 2, 1),new THREE.Face3(3,1,2));
		stair.faces.push(new THREE.Face3(0, 1, 2), new THREE.Face3(2,1,3) );
		stair.faceVertexUvs[0] = []
		stair.faceVertexUvs[ 0 ].push( [
	        new THREE.Vector2( 0, 0 ),
	        new THREE.Vector2( 1, 0 ),
	        new THREE.Vector2( 0, 1 )
	    ] );
		stair.faceVertexUvs[1] = []
		stair.faceVertexUvs[ 1 ].push( [
	        new THREE.Vector2( 0, 1 ),
	        new THREE.Vector2( 1, 0 ),
	        new THREE.Vector2( 1, 1 )
	    ] );

		stair.computeBoundingSphere();
		var texture = THREE.ImageUtils.loadTexture('img/test.jpg');
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		var material = new THREE.MeshBasicMaterial({ 
			//map: texture
			color: 0x785E9E
		});
		var mesh = new THREE.Mesh(stair, material);
		scene.add(mesh);
		//
		//Escalier devant cafet
		//
		stair = new THREE.Geometry(),
		vertices = [new THREE.Vector3(420,230, -60),
					new THREE.Vector3(660,230, 50),
					new THREE.Vector3(420,350,-60),
					new THREE.Vector3(660,350,50)];
		//Translations
		vertices[0].x += trans;
		vertices[0].y += -trans;
		vertices[1].x += trans;
		vertices[1].y += -trans;
		vertices[2].x += trans;
		vertices[2].y += -trans;
		vertices[3].x += trans;
		vertices[3].y += -trans;


		stair.vertices = vertices;
		// stair.faces.push(new THREE.Face3(0, 1, 2),new THREE.Face3(1,3,2),
		// 		       new THREE.Face3(0, 2, 1),new THREE.Face3(3,1,2));
		stair.faces.push(new THREE.Face3(0, 1, 2), new THREE.Face3(2,1,3),
		 	new THREE.Face3(0, 2, 1), new THREE.Face3(2,3,1));
		stair.faceVertexUvs[0] = []
		stair.faceVertexUvs[ 0 ].push( [
	        new THREE.Vector2( 0, 0 ),
	        new THREE.Vector2( 1, 0 ),
	        new THREE.Vector2( 0, 1 )
	    ] );
		stair.faceVertexUvs[1] = []
		stair.faceVertexUvs[ 1 ].push( [
	        new THREE.Vector2( 0, 1 ),
	        new THREE.Vector2( 1, 0 ),
	        new THREE.Vector2( 1, 1 )
	    ] );

		stair.computeBoundingSphere();
		texture = THREE.ImageUtils.loadTexture('img/test.jpg');
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		mesh = new THREE.Mesh(stair, material);
		scene.add(mesh);
	}
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}


function animate() {
	requestAnimationFrame( animate );
	controls.update();
	render();
}

var btime;
function animCam()
{
	animCamEnabled = animCamEnabled===false;
	if(animCamEnabled)btime = Date.now();
}

var t=0;
function render() {
	// Try Animate Camera Along Spline
		if(animCamEnabled === true)
		{
			var scale=1;
			//var time = Date.now();
			//var looptime = 20 * 1000;
			//var t = ( (time) % looptime ) / looptime;
			//log(tube.path.points)
			t += 0.01/tube.path.points.length;
			if(t>=0.98) {
				animCamEnabled = false; t=0;
			}else{
				var pos = tube.path.getPointAt( t );
				pos.multiplyScalar( scale );

				// interpolation
				var segments = tube.tangents.length;
				var pickt = t * segments;
				var pick = Math.floor( pickt );
				var pickNext = ( pick + 1 ) % segments;

				binormal.subVectors( tube.binormals[ pickNext ], tube.binormals[ pick ] );
				binormal.multiplyScalar( pickt - pick ).add( tube.binormals[ pick ] );

				var dir = tube.path.getTangentAt( t );
				var offset = 15;
				normal.copy( binormal ).cross( dir );

				// We move on a offset on its binormal
				pos.add( normal.clone().multiplyScalar( offset ) );
				splineCamera.position = pos;
				//cameraEye.position = pos;


				// Camera Orientation 1 - default look at
				//splineCamera.lookAt( lookAt );

				// Using arclength for stablization in look ahead.
				var lookAt = tube.path.getPointAt( ( t + 30 / tube.path.getLength() ) % 1 ).multiplyScalar( scale );

				// Camera Orientation 2 - up orientation via normal
				splineCamera.matrix.lookAt(splineCamera.position, lookAt, upnormal);
				splineCamera.rotation.setFromRotationMatrix( splineCamera.matrix, splineCamera.rotation.order );

				//cameraHelper.update();
				//parent.rotation.y += ( targetRotation - parent.rotation.y ) * 0.05;
				renderer.render( scene, splineCamera);
			}
		}
		else renderer.render( scene, camera );
}