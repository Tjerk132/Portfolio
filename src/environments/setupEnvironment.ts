import { environment as development } from "./environment";
import { environment as production } from "./environment.prod";

export const configureEnvironment = () => {
    const env: ImportMetaEnv = import.meta.env;

    if(env.DEV) {
        globalThis.environment = development;
    }
    if(env.PROD) {
        globalThis.environment = production;
    }
}