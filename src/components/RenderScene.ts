import { Scene, PerspectiveCamera, WebGLRenderer, Object3D } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module';
import { RenderObject } from './RenderObject';

export abstract class RenderScene {

    public scene: Scene;
    public camera: PerspectiveCamera;
    public renderer: WebGLRenderer;
    public controls: OrbitControls;
    public stats: Stats;
    public renderObjects: RenderObject[] = [];

    private onRenderCallback: () => void;

    constructor(onRenderCallback: () => void) {

        this.onRenderCallback = onRenderCallback;

        this.scene = new Scene();

        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        this.renderer = new WebGLRenderer({
            antialias: true
        });

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.renderer.shadowMap.enabled = true;
        // this.renderer.useLegacyLights = false;

        document.body.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);

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

        this.onRenderCallback();

        this.renderer.render(this.scene, this.camera);
    }
}