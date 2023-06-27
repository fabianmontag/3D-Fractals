import * as THREE from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";
import { getRandomColor } from "../util";

const addCone = (r: number | undefined, h: number | undefined, rs: number | undefined, vec: THREE.Vector3) => {
    const geometry = new THREE.ConeGeometry(r, h, rs, 1, false, Math.PI / 4);

    geometry.translate(vec.x, vec.y, vec.z);

    return geometry;
};

const t = (vec: THREE.Vector3, a: number, i: number, arr: THREE.BufferGeometry[]) => {
    if (i == 0) {
        let o = addCone(Math.sqrt(a ** 2 + a ** 2) / 2, a, 4, vec);
        arr.push(o);
        return;
    } else if (i < 0) return;

    t(new THREE.Vector3(vec.x - a / 4, vec.y - a / 4, vec.z - a / 4), a / 2, i - 1, arr);
    t(new THREE.Vector3(vec.x - a / 4, vec.y - a / 4, vec.z + a / 4), a / 2, i - 1, arr);

    t(new THREE.Vector3(vec.x + a / 4, vec.y - a / 4, vec.z - a / 4), a / 2, i - 1, arr);
    t(new THREE.Vector3(vec.x + a / 4, vec.y - a / 4, vec.z + a / 4), a / 2, i - 1, arr);

    t(new THREE.Vector3(vec.x, vec.y + a / 4, vec.z), a / 2, i - 1, arr);
};

export const createSierpinskiTriangle = (v1: THREE.Vector3, width: number, steps: number, transparent: boolean = false) => {
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
    mesh.position.y = width / 2;
    mesh.position.z = 0;

    return mesh;
};
