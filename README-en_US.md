[中文文档](README-zh_CN.md)

## SiYuan Plugin Development Enhancement: Changelog Functionality

This enhancement package helps you easily display changelogs while updating your plugin.


### Usage


1. Install dependency


    ```bash
    pnpm add -D sy-plugin-changelog
    ```


2. Import and use in your code


    ```ts
    import { changelog } from 'sy-plugin-changelog';


    export default class PluginSample extends Plugin {
        async onload() {
            //... everything done
            changelog(this);
        }
    }
    ```


3. Create a new file `CHANGELOG-<lang>-<version>.md` located in the `i18n` directory, and ensure that it is included in the built package
    - For example, `i18n/CHANGELOG-zh_CN-0.0.2.md`


Extra notes:


- `<lang>` should match the value of `window.siyuan.config.lang`, for example: `zh_CN`
- `<version>` should match the `version` field in `plugin.json`, and the format should be `/\d+\.\d+\.\d+/`, like `1.1.2`
- Note that `<version>` will only match `/\d+\.\d+\.\d+/`. If your version is something like `1.1.2-dev1` or `1.1.2-beta`, it will still only match `1.1.2`.


### Optional Parameters


#### 1. `changelogPath`
`changelogPath` allows you to customize the path to the changelog. By default, this path is relative to the plugin directory:


```ts
const path = `/data/plugins/${pluginName}/${changelogPath}`;
```
The `changelogPath` can include `${lang}` and `${version}` templates, which will be replaced at runtime with their corresponding values:
```ts
changelogPath.replace(/\${lang}/g, currentLang).replace(/\${(?:ver|version)}/g, mainVersion);
```


#### 2. `langFallback`


`langFallback` specifies the fallback language. The `${lang}` parameter passed in will be resolved according to the fallback rules. This is already set by default and shouldn't need to be set manually in most cases.


```ts
export type Lang = "zh_CN" | "zh_CHT" | "en_US" | "es_ES" | "fr_FR";
export type LangFallback = { [key in Lang]?: Lang };
let DefaultLangFallback: LangFallback = {
    "zh_CN": "zh_CN",
    "zh_CHT": "zh_CN",
    "en_US": "en_US",
    "es_ES": "en_US",
    "fr_FR": "en_US",
}
```


### Return Value

`changelog` returns the following object:

```ts
interface ChangelogResult {
    VersionChanged: boolean | undefined;
    OldVersion: string | undefined;
    NewVersion: string | undefined;
    Dialog: TypoDialog | undefined;
}
```


The `Dialog` property of this object is the displayed dialog window, with the internal DOM structure as follows:


```ts
return new TypoDialog({
    title: title,
    content: `
    <div id="dialog" class="b3-typography" style="margin: 2rem; font-size: 1rem">
        <div id="dialogContent"  style="font-size: 1rem">
            ${typo}
        </div>
    </div>`,
    width: width,
    height: "50%"
});
```

`TypoDialog` is essentially a SiYuan `Dialog`, wrapped with some utility method.