# Google Drive連携機能のセットアップ手順

このドキュメントでは、Smalruby3-GUIでGoogle Driveからファイルを読み込むための機能を有効にするために必要なGoogle Cloud Platform (GCP)の設定手順を説明します。

## 前提条件

- Googleアカウントを持っていること
- Google Cloud Platformへのアクセス権限があること

## 1. Google Cloud Platformプロジェクトの作成

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 画面上部の「プロジェクトを選択」をクリック
3. 「新しいプロジェクト」をクリック
4. プロジェクト名を入力（例: `smalruby3-gui`）
5. 「作成」をクリック

## 2. 必要なAPIの有効化

### Google Drive APIを有効化

1. Google Cloud Consoleで作成したプロジェクトを選択
2. 左側のメニューから「APIとサービス」→「ライブラリ」を選択
3. 検索ボックスに「Google Drive API」と入力
4. 「Google Drive API」を選択
5. 「有効にする」をクリック

### Google Picker APIを有効化

1. 同じく「ライブラリ」画面で検索ボックスに「Google Picker API」と入力
2. 「Google Picker API」を選択
3. 「有効にする」をクリック

## 3. OAuth 2.0 認証情報の作成

### OAuth同意画面の設定

1. 左側のメニューから「APIとサービス」→「OAuth同意画面」を選択
2. ユーザータイプで「外部」を選択（テスト用途の場合）
3. 「作成」をクリック
4. アプリ情報を入力:
   - **アプリ名**: `Smalruby3 GUI`
   - **ユーザーサポートメール**: あなたのメールアドレス
   - **デベロッパーの連絡先情報**: あなたのメールアドレス
5. 「保存して次へ」をクリック
6. 「スコープ」画面で「スコープを追加または削除」をクリック
7. 以下のスコープを追加:
   - `https://www.googleapis.com/auth/drive.readonly`
   または
   - `https://www.googleapis.com/auth/drive.file`
8. 「更新」→「保存して次へ」をクリック
9. テストユーザー画面で「保存して次へ」をクリック
10. 確認画面で「ダッシュボードに戻る」をクリック

### OAuth 2.0 クライアントIDの作成

1. 左側のメニューから「APIとサービス」→「認証情報」を選択
2. 画面上部の「認証情報を作成」→「OAuth クライアント ID」をクリック
3. アプリケーションの種類で「ウェブアプリケーション」を選択
4. 名前を入力（例: `Smalruby3 GUI Web Client`）
5. 「承認済みのJavaScript生成元」に以下を追加:
   - `http://localhost:8601` (開発環境)
   - 本番環境のURL（例: `https://smalruby.github.io`）
6. 「承認済みのリダイレクトURI」は空欄でOK（Picker APIでは不要）
7. 「作成」をクリック
8. 表示されたダイアログで「クライアントID」をコピーして保存

**重要**: クライアントシークレットは今回の実装では使用しません（フロントエンドのみの実装のため）

## 4. APIキーの作成（Picker API用）

1. 「認証情報」画面で「認証情報を作成」→「APIキー」をクリック
2. APIキーが作成されるので、コピーして保存
3. （推奨）「キーを制限」をクリック
4. 「アプリケーションの制限」で「HTTPリファラー（ウェブサイト）」を選択
5. 「ウェブサイトの制限」に以下を追加:
   - `http://localhost:8601/*`
   - 本番環境のURL（例: `https://smalruby.github.io/*`）
6. 「APIの制限」で「キーを制限」を選択
7. 「Google Picker API」を選択
8. 「保存」をクリック

## 5. 環境変数の設定

### 開発環境（Docker使用時）

**重要**: このプロジェクトはDockerを使用しているため、プロジェクトルート（`smalruby3-develop/`）に `.env` ファイルを作成します。

1. プロジェクトルートに `.env` ファイルを作成:

```bash
# Google Drive API設定
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_API_KEY=your-api-key
```

