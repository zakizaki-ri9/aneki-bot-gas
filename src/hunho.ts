/**
 * 分報のメッセージを送信する関数
 */
function push_hunho() {
  const properties = PropertiesService.getScriptProperties();

  let data = {
    "text": "分報って知ってるか？\n知らない人は見ておいてくれよな！\n" +
      properties.getProperty('HUNHO_ESA_URL'),
    "unfurl_links": true,
  };

  let option: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(data)
  };

  UrlFetchApp.fetch(properties.getProperty('SLACK_POST_URL_TEST'), option);
}