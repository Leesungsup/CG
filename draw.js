
var gl;
var points;
var webgl;
var offset=0.0
var sunlight_point=0
var direction=0.01
//Change angle to radian value
var angleToRad = (angle) => {
    return Math.PI / 180 * angle;
}

//Rotate angle
var rotateXY = (x, y, rotate) => {
    xx = x * Math.cos(angleToRad(rotate)) - y * Math.sin(angleToRad(rotate));
    yy = x * Math.sin(angleToRad(rotate)) + y * Math.cos(angleToRad(rotate));
    return [xx, yy];
}

//Make circle vertices
var makeCircle = (radius = 0.5, width = 1, rotate = 0, minAngle = 5) => {
    var vertices = []
    for(var i = 0; i < 360; i += minAngle){
        vertices.push(vec2(0, 0));
        x = Math.cos(angleToRad(i)) * radius * width;
        y = Math.sin(angleToRad(i)) * radius;
        xn = Math.cos(angleToRad(i + minAngle)) * radius * width;
        yn = Math.sin(angleToRad(i + minAngle)) * radius;
        vertices.push(vec2(rotateXY(x, y, rotate)[0], rotateXY(x, y, rotate)[1]));
        vertices.push(vec2(rotateXY(xn, yn, rotate)[0], rotateXY(xn, yn, rotate)[1]));

    }   

    return vertices;
}

