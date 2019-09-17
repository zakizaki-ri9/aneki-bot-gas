/**
 * 分報のメッセージを送信する関数
 */
function pushHunho() {
  const properties = PropertiesService.getScriptProperties()

  const data = {
    text:
      '分報って知ってるか？\n知らない人は見ておいてくれよな！\n' +
      properties.getProperty('HUNHO_ESA_URL'),
    unfurl_links: true
  }

  const option: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(data)
  }

  const url = properties.getProperty('SLACK_POST_URL_TEST')
  if (url) {
    UrlFetchApp.fetch(url, option)
  } else {
    Logger.log('slack post url is null!!')
  }
}
