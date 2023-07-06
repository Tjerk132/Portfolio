import { Group, Object3D } from "three";

export abstract class RenderObject {

    public group: Group;

    constructor() {
        this.group = new Group();
    }

    protected addObject(...object: Object3D[]) {
        this.group.add(...object);
    }
    
    public render = () => {};
}