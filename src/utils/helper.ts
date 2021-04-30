import { expect } from "chai";
import { DataTable } from '@cucumber/cucumber';
import faker from "faker";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import moment from 'moment';
import * as randomstring from 'randomstring';
import * as URL from "url";
import { Constants } from './constanrs';

abstract class Helper {

    /**
     * Get list of downloaded files form default download dir
     *
     * @static
     * @returns {Array<{ name: string, date: Date }>}
     * @memberof Helper
     */
    public static getDownloadedFiles(): Array<{ name: string, date: Date }> {
        const dir = "";
        return readdirSync(dir)
            .map(function (v) {
                return {
                    name: v,
                    time: statSync(dir + v).mtime.getTime()
                };
            })
            .map(function (v) {
                return {name: v.name, date: new Date(v.time)}
            });
    }

    /**
     * Detect if user was directed to new tab
     *
     * @static
     * @memberof Helper
     */
    public static ifNewTab(): void {
        browser.waitUntil(
            () => {
                return browser.getWindowHandles().length > 1
            }, {
                timeout: browser.options.waitforTimeout,
                timeoutMsg: 'expected windowHandles > 1'
            });
        browser.pause(browser.options.waitforTimeout);
        browser.switchToWindow(browser.getWindowHandles()[1]);
    }