2. **注意事項**:
   - `.env` ファイルは `.gitignore` に含まれているため、Gitにコミットされません
   - `docker-compose.yml` がこの `.env` ファイルを自動的に読み込みます
   - 環境変数を変更した場合は、`docker compose restart gui` でサービスを再起動してください

3. サービスの再起動:

```bash
# 環境変数を反映させるため再起動
docker compose restart gui
```

### 開発環境（Dockerを使用しない場合）

Dockerを使用せず、直接npmコマンドを実行する場合:

```bash
# gui/smalruby3-gui/ ディレクトリに .env ファイルを作成
cd gui/smalruby3-gui
cat > .env << 'EOF'
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_API_KEY=your-api-key
EOF

# 開発サーバー起動
npm start
```

### 本番環境

本番環境では、ビルド時に環境変数を設定します:

```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com \
GOOGLE_API_KEY=your-api-key \
npm run build
```

または、GitHub ActionsなどのCI/CD環境では、シークレット変数として設定します。

## 6. セキュリティに関する注意事項

### クライアントIDとAPIキーの管理

- **クライアントID**: 公開しても問題ありませんが、承認済みのJavaScript生成元で制限することを推奨
- **APIキー**: HTTPリファラーで制限し、API制限を有効にすることを強く推奨
- **クライアントシークレット**: フロントエンドでは使用しないこと（セキュリティリスク）

### OAuth 2.0 スコープの選択

- `drive.readonly`: ファイルの読み取り専用（推奨）
- `drive.file`: アプリが作成したファイルの読み書き

読み取り専用の用途であれば `drive.readonly` を使用してください。

## 7. 動作確認

1. 開発サーバーを起動:
   ```bash
   docker compose up gui
   ```

2. ブラウザで `http://localhost:8601` を開く

3. ファイルメニューから「Google ドライブから読み込む」を選択

4. Google認証画面が表示されることを確認

5. 認証後、Google Driveのファイル選択画面が表示されることを確認

## トラブルシューティング

### "Access blocked: This app's request is invalid"

- OAuth同意画面の設定が完了していない可能性があります
- テストユーザーに自分のアカウントが追加されているか確認してください

### "API key not valid. Please pass a valid API key."

- APIキーが正しく設定されていない可能性があります
- APIキーの制限設定を確認してください
- Picker APIが有効になっているか確認してください

### "The origin http://localhost:8601 is not allowed"

- OAuth クライアントIDの「承認済みのJavaScript生成元」に `http://localhost:8601` が追加されているか確認してください

### 動的スクリプトのロードエラー

- ブラウザのコンソールでエラー内容を確認してください
- Content Security Policy (CSP) の設定を確認してください

## 参考リンク

