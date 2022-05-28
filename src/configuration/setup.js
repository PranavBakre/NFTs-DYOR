import { Vector3 } from "three";
import { Fog } from "three";
import { Scene, PerspectiveCamera, WebGLRenderer, AmbientLight } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { getDirectionLight } from "lights";
export const renderer = new WebGLRenderer({
  antialias: true,
  canvas: document.getElementById("threejs-canvas"),
});

export const scene = new Scene();
export const camera = new PerspectiveCamera(75, 1920 / 1920, 0.1, 1000);

//Camera controls for mouse movement
export const controls = new OrbitControls(camera, renderer.domElement);

controls.target = new Vector3(0, 1.4, 0);
controls.autoRotate = true;
controls.autoRotateSpeed = 6;
//Adding Lights to the scene
RectAreaLightUniformsLib.init();
let ambientLight = new AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight1 = getDirectionLight(
  [0.6, 2, 1],
  [-0.35, 0.95, 0],
  "white",
  0.7
);
const directionalLight2 = getDirectionLight(
  [-0.6, 0.8, 1],
  [0.35, 1.85, 0],
  0xd400ff /*0xab35e6*/,
  1
);
scene.add(
  directionalLight1,
  directionalLight2,
  directionalLight1.target,
  directionalLight2.target
);
