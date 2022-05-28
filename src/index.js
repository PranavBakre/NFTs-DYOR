import { scene, renderer, camera, controls } from "./configuration/setup";
import { PlaneGeometry, Mesh, RectAreaLight, MeshPhongMaterial, MeshBasicMaterial, ShapeBufferGeometry, PlaneBufferGeometry } from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TextureLoader } from "three";
import { getFrameWithHole, getRoundedRectangle } from "./shape";
import { convertTextToTexture } from "./text";
import { getMediaRecorder } from "./media-recorder";
const domRoot = document.getElementById("root");

//Setup Params
const params = new URLSearchParams(location.search)
params.forEach((value, key) => {
	const elem = document.getElementById(key);
	if (elem !== undefined && elem !== null) {
		elem.innerHTML = value
	}
})


//Setup Video Recording
const button = document.getElementById("export-button");
const downloadLink = document.getElementById("download");
const canvasStream = renderer.domElement.captureStream(60)
const mediaRecorder = getMediaRecorder(canvasStream, {
	mimeType: "video/webm",
	videoBitsPerSecond: 8000000
},
	(blob) => {
		const url = URL.createObjectURL(blob);
		console.log(url)
		downloadLink.href = url;
		downloadLink.download = "file.webm"
		downloadLink.style.display = "block"
		button.disabled = false;
	}
)


button.onclick = (event) => {
	mediaRecorder.start()

	button.disabled = true;

}

//Load Fonts before Canvas Renders text
let titleFont = new FontFace("Gilroy-Medium", "url(https://fonts.cdnfonts.com/s/16219/Gilroy-Medium.woff)")
let subtitleFont = new FontFace("Gilroy-Regular", "url(https://fonts.cdnfonts.com/s/16219/Gilroy-Regular.woff)")

Promise.all([titleFont.load(), subtitleFont.load()]).then(fonts => {
	console.log(fonts)
	fonts.forEach(font => document.fonts.add(font));
}).then(() => {

	let { texture: canvasTexture, canvas: titleCanvas } = convertTextToTexture(params.get("title") ?? "Megha Singh", {
		position: "absolute",
		top: "0px",
		padding: "5px",
	}, domRoot)
	let titleMaterial = new MeshBasicMaterial({ map: canvasTexture, transparent: true });
	let titleGeometry = new PlaneBufferGeometry(titleCanvas.width / 400, titleCanvas.height / 400, 2, 2);
	let titleMesh = new Mesh(titleGeometry, titleMaterial);
	titleMesh.position.z = 0.202;
	titleMesh.position.y = 0.9


	let { texture: subtitleCanvasTexture, canvas: subtitleCanvas } = convertTextToTexture(params.get("subtitle") ?? "Member since Jan 2021", {
		position: "absolute",
		top: "1.5rem",
		padding: "5px",
		fontSize: "18px"
	}, domRoot)

	let subtitleMaterial = new MeshBasicMaterial({ map: subtitleCanvasTexture, transparent: true });
	let subtitleGeometry = new PlaneBufferGeometry(subtitleCanvas.width / 500, subtitleCanvas.height / 450, 2, 2);
	let subtitleMesh = new Mesh(subtitleGeometry, subtitleMaterial);
	subtitleMesh.position.z = 0.201;
	subtitleMesh.position.y = 0.85

	scene.add(titleMesh, subtitleMesh)
})




//Setup window and frame
let x = -0.4; let y = 0.8; let width = 0.8; let height = 1.25; let radius = 0.1
const wall = getRoundedRectangle(5, 5, 0, -2, -2)
const window = getRoundedRectangle(width, height, radius, x, y)
wall.holes.push(window)
const wallMaterial = new MeshBasicMaterial({ color: "black", shininess: 100, reflectivity: 1 });
const plane = new Mesh(new ShapeBufferGeometry(wall), wallMaterial);
plane.position.z = 0.2



let borderSize = 0.01;
let frameBorder1 = getFrameWithHole(width, height, radius, borderSize, x, y)

let borderMaterial = new MeshPhongMaterial({ color: "white", reflectivity: 1 })

const frameBorder1Mesh = new Mesh(new ShapeBufferGeometry(frameBorder1), borderMaterial);
frameBorder1Mesh.position.z = 0.2


x = x + borderSize; y = y + borderSize; width = width - 2 * borderSize; height = height - 2 * borderSize;

borderSize = 0.1;

let frame = getRoundedRectangle(width, height, radius, x, y)

x = x + borderSize; y = y + borderSize + 0.05; width = width - 2 * borderSize; height = height - 2 * borderSize - 0.05; radius = radius - 0.005;
let hole = getRoundedRectangle(width, height, radius, x, y)
frame.holes.push(hole)


const frameLight = new RectAreaLight("white", 1, width, height)
frameLight.position.set(0, 1.45, 0.2);


let frameGeometry = new ShapeBufferGeometry(frame);
const frameMaterial = new MeshPhongMaterial({ color: /*"black"*/0x3570e6, shininess: 150 });
let frameMesh = new Mesh(frameGeometry, frameMaterial)
frameMesh.position.z = 0.2

borderSize = 0.01;

let frameBorder2 = getFrameWithHole(width, height, radius, borderSize, x, y)

x = x + borderSize; y = y + borderSize; width = width - 2 * borderSize; height = height - 2 * borderSize; //radius = radius - 0.005;
const frameBorder2Mesh = new Mesh(new ShapeBufferGeometry(frameBorder2), borderMaterial);
frameBorder2Mesh.position.z = 0.2


camera.position.z = 1.3;
camera.position.y = 1.4;
controls.update();
const loader = new GLTFLoader();

//Load Logo
const textureLoader = new TextureLoader()
textureLoader.load((params.get("logo") ?? "logo.png"), (texture) => {
	let image = texture.image;
	console.log(image.width)
	let logoBase = new PlaneGeometry(image.width / 2500, image.height / 2500);
	const material = new MeshPhongMaterial({
		map: texture,
		transparent: true
	});
	const mesh = new Mesh(logoBase, material)
	mesh.position.z = 0.201;
	mesh.position.y = 1.99
	scene.add(mesh)
})

//Load GLB Model
loader.load(params.get("model") ?? 'avatar.glb', function (gltf) {
	console.log(gltf)
	scene.add(gltf.scene);

}, undefined, function (error) {

	console.error(error);


});



scene.add(plane, frameBorder1Mesh, frameLight, frameMesh, frameBorder2Mesh)

function animate() {
	requestAnimationFrame(animate);
	if (camera.rotation.y > Math.PI / 8) {
		controls.autoRotateSpeed = 6
	} else if (camera.rotation.y < -1 * Math.PI / 8) {
		controls.autoRotateSpeed = -6
	}

	controls.update();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.render(scene, camera);
}
animate();