    public static createhtmlWithBody(path: string, bodyContent: string): void {
        //
        const content = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="X-UA-Compatible" content="ie=edge"/>
          <title>Document </title>
        </head>
        <body>
          ${bodyContent}
        </body>
        </html>`;
        writeFileSync(path, content);
    }

    public static getCurrentMonthFormatted(
        momentFormat: string = 'YYYY-MM'
    ): string {
        return moment().format(momentFormat);
    }

    public static getFormattedDate(timestamp: number = Date.now(), format: string = "MMM Do YY"): string {
        return moment(timestamp).format(format);
    }

    public static createDirIfNotExist(path: string): void {
        if (!existsSync(path)) {
            mkdirSync(path);
        }
    }

    public static addTimestamp(
        data: DataTable,
        marker: string = "TIME",
        time: number = Date.now()
    ): DataTable {
        return Helper.transform(data, marker, time, Helper.replaceWithTime);
    }

    public static replaceWithTime(data: string, marker: string, time: number): string {
        return data.replace(new RegExp(marker, 'g'), time.toString() || Date.now().toString());
    }

    public static applyRandom(
        data: DataTable,
        marker: string,
        prefix: string,
    ): DataTable {
        return Helper.transform(data, marker, prefix, Helper.replaceWithRandom);
    }

    public static getHrefPath(url: URL): string {
        // return url.href.replace(url.origin, '');
        return url.pathname + url.search;
    }

    public static normalizeUrlPath(url: string): string {
        // @ts-ignore
        let a: URL = new URL("http://google.com");
        const actPath = Helper.getHrefPath(a);
        if (url.includes("\\?")) {
            url = url.replace("\\?", "?");
        }
        if (url.includes("\\d+")) {
            const id: string = Helper.getNumberFromString(actPath);
            url = url.replace("\\d+", id);
        }
        return url;
    }

    public static getRandomForString(
        data: string,
        randomMarker: string = 'RANDOM',
        charset?: string
    ): string {
        return data.includes(randomMarker)
            ? randomstring.generate({length: 7, charset: charset || 'alphabetic'})
            : '';
    }

    public static getRandomValueByFieldName(inputLabel: string): string {
        switch (inputLabel) {
            case 'Opening / Formation date':
                return `0${faker.random.number({min: 1, max: 9})}/${faker.random.number({min: 1960, max: 2020})}`;
            case 'Website URL':
                return `${faker.internet.url()}/`;
            case 'Business contact email':
                return `${faker.internet.email()}/`
            default:
                return faker.random.word();
        }
    }

    public static getMultiRandomForString(
        data: string,
        randomMarker: string = 'RANDOM',
        charset?: string,
        randomLength?: string
    ): string {
        const count = (str:any) => {
            const re = new RegExp(randomMarker, "g");
            return ((str || '').match(re) || []).length;
        };
        const counter = count(data);
        for (let i = 0; i < counter; i++) {
            data = data.replace("RANDOM", randomstring.generate({
                // @ts-ignore
                length: randomLength,
                charset: charset || 'alphabetic'
            }));
        }

        return data;
    }

    public static getMultiReplacebyValue(
        inputString: string,
        subStringMarker: string = 'RANDOM',
        subStringValue: string,
    ): string {
        const count = (str:any) => {
            return (str.split(subStringMarker)).length - 1;
        };
        const counter = count(inputString);
        for (let i = 0; i < counter; i++) {
            inputString = inputString.replace(subStringMarker, subStringValue);
        }

        return inputString;
    }

    public static replaceDataWithRandom(data: DataTable) {
        const randomPrefix = Helper.getRandomForString(
            data.raw().join(),
            Constants.RANDOM_MARKER
        );
        return Helper.applyRandom(data, Constants.RANDOM_MARKER, randomPrefix);
    }

    public static replaceWithRandom(
        data: string,
        randomMarker: string = Constants.RANDOM_MARKER,
        randomPrefix?: string
    ): string {
        return data.replace(new RegExp(randomMarker, 'g'), randomPrefix || Helper.getRandomForString(data));
    }

    /**
     * Replace string with values from CustomWorld.store
     * @param source string to be replaced
     * @param world context CustomWorld
     * @param varPrefix prefix for variable eg. %{VAR}, prefix %
     */
    public static replaceWithWorldValue(
        source: string,
        world: any,
        varPrefix: string = '%'
    ): any {
        const varsPath = source.match(new RegExp(`${varPrefix}{([^}]+)}`, 'g'));
        if (varsPath) {
            varsPath.forEach(x => {
                const resVar = x
                    .replace(new RegExp(`(${varPrefix}{|})`, 'g'), '')
                    .split(/[\[\].]+/g)
                    .filter(Boolean);
                let res = world.findValue(resVar[0]);

                for (let i = 1; i < resVar.length; i++) {
                    if (res[resVar[i]] === undefined) {
                        throw new Error(`Unable to get "${resVar[i]}" value from ${JSON.stringify(res)} object.`);
                    } else {
                        res = res[resVar[i]];
                    }
                }

                if (typeof res === "object") {
                    source = res;
                } else {
                    source = source.replace(x, res === undefined ? x : res);
                }
            });
        }
        return source;
    }

    /**
     * Replace string with random value from array saved into CustomWorld.store
     * @param source string to be replaced
     * @param world context CustomWorld
     * @param varPrefix prefix for variable eg. %{VAR}, prefix %
     */
    public static replaceWithRandomValueWorldArray(
        source: string,
        world: any,
        varPrefix: string = '%'
    ): any {
        const varsPath = source.match(new RegExp(`${varPrefix}{([^}]+)}`, 'g'));
        const filteredValue: string[] = [];
        if (varsPath) {
            varsPath.forEach(x => {
                const resVar:string[] = x
                    .replace(new RegExp(`(${varPrefix}{|})`, 'g'), '')
                    .split('.');
                const rrr: object[] = world.findValue(resVar[0]);
                rrr.forEach(a => {
                    // @ts-ignore
                    filteredValue.push(a[resVar[1]]);
                });
            });
        }
        return filteredValue[(Helper.getRandomInt(0, filteredValue.length - 1))];
    }

    /**
     * replaceWithBaseUrl
     */
    public static replaceWithBaseUrl(source: string): string {
        return source.replace('${BASE_URL}', '');
    }

    /**
     * Replace string with Random from CustomWorld.store
     * @param source string to be replaced
     * @param world context CustomWorld
     */
    public static replaceWithWorldRandom(
        source: string,
        world: any
    ): string {
        if (!world.getRandom()) {
            world.setRandom(Helper.getRandomForString(source));
        }
        return source.replace(new RegExp(Constants.RANDOM_MARKER, 'g'), world.getRandom());
    }

    /**
     * Get world value for placeholder if exist
     * @param source string to be replaced
     * @param world context CustomWorld
     * @param varPrefix prefix for variable eg. %{VAR}, prefix %
     */
    public static getWorldValue(
        source: string,
        world: any,
        varPrefix: string = '%'
    ): any {
        const varsPath = source.match(new RegExp(`${varPrefix}{([^}]+)}`, 'g'));
        let res = null;
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

    public static objToStrMap(obj:any): Map<string, string> {
        const strMap: Map<string, string> = new Map();
        for (const k of Object.keys(obj)) {
            strMap.set(k, obj[k]);
        }
        return strMap;
    }

    public static getUrlPath(url: string): string {
        const currentUrl = URL.parse(url);
        return url.replace(currentUrl.protocol + "//" + currentUrl.hostname, "");
    }

    public static getNumberFromString(myString: string): string {
        const a = new RegExp("(\\d+)");
        const id:string[] | null = a.exec(myString) as string[];
        return id[0];
    }

    public static getKeyNameByValue(requiredObject: {[index: string]:any}, value: string): string {
        let searchedKeyName: string = '';
        Object.keys(requiredObject).forEach(key => {
            if (requiredObject[key] === value) {
                searchedKeyName = key;
            }
        });
        return searchedKeyName;
    }

    public static getRandomInt(min:number, max:number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public static openPath(path: string): void {
        browser.deleteAllCookies();
        browser.refresh();
        let pageUrl: string;
        if (path === '/') {
            // @ts-ignore
            pageUrl = browser.options.baseUrl;
        } else {
            pageUrl = browser.options.baseUrl + path;
        }
        browser.url(pageUrl);
    }

    public static getActualDirectories(filePath?: string): string[] {
        // fs.readdirSync(".").forEach(file => console.log(file));
        let rawdata;
        if (!filePath) {
            rawdata = readFileSync('./src/fixtures/src.json');
        } else {
            rawdata = readFileSync(filePath);
        }
        return JSON.parse(rawdata.toString());
    }

    public static waitForTextValueCss(elementSelector: string): void {
        browser.waitUntil(() => {
            return this.getElementValueBySelector(elementSelector) !== "";
        }, {
            timeout: 5000,
            timeoutMsg: 'element still has no value',
            interval: 200
        });
    }

    public static isElementVisible(elementSelector: string): boolean {
        return browser.execute((selector) => {
            return document.querySelector(selector) !== null;
        }, elementSelector);
    }

    public static getElementValueBySelector(elementSelector: string): string {
        this.scrollToElementByCss(elementSelector);
        return browser.execute((selector) => {
            return (document.querySelector(selector) as HTMLInputElement).value;
        }, elementSelector);
    }

    public static setElementValueBySelector(elementSelector: string, text: string): void {
        this.scrollToElementByCss(elementSelector);
        browser.execute((selector, inputText) => {
            document.querySelector(selector).setAttribute("value", inputText);
        }, elementSelector, text);
    }

    public static getSelectedTextBySelector(elementSelector: string): string {
        this.scrollToElementByCss(elementSelector);
        return browser.execute((selector) => {
            // @ts-ignore
            return document.querySelector(selector + " option:checked").textContent.trim()
        }, elementSelector);
    }

    public static getVisibleTextByFullSelector(elementSelector: string): string {
        this.scrollToElementByCss(elementSelector);
        return browser.execute((selector) => {
            return document.querySelector(selector).textContent.trim()
        }, elementSelector);
    }

    public static clickBySelector(elementSelector: string): void {
        this.scrollToElementByCss(elementSelector);
        browser.execute((selector) => {
            return (document.querySelector(selector) as HTMLInputElement).click()
        }, elementSelector);
    }

    public static getCheckedCheckBoxes(elementSelector: string): number {
        return browser.execute((selector) => {
            // @ts-ignore
            return Array.from(document.forms[0].elements[selector]).filter(a => a.checked === true).length
        }, elementSelector);
    }

    public static getCheckBoxState(elementSelector: string): boolean {
        return browser.execute((selector) => {
            // @ts-ignore
            return Array.from(document.querySelectorAll(selector))[0].checked
        }, elementSelector);
    }

    public static unCheckElementByValue(checkBoxSelector: string, elementValue: string): void {
        browser.execute((selector, value) => {
            // @ts-ignore
            return Array.from(document.forms[0].elements[selector]).find(i => i.value === value).checked = false;
        }, checkBoxSelector, elementValue);
    }

    public static setCheckBoxState(checkBoxSelector: string, elementValue: boolean): void {
        browser.execute((selector, value) => {
            // @ts-ignore
            Array.from(document.querySelectorAll(selector))[0].checked = value
        }, checkBoxSelector, elementValue);
    }

    public static scrollToElementByCss(elementSelector: string): void {
        browser.execute((selector) => {
            return document.querySelector(selector).scrollIntoView();
        }, elementSelector);
    }

    public static getValueCheckedCheckBoxes(elementSelector: string): any {
        return browser.execute((selector) => {
            // @ts-ignore
            return Array.from(document.forms[0].elements[selector]).filter(a => a.checked === true).map(b => b.value)
        }, elementSelector);
    }

    public static getCookieValue(value: string, cookie: string[]): string {
        let a: string = "";
        cookie.forEach((row) => {
            row.trim().includes(value) ? a = row : "NONE"
        });
        switch (value) {
            case "CSRF-TOKEN":
                a = a.split(";")[0].trim().replace("CSRF-TOKEN=", "");
                break;
            case "PHPSESSID":
                a = a.split(";")[0].trim().replace("PHPSESSID=", "");
                break;
        }
        return a;
    }

    public static generateRandomHexColor(): string {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    public static getFullLink(shortLink: string): string {
        let url: URL.UrlWithStringQuery;
        try {
            url = URL.parse(shortLink);
        } catch (e) {
            throw new Error(e);
        }
        return "";
    }

    /**
     * Get full Country name by sending ISO code and vice versa
     *
     * @static
     * @param {string} code
     * @param {boolean} isReverse
     * @returns {string}
     * @memberof Helper
     */
    public static getCountryNameByCode(code: string, isReverse?: boolean): string {
        const countryCodes = JSON.parse(readFileSync(process.cwd() + '/src/fixtures/supportedCountryCodes.json', 'utf8')) as any;
        if (isReverse) {
            return countryCodes[code];
        } else {
            // @ts-ignore
            return Object.keys(countryCodes).find(key => countryCodes[key] === code);
        }
    }

    public static getStateNameByCode(countryCode: string, stateCode: string, isReverse?: boolean): string {
        const countryStateCodes = JSON.parse(readFileSync(process.cwd() + '/src/fixtures/countryStateCodes.json', 'utf8')) as any;
        const stateCodes = countryStateCodes[countryCode];
        if (isReverse) {
            // @ts-ignore
            return Object.keys(stateCodes).find((key => stateCodes[key] === stateCode));
        } else {
            return stateCodes[stateCode];
        }
    }

    public static getCategoryNameByCategoryId(categoryArray: [{ "id": number, "name": string }], category: string, isReverse: boolean = false, separator: string = ','): string {
        const allCategories = String(category).split(separator);
        const reCategory: string[] = [];
        if (allCategories.length >= 1 && allCategories[0] !== "") {
            allCategories.forEach(cat => {
                categoryArray.forEach(catArr => {
                    if (isReverse) {
                        if (catArr.name === cat) {
                            reCategory.push(String(catArr.id));
                        }
                    } else {
                        // tslint:disable-next-line:radix
                        const catId: number = Number.parseInt(cat);
                        if (catArr.id === catId) {
                            reCategory.push(catArr.name);
                        }
                    }
                })
            });
            if (reCategory.length === allCategories.length) {
                return reCategory.join();
            } else {
                throw new Error(`One or more provided category: ${category}, is not found in the provided Category Array: ${categoryArray}`);
            }
        } else {
            return "";
        }
    }

    /**
     * Find text on page
     * Assert if exist or not
     *
     * TODO: Add soft assertion for list
     * @param {string} pageName
     * @param {string} ifContains
     * @param {string} isList
     * @param {string} message
     */
    public static findText(pageName: string, ifContains: string, isList: string, message: string): void {
        const items: string[] = [];
        isList.endsWith('list')
            ? items.push(...message.split(';'))
            : items.push(message);
        let isExist: boolean;
        const pol = !ifContains.endsWith('not');
        const timeout = pol ? 10 : 1;
        items.forEach(i => {
            isExist = false;
            expect(isExist).that.equal(
                pol,
                `Message with text "${i}" doesn't appeared on ${pageName ||
                'this'} page after ${1000 * timeout} ms`
            );
        });
    }

    public static isValidUrl(url: string, hostname?: string): boolean {
        const pattern: string = '^((ftp|https?):\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$';
        const regExt: RegExp = new RegExp(pattern, 'gi');
        switch (false) {
            case url.match(regExt) !== null:
                return false;
            // case url.match(regExt).length === 1:
            //     return false;
            default:
                if (hostname) {
                    const newUrl: URL.UrlWithStringQuery = URL.parse(url);
                    // @ts-ignore
                    return newUrl.hostname.includes(hostname);
                } else {
                    return true;
                }
        }
    }

    public static getVarType(variable: any): string {
        let typeName: string = "NONE";
        if (typeof variable === 'object') {
            if (!Array.isArray(variable)) {
                typeName = "object";
            } else {
                typeName = "array";
            }
        } else {
            if (!isNaN(+variable)) {
                typeName = "number";
            } else {
                typeName = "string";
            }
        }
        return typeName;
    }

    public static isStringArraySorted(arr: string[]): boolean {
        let b: string[] = [];
        arr.forEach(k => b.push(k));
        b = b.sort();
        try {
            expect(arr).to.deep.equal(b);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Replace string with Current Date in the format 'YYYY-MM-DD'
     *
     * @param {string} source - string to be changed
     * @param {string} varName - variable name to be replaced, 'DATE' by default
     * @param {string} varPrefix - prefix for variable eg. %{VAR}, prefix %
     */
    public static replaceWithCurrentDate(
        source: string,
        varName: string = 'DATE',
        varPrefix: string = '%'
    ): any {
        const varsPath = source.match(new RegExp(`${varPrefix}{([^}]+)}`, 'g'));
        if (varsPath) {
            varsPath.forEach(x => {
                if (x === `${varPrefix}{${varName}}`) {
                    source = source.replace(x, this.getFormattedDate(Date.now(), 'YYYY-MM-DD'));
                }
            });
        }
        return source;
    }

    public static roundNumberWithSymbol(value: number, symbolsRange: number): string {
        return value.toFixed(symbolsRange);
    }

    public static StringToBoolean(str: string): boolean {
        let result: boolean = false;
        if (Boolean(str)) {
            str === 'true'
                ? result = true
                : result = false;
        } else {
            throw new Error("Cant parse Boolean from String: " + str);
        }
        return result;
    }

    private static transform(data: DataTable, marker: string, value: any, apply: (target: string, marker: string, value: any) => any): DataTable {
        const newData: DataTable = Object.create(data);
        const raw = newData
            .raw()
            .map(x =>
                x.map(y =>
                    y.includes(marker)
                        ? apply(y, marker, value)
                        : y
                )
            );
        newData.raw = () => raw;
        return newData;
    }
}

export { Helper };