window.onload = function init() {
    var canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    buttonChange = document.getElementById("btnChange")
        buttonChange.addEventListener("click", () => {
            direction = -direction
            console.log(clickBox)
    })
    //Configure WebGL 
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    //Load shaders 
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    gl.clear( gl.COLOR_BUFFER_BIT );
    r=0.5;
    var vertices = new Float32Array(
        [
            0.0,0.0, 
            r,0.0, 
            r*Math.cos(Math.PI/4),r*Math.sin(Math.PI/4),
            r*Math.cos(2*Math.PI/4),r*Math.sin(2*Math.PI/4),
            r*Math.cos(3*Math.PI/4),r*Math.sin(3*Math.PI/4),
            r*Math.cos(4*Math.PI/4),r*Math.sin(4*Math.PI/4),
            r*Math.cos(5*Math.PI/4),r*Math.sin(5*Math.PI/4),
            r*Math.cos(6*Math.PI/4),r*Math.sin(6*Math.PI/4),
            r*Math.cos(7*Math.PI/4),r*Math.sin(7*Math.PI/4),
            r*Math.cos(8*Math.PI/4),r*Math.sin(8*Math.PI/4),
        ]        
    ); 

    //Draw Background
    drawBackground(program);

    // Rain
    for(var i = -0.9; i < 0.9; i += 0.2){
        for(var j = -0.9; j < 0.9; j += 0.15){
            if(j*2<0.95 && 0.9>=(-j-i*2) && (-j-i*2)>=-0.9){
                draw(program, makeCircle(0.03, 2, 90), [j*2, -j - i*2-offset, 0], [0, 0.2, 0.5, 1]);
            }
        }
    }

    //Draw Head
    drawOctagonVertices(program,[0,0,0],[1.0, 0, 0, 1.0],0.4);
    sunlight_vertics=new Float32Array(
        [
            0.65,0,0,
            0.56,0.23,22.5,
            0.46,0.46,45,
            0.23,0.56,67.5,
            0,0.65,90,
            -0.23,0.56,-67.5,
            -0.46,0.46,-45,
            -0.56,0.23,-22.5,
            -0.65,0,0,
            -0.56,-0.23,22.5,
            -0.46,-0.46,45,
            -0.23,-0.56,67.5,
            0,-0.65,90,
            0.23,-0.56,-67.5,
            0.46,-0.46,-45,
            0.56,-0.23,-22.5
        ]        
    ); 
    //Draw Sunlight
    // result = makeCircle(0.09, 2.5, 0); // 0: vertices, 0: colors
    // draw(program, result, [0.65,0,0], [1.0, 0, 0, 0.1]);
    // result = makeCircle(0.09, 2.5, 0); // 0: vertices, 0: colors
    // draw(program, result, [-0.65,0,0], [1.0, 0, 0, 0.1]);
    // result = makeCircle(0.09, 2.5, 45); // 0: vertices, 0: colors
    // draw(program, result, [-0.46,-0.46,0], [1.0, 0, 0, 0.1]);
    // result = makeCircle(0.09, 2.5, 45); // 0: vertices, 0: colors
    // draw(program, result, [0.46,0.46,0], [1.0, 0, 0, 0.1]);
    // result = makeCircle(0.09, 2.5, -45); // 0: vertices, 0: colors
    // draw(program, result, [0.46,-0.46,0], [1.0, 0, 0, 0.1]);
    // result = makeCircle(0.09, 2.5, -45); // 0: vertices, 0: colors
    // draw(program, result, [-0.46,0.46,0], [1.0, 0, 0, 0.1]);
    // result = makeCircle(0.09, 2.5, 90); // 0: vertices, 0: colors
    // draw(program, result, [0,0.65,0], [1.0, 0, 0, 0.1]);
    // result = makeCircle(0.09, 2.5, 90); // 0: vertices, 0: colors
    // draw(program, result, [0,-0.65,0], [1.0, 0, 0, 0.1]);
    
    //Draw Head decoratioin
    for(var i=sunlight_point;i<sunlight_vertics.length;i+=6){
        result = makeCircle(0.09, 2.5, sunlight_vertics[i+2]); // 0: vertices, 0: colors
        draw(program, result, [sunlight_vertics[i],sunlight_vertics[i+1],0], [1, 0, 0, 0.1]);
    }

    //Draw Head decoratioin
    for(var i=2;i<vertices.length;i+=2){
        result = makeCircle(0.06, 1, 0); // 0: vertices, 0: colors
        draw(program, result, [vertices[i],vertices[i+1],0], [1, 1.0, 0, 1]);
        result = makeCircle(0.02, 1, 0);
        draw(program, result, [vertices[i]-0.02, vertices[i+1], 0], [1.0, 1.0, 1.0, 1]);
    }
    

    //Draw Cheek
    result = makeCircle(0.06, 1, 0);
    draw(program, result, [-0.2, -0.1, 0], [0, 0, 0, 1]);
    result = makeCircle(0.06, 1, 0);
    draw(program, result, [0.2, -0.1, 0], [0, 0, 0, 1]);

    //Draw Eye
    result = makeCircle(0.06, 1, 0);
    draw(program, result, [-0.15, 0.04, 0], [0, 0, 0, 1]);
    result = makeCircle(0.06, 1, 0);
    draw(program, result, [0.15, 0.04, 0], [0, 0, 0, 1]);

    //Draw Eye hightlighter
    result = makeCircle(0.02, 1, 0);
    draw(program, result, [-0.18, 0.04, 0], [1.0, 1.0, 1.0, 1]);
    result = makeCircle(0.02, 1, 0);
    draw(program, result, [0.12, 0.04, 0], [1.0, 1.0, 1.0, 1]);

    //Draw Nose
    draw(program,[ 
        vec2(0, -0.06), //v0
        vec2(-0.02, -0.03), //v1
        vec2(0.02, -0.03), //v2
    ],[0, 0, 0], [0, 0, 0, 1]);
    
    //Draw Mouth
    draw(program, makeCircle(0.04, 1.4, 1), [-0.05, -0.15, 0], [0, 0, 0, 1])
    draw(program, makeCircle(0.03, 1.4, 1), [-0.05, -0.15, 0], [1, 0, 0, 1])
    draw(program, makeCircle(0.04, 1.4, 1), [0.05, -0.15, 0], [0, 0, 0, 1])
    draw(program, makeCircle(0.03, 1.4, 1), [0.05, -0.15, 0], [1, 0, 0, 1])
    draw(program,[ 
        vec2(0, -0.06), //v0
        vec2(-0.15, -0.14), //v1
        vec2(0.15, -0.14), //v2
    ],[0, 0, 0], [1.0, 0, 0, 1]);
    // Variable controlls for animate background pattern

    offset += direction
    //sunlight_point+=3
    if(sunlight_point>3)sunlight_point=0
    if(offset >= 0.25){ 
        sunlight_point+=3
        offset = -0.25
    }
    else if(offset <= -0.25){ 
        offset = 0.25
        sunlight_point+=3
    }
    requestAnimationFrame(init)
};
//draw function
var draw = (program, v, uoffset = [0,0,0], color = [0,0,0,1]) => {
    console.log(uoffset,color);	  

    // Create a buffer object, initialize it, and associate it with the
    //  associated attribute variable in our vertex shader    

	/*-----------------------------------------------------------------------*/
	/* vertex position ------------------------------------------------------*/
	/*-----------------------------------------------------------------------*/
    var vertexPositionBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vertexPositionBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(v), gl.STATIC_DRAW ); // flatten -> Tessellation

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    /*-----------------------------------------------------------------------*/
	/* vertex color ---------------------------------------------------------*/
	/*-----------------------------------------------------------------------*/
    // Add color
    c = [];
    for(var i=0; i < v.length; i++)
        c.push(vec4(color[0], color[1], color[2], color[3]));

    // Color
    var vertexColorBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(c), gl.STATIC_DRAW);
    
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    //Offset
    var Offset = gl.getUniformLocation( program, "Offset" );
    gl.uniform4fv(Offset, [uoffset[0], uoffset[1], uoffset[2], 0]);

    //Draw
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, v.length );
}


