import { Mesh, MeshPhongMaterial, SphereGeometry, TextureLoader } from "three";
import { RenderObject } from "../../RenderObject";

export abstract class Planet extends RenderObject {

    protected textureLoader: TextureLoader;

    constructor() {
        super();
        this.textureLoader = new TextureLoader();
    }

    protected createPlanet(
        { geometry, mapUrl, bumpMapUrl, specularMapUrl, lightMapUrl, emissive = false }
            : {
                geometry: SphereGeometry,
                mapUrl: string,
                bumpMapUrl?: string,
                specularMapUrl?: string,
                lightMapUrl?: string,
                emissive?: boolean
            }
    ) {

        const map = this.textureLoader.load(mapUrl);
        const bumpMap = this.textureLoader.load(bumpMapUrl);
        const specularMap = this.textureLoader.load(specularMapUrl);
        const lightMap = this.textureLoader.load(lightMapUrl);

        const material = new MeshPhongMaterial({
            map: map,
            bumpMap: bumpMap,
            bumpScale: 0.5,
            specularMap: specularMap,
            shininess: 0.5,
            lightMap: lightMap
        })

        if (emissive) {
            material.emissiveMap = material.map;
            material.emissiveIntensity = 1;
            material.emissive.setHex(0xFFFFFF);
        }
        
        const planet = new Mesh(geometry, material)

        return planet;
    }
}