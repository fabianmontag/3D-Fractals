import * as THREE from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";
import { createCubeGeometry, getRandomColor } from "../util";

const t = (vec: THREE.Vector3, a: number, i: number, arr: THREE.BufferGeometry[]) => {
    if (i == 0) {
        let o = createCubeGeometry(a, a, a, vec);
        arr.push(o);
    }
    if (i < 0) return;

    let a3 = a / 3;

    // bottom
    t(new THREE.Vector3(vec.x, vec.y - a3, vec.z), a3, i - 1, arr);
    t(new THREE.Vector3(vec.x, vec.y - a3, vec.z - a3), a3, i - 1, arr);
    t(new THREE.Vector3(vec.x, vec.y - a3, vec.z + a3), a3, i - 1, arr);
    t(new THREE.Vector3(vec.x - a3, vec.y - a3, vec.z), a3, i - 1, arr);
    t(new THREE.Vector3(vec.x + a3, vec.y - a3, vec.z), a3, i - 1, arr);

    // middle
    t(new THREE.Vector3(vec.x, vec.y, vec.z - a3), a3, i - 1, arr);
    t(new THREE.Vector3(vec.x, vec.y, vec.z + a3), a3, i - 1, arr);
    t(new THREE.Vector3(vec.x - a3, vec.y, vec.z), a3, i - 1, arr);
    t(new THREE.Vector3(vec.x + a3, vec.y, vec.z), a3, i - 1, arr);
    t(new THREE.Vector3(vec.x + a3, vec.y, vec.z - a3), a3, i - 1, arr);
    t(new THREE.Vector3(vec.x + a3, vec.y, vec.z + a3), a3, i - 1, arr);
    t(new THREE.Vector3(vec.x - a3, vec.y, vec.z - a3), a3, i - 1, arr);
    t(new THREE.Vector3(vec.x - a3, vec.y, vec.z + a3), a3, i - 1, arr);

    // top
    t(new THREE.Vector3(vec.x, vec.y + a3, vec.z), a3, i - 1, arr);
    t(new THREE.Vector3(vec.x, vec.y + a3, vec.z - a3), a3, i - 1, arr);
    t(new THREE.Vector3(vec.x, vec.y + a3, vec.z + a3), a3, i - 1, arr);
    t(new THREE.Vector3(vec.x - a3, vec.y + a3, vec.z), a3, i - 1, arr);
    t(new THREE.Vector3(vec.x + a3, vec.y + a3, vec.z), a3, i - 1, arr);
};

export const createAlternateFractalCube = (v1: THREE.Vector3, width: number, steps: number, transparent: boolean = false) => {
    let arr: THREE.BufferGeometry[] = [];

    t(v1, width, steps, arr);

    let transparency = 0.5;

    let meshes = [];

    let color = getRandomColor();

    let gg = BufferGeometryUtils.mergeBufferGeometries(arr);
    gg.computeVertexNormals();

    if (transparent) {
        {
            var mesh = new THREE.Mesh(
                gg,
                new THREE.MeshPhongMaterial({
                    side: THREE.BackSide,
                    opacity: transparency,
                    transparent: transparent,
                    color: new THREE.Color(color),
                    depthWrite: transparent ? false : false,
                })
            );

            mesh.position.x = 0;
            mesh.position.y = 0;
            mesh.position.z = 0;

            meshes.push(mesh);
        }

        {
            var mesh = new THREE.Mesh(
                gg,
                new THREE.MeshPhongMaterial({
                    side: THREE.FrontSide,
                    opacity: transparency,
                    transparent: transparent,
                    color: new THREE.Color(color),
                    depthWrite: transparent ? false : false,
                })
            );

            mesh.position.x = 0;
            mesh.position.y = 0;
            mesh.position.z = 0;

            meshes.push(mesh);
        }
    } else {
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

        meshes.push(mesh);
    }

    return meshes;
};
