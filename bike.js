var gl;
var canvas;

var xAxis=0;
var yAxis=1;
var zAxis=2;

var axis=0;
var theta=[0,0,0];

var thetaLoc;

var flag = false;

var points = [];
var colors = [];
window.onload = function init()
{
	canvas = document.getElementById( "gl-canvas" );
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	const renderer = new THREE.WebGLRenderer({canvas});
	renderer.setSize(canvas.width,canvas.height);

	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0x000000);

	camera = new THREE.PerspectiveCamera(75,canvas.width / canvas.height,0.1, 1000);
	camera.rotation.y = 45/180*Math.PI;
	camera.position.x = 50;
	camera.position.y = 50;
	camera.position.z = 50;

	const controls = new THREE.OrbitControls(camera, renderer.domElement);

	var light1 = new THREE.AmbientLight (0xffffff,5);
	scene.add(light1);

	var light2 = new THREE.DirectionalLight(0xffffff, 5);
	light2.position.set(5000,1000,0);
	scene.add(light2);

	var light3 = new THREE.PointLight(0xAAAA55,5);
	light3.position.set(0,1000,-5000);
	scene.add(light3);

	// light2 = new THREE.PointLight(0xFFFF77,5);
	// light2.position.set(1000,1000,-3000);
	// scene.add(light2);

	// light3 = new THREE.PointLight(0x993333,1);
	// light3.position.set(0,-1000,3000);
	// scene.add(light3);


	const loader = new THREE.GLTFLoader();
	loader.load('./model/scene.gltf', function(gltf){
		compass = gltf.scene.children[0];
		compass.rotation.x = -1.5708
		compass.scale.set(30,30,30);
		scene.add(gltf.scene);
		animate();
	}, undefined, function (error) {
		console.error(error);
	});

	var time = 0
	function animate() {
		compass.rotation.x = time += 0.1
		renderer.render(scene,camera);
		requestAnimationFrame(animate);
	}
	gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    var mySphere = sphere();
    mySphere.scale(0.40, 0.40, 0.40);

    points = points.concat(mySphere.TriangleVertices);
    colors = colors.concat(mySphere.TriangleVertexColors)

    var myCylinder = cylinder(72, 3, true);
    myCylinder.scale(0.3, 1.0, 0.3);
    myCylinder.translate(0.0, -0.4, 0.0);


    points = points.concat(myCylinder.TriangleVertices);
    colors = colors.concat(myCylinder.TriangleVertexColors)
    
    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
    

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation(program, "theta"); 
    
    //event listeners for buttons
    
    document.getElementById( "xButton" ).onclick = function () {
        axis = xAxis;
    };
    document.getElementById( "yButton" ).onclick = function () {
        axis = yAxis;
    };
    document.getElementById( "zButton" ).onclick = function () {
        axis = zAxis;
    };
    document.getElementById("ButtonT").onclick = function(){flag = !flag;};
    render();

}
function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if(flag) theta[axis] += 2.0;
    gl.uniform3fv(thetaLoc, theta);
    gl.drawArrays( gl.TRIANGLES, 0, points.length);
    requestAnimFrame( render );
}