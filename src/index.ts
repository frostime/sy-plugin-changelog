import { Plugin, Dialog } from "siyuan";
import { getFile, showChangeLog } from "./utils";

const StorageName = 'PluginVersion';

interface TrackResult {
    VersionChanged: boolean | undefined;
    OldVersion: string | undefined;
    NewVersion: string | undefined;
    Dialog: Dialog | undefined;
}

export async function track(plugin: Plugin): Promise<TrackResult> {
    const pluginJsonPath = `/data/plugins/${plugin.name}/plugin.json`
    let result: TrackResult = {
        VersionChanged: undefined,
        OldVersion: undefined,
        NewVersion: undefined,
        Dialog: undefined
    }
    try {
        let pluginFile = await getFile(pluginJsonPath);
        if (pluginFile === null) {
            return result;
        }
        pluginFile = JSON.parse(pluginFile);
        let version = pluginFile.version;
        console.log(`${plugin.name} Ver: ${version}`);

        let oldVer = await plugin.loadData(StorageName);
        result.OldVersion = oldVer;
        result.NewVersion = version;

        result.VersionChanged = false;
        //Another version found
        if (version !== oldVer) {
            result.VersionChanged = true;
            console.log(`${plugin.name} got new version: ${oldVer} -> ${version}`);
            plugin.saveData(StorageName, version);
            result.Dialog = await showChangeLog(plugin.name, version);
        }
    } catch (error_msg) {
        console.error(`Setting load error: ${error_msg}`);
    }
    return result;
}
