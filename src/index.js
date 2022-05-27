import { scene, renderer, camera, controls, capturer } from "./configuration/setup";
import { PlaneGeometry, Mesh, RectAreaLight, MeshPhongMaterial, MeshBasicMaterial, CanvasTexture, ShapeBufferGeometry, PlaneBufferGeometry } from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TextureLoader } from "three";
import "index.css"
import { getFrameWithHole, getRoundedRectangle } from "./shape";
import { convertTextToTexture } from "./text";


const domRoot = document.getElementById("root");
domRoot.appendChild(renderer.domElement)

const button = document.createElement("button");
button.onclick = (event) => {
	capturer.start();
	console.log("Start")
	setTimeout(()=> {
		console.log("End")
		capturer.stop();
		capturer.save((blob)=> {
			const url = URL.createObjectURL(blob);
			console.log(url)
			history.pushState({},"", url)
		});
		button.disabled = false;
	}, 1000);
	button.disabled= true;
}
button.innerHTML="Save video"
button.style.position = "absolute";
button.style.top = "3rem";

domRoot.append(button)
let x = -0.4; let y = 0.9; let width = 0.8; let height = 1.05; let radius = 0.1
const wall = getRoundedRectangle(5, 5, 0, -2, -2)
const window = getRoundedRectangle(width, height, radius, x, y)
wall.holes.push(window)
const wallMaterial = new MeshBasicMaterial({ color: "black", shininess: 100, reflectivity: 1 });
const plane = new Mesh(new ShapeBufferGeometry(wall), wallMaterial);
plane.position.z = 0.2
scene.add(plane)


let borderSize = 0.01;
let frameBorder1 = getFrameWithHole(width, height, radius,borderSize, x, y)

let borderMaterial = new MeshPhongMaterial({ color: "white", reflectivity: 1 })

const frameBorder1Mesh = new Mesh(new ShapeBufferGeometry(frameBorder1), borderMaterial);
frameBorder1Mesh.position.z = 0.2
scene.add(frameBorder1Mesh)

x = x + borderSize; y = y + borderSize; width = width - 2 * borderSize; height = height - 2 * borderSize;

borderSize = 0.1;

let frame = getRoundedRectangle(width, height, radius, x, y)

x = x + borderSize; y = y + borderSize + 0.05; width = width - 2 * borderSize; height = height - 2 * borderSize - 0.05; radius = radius - 0.005;
let hole = getRoundedRectangle(width, height, radius, x, y)

frame.holes.push(hole)


const frameLight = new RectAreaLight("gold", 1.5, width, height)
frameLight.position.set(0, 1.45, 0.2);
// frameLight.lookAt(0,1.7,0)
scene.add(frameLight)

// let helper = new RectAreaLightHelper(frameLight)
// frameLight.add(helper)



let frameGeometry = new ShapeBufferGeometry(frame);
const frameMaterial = new MeshPhongMaterial({ color: /*"black"*/0x3570e6, shininess: 150 });
let frameMesh = new Mesh(frameGeometry, frameMaterial)
frameMesh.position.z = 0.2

borderSize = 0.01;



let frameBorder2 = getFrameWithHole(width, height, radius,borderSize, x, y)
// let frameBorder2 = getRoundedRectangle(width, height, radius, x, y)

// frameBorder2.holes.push(getRoundedRectangle(width, height, radius, x, y))
x = x + borderSize; y = y + borderSize; width = width - 2 * borderSize; height = height - 2 * borderSize; //radius = radius - 0.005;
const frameBorder2Mesh = new Mesh(new ShapeBufferGeometry(frameBorder2), borderMaterial);
frameBorder2Mesh.position.z = 0.2

scene.add(frameMesh, frameBorder2Mesh)

camera.position.z = 1.3;
camera.position.y = 1.4;
controls.update();
const loader = new GLTFLoader();


const textureLoader = new TextureLoader()
textureLoader.load("logo.png", (texture) => {
	let image = texture.image;
	console.log(image.width)
	let logoBase = new PlaneGeometry(image.width / 2500, image.height / 2500);
	const material = new MeshPhongMaterial({
		map: texture,
		transparent: true,
		// opacity: 0
	});
	const mesh = new Mesh(logoBase, material)
	mesh.position.z = 0.201;
	mesh.position.y = 1.89
	scene.add(mesh)
})


loader.load('avatar.glb', function (gltf) {
	console.log(gltf)
	scene.add(gltf.scene);

}, undefined, function (error) {

	console.error(error);


});


let {texture:canvasTexture, canvas:titleCanvas} = convertTextToTexture("Megha Singh", {
	position: "absolute",
	top: "0px",
	padding: "5px",
}, domRoot)
let titleMaterial = new MeshBasicMaterial({ map: canvasTexture, transparent: true });
let titleGeometry = new PlaneBufferGeometry(titleCanvas.width / 400, titleCanvas.height / 400, 2, 2);
let titleMesh = new Mesh(titleGeometry, titleMaterial);
titleMesh.position.z = 0.202;
titleMesh.position.y = 1
scene.add(titleMesh)

// var subtitleDiv = document.createElement("div");
// subtitleDiv.innerHTML = "Member since Jan 2021"
// subtitleDiv.style.position = "absolute"
// subtitleDiv.style.top = "1.5rem"
// subtitleDiv.style.color = "white"
// subtitleDiv.style.fontWeight = "Bold"
// subtitleDiv.style.fontSize = "15px"
// subtitleDiv.style.fontFamily = "Gilroy-Medium"
// subtitleDiv.style.padding = "5px"
// document.body.append(subtitleDiv)


let {texture:subtitleCanvasTexture, canvas:subtitleCanvas} = convertTextToTexture("Member since Jan 2021", {
	position: "absolute",
	top: "1.5rem",
	padding: "5px",
	fontSize: "18px"
}, domRoot)
// var subtitleCanvas = document.createElement('canvas');
// subtitleCanvas.width = subtitleDiv.offsetWidth; subtitleCanvas.height = subtitleDiv.offsetHeight;
// console.log( subtitleDiv.offsetHeight)
// var subtitleCanvasCtx = subtitleCanvas.getContext("2d");
// subtitleCanvasCtx.fillStyle = subtitleDiv.style.color;
// subtitleCanvasCtx.font = subtitleDiv.style.fontWeight + " " + subtitleDiv.style.fontSize + " " + subtitleDiv.style.fontFamily
// subtitleCanvasCtx.fillText(subtitleDiv.innerHTML, 0, 10);
// console.log(subtitleCanvas.width)
// let subtitleCanvasTexture = new CanvasTexture(subtitleCanvas);
let subtitleMaterial = new MeshBasicMaterial({ map: subtitleCanvasTexture, transparent: true });
let subtitleGeometry = new PlaneBufferGeometry(subtitleCanvas.width / 500, subtitleCanvas.height/450, 2, 2);
let subtitleMesh = new Mesh(subtitleGeometry, subtitleMaterial);
subtitleMesh.position.z = 0.201;
subtitleMesh.position.y = 0.95

scene.add(subtitleMesh)
function animate() {
	requestAnimationFrame(animate);
	if (camera.rotation.y > Math.PI / 8) {
		controls.autoRotateSpeed = 1.25
	} else if (camera.rotation.y < -1 * Math.PI / 8) {
		controls.autoRotateSpeed = -1.25
	}
	// rendering stuff ...
	capturer.capture( renderer.domElement );
	controls.update();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.render(scene, camera);
}
// setInterval(()=> {
// 	console.log(camera.rotation.y)
// }, 1000)
animate();