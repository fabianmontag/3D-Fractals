import * as THREE from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";
import { getRandomColor } from "../util";

const addCube = (w: number | undefined, h: number | undefined, d: number | undefined, v: { x: number; y: number; z: number }) => {
    const geometry = new THREE.BoxGeometry(w, h, d);

    geometry.translate(v.x, v.y, v.z);

    return geometry;
};

const t = (vec: THREE.Vector3, a: number, i: number, arr: THREE.BufferGeometry[]) => {
    if (i == 0) {
        let o = addCube(a, a, a, vec);
        arr.push(o);
        return;
    }
    if (i < 0) return;

    let a3 = a / 3;

    // bottom
    t(new THREE.Vector3(vec.x - a3, vec.y - a3, vec.z), a3, i - 1, arr);
    t(new THREE.Vector3(vec.x - a3, vec.y - a3, vec.z - a3), a3, i - 1, arr);
    t(new THREE.Vector3(vec.x - a3, vec.y - a3, vec.z + a3), a3, i - 1, arr);

    t(new THREE.Vector3(vec.x + a3, vec.y - a3, vec.z), a3, i - 1, arr);
    t(new THREE.Vector3(vec.x + a3, vec.y - a3, vec.z - a3), a3, i - 1, arr);
    t(new THREE.Vector3(vec.x + a3, vec.y - a3, vec.z + a3), a3, i - 1, arr);

    t(new THREE.Vector3(vec.x, vec.y - a3, vec.z + a3), a3, i - 1, arr);
    t(new THREE.Vector3(vec.x, vec.y - a3, vec.z - a3), a3, i - 1, arr);

    // top
    t(new THREE.Vector3(vec.x - a3, vec.y + a3, vec.z), a3, i - 1, arr);
    t(new THREE.Vector3(vec.x - a3, vec.y + a3, vec.z - a3), a3, i - 1, arr);
    t(new THREE.Vector3(vec.x - a3, vec.y + a3, vec.z + a3), a3, i - 1, arr);

    t(new THREE.Vector3(vec.x + a3, vec.y + a3, vec.z), a3, i - 1, arr);
    t(new THREE.Vector3(vec.x + a3, vec.y + a3, vec.z - a3), a3, i - 1, arr);
    t(new THREE.Vector3(vec.x + a3, vec.y + a3, vec.z + a3), a3, i - 1, arr);

    t(new THREE.Vector3(vec.x, vec.y + a3, vec.z + a3), a3, i - 1, arr);
    t(new THREE.Vector3(vec.x, vec.y + a3, vec.z - a3), a3, i - 1, arr);

    t(new THREE.Vector3(vec.x + a3, vec.y, vec.z - a3), a3, i - 1, arr);
    t(new THREE.Vector3(vec.x + a3, vec.y, vec.z + a3), a3, i - 1, arr);

    t(new THREE.Vector3(vec.x - a3, vec.y, vec.z - a3), a3, i - 1, arr);
    t(new THREE.Vector3(vec.x - a3, vec.y, vec.z + a3), a3, i - 1, arr);
};

export const createSierpinskiCarpet = (v1: THREE.Vector3, width: number, steps: number, transparent: boolean = false) => {
    let arr: THREE.BufferGeometry[] = [];

    t(v1, width, steps, arr);

    let gg = BufferGeometryUtils.mergeBufferGeometries(arr);
    gg.computeVertexNormals();

    let color = getRandomColor();

    var mesh = new THREE.Mesh(
        gg,
        new THREE.MeshPhongMaterial({
            side: THREE.DoubleSide,
            color: new THREE.Color(color),
            depthWrite: transparent ? false : true,
            depthTest: true,
            depthFunc: THREE.LessDepth,
        })
    );

    mesh.position.x = 0;
    mesh.position.y = 0;
    mesh.position.z = 0;

    return mesh;
};
