import { CustomWorld } from './customWorld';
import { World } from './World';

abstract class Helper {
    public static addWorldValue(world: World, varName: string, data: any) {
        (world as CustomWorld<any>).keepValue(varName, data);
    };

    public static getWorldValue(
        source: string,
        world: any,
        varPrefix: string = '%'
    ): any {
        const varsPath = source.match(new RegExp(`${varPrefix}{([^}]+)}`, 'g'));
        let res;
        if (varsPath) {
            varsPath.forEach(x => {
                const resVar = x
                    .replace(new RegExp(`(${varPrefix}{|})`, 'g'), '')
                    .split('.');
                const rrr = world.findValue(resVar[0]);
                res = resVar.length > 1 ? rrr[resVar[1]] : rrr;
            });
        }
        return res;
    }
}

export { Helper }
