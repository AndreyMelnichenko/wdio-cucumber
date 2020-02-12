// @ts-ignore
import { setWorldConstructor } from 'cucumber';
import { CustomWorld } from 'src/utils/customWorld';

setWorldConstructor(CustomWorld);
