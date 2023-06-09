## 思源插件开发增强包: 更新日志功能

可以帮你在插件更新的时候方便地展示更新日志。

### 使用方法

1. 安装依赖

    ```bash
    pnpm add -D sy-plugin-changelog
    ```

2. 在自己的代码中导入并使用

    ```ts
    import { changelog } from 'sy-plugin-changelog';

    export default class PluginSample extends Plugin {
        async onload() {
            //... everything done
            changelog(this);
        }
    }
    ```

3. 请在 `i18n` 目录下新建文件 `CHANGELOG-<lang>-<version>.md` 文件, 并保证被加入打包当中
    - 例如: `i18n/CHANGELOG-zh_CN-0.0.2.md`
    - 如果你是用的是 `vite-plugin` 模板，那么 i18n 下的文件会自动打包到发布包中, 无需手动放入

### 说明

- `<lang>` 应当和思源 `window.siyuan.config.lang` 一致, 例如: `zh_CN`
- `<version>` 应当和 `plugin.json` 中 version 字段一致, 且格式为 `/\d+\.\d+\.\d+/`, 如 `1.1.2`
    - 注意, 如果你的版本是 `1.1.2-dev1`、`1.1.2-beta` 等，那么还是只会匹配到`1.1.2`
- 可选参数: `changelogPath` 可以自定义指定更新日志的路径, 该路径默认以插件目录为根目录:

    ```ts
    let filename = changelogPath ?? `i18n/CHANGELOG-${currentLang}-${mainVersion}.md`;
    const path = `/data/plugins/${pluginName}/${filename}`;
    ```
- 可选参数: `langFallback` 指定语言的 Fallback，默认已经设置好了, 大部分情况下不用自行设置

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

