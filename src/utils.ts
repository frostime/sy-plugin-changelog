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
 * @returns 返回原始的文本 txt
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

function showTypoDialog(title: string, typo: string, width?: string) {
    return new Dialog({
        title: title,
        content: `
        <div id="dialog" class="b3-typography" style="margin: 2rem; font-size: 1rem">
            ${typo}
        </div>`,
        width: width,
        height: "50%"
    });
}

export async function showChangeLog(pluginName: string, version: string): Promise<Dialog|undefined> {
    try {
        //从 version 版本号中提取主要版本号 mainVersion，比如 1.1.1-beta 或 1.1.1.patch 等，都提取出 1.1.1
        let match = version.match(/\d+\.\d+\.\d+/g);
        if (match === null) {
            console.log(`版本号格式不正确：${version}`);
            return;
        }
        let mainVersion = match[0];

        let currentLang = window?.siyuan?.config?.lang;
        if (currentLang === undefined) {
            console.log('Get Lang error');
            return;
        }

        const path = `/data/plugins/${pluginName}/CHANGELOG-${currentLang}-${mainVersion}.md`;

        let file: string = await getFile(path);
        let code404 = file.match(/"code":404/g);
        if (code404 !== null) {
            console.log(`找不到更新文件：${path}`);
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