//Draw background
var drawBackground = (program) => {
    //Background vertices
    vertices = [
        vec2(-0.9, 0.9),
        vec2(-0.9, -0.9),
        vec2(0.9, 0.9),
        vec2(0.9, -0.9),
    ];

    //Background color gradation
    color = [
        vec4(0.25, 1, 0.45,1),
        vec4(0.75, 0.45, 1,1),
        vec4(0.7, 0.7, 0.1,1),
        vec4(1, 0.25, 0.25,1),
    ];

    // Create a buffer object, initialize it, and associate it with the
    //  associated attribute variable in our vertex shader    
	/*-----------------------------------------------------------------------*/
	/* vertex position ------------------------------------------------------*/
	/*-----------------------------------------------------------------------*/
    var vertexPositionBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vertexPositionBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    /*-----------------------------------------------------------------------*/
	/* vertex color ---------------------------------------------------------*/
	/*-----------------------------------------------------------------------*/
    // Color
    var vertexColorBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(color), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    //Draw
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, vertices.length );
}

//Draw Octagon
function drawOctagonVertices(program, uoffset,color,size) {
    itemSize = 2;
    numberOfItem = 6;
    var r = size; //radius
    var octagonVertices = new Float32Array(
        [
            0.0,0.0, 
            r,0.0, 
            r*Math.cos(Math.PI/4),r*Math.sin(Math.PI/4),
            r*Math.cos(2*Math.PI/4),r*Math.sin(2*Math.PI/4),
            r*Math.cos(3*Math.PI/4),r*Math.sin(3*Math.PI/4),
            r*Math.cos(4*Math.PI/4),r*Math.sin(4*Math.PI/4),
            r*Math.cos(5*Math.PI/4),r*Math.sin(5*Math.PI/4),
            r*Math.cos(6*Math.PI/4),r*Math.sin(6*Math.PI/4),
            r*Math.cos(7*Math.PI/4),r*Math.sin(7*Math.PI/4),
            r*Math.cos(8*Math.PI/4),r*Math.sin(8*Math.PI/4),]        
    ); 

    // Create a buffer object, initialize it, and associate it with the
    //  associated attribute variable in our vertex shader    
	/*-----------------------------------------------------------------------*/
	/* vertex position ------------------------------------------------------*/
	/*-----------------------------------------------------------------------*/
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );	
    gl.bufferData( gl.ARRAY_BUFFER, octagonVertices, gl.STATIC_DRAW );	 	  

	gl.vertexAttribPointer( vPosition, itemSize, gl.FLOAT, false, 0, 0 );	
    gl.enableVertexAttribArray( vPosition );
    

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    /*-----------------------------------------------------------------------*/
	/* vertex color ---------------------------------------------------------*/
	/*-----------------------------------------------------------------------*/
    //Add color
    c = []
    for(var i=0; i < octagonVertices.length; i++)
        c.push(vec4(color[0], color[1], color[2], color[3]));

    // Color
    var vertexColorBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(c), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
    //Offset
    var offset = gl.getUniformLocation(program, "Offset");
    gl.uniform4fv(offset,[uoffset[0], uoffset[1], uoffset[2], 0]);

    //Draw
    gl.drawArrays(gl.TRIANGLE_FAN, 0, octagonVertices.length/2); 
}

