import { rotatingBox, arrowUp, universe } from "./scenarios";

import { initializeApp, } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { configureEnvironment } from "./environments/setupEnvironment";

configureEnvironment();

const app = initializeApp(environment.firebase);

const analytics = getAnalytics(app);

universe();
//firebase deploy --only hosting:portfolio-f2fe8