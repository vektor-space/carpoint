/**
 * Created by Satbir on 05/03/16.
 */

//Create a scene, camera, renderer,



var aspectRatio, fieldofView, camera, renderer, scene, loader, mesh, zmax, zmin;


function init(){
    aspectRatio = window.innerWidth/window.innerHeight;

    fieldofView = 55;

    camera = new THREE.PerspectiveCamera(fieldofView, aspectRatio, 1, 2000);

    camera.position.z = 1000;
    camera.position.y = 500;
    //camera.position.x = -500;

    renderer = new THREE.WebGLRenderer();

    renderer.setPixelRatio(window.devicePixelRatio);

    renderer.setSize( window.innerWidth, window.innerHeight );

    var controls = new THREE.OrbitControls( camera, renderer.domElement );

    document.body.appendChild( renderer.domElement );

    scene = new THREE.Scene();

    scene.fog = new THREE.FogExp2( 0x000000, 0.0009 );

    // instantiate a loader
    loader = new THREE.JSONLoader();

// load a resource
    //loader.load(
    //    // resource URL
    //    'models/car_bumper.json',
    //    // Function when resource is loaded
    //    loadcallback
    //);

    loader.load(
        // resource URL
        'models/car.json',
        // Function when resource is loaded
        loadcallback
    );

    zmax = 0;
    zmin = 0;

    function loadcallback( geometry, materials ) {
        var material = new THREE.MultiMaterial( materials );
        var object = new THREE.Mesh( geometry, material );

        var vertices = geometry.vertices;
        var vl = vertices.length;

        var newgeometry = new THREE.Geometry();



        var newgeometry = new THREE.BufferGeometry();

        newgeometry.dynamic = true;

        var numPoints = vl;

        var positions = new Float32Array( numPoints*3 );
        var colors = new Float32Array( numPoints*3 );


        var k = 0;

        var color = new THREE.Color( 0.75,0.75,0.75 );



        for (var i = 0; i < numPoints; i++){
            positions[3*i] = vertices[i].x;
            positions[3*i + 1] = vertices[i].y;
            positions[3*i + 2] = vertices[i].z;

            if(vertices[i].z > zmax){
                zmax = vertices[i].z;
            }

            if(vertices[i].z < zmin){
                zmin = vertices[i].z;
            }

            colors[3*i] = color.r;
            colors[3*i + 1] = color.g;
            colors[3*i + 2] = color.b;

        }

        newgeometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
        newgeometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );

        mesh = new THREE.Points( newgeometry, new THREE.PointsMaterial( {
            size: 3,
            //color: 0xffffff,
            vertexColors: THREE.VertexColors
        } ) );

        mesh.rotation.y = Math.PI / 4;
        //mesh.rotation.z = Math.PI / 2;



        console.log(zmax, zmin);

        scene.add( mesh );
    }
}



var range = {
    min: 0,
    max: 200
}

init();

render();

function updateColors(){

    if(mesh){

        mesh.rotation.y += 0.01;

        var colors = mesh.geometry.attributes.color.array;
        var positions = mesh.geometry.attributes.position.array;

        var color = new THREE.Color( 1, 1, 1 );
        var color1 = new THREE.Color( 0.75, 0.75, 0.75 )



        for (var i = 0; i < colors.length; i++){

            if(positions[3*i + 2] < range.max && positions[3*i + 2] > range.min ){
                colors[3*i] = color.r;
                colors[3*i + 1] = color.g;
                colors[3*i + 2] = color.b;
            } else {
                colors[3*i] = color1.r;
                colors[3*i + 1] = color1.g;
                colors[3*i + 2] = color1.b;
            }



        }

        //mesh.geometry.removeAttribute('color');

        //mesh.geometry.removeAttribute('')


        mesh.geometry.attributes.color.needsUpdate = true;
    }


}

function render(){

    if(range.min < zmin){
        range.max = zmax;
        range.min = zmax - 100;
    }

    range.min -= 10;
    range.max -= 10;



    updateColors();

    renderer.render( scene, camera );


    requestAnimationFrame(render);
}


