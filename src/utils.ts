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