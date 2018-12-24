// @ts-nocheck

/**
 * 分報を通知する関数
 */
function push_hunho() {
  var properties = PropertiesService.getScriptProperties();

  var data = {
    "text": "分報って知ってるか？\n知らない人は見ておいてくれよな！\n" +
      properties.getProperty('HUNHO_ESA_URL'),
    "unfurl_links": true,
  };

  var option = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(data)
  };

  UrlFetchApp.fetch(properties.getProperty('SLACK_POST_URL_TEST'), option);
}