
//Matrix.js for 3D drawing in HTML5 canvas
//by Pamela Liou 2018
//inspired heavily by Ken Perlin's Computer Graphics course and
//M.js, rewritten for ECMA6


class Vector3{
	constructor(x,y,z){
		this.x;
		this.y;
		this.z;
		this.set(x,y,z);

	}

	set(x,y,z){
			if (x !== undefined) this.x = x;
     	if (y !== undefined) this.y = y;
     	if (z !== undefined) this.z = z;
	}

	toString(){
		return '{x:' + this.x + ', y:' + this.y + ', z:' + this.z + '}';

	}

	viewportTransform(width, height, pixel){
		pixel.x = (width  / 2) + this.x * (width / 2); 
     	pixel.y = (height / 2) - this.y * (width / 2);
	}

}


class Matrix{

	contructor(){
		this.initMatrix; // identity matrix, init matrix
		this.matrix; // current matrix
		this.prevMatrix; // matrix before previous transform
		this.transformMatrix; //transform

		this.set();


	}

	init(){
		this.initMatrix =[
							[1, 0, 0, 0],
							[0, 1, 0, 0],
							[0, 0, 1, 0],
							[0, 0, 0, 1],
						];

		//copy over init to current matrix and prev
		this.matrix = this.initMatrix.map(function(arr){return arr.slice()});

		
		this.prevMatrix = this.matrix.map(function(arr){return arr.slice()});
	};

	set(x,y,z){ //takes xyx and sets transform matrix
		this.transformMatrix = [
							[1, 0, 0, x],
							[0, 1, 0, y],
							[0, 0, 1, z],
							[0, 0, 0, 1],
						];

	}

	setVec3(vec){ //takes vec3 and sets transform matrix
		this.transformMatrix = [
							[1, 0, 0, vec.x],
							[0, 1, 0, vec.y],
							[0, 0, 1, vec.z],
							[0, 0, 0, 1],
						];

	}

	translate(x,y,z){

		this.prevMatrix = this.matrix.map(function(arr){return arr.slice()});
		this.set(x,y,z);
		this.multiply();

	};

	rotateX(angle){ //angle in radians duh

		this.prevMatrix = this.matrix.map(function(arr){return arr.slice()});
		
		var c = Math.cos(angle);
      	var s = Math.sin(angle);

		this.transformMatrix = [
							[1, 0, 0, 0],
							[0, c, -s, 0],
							[0, s, c, 0],
							[0, 0, 0, 1],
						];

		this.multiply();

	}


	rotateY(angle){ //angle in radians duh

		this.prevMatrix = this.matrix.map(function(arr){return arr.slice()});

		var c = Math.cos(angle);
      	var s = Math.sin(angle);

		this.transformMatrix = [
							[c, 0, s, 0],
							[0, 1, 0, 0],
							[-s, 0, c, 0],
							[0, 0, 0, 1],
						];

		this.multiply();

	}


	rotateZ(angle){ //angle in radians duh

		this.prevMatrix = this.matrix.map(function(arr){return arr.slice()});

		var c = Math.cos(angle);
      	var s = Math.sin(angle);

		this.transformMatrix = [
							[c, -s, 0, 0],
							[s, c, 0, 0],
							[0, 0, 1, 0],
							[0, 0, 0, 1],
						];

		this.multiply();

	}

	scale(x,y,z){

		this.transformMatrix = [
							[x, 0, 0, 0],
							[0, y, 0, 0],
							[0, 0, z, 0],
							[0, 0, 0, 1],
						];
		this.multiply();

	}


	perspective(x,y,z){

		this.transformMatrix = [
							[1, 0, 0, 0],
							[0, 1, 0, 0],
							[0, 0, 1, 0],
							[x, y, z, 1],
						];
		this.multiply();

	}

	transform(src, dst){ //takes Vec4, returns Vec3

		var A = this.matrix.map(function(arr){return arr.slice()}), //copy
			x = src.x,
			y = src.y,
			z = src.z, 
			w = (src.w !== undefined) ? src.w : 1;

			dst.x = A[0][0] * x + A[0][1] * y + A[0][2] * z + A[0][3] * w;
			dst.y = A[1][0] * x + A[1][1] * y + A[1][2] * z + A[1][3] * w;
			dst.z = A[2][0] * x + A[2][1] * y + A[2][2] * z + A[2][3] * w;
			w =	    A[3][0] * x + A[3][1] * y + A[3][2] * z + A[3][3] * w;

			if (dst.w !== undefined){
				dst.w = w;
			}else{
				dst.x /= w;
				dst.y /= w;
				dst.z /= w;
			}
	}

	multiply(){

		var A = this.matrix.map(function(arr){return arr.slice()}); //copy

		var matrix = this.matrix; //reference to matrix
		//this.prevMatrix = this.matrix;

		var B = this.transformMatrix;

		var row, col;

		this.array2D(4, 4, function(row, col){

				matrix[row][col] =
					A[row][0] * B[0][col] + 
					A[row][1] * B[1][col] +
					A[row][2] * B[2][col] +
					A[row][3] * B[3][col] ;
				});
	 
			
		}

	array2D(row, col, callback){  //convenience function for cycling through 2d arrays
    	var i, j;
   		for( i =0; i < row; i++){ 
    	   for( j= 0; j < col; j++){
    	      callback(i,j);
    	   }
 	}


}

}



////Ken's code for animating canvas, needs updating perhaps

   // KEEP TRACK OF TIME IN SECONDS SINCE THE PAGE WAS LOADED.

   var startTime = (new Date()).getTime() / 1000, time = startTime;

   // MAINTAIN AN ARRAY OF 2D CANVASES, AND HAVE EACH CANVAS RESPOND TO MOUSE EVENTS.

   var canvases = [];
   function initCanvas(id) {
      var canvas = document.getElementById(id);
      canvas.setCursor = function(x, y, z) {
         var r = this.getBoundingClientRect();
	 this.cursor.set(x - r.left, y - r.top, z);
      }
      canvas.cursor = new Vector3(0, 0, 0);
      canvas.onmousedown = function(e) { this.setCursor(e.clientX, e.clientY, 1); }
      canvas.onmousemove = function(e) { this.setCursor(e.clientX, e.clientY   ); }
      canvas.onmouseup   = function(e) { this.setCursor(e.clientX, e.clientY, 0); }
      canvases.push(canvas);
      return canvas;
   }

   // ANIMATE BY CALLING EACH CANVAS'S update() FUNCTION, IF IT HAS ONE.

   function tick() {
      time = (new Date()).getTime() / 1000 - startTime;
      for (var i = 0 ; i < canvases.length ; i++)
         if (canvases[i].update) {
	    var canvas = canvases[i];
            var g = canvas.getContext('2d');
            g.clearRect(0, 0, canvas.width, canvas.height);
            canvas.update(g);
         }
      setTimeout(tick, 1000 / 60);
   }
   tick();


////


