import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh, DoubleSide, TextureLoader, SphereGeometry, MeshStandardMaterial, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module';
import { Star } from "./components/universe/Star";
import { Moon } from "./components/universe/Moon";
import { Saturn } from "./components/universe/Saturn";
import { Sun } from "./components/universe/Sun";
import { Earth } from "./components/universe/Earth";
import { RenderScene } from "./components/RenderScene";

// import { GLTFLoader, O } from 'three/examples/jsm/'//'three-addons';
import * as THREE from 'three';

export const rotatingBox = () => {

    const scene = new Scene();
    scene.add(new THREE.AxesHelper(5))

    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer = new WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        renderer.render(scene, camera);
    }

    animate();
}

export const arrowUp = () => {
    const scene = new THREE.Scene()
    scene.add(new THREE.AxesHelper(5))

    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    )
    camera.position.z = 2

    const renderer = new THREE.WebGLRenderer()
    //renderer.physicallyCorrectLights = true //deprecated
    renderer.useLegacyLights = false //use this instead of setting physicallyCorrectLights=true property
    // renderer.shadowMap.enabled = true
    // renderer.outputColorSpace = THREE.Colors[];
    // renderer.outputEncoding = THREE.sRGBEncoding
    renderer.setSize(window.innerWidth, window.innerHeight)

    document.body.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true


    // this.renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    const clock = new THREE.Clock();
    const stats = new Stats();
    document.body.appendChild(stats.dom);

    // ambient light which is for the whole scene
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    ambientLight.castShadow = true;
    scene.add(ambientLight);

    // directional light - parallel sun rays
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    // this.directionalLight.castShadow = true;
    directionalLight.position.set(0, 32, 64);
    scene.add(directionalLight);

    // if window resizes
    // window.addEventListener('resize', () => onWindowResize(), false);

    // renderer.gammaOuput = true


    // const material = new LineBasicMaterial({ color: 0x0000ff });

    // const points: Vector3[] = [];
    // points.push(new Vector3(- 10, 0, 0));
    // points.push(new Vector3(0, 10, 0));
    // points.push(new Vector3(10, 0, 0));

    // const geometry = new BufferGeometry().setFromPoints(points);

    // const line = new Line(geometry, material);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const loader = new GLTFLoader();

    loader.load('./monkey_textured.glb', function (gltf) {
        gltf.scene.traverse(function (child) {
            if ((child as THREE.Mesh).isMesh) {
                const m = child as THREE.Mesh
                m.receiveShadow = true
                m.castShadow = true
            }
            if ((child as THREE.Light).isLight) {
                const l = child as THREE.Light
                l.castShadow = true
                l.shadow.bias = -0.003
                l.shadow.mapSize.width = 2048
                l.shadow.mapSize.height = 2048
            }
        })

        scene.add(gltf.scene);

    }, (xhr) => {
        console.log(xhr.loaded / xhr.total * 100, "% loaded");

    }, function (error) {

        console.error(error);

    });

    function animate() {
        requestAnimationFrame(animate);
        stats.update();
        controls.update();

        renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(animate)

    window.addEventListener('resize', function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    animate();

    // scene.add(line);
    // renderer.render(scene, camera);
}

export const universe = () => {

    const scene = new RenderScene();

    const textureLoader = new TextureLoader();
    const backgroundGeometry = new SphereGeometry(500);
    const backgroundMaterial = new MeshStandardMaterial({
        map: textureLoader.load("milkyway/8k_stars_milky_way.jpg"),
        side: DoubleSide
    });

    const background = new Mesh(backgroundGeometry, backgroundMaterial);

    scene.add3DObjects(background);

    const sun = new Sun({ position: new Vector3(0, 30, 0) });
    scene.addRenderObject(sun);

    const earth = new Earth({ position: new Vector3(40, 20, 0) });
    scene.addRenderObject(earth);

    const moon = new Moon({ position: new Vector3(80, 20, 20) });

    scene.addRenderObject(moon);

    const saturn = new Saturn({ position: new Vector3(120, 20, 100) });

    scene.addRenderObject(saturn);

    new Array(250).fill(1).forEach(() => {
        const star = new Star();
        scene.addRenderObject(star);
    });

    // var pos = ringGeometry.attributes.position;
    // var v3 = new THREE.Vector3();
    // for (let i = 0; i < pos.count; i++) {
    //     v3.fromBufferAttribute(pos, i);
    //     ringGeometry.attributes.uv.setXY(i, v3.length() < 4 ? 0 : 1, 1);
    // }

    // const earthRingGeometry = new RingGeometry(41, 40, 50);
    // const earthRingHelper = new Mesh(earthRingGeometry, new MeshBasicMaterial({ color: 0xffffff, side: DoubleSide }));
    // earthRingHelper.position.set(0, 20, 0)
    // earthRingHelper.rotation.set(Math.PI / 2, 0, 0);
    // scene.add3DObjects(earthRingHelper);

    // const moonRingGeometry = new RingGeometry(81, 80, 50);
    // const moonRingHelper = new Mesh(moonRingGeometry, new MeshBasicMaterial({ color: 0xffffff, side: DoubleSide }));
    // moonRingHelper.position.set(0, 20, 0)
    // moonRingHelper.rotation.set(Math.PI / 2, 0, 0);
    // scene.add3DObjects(moonRingHelper);

    // const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
    // const material = new THREE.MeshStandardMaterial({ color: 0xFF6347 });
    // const torus = new Mesh(geometry, material);
    // torus.position.set(-50, 60, -30);

    // scene.add3DObjects(torus);

    // scene.scene.fog = new THREE.Fog( 0x23272a, 0.5, 1700 );

    // scene.addRenderObject(earth, sun, moon);

    scene.animate();

    document.body.onscroll = () => {
        const t = document.body.getBoundingClientRect().top;

        // camera.position.z = t * -0.01;
        // camera.position.x = t * -0.0002;
        // camera.position.y = t * -0.0002;
    }
}