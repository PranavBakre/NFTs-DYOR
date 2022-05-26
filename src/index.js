import { scene, renderer, camera, controls } from "./configuration/setup";
import { PlaneGeometry, Mesh, AmbientLight, RectAreaLight, MeshPhongMaterial, MeshBasicMaterial, Shape, ShapeBufferGeometry, PlaneBufferGeometry } from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TextureLoader } from "three";
import {RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import "index.css"
import { getDirectionLight } from "./lights";
import { getRoundedRectangle } from "./shape";
import { MeshLambertMaterial, CanvasTexture } from "three";
import { Texture } from "three";

function createTextCanvas(text, color, font, size) {
	size = size || 100;
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');
	var fontStr = (font || 'Arial') + ' ' + (size +'px');
	ctx.font = fontStr; 
	var w = ctx.measureText(text).width;
	var h = Math.ceil(size*1.25);
	canvas.width = w;
	canvas.height = h;
	ctx.font = fontStr;
	ctx.fillStyle = color || 'black';
	ctx.fillText(text, 0, size);
	return canvas;
  }
document.getElementById("root").appendChild(renderer.domElement)
RectAreaLightUniformsLib.init();
let ambientLight = new AmbientLight(0xffffff, 0.5)
scene.add( ambientLight );

const directionalLight1 = getDirectionLight([0.6,2,1],[-0.35,0.95,0], "white", 0.7)
const directionalLight2 = getDirectionLight([-0.6,0.8,1],[0.35,1.85,0], 0xd400ff/*0xab35e6*/, 1)
console.log(directionalLight1.position.y)
scene.add( directionalLight1 );	
scene.add( directionalLight2 );	

let x = -0.4; let y = 0.9; let width = 0.8; let height = 1.05; let radius = 0.1
const wall = getRoundedRectangle(5,5,0,-2,-2)
const window = getRoundedRectangle(width, height, radius, x,y)
wall.holes.push(window)
const wallMaterial = new MeshBasicMaterial( { color: "black", shininess: 100,reflectivity: 1 } );
const plane = new Mesh( new ShapeBufferGeometry( wall ), wallMaterial );
// plane.rotateX(-Math.PI / 2)
plane.position.z = 0.2
scene.add( plane)


let  borderSize = 0.01;
let frameBorder1 = getRoundedRectangle(width, height, radius, x,y) 
x = x + borderSize ; y = y + borderSize; width = width - 2 * borderSize; height = height - 2 * borderSize;

frameBorder1.holes.push(getRoundedRectangle(width, height, radius, x,y))
let borderMaterial = new MeshPhongMaterial({color: "white", reflectivity: 1})

const frameBorder1Mesh = new Mesh( new ShapeBufferGeometry( frameBorder1 ), borderMaterial );
frameBorder1Mesh.position.z=0.2
scene.add(frameBorder1Mesh)


let frame = getRoundedRectangle(width, height, radius, x,y) 
borderSize = 0.1;
x = x + borderSize ; y = y + borderSize + 0.05; width = width - 2 * borderSize; height = height - 2 * borderSize - 0.05;radius = radius - 0.005;
let hole =  getRoundedRectangle(width, height, radius, x,y)

frame.holes.push(hole)


const frameLight = new RectAreaLight("gold", 1.5, width, height)
frameLight.position.set(0,1.45,0.2);
// frameLight.lookAt(0,1.7,0)
scene.add(frameLight)

// let helper = new RectAreaLightHelper(frameLight)
// frameLight.add(helper)



let frameGeometry = new ShapeBufferGeometry( frame );
const frameMaterial = new MeshPhongMaterial( { color: /*"black"*/0x3570e6, shininess: 150 } );
let frameMesh = new Mesh(frameGeometry, frameMaterial)
frameMesh.position.z = 0.2

borderSize = 0.01;



let frameBorder2 = getRoundedRectangle(width, height, radius, x,y) 
x = x + borderSize ; y = y + borderSize; width = width - 2 * borderSize; height = height - 2 * borderSize;radius = radius - 0.005;
frameBorder2.holes.push(getRoundedRectangle(width, height, radius, x,y))
const frameBorder2Mesh = new Mesh( new ShapeBufferGeometry( frameBorder2 ), borderMaterial );
frameBorder2Mesh.position.z=0.2

scene.add(frameMesh, frameBorder2Mesh,
	 directionalLight1.target, directionalLight2.target)

camera.position.z = 1.3;
camera.position.y = 1.4;
controls.update();
const loader = new GLTFLoader();


const textureLoader = new TextureLoader()
textureLoader.load("logo.png", (texture) => {
	let image = texture.image;
	console.log(image.width)
	let logoBase = new PlaneGeometry(image.width/2500, image.height/2500);
	const material = new MeshBasicMaterial( {
		map: texture,
		transparent: true,
		// opacity: 0
	 } );
	 const mesh = new Mesh(logoBase,material)
	 mesh.position.z = 0.201;
	 mesh.position.y = 1.89
	 scene.add(mesh)
})


loader.load( 'avatar.glb', function ( gltf ) {
    console.log(gltf)
	scene.add( gltf.scene );

}, undefined, function ( error ) {

	console.error( error );


} );
	var canvas = document.createElement('canvas');
    canvas.width = 300; canvas.height = 128;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle='white';
    ctx.font = "22px Arial";
    ctx.fillText("Megha Singh", 10, 100);
	console.log(canvas.width)
    let canvasTexture = new CanvasTexture( canvas );
	let titleMaterial = new MeshBasicMaterial({ map: canvasTexture, /*transparent: true*/ });
	let titleGeometry  =new PlaneBufferGeometry(0.4,0.1,2,2);
    let titleMesh = new Mesh( titleGeometry, titleMaterial );
    titleMesh.position.z = 0.201;
	 titleMesh.position.y= 0.98
	 
scene.add(titleMesh)
function animate() {
	requestAnimationFrame( animate );
	if (camera.rotation.y > Math.PI/8) {
		controls.autoRotateSpeed = 1
	}else if(camera.rotation.y < -1* Math.PI/8) {
		controls.autoRotateSpeed = -1
	}
    controls.update();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.render( scene,camera );
}
// setInterval(()=> {
// 	console.log(camera.rotation.y)
// }, 1000)
animate();