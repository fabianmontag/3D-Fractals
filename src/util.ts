import * as THREE from "three";

// generate random THREEjs Color
export const getRandomColor = () => {
    const R = Math.floor(Math.random() * 255);
    const G = Math.floor(Math.random() * 255);
    const B = Math.floor(Math.random() * 255);

    return new THREE.Color(`rgb(${R}, ${G}, ${B})`);
};

// create THREEjs geometry
export const createCubeGeometry = (w: number, h: number, d: number, v: { x: number; y: number; z: number }) => {
    const geometry = new THREE.BoxGeometry(w, h, d);
    geometry.translate(v.x, v.y, v.z);
    return geometry;
};
