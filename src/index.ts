import { Plugin, Dialog } from "siyuan";
import { getFile, showChangeLog, LangFallback } from "./utils";

const StorageName = 'PluginVersion';

interface ChangelogResult {
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
 *      Optional, the path of changelog file, default is `i18n/CHANGELOG-${lang}-${lang}.md`\
 *      You can specify a concrete path like `i18n/CHANGELOG-zh_CN-1.0.0.md`\
 *      Or you can use placeholder `${lang}` and `${ver}`, `${version}, the ${lang} will be replaced with current language, and ${ver} will be replaced with the main version of the plugin.
 * 
 * @param langFallback
 *      Optional, the fallback language
 *      default is:\
 *      ```
 *      {"zh_CN": "zh_CN", "zh_CHT": "zh_CN", "en_US": "en_US", "es_ES": "en_US", "fr_FR": "en_US"}
 *      ```
 *      A custom langFallback will be merged with the default one.
 * @returns 
 */
export async function changelog(plugin: Plugin, changelogPath?: string, langFallback?: LangFallback): Promise<ChangelogResult> {
    const pluginJsonPath = `/data/plugins/${plugin.name}/plugin.json`
    let result: ChangelogResult = {
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
            result.Dialog = await showChangeLog(plugin.name, version, changelogPath, langFallback);
        }
    } catch (error_msg) {
        console.error(`Setting load error: ${error_msg}`);
    }
    return result;
}
