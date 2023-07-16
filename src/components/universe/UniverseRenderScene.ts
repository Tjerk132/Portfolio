import { AxesHelper, DoubleSide, GridHelper, Mesh, MeshStandardMaterial, Object3D, Raycaster, SphereGeometry, TextureLoader, Vector2 } from "three";
import { RenderScene } from "../RenderScene";
import { Star } from "./Star";
import { Sun } from "./Sun";

export class UniverseRenderScene extends RenderScene {

    private raycaster: Raycaster;
    private mouse: Vector2;
    private cameraTrailObject: Object3D;

    constructor() {
        const onRenderCallback = () => {
            this.raycaster.setFromCamera(this.mouse, this.camera);
            this.updateCameraTrail();
        };

        super(onRenderCallback);

        this.camera.position.set(90, 60, -120);

        this.raycaster = new Raycaster();

        this.mouse = new Vector2();

        document.addEventListener('click', (event) => {
            event.preventDefault();

            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            this.cameraTrailObject = this.locateClickedObject();
        });

        const background = this.createBackground();

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
        // const gridHelper = new GridHelper(200, 50);
        // this.scene.add(lightHelper);
        // const axesHelper = new AxesHelper(15);

        this.add3DObjects(background);//, gridHelper, axesHelper);


        window.onresize = () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        };
    }

    private createBackground = () => {

        const textureLoader = new TextureLoader();
        const backgroundGeometry = new SphereGeometry(500);
        const backgroundMaterial = new MeshStandardMaterial({
            map: textureLoader.load("milkyway/8k_stars_milky_way.jpg"),
            side: DoubleSide
        });

        const background = new Mesh(backgroundGeometry, backgroundMaterial);

        return background;
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

            const clickedObject = this.renderObjects.find(renderObject => intersection.object.parent.uuid === renderObject.group.uuid)

            if (!(clickedObject instanceof Sun || clickedObject instanceof Star)) {
                return intersection.object;
            }
        }
 
        return undefined;
    }
}