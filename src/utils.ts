import { Dialog } from "siyuan";

declare global {
    interface Window {
        siyuan: any;
    }
}

async function myFetchSyncPost(url: string, data: any) {
    const init: RequestInit = {
        method: "POST",
    };
    if (data) {
        init.body = JSON.stringify(data);
    }
    const res = await fetch(url, init);
    const txt = await res.text();
    return txt;
}

/**
 * 使用了自定义的 fetchSyncPost
 * @param path
 * @returns Raw txt
 */
export async function getFile(path: string): Promise<any> {
    let data = {
        path: path
    }
    let url = '/api/file/getFile';
    try {
        let file = await myFetchSyncPost(url, data);
        return file;
    } catch (error_msg) {
        return null;
    }
}

class MyDialog extends Dialog {

    eleContainer: HTMLElement;

    constructor(options: any) {
        super(options);
        this.eleContainer = this.element.querySelector('.b3-dialog__container')!;
    }

    setSize(size: { width?: string; height?: string }) {
        let ele: HTMLElement = this.element.querySelector('.b3-dialog__container')!;
        ele.style.width = size.width ?? ele.style.width;
        ele.style.height = size.height ?? ele.style.height;
    }

    setFont(size: string) {
        let ele: HTMLElement = this.element.querySelector('#dialogContent')!;
        ele.style.fontSize = size;
    }
}

function showTypoDialog(title: string, typo: string, width?: string) {
    return new MyDialog({
        title: title,
        content: `
        <div id="dialog" class="b3-typography" style="margin: 2rem; font-size: 1rem">
            <div id="dialogContent" style="font-size: 1rem">
                ${typo}
            </div>
        </div>`,
        width: width,
        height: "50%"
    });
}

export type Lang = "zh_CN" | "zh_CHT" | "en_US" | "es_ES" | "fr_FR";
export type LangFallback = { [key in Lang]?: Lang };
let DefaultLangFallback: LangFallback = {
    "zh_CN": "zh_CN",
    "zh_CHT": "zh_CN",
    "en_US": "en_US",
    "es_ES": "en_US",
    "fr_FR": "en_US",
}

export async function showChangeLog(pluginName: string, version: string, changelogPath?: string, langFallback?: LangFallback): Promise<Dialog | undefined> {
    try {
        //Get mainVersion，1.1.1-beta or 1.1.1.patch , has main version as 1.1.1
        let match = version.match(/\d+\.\d+\.\d+/g);
        if (match === null) {
            console.log(`Failed to parse plugin version: ${version}`);
            return;
        }
        let mainVersion = match[0];

        let currentLang: Lang = window?.siyuan?.config?.lang;
        if (currentLang === undefined) {
            console.log('Get Lang error');
            return;
        }

        if (langFallback === undefined) {
            langFallback = DefaultLangFallback;
        } else {
            //Merge langFallback with DefaultLangFallback
            for (let key in DefaultLangFallback) {
                if (langFallback[key as Lang] === undefined) {
                    langFallback[key as Lang] = DefaultLangFallback[key as Lang];
                }
            }
        }
        currentLang = langFallback[currentLang] ?? currentLang;

        if (changelogPath === undefined) {
            changelogPath = `i18n/CHANGELOG-${currentLang}-${mainVersion}.md`;
        } else {
            changelogPath = changelogPath.replace(/\${lang}/g, currentLang).replace(/\${(?:ver|version)}/g, mainVersion);
        }

        const path = `/data/plugins/${pluginName}/${changelogPath}`;

        let file: string = await getFile(path);
        let code404 = file.match(/"code":404/g);
        if (code404 !== null) {
            console.log(`Faild to find changelog file: ${path}`);
            return;
        }

        //@ts-ignore
        const lute = window.Lute!.New();

        let content = lute.Md2HTML(file);
        return showTypoDialog(
            `${pluginName} v${version}`,
            content,
            "60%"
        );
    } catch (err) {
        console.log('showChangeLog error:', err);
    }
}

