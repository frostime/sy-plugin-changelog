import { Plugin } from "siyuan";
import { getFile } from "./utils";

export async function track(plugin: Plugin) {
    let pluginName = plugin.name;
    return pluginName;
}


const StorageName = 'PluginVersion';

async function checkPluginVersion(plugin: Plugin) {
    const pluginJsonPath = `/data/plugins/${plugin.name}/plugin.json`
    try {
        let plugin_file = await getFile(pluginJsonPath);
        if (plugin_file === null) {
            return;
        }
        plugin_file = JSON.parse(plugin_file);
        let version = plugin_file.version;
        console.log(`${plugin.name} Ver: ${version}`);

        let oldVer = plugin.data[StorageName];

        //发现更新到了不同的版本
        if (version !== oldVer) {
            plugin.data[StorageName] = version;
            plugin.saveData(StorageName, version);
            // showChangeLog(this.version);
        }
    } catch (error_msg) {
        console.error(`Setting load error: ${error_msg}`);
    }
}

