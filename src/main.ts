import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { createAlternateFractalCube } from "./fractals/AlternateKochCubes";
import { createFractalCube } from "./fractals/FractalCubes";
import { createKochCube } from "./fractals/KochCube";
import { createSierpinskiCarpet } from "./fractals/Sierpinski-Carpet";
import { createSierpinskiTriangle } from "./fractals/Sierpinski-Triangle";

// DPR
const dpr = devicePixelRatio;

// scene
const scene = new THREE.Scene();

// camera
const camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3;
camera.updateProjectionMatrix();

// renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(dpr);
document.body.appendChild(renderer.domElement);

scene.add(camera);

// const controls
new OrbitControls(camera, renderer.domElement);

// hemisphereLight
const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x9c9c9c, 1);
scene.add(hemisphereLight);

// inner Light
const innerLight = new THREE.PointLight(0xffffff, 1, 100);
innerLight.position.set(0, 0, 0);
scene.add(innerLight);

// render loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// all avaliable fractals
enum fractalType {
    "Sierpinski-Triangle",
    "Sierpinski-Carpet",
    "Koch-Cubes",
    "Fractal-Cubes",
    "Alternate-Koch-Cubes",
}
const fractalTypeStrings = ["Sierpinski-Triangle", "Sierpinski-Carpet", "Koch-Cubes", "Fractal-Cubes", "Alternate-Koch-Cubes"];

// parameters
let steps = 3;
let transparent = false;
let currentFractalType: fractalType = fractalType["Alternate-Koch-Cubes"];

// create and add selected mesh type
const renderMesh = (n: fractalType) => {
    if (n == fractalType["Sierpinski-Triangle"]) {
        let sierpenskiTriangle = createSierpinskiTriangle(new THREE.Vector3(0, 0, 0), 3, steps, transparent);
        sierpenskiTriangle.position.y -= 1;
        scene.add(sierpenskiTriangle);
    } else if (n == fractalType["Sierpinski-Carpet"]) {
        let sierpenskiCarpet = createSierpinskiCarpet(new THREE.Vector3(0, 0, 0), 3, steps, transparent);
        scene.add(sierpenskiCarpet);
    } else if (n == fractalType["Koch-Cubes"]) {
        let p1 = new THREE.Vector3(-1, -1, 1);
        let p2 = new THREE.Vector3(1, -1, 1);
        let p3 = new THREE.Vector3(1, 1, 1);
        let p4 = new THREE.Vector3(-1, 1, 1);
        let kochCube = createKochCube(p1, p2, p3, p4, steps, transparent);
        scene.add(kochCube);
    } else if (n == fractalType["Fractal-Cubes"]) {
        let fractalCube = createFractalCube(new THREE.Vector3(0, 0, 0), 2, steps, transparent);
        scene.add(fractalCube);
    } else if (n == fractalType["Alternate-Koch-Cubes"]) {
        let alternateFractalCubeMeshes = createAlternateFractalCube(new THREE.Vector3(0, 0, 0), 3, steps, transparent);
        scene.add(alternateFractalCubeMeshes[0]);
    }
};

// reload scene
const reload = () => {
    scene.clear();
    scene.add(camera);
    scene.add(hemisphereLight);
    scene.add(innerLight);

    renderMesh(currentFractalType);
};
reload();

// DOM fractal type changer
const selectType = document.querySelector("#selectType");
selectType?.addEventListener("change", (e) => {
    const vString = (e.target as HTMLInputElement).value;
    currentFractalType = fractalType[fractalTypeStrings.indexOf(vString)] ? fractalTypeStrings.indexOf(vString) : 0;
    reload();
});

// DOM steps changer
const stepsChanger = document.querySelector("#stepsChanger");
stepsChanger?.addEventListener("input", (e) => {
    const stps = Number((e.target as HTMLInputElement).value);
    steps = stps;
    reload();
});

// DOM transparency changer
const transparencyChanger = document.querySelector("#transparencyChanger");
transparencyChanger?.addEventListener("input", (e) => {
    const checked = (e.target as HTMLInputElement).checked;
    transparent = checked === true ? true : false;
    reload();
});
