import * as THREE from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";
import { getRandomColor } from "../util";

const addRectangle = (p1: THREE.Vector3 | undefined, p2: THREE.Vector3 | undefined, p3: THREE.Vector3 | undefined, p4: THREE.Vector3 | undefined) => {
    let g1;

    {
        var geom = new THREE.BufferGeometry();
        var triangle = new THREE.Triangle(p1, p2, p3);

        const vertices = new Float32Array([triangle.a.x, triangle.a.y, triangle.a.z, triangle.b.x, triangle.b.y, triangle.b.z, triangle.c.x, triangle.c.y, triangle.c.z]);

        geom.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
        geom.computeVertexNormals();

        g1 = geom;
    }

    let g2;

    {
        var geom = new THREE.BufferGeometry();
        var triangle = new THREE.Triangle(p1, p3, p4);

        const vertices = new Float32Array([triangle.a.x, triangle.a.y, triangle.a.z, triangle.b.x, triangle.b.y, triangle.b.z, triangle.c.x, triangle.c.y, triangle.c.z]);

        geom.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
        geom.computeVertexNormals();

        g2 = geom;
    }

    return { g1, g2 };
};

const t = (p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3, p4: THREE.Vector3, i: number, b: boolean, arr: THREE.BufferGeometry[], steps: number) => {
    if (i > steps) return;

    let b1 = p1
        .clone()
        .add(p1.clone().add(p3.clone()))
        .multiplyScalar(1 / 3);
    let b2 = p2
        .clone()
        .add(p2.clone().add(p4.clone()))
        .multiplyScalar(1 / 3);
    let b3 = p3
        .clone()
        .add(p3.clone().add(p1.clone()))
        .multiplyScalar(1 / 3);
    let b4 = p4
        .clone()
        .add(p4.clone().add(p2.clone()))
        .multiplyScalar(1 / 3);

    let v = b ? -1 : 1;

    let l = v * b1.clone().sub(b2.clone()).length();

    let N = b1.clone().sub(b2.clone()).cross(b1.clone().sub(b3.clone()));
    let MN = N.length();

    let c1 = N.clone().divideScalar(MN).multiplyScalar(l).add(b1.clone());
    let c2 = N.clone().divideScalar(MN).multiplyScalar(l).add(b2.clone());
    let c3 = N.clone().divideScalar(MN).multiplyScalar(l).add(b3.clone());
    let c4 = N.clone().divideScalar(MN).multiplyScalar(l).add(b4.clone());

    let r1 = addRectangle(b1, b2, c2, c1);
    arr.push(r1.g1, r1.g2);
    let r2 = addRectangle(b2, b3, c3, c2);
    arr.push(r2.g1, r2.g2);
    let r3 = addRectangle(b3, b4, c4, c3);
    arr.push(r3.g1, r3.g2);
    let r4 = addRectangle(b1, b4, c4, c1);
    arr.push(r4.g1, r4.g2);
    let r5 = addRectangle(c1, c2, c3, c4);
    arr.push(r5.g1, r5.g2);

    t(b1, b2, c2, c1, i + 1, b, arr, steps);
    t(b2, b3, c3, c2, i + 1, b, arr, steps);
    t(b3, b4, c4, c3, i + 1, b, arr, steps);
    t(b1, b4, c4, c1, i + 1, !b, arr, steps);
    t(c1, c2, c3, c4, i + 1, b, arr, steps);

    let m1 = p1.clone().add(
        p2
            .clone()
            .sub(p1.clone())
            .multiplyScalar(1 / 3)
    );
    let m2 = p1.clone().add(
        p2
            .clone()
            .sub(p1.clone())
            .multiplyScalar(2 / 3)
    );

    let m3 = p2.clone().add(
        p3
            .clone()
            .sub(p2.clone())
            .multiplyScalar(1 / 3)
    );
    let m4 = p2.clone().add(
        p3
            .clone()
            .sub(p2.clone())
            .multiplyScalar(2 / 3)
    );

    let m5 = p3.clone().add(
        p4
            .clone()
            .sub(p3.clone())
            .multiplyScalar(1 / 3)
    );
    let m6 = p3.clone().add(
        p4
            .clone()
            .sub(p3.clone())
            .multiplyScalar(2 / 3)
    );

    let m7 = p4.clone().add(
        p1
            .clone()
            .sub(p4.clone())
            .multiplyScalar(1 / 3)
    );
    let m8 = p4.clone().add(
        p1
            .clone()
            .sub(p4.clone())
            .multiplyScalar(2 / 3)
    );

    t(p1, m1, b1, m8, i + 1, b, arr, steps);
    t(m1, m2, b2, b1, i + 1, b, arr, steps);
    t(m2, p2, m3, b2, i + 1, b, arr, steps);
    t(b2, m3, m4, b3, i + 1, b, arr, steps);
    t(b3, m4, p3, m5, i + 1, b, arr, steps);
    t(b4, b3, m5, m6, i + 1, b, arr, steps);
    t(m7, b4, m6, p4, i + 1, b, arr, steps);
    t(m8, b1, b4, m7, i + 1, b, arr, steps);
};

export const createKochCube = (p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3, p4: THREE.Vector3, steps: number, transparent: boolean = false) => {
    let l = p1.clone().sub(p2.clone()).length();

    let N = p1.clone().sub(p2.clone()).cross(p1.clone().sub(p3.clone()));
    let MN = N.length();

    let c1 = N.clone().divideScalar(MN).multiplyScalar(-l).add(p1.clone());
    let c2 = N.clone().divideScalar(MN).multiplyScalar(-l).add(p2.clone());
    let c3 = N.clone().divideScalar(MN).multiplyScalar(-l).add(p3.clone());
    let c4 = N.clone().divideScalar(MN).multiplyScalar(-l).add(p4.clone());

    let arr = [];

    let r1 = addRectangle(p1, p2, p3, p4);
    let r2 = addRectangle(p1, p2, c2, c1);
    let r3 = addRectangle(p2, p3, c3, c2);
    let r4 = addRectangle(p3, p4, c4, c3);
    let r5 = addRectangle(p1, p4, c4, c1);
    let r6 = addRectangle(c1, c2, c3, c4);

    arr.push(r1.g1, r1.g2);
    arr.push(r2.g1, r2.g2);
    arr.push(r3.g1, r3.g2);
    arr.push(r4.g1, r4.g2);
    arr.push(r5.g1, r5.g2);
    arr.push(r6.g1, r6.g2);

    t(p1, p2, p3, p4, 1, false, arr, steps);
    t(p1, p2, c2, c1, 1, true, arr, steps);
    t(p2, p3, c3, c2, 1, true, arr, steps);
    t(p3, p4, c4, c3, 1, true, arr, steps);
    t(p1, p4, c4, c1, 1, false, arr, steps);
    t(c1, c2, c3, c4, 1, true, arr, steps);

    let geoms = arr.map((e) => e);
    let gg = BufferGeometryUtils.mergeBufferGeometries(geoms);
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
