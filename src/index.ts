import { Plugin, Dialog } from "siyuan";
import { getFile, showChangeLog } from "./utils";

const StorageName = 'PluginVersion';

interface TrackResult {
    VersionChanged: boolean | undefined;
    OldVersion: string | undefined;
    NewVersion: string | undefined;
    Dialog: Dialog | undefined;
}

/**
 * 
 * @param plugin
 *      The plugin whose changelog you want to show
 * @param changelogPath
 *      Optional, the path of changelog file, default is `i18n/CHANGELOG-${currentLang}-${mainVersion}.md`
 * @returns 
 */
export async function changelog(plugin: Plugin, changelogPath?: string): Promise<TrackResult> {
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
            result.Dialog = await showChangeLog(plugin.name, version, changelogPath);
        }
    } catch (error_msg) {
        console.error(`Setting load error: ${error_msg}`);
    }
    return result;
}