- [Google Cloud Console](https://console.cloud.google.com/)
- [Google Picker API Documentation](https://developers.google.com/picker/api)
- [Google Identity Services](https://developers.google.com/identity/gsi/web/guides/overview)
- [Google Drive API v3](https://developers.google.com/drive/api/v3/about-sdk)
menu-bar.jsx:498 Uncaught TypeError: Cannot read properties of undefined (reading 'formatMessage')
    at MenuBar.render (menu-bar.jsx:498:1)
    at finishClassComponent (react-dom.development.js:17160:1)
    at updateClassComponent (react-dom.development.js:17110:1)
    at beginWork (react-dom.development.js:18620:1)
    at HTMLUnknownElement.callCallback (react-dom.development.js:188:1)
    at Object.invokeGuardedCallbackDev (react-dom.development.js:237:1)
    at invokeGuardedCallback (react-dom.development.js:292:1)
    at beginWork$1 (react-dom.development.js:23203:1)
    at performUnitOfWork (react-dom.development.js:22157:1)
    at workLoopSync (react-dom.development.js:22130:1)
render @ menu-bar.jsx:498
finishClassComponent @ react-dom.development.js:17160
updateClassComponent @ react-dom.development.js:17110
beginWork @ react-dom.development.js:18620
callCallback @ react-dom.development.js:188
invokeGuardedCallbackDev @ react-dom.development.js:237
invokeGuardedCallback @ react-dom.development.js:292
beginWork$1 @ react-dom.development.js:23203
performUnitOfWork @ react-dom.development.js:22157
workLoopSync @ react-dom.development.js:22130
performSyncWorkOnRoot @ react-dom.development.js:21756
scheduleUpdateOnFiber @ react-dom.development.js:21188
updateContainer @ react-dom.development.js:24373
（匿名） @ react-dom.development.js:24758
unbatchedUpdates @ react-dom.development.js:21903
legacyRenderSubtreeIntoContainer @ react-dom.development.js:24757
render @ react-dom.development.js:24840
__WEBPACK_DEFAULT_EXPORT__ @ render-gui.jsx:60
./src/playground/index.jsx @ index.jsx:23
__webpack_require__ @ bootstrap:22
（匿名） @ startup:6
（匿名） @ startup:6
webpackUniversalModuleDefinition @ universalModuleDefinition:9
（匿名） @ universalModuleDefinition:10
render-gui.jsx:60 Warning: componentWillMount has been renamed, and is not recommended for use. See https://fb.me/react-unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.
* Rename componentWillMount to UNSAFE_componentWillMount to suppress this warning in non-strict mode. In React 17.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run `npx react-codemod rename-unsafe-lifecycles` in your project source folder.

Please update the following components: MediaQuery, ProjectSaverComponent
printWarning @ react-dom.development.js:88
warn @ react-dom.development.js:51
__webpack_modules__../node_modules/react-dom/cjs/react-dom.development.js.ReactStrictModeWarnings.flushPendingUnsafeLifecycleWarnings @ react-dom.development.js:11371
flushRenderPhaseStrictModeWarningsInDEV @ react-dom.development.js:23112
commitRootImpl @ react-dom.development.js:22396
unstable_runWithPriority @ scheduler.development.js:653
runWithPriority$1 @ react-dom.development.js:11039
commitRoot @ react-dom.development.js:22381
finishSyncRender @ react-dom.development.js:21807
performSyncWorkOnRoot @ react-dom.development.js:21793
scheduleUpdateOnFiber @ react-dom.development.js:21188
updateContainer @ react-dom.development.js:24373
（匿名） @ react-dom.development.js:24758
unbatchedUpdates @ react-dom.development.js:21903
legacyRenderSubtreeIntoContainer @ react-dom.development.js:24757
render @ react-dom.development.js:24840
__WEBPACK_DEFAULT_EXPORT__ @ render-gui.jsx:60
./src/playground/index.jsx @ index.jsx:23
__webpack_require__ @ bootstrap:22
（匿名） @ startup:6
（匿名） @ startup:6
webpackUniversalModuleDefinition @ universalModuleDefinition:9
（匿名） @ universalModuleDefinition:10
render-gui.jsx:60 Warning: componentWillReceiveProps has been renamed, and is not recommended for use. See https://fb.me/react-unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://fb.me/react-derived-state
* Rename componentWillReceiveProps to UNSAFE_componentWillReceiveProps to suppress this warning in non-strict mode. In React 17.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run `npx react-codemod rename-unsafe-lifecycles` in your project source folder.

Please update the following components: DropAreaWrapper, MediaQuery, Popover, SortableWrapper, Tabs
printWarning @ react-dom.development.js:88
warn @ react-dom.development.js:51
__webpack_modules__../node_modules/react-dom/cjs/react-dom.development.js.ReactStrictModeWarnings.flushPendingUnsafeLifecycleWarnings @ react-dom.development.js:11377
flushRenderPhaseStrictModeWarningsInDEV @ react-dom.development.js:23112
commitRootImpl @ react-dom.development.js:22396
unstable_runWithPriority @ scheduler.development.js:653
runWithPriority$1 @ react-dom.development.js:11039
commitRoot @ react-dom.development.js:22381
finishSyncRender @ react-dom.development.js:21807
performSyncWorkOnRoot @ react-dom.development.js:21793
scheduleUpdateOnFiber @ react-dom.development.js:21188
updateContainer @ react-dom.development.js:24373
（匿名） @ react-dom.development.js:24758
unbatchedUpdates @ react-dom.development.js:21903
legacyRenderSubtreeIntoContainer @ react-dom.development.js:24757
render @ react-dom.development.js:24840
__WEBPACK_DEFAULT_EXPORT__ @ render-gui.jsx:60
./src/playground/index.jsx @ index.jsx:23
__webpack_require__ @ bootstrap:22
（匿名） @ startup:6
（匿名） @ startup:6
webpackUniversalModuleDefinition @ universalModuleDefinition:9
（匿名） @ universalModuleDefinition:10
render-gui.jsx:60 Warning: componentWillUpdate has been renamed, and is not recommended for use. See https://fb.me/react-unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* Rename componentWillUpdate to UNSAFE_componentWillUpdate to suppress this warning in non-strict mode. In React 17.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run `npx react-codemod rename-unsafe-lifecycles` in your project source folder.

Please update the following components: MediaQuery
printWarning @ react-dom.development.js:88
warn @ react-dom.development.js:51
__webpack_modules__../node_modules/react-dom/cjs/react-dom.development.js.ReactStrictModeWarnings.flushPendingUnsafeLifecycleWarnings @ react-dom.development.js:11383
flushRenderPhaseStrictModeWarningsInDEV @ react-dom.development.js:23112
commitRootImpl @ react-dom.development.js:22396
unstable_runWithPriority @ scheduler.development.js:653
runWithPriority$1 @ react-dom.development.js:11039
commitRoot @ react-dom.development.js:22381
finishSyncRender @ react-dom.development.js:21807
performSyncWorkOnRoot @ react-dom.development.js:21793
scheduleUpdateOnFiber @ react-dom.development.js:21188
updateContainer @ react-dom.development.js:24373
（匿名） @ react-dom.development.js:24758
unbatchedUpdates @ react-dom.development.js:21903
legacyRenderSubtreeIntoContainer @ react-dom.development.js:24757
render @ react-dom.development.js:24840
__WEBPACK_DEFAULT_EXPORT__ @ render-gui.jsx:60
./src/playground/index.jsx @ index.jsx:23
__webpack_require__ @ bootstrap:22
（匿名） @ startup:6
（匿名） @ startup:6
webpackUniversalModuleDefinition @ universalModuleDefinition:9
（匿名） @ universalModuleDefinition:10
render-gui.jsx:60 The above error occurred in the <MenuBar> component:
    in MenuBar (created by Connect(MenuBar))
    in Connect(MenuBar) (created by GoogleDriveLoaderComponent)
    in GoogleDriveLoaderComponent (created by Connect(GoogleDriveLoaderComponent))
    in Connect(GoogleDriveLoaderComponent) (created by InjectIntl(Connect(GoogleDriveLoaderComponent)))
    in InjectIntl(Connect(GoogleDriveLoaderComponent)) (created by MenuBarContainer)
    in MenuBarContainer (created by Connect(MenuBarContainer))
    in Connect(MenuBarContainer) (created by InjectIntl(Connect(MenuBarContainer)))
    in InjectIntl(Connect(MenuBarContainer)) (created by MediaQuery)
    in div (created by Box)
    in Box (created by MediaQuery)
    in MediaQuery (created by GUIComponent)
    in GUIComponent (created by Connect(GUIComponent))
    in Connect(GUIComponent) (created by InjectIntl(Connect(GUIComponent)))
    in InjectIntl(Connect(GUIComponent)) (created by GUI)
    in GUI (created by Connect(GUI))
    in Connect(GUI) (created by InjectIntl(Connect(GUI)))
    in InjectIntl(Connect(GUI)) (created by SystemPreferences)
    in SystemPreferences (created by Connect(SystemPreferences))
    in Connect(SystemPreferences) (created by CloudManager)
    in CloudManager (created by Connect(CloudManager))
    in Connect(CloudManager) (created by URLLoaderComponent)
    in URLLoaderComponent (created by Connect(URLLoaderComponent))
    in Connect(URLLoaderComponent) (created by InjectIntl(Connect(URLLoaderComponent)))
    in InjectIntl(Connect(URLLoaderComponent)) (created by SBFileUploaderComponent)
    in SBFileUploaderComponent (created by Connect(SBFileUploaderComponent))
    in Connect(SBFileUploaderComponent) (created by InjectIntl(Connect(SBFileUploaderComponent)))
    in InjectIntl(Connect(SBFileUploaderComponent)) (created by VMManager)
    in VMManager (created by Connect(VMManager))
    in Connect(VMManager) (created by VMListener)
    in VMListener (created by Connect(VMListener))
    in Connect(VMListener) (created by ProjectSaverComponent)
    in ProjectSaverComponent (created by Connect(ProjectSaverComponent))
    in Connect(ProjectSaverComponent) (created by TitledComponent)
    in TitledComponent (created by Connect(TitledComponent))
    in Connect(TitledComponent) (created by InjectIntl(Connect(TitledComponent)))
    in InjectIntl(Connect(TitledComponent)) (created by ProjectFetcherComponent)
    in ProjectFetcherComponent (created by Connect(ProjectFetcherComponent))
    in Connect(ProjectFetcherComponent) (created by InjectIntl(Connect(ProjectFetcherComponent)))
    in InjectIntl(Connect(ProjectFetcherComponent)) (created by QueryParserComponent)
    in QueryParserComponent (created by Connect(QueryParserComponent))
    in Connect(QueryParserComponent) (created by FontLoaderComponent)
    in FontLoaderComponent (created by Connect(FontLoaderComponent))
    in Connect(FontLoaderComponent) (created by ErrorBoundaryWrapper)
    in ErrorBoundary (created by Connect(ErrorBoundary))
    in Connect(ErrorBoundary) (created by ErrorBoundaryWrapper)
    in ErrorBoundaryWrapper (created by LocalizationWrapper)
    in IntlProvider (created by Connect(IntlProvider))
    in Connect(IntlProvider) (created by LocalizationWrapper)
    in LocalizationWrapper (created by Connect(LocalizationWrapper))
    in Connect(LocalizationWrapper) (created by HashParserComponent)
    in HashParserComponent (created by Connect(HashParserComponent))
    in Connect(HashParserComponent) (created by AppStateWrapper)
    in IntlProvider (created by Connect(IntlProvider))
    in Connect(IntlProvider) (created by AppStateWrapper)
    in Provider (created by AppStateWrapper)
    in AppStateWrapper

React will try to recreate this component tree from scratch using the error boundary you provided, ErrorBoundary.
logCapturedError @ react-dom.development.js:19527
logError @ react-dom.development.js:19564
callback @ react-dom.development.js:20744
callCallback @ react-dom.development.js:12490
commitUpdateQueue @ react-dom.development.js:12511
commitLifeCycles @ react-dom.development.js:19858
commitLayoutEffects @ react-dom.development.js:22803
callCallback @ react-dom.development.js:188
invokeGuardedCallbackDev @ react-dom.development.js:237
invokeGuardedCallback @ react-dom.development.js:292
commitRootImpl @ react-dom.development.js:22541
unstable_runWithPriority @ scheduler.development.js:653
runWithPriority$1 @ react-dom.development.js:11039
commitRoot @ react-dom.development.js:22381
finishSyncRender @ react-dom.development.js:21807
performSyncWorkOnRoot @ react-dom.development.js:21793
scheduleUpdateOnFiber @ react-dom.development.js:21188
updateContainer @ react-dom.development.js:24373
（匿名） @ react-dom.development.js:24758
unbatchedUpdates @ react-dom.development.js:21903
legacyRenderSubtreeIntoContainer @ react-dom.development.js:24757
render @ react-dom.development.js:24840
__WEBPACK_DEFAULT_EXPORT__ @ render-gui.jsx:60
./src/playground/index.jsx @ index.jsx:23
__webpack_require__ @ bootstrap:22
（匿名） @ startup:6
（匿名） @ startup:6
webpackUniversalModuleDefinition @ universalModuleDefinition:9
（匿名） @ universalModuleDefinition:10
error-boundary.jsx:42 gui Unhandled Error with action='Top Level App': TypeError: Cannot read properties of undefined (reading 'formatMessage')    at MenuBar.render (http://localhost:8601/gui.js:450776:24)    at finishClassComponent (http://localhost:8601/gui.js:171907:31)    at updateClassComponent (http://localhost:8601/gui.js:171857:24)    at beginWork (http://localhost:8601/gui.js:173367:16)    at HTMLUnknownElement.callCallback (http://localhost:8601/gui.js:154935:14)    at Object.invokeGuardedCallbackDev (http://localhost:8601/gui.js:154984:16)    at invokeGuardedCallback (http://localhost:8601/gui.js:155039:31)    at beginWork$1 (http://localhost:8601/gui.js:177950:7)    at performUnitOfWork (http://localhost:8601/gui.js:176904:12)    at workLoopSync (http://localhost:8601/gui.js:176877:22)Component stack:     in MenuBar (created by Connect(MenuBar))    in Connect(MenuBar) (created by GoogleDriveLoaderComponent)    in GoogleDriveLoaderComponent (created by Connect(GoogleDriveLoaderComponent))    in Connect(GoogleDriveLoaderComponent) (created by InjectIntl(Connect(GoogleDriveLoaderComponent)))    in InjectIntl(Connect(GoogleDriveLoaderComponent)) (created by MenuBarContainer)    in MenuBarContainer (created by Connect(MenuBarContainer))    in Connect(MenuBarContainer) (created by InjectIntl(Connect(MenuBarContainer)))    in InjectIntl(Connect(MenuBarContainer)) (created by MediaQuery)    in div (created by Box)    in Box (created by MediaQuery)    in MediaQuery (created by GUIComponent)    in GUIComponent (created by Connect(GUIComponent))    in Connect(GUIComponent) (created by InjectIntl(Connect(GUIComponent)))    in InjectIntl(Connect(GUIComponent)) (created by GUI)    in GUI (created by Connect(GUI))    in Connect(GUI) (created by InjectIntl(Connect(GUI)))    in InjectIntl(Connect(GUI)) (created by SystemPreferences)    in SystemPreferences (created by Connect(SystemPreferences))    in Connect(SystemPreferences) (created by CloudManager)    in CloudManager (created by Connect(CloudManager))    in Connect(CloudManager) (created by URLLoaderComponent)    in URLLoaderComponent (created by Connect(URLLoaderComponent))    in Connect(URLLoaderComponent) (created by InjectIntl(Connect(URLLoaderComponent)))    in InjectIntl(Connect(URLLoaderComponent)) (created by SBFileUploaderComponent)    in SBFileUploaderComponent (created by Connect(SBFileUploaderComponent))    in Connect(SBFileUploaderComponent) (created by InjectIntl(Connect(SBFileUploaderComponent)))    in InjectIntl(Connect(SBFileUploaderComponent)) (created by VMManager)    in VMManager (created by Connect(VMManager))    in Connect(VMManager) (created by VMListener)    in VMListener (created by Connect(VMListener))    in Connect(VMListener) (created by ProjectSaverComponent)    in ProjectSaverComponent (created by Connect(ProjectSaverComponent))    in Connect(ProjectSaverComponent) (created by TitledComponent)    in TitledComponent (created by Connect(TitledComponent))    in Connect(TitledComponent) (created by InjectIntl(Connect(TitledComponent)))    in InjectIntl(Connect(TitledComponent)) (created by ProjectFetcherComponent)    in ProjectFetcherComponent (created by Connect(ProjectFetcherComponent))    in Connect(ProjectFetcherComponent) (created by InjectIntl(Connect(ProjectFetcherComponent)))    in InjectIntl(Connect(ProjectFetcherComponent)) (created by QueryParserComponent)    in QueryParserComponent (created by Connect(QueryParserComponent))    in Connect(QueryParserComponent) (created by FontLoaderComponent)    in FontLoaderComponent (created by Connect(FontLoaderComponent))    in Connect(FontLoaderComponent) (created by ErrorBoundaryWrapper)    in ErrorBoundary (created by Connect(ErrorBoundary))    in Connect(ErrorBoundary) (created by ErrorBoundaryWrapper)    in ErrorBoundaryWrapper (created by LocalizationWrapper)    in IntlProvider (created by Connect(IntlProvider))    in Connect(IntlProvider) (created by LocalizationWrapper)    in LocalizationWrapper (created by Connect(LocalizationWrapper))    in Connect(LocalizationWrapper) (created by HashParserComponent)    in HashParserComponent (created by Connect(HashParserComponent))    in Connect(HashParserComponent) (created by AppStateWrapper)    in IntlProvider (created by Connect(IntlProvider))    in Connect(IntlProvider) (created by AppStateWrapper)    in Provider (created by AppStateWrapper)    in AppStateWrapper
__webpack_modules__../node_modules/minilog/lib/web/formatters/minilog.js.logger.write @ minilog.js:17
onItem @ transform.js:31
emit @ index.js:26
__webpack_modules__../node_modules/minilog/lib/common/filter.js.Filter.write @ filter.js:52
onItem @ transform.js:31
emit @ index.js:26
__webpack_modules__../node_modules/minilog/lib/common/transform.js.Transform.write @ transform.js:15
o.error @ minilog.js:12
componentDidCatch @ error-boundary.jsx:42
callback @ react-dom.development.js:20749
callCallback @ react-dom.development.js:12490
commitUpdateQueue @ react-dom.development.js:12511
commitLifeCycles @ react-dom.development.js:19858
commitLayoutEffects @ react-dom.development.js:22803
callCallback @ react-dom.development.js:188
invokeGuardedCallbackDev @ react-dom.development.js:237
invokeGuardedCallback @ react-dom.development.js:292
commitRootImpl @ react-dom.development.js:22541
unstable_runWithPriority @ scheduler.development.js:653
runWithPriority$1 @ react-dom.development.js:11039
commitRoot @ react-dom.development.js:22381
finishSyncRender @ react-dom.development.js:21807
performSyncWorkOnRoot @ react-dom.development.js:21793
scheduleUpdateOnFiber @ react-dom.development.js:21188
updateContainer @ react-dom.development.js:24373
（匿名） @ react-dom.development.js:24758
unbatchedUpdates @ react-dom.development.js:21903
legacyRenderSubtreeIntoContainer @ react-dom.development.js:24757
render @ react-dom.development.js:24840
__WEBPACK_DEFAULT_EXPORT__ @ render-gui.jsx:60
./src/playground/index.jsx @ index.jsx:23
__webpack_require__ @ bootstrap:22
（匿名） @ startup:6
（匿名） @ startup:6
webpackUniversalModuleDefinition @ universalModuleDefinition:9
（匿名） @ universalModuleDefinition:10
（インデックス）:34 no PWA worker registration
