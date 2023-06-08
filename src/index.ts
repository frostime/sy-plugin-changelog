import { Plugin } from "siyuan";
import { getFile } from "./utils";

const StorageName = 'PluginVersion';


export async function track(plugin: Plugin) {
    const pluginJsonPath = `/data/plugins/${plugin.name}/plugin.json`
    try {
        let pluginFile = await getFile(pluginJsonPath);
        if (pluginFile === null) {
            return;
        }
        pluginFile = JSON.parse(pluginFile);
        let version = pluginFile.version;
        console.log(`${plugin.name} Ver: ${version}`);

        let oldVer = await plugin.loadData(StorageName);

        //发现更新到了不同的版本
        if (version !== oldVer) {
            console.log(`${plugin.name} got new version: ${oldVer} -> ${version}`);
            plugin.saveData(StorageName, version);
            // showChangeLog(this.version);
        }
    } catch (error_msg) {
        console.error(`Setting load error: ${error_msg}`);
    }
}
