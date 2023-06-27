import * as THREE from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";
import { createCubeGeometry, getRandomColor } from "../util";

const t = (arr: THREE.BufferGeometry[], vec: THREE.Vector3, a: number, i: number, xp = false, xn = false, yp = false, yn = false, zp = false, zn = false) => {
    if (i <= 0) return;

    let c = createCubeGeometry(a, a, a, vec);
    arr.push(c);

    let f = false;

    if (!xp) t(arr, new THREE.Vector3(vec.x - a / 2 - a / 2 / 2, vec.y, vec.z), a / 2, i - 1, f, true);
    if (!xn) t(arr, new THREE.Vector3(vec.x + a / 2 + a / 2 / 2, vec.y, vec.z), a / 2, i - 1, true, f);

    if (!yp) t(arr, new THREE.Vector3(vec.x, vec.y - a / 2 - a / 2 / 2, vec.z), a / 2, i - 1, f, f, false, true);
    if (!yn) t(arr, new THREE.Vector3(vec.x, vec.y + a / 2 + a / 2 / 2, vec.z), a / 2, i - 1, f, f, true, false);

    if (!zp) t(arr, new THREE.Vector3(vec.x, vec.y, vec.z - a / 2 - a / 2 / 2), a / 2, i - 1, f, f, f, f, false, true);
    if (!zn) t(arr, new THREE.Vector3(vec.x, vec.y, vec.z + a / 2 + a / 2 / 2), a / 2, i - 1, f, f, f, f, true, false);
};

export const createFractalCube = (v1: THREE.Vector3, width: number, steps: number, transparent: boolean = false) => {
    let arr: THREE.BufferGeometry[] = [];

    t(arr, v1, width, steps);

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
