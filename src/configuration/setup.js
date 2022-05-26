import { Vector3 } from 'three';
import { Fog } from 'three';
import { Scene, PerspectiveCamera, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


export const renderer = new WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );

export const scene = new Scene();
export const camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
export const controls = new OrbitControls( camera, renderer.domElement );

controls.target = new Vector3(0,1.4,0)
controls.autoRotate = true