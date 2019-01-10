
## 概要

[エンジニアの登壇を応援する会 - #engineers_lt](https://engineers-lt.gitbook.io/information/)の  
feedチャネルで使用しているあねきぼっとのGAS部分。  

とりあえずで実装していた部分をリファクタリングしつつ、  
誰でも拡張可能なように以下の実装を行う。  

- 必須
  - [x] APIKeyやWebhookURLのプロパティストア化
  - [ ] connpassとtechplayから取得する情報をスプレッドシート参照するように変更
    - [x] connpassの方はタイトルをWebページから取得できるようにする
  - ~~[ ] SlackApp化~~
    - 現状はWebhookのみの対応で問題ないためやらなくておk
  - [ ] 冗長なコードを整備
    - [ ] グローバルな変数あたり
    - [ ] イベント当日、翌日のメッセージ生成メソッドあたり
- できれば
  - [ ] TypeScript化

## 画像

[けぇき](https://www.pixiv.net/member.php?id=360566)さんの作品。  
[SNSフリーアイコン](https://www.pixiv.net/member_illust.php?mode=manga&illust_id=474267820)から拝借。

※再配布不可能であるため、リポジトリには含めておりません。

## 詳細

実装内容について説明します。

### GASのライブラリ

`src/appsscript.json`に定義、使用しているライブリラリについて記載します。

- Moment
  - 日付を扱うためのライブラリ
  - 参考URL: https://tonari-it.com/gas-moment-js-moment/
