import { Scene, PerspectiveCamera, WebGLRenderer, GridHelper, Object3D, AxesHelper, Raycaster, Vector2 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module';
import { RenderObject } from './RenderObject';
import { Sun } from './universe/Sun';
import { Planet } from './universe/Base/Planet';

export class RenderScene {

    public scene: Scene;
    public camera: PerspectiveCamera;
    public renderer: WebGLRenderer;
    public controls: OrbitControls;
    public stats: Stats;

    private raycaster: Raycaster;
    private mouse: Vector2;
    private cameraTrailObject: Object3D;

    public renderObjects: RenderObject[] = [];

    constructor() {

        this.scene = new Scene();

        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        this.renderer = new WebGLRenderer({
            antialias: true
        });

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.renderer.shadowMap.enabled = true;
        // this.renderer.useLegacyLights = false;

        this.camera.position.set(90, 60, -120);

        document.body.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement)

        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        this.stats = new Stats();

        document.body.appendChild(this.stats.dom);

        this.raycaster = new Raycaster();

        this.mouse = new Vector2();

        document.addEventListener('click', (event) => {
            event.preventDefault();

            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            // console.log( this.locateClickedObject());

            this.cameraTrailObject = this.locateClickedObject();
            // const intersectingObject = this.locateClickedObject();
        })
        // ambient light which is for the whole scene
        // const ambientLight = new AmbientLight(0x222222);
        // ambientLight.position.set(0, 300, 0)
        // ambientLight.castShadow = true;
        // this.scene.add(ambientLight);

        // directional light - parallel sun rays
        // const directionalLight = new DirectionalLight(0xffffff, 2);
        // this.directionalLight.castShadow = true;
        // directionalLight.position.set(0, 32, 64);
        // this.scene.add(directionalLight);


        // const pointLight = new PointLight(0xffffff);
        // pointLight.position.set(20, 20, 20)
        // this.scene.add(pointLight);
        // const lightHelper = new PointLightHelper(pointLight);

        // const lightHelper = new DirectionalLightHelper(directionalLight);
        const gridHelper = new GridHelper(200, 50);
        this.scene.add(gridHelper);
        // this.scene.add(lightHelper);
        const axesHelper = new AxesHelper(15);
        this.scene.add(axesHelper);

        window.onresize = () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        };
    }

    public add3DObjects(...object: Object3D[]) {
        this.scene.add(...object);
    }

    public addRenderObject(...renderObject: RenderObject[]) {
        this.renderObjects.push(...renderObject);
        this.scene.add(...renderObject.map(renderObject => renderObject.group));
    }

    public animate = () => {
        requestAnimationFrame(this.animate);

        this.renderObjects.forEach(renderObject => {
            renderObject.render();
        });

        this.stats.update();
        this.controls.update();

        this.raycaster.setFromCamera(this.mouse, this.camera);
        this.updateCameraTrail();

        // torus.rotation.x += 0.01;
        // torus.rotation.y += 0.005;
        // torus.rotation.z += 0.01;

        this.renderer.render(this.scene, this.camera);
    }

    private updateCameraTrail = () => {
        const cameraTrailObject = this.cameraTrailObject;
        if (cameraTrailObject) {
            this.camera.position.set(
                cameraTrailObject.position.x,
                cameraTrailObject.position.y,
                cameraTrailObject.position.z
            );

            this.camera.lookAt(0, 20, 0);
        }
    }

    private locateClickedObject = () => {
        const intersections = this.raycaster.intersectObjects(this.renderObjects.map(renderObject => renderObject.group));

        if (intersections.length) {
            const intersection = intersections[0];

            const clickedPlanet = this.renderObjects.find(renderObject => intersection.object.parent.uuid === renderObject.group.uuid)

            if (!(clickedPlanet instanceof Sun)) {
                return intersection.object;
            }
        }
        // console.log(intersections.length);
        
        return undefined;
    }
}