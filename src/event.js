// @ts-nocheck

// TODO: スプレッドシートから参照するように変更する
var _define = {
  event_id: {
    connpass: [{
        url: 'https://engineers.connpass.com/event/113403/',
        title: '目標設定の技術を勉強する会 #1'
      },
      {
        url: 'https://engineers.connpass.com/event/112692/',
        title: 'カジュアルLT大会 #1'
      }
    ],
    techplay: [
      705867 // 忘年会
    ]
  },
  url: {
    slack: "",
    connpass: "",
    techplay: ""
  }
};

// イベント開催日近辺になったら通知有無を判断するためのイベント情報を格納する配列
var _notification = [];

// メッセージの先頭に表示させる文章
var _headPretext = "おはよ。今日もがんばれよ。 :fake_ariaki: \n";

// イベント情報を通知するか判別するための本日日付情報を取得
var _today = Moment.moment();
var _todayYYYYMMDD = Moment.moment(_today.format("YYYY-MM-DD"));

// メッセージの最後にに表示させる文章
var _lastPretext = "さて、" +
  _today.format("YYYY-MM-DD HH:mm:ss") +
  "時点の参加状況だぞ。";

/**
 * connpassとtechplayから取得した情報をslackへ通知する処理
 * 本関数が定期実行される
 **/
function main() {

  // _define系に初期値設定
  init();

  // connpassとtechplayそれぞれから情報取得
  var resultTechplay = [];
  _define.event_id.techplay.forEach(function (id) {
    var eventInfo = getTechplayInfoNetlify(id);
    if (eventInfo !== null) {
      resultTechplay.push(eventInfo);
    }
  });
  var resultConnpass = [];
  _define.event_id.connpass.forEach(function (obj) {
    var eventInfo = getConnpassInfoNetlify(obj.url, obj.title);
    if (eventInfo !== null) {
      resultConnpass.push(eventInfo);
    }
  });

  // 情報を結合
  var data = {
    "attachments": resultConnpass
  };
  resultTechplay.forEach(function (element) {
    data.attachments.push(element);
  });

  // メッセージの冒頭に表示する文字列を設定
  data.attachments[0].pretext += _lastPretext;

  // 今日開催のイベントに対してのメッセージを追記
  var tMsg = createTodayMessage();
  if (tMsg !== "") {
    data.attachments.splice(0, 0, {
      "pretext": tMsg,
      "title": "",
      "title_link": "",
      "text": "",
      "mrkdwn": true
    });
  }

  // 昨日開催だったイベントに対してのメッセージを追記
  var yMsg = createYesterdayMessage();
  if (yMsg !== "") {
    data.attachments.splice(0, 0, {
      "pretext": yMsg,
      "title": "",
      "title_link": "",
      "text": "",
      "mrkdwn": true
    });
  }

  // 最初のメッセージを追加
  data.attachments.splice(0, 0, {
    "pretext": _headPretext,
    "title": "",
    "title_link": "",
    "text": "",
    "mrkdwn": true
  });

  var option = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(data)
  };

  // slackへ通知
  UrlFetchApp.fetch(_define.url.slack, option);
}

/***
 * 初期化処理
 * ・スクリプトプロパティから必要な値を_defineへセット（できればユーザー限定でのユーザープロパティ参照としたい）
 */
function init() {
  var properties = PropertiesService.getScriptProperties();
  _define.url.connpass = properties.getProperty('CONNPASS_INFO_URL');
  _define.url.techplay = properties.getProperty('TECHPLAY_INFO_URL');
  _define.url.slack = properties.getProperty('SLACK_POST_URL_TEST');
}

/**
 * イベント終了の通知メッセージを生成
 * @return {string} イベント終了用メッセージ
 */
function createYesterdayMessage() {
  var item = [];
  var yesterday = Moment.moment().subtract(1, 'days').format("YYYY-MM-DD");
  _notification.forEach(function (element) {
    if (yesterday === element.day.format("YYYY-MM-DD")) {
      item.push(element);
    }
  });

  if (item.length < 1) return "";
  var result = "きのうは以下のイベントお疲れ。\nみんな最高だぜ... :two_hearts: \n";
  item.forEach(function (element) {
    result += "*" + element.title + "* \n";
  });
  return result;
}

/**
 * イベント当日の通知メッセージを生成
 * @return {string} イベント当日用メッセージ
 */
function createTodayMessage() {
  var item = [];
  var today = Moment.moment().format("YYYY-MM-DD");
  _notification.forEach(function (element) {
    if (today === element.day.format("YYYY-MM-DD")) {
      item.push(element);
    }
  });

  if (item.length < 1) return "";
  var result = "きょうは以下のイベントだな...\nみんな、がんばろうな！ :ai: \n";
  item.forEach(function (element) {
    result += "*" + element.title + "* \n";
  });
  return result;
}

/**
 * NetlifyにデプロイされているTechplayスクレイピングAPIを叩き、
 * Slackに返却すべき情報用に整形して返却
 *
 * @param {int} eventId techplayのイベントID
 * @return {object} bot通知に必要な情報のみを詰め込んだオブジェクト
 *                  ただし、本日日付以降のイベントならnullを返却
 **/
function getConnpassInfoNetlify(eventUrl, title) {

  // URL設定
  var url = _define.url.connpass;

  // Functionに渡すパラメータの準備
  var payload = {
    "event_url": eventUrl,
    "title": title
  };

  var options = {
    "method": "POST",
    "payload": JSON.stringify(payload)
  };

  // Function実行
  var techplayInfo = UrlFetchApp.fetch(url, options);

  // オブジェクト化
  var json = JSON.parse(techplayInfo.getContentText());
  Logger.log(json);

  // bot通知に必要な情報を作成
  //  日付と時刻
  var day = Moment.moment(json.day.substr(0, 10));
  var textDay = "*開催日時* : " + json.day + " " + json.time + "\n";
  var textHuman = "*合計人数* : " + json.total + "\n";
  if (json.detail_list !== null && json.detail_list.length > 0) {
    json.detail_list.forEach(function (e, idx) {
      textHuman += "*" + e.category + "* : " + e.capacity;
      textHuman += (json.detail_list.length - 1) == idx ? "" : "\n";
    });
  }

  var result = null;
  if (_todayYYYYMMDD.isBefore(day) ||
    _todayYYYYMMDD.format("YYYY-MM-DD") === day.format("YYYY-MM-DD")) {
    result = {
      "pretext": "",
      "title": title,
      "title_link": eventUrl,
      "text": textDay + textHuman,
      "mrkdwn": true
    };
  }

  // _notificationへ情報セット
  _notification.push({
    title: title,
    title_link: eventUrl,
    day: day,
    time_from: "",
    time_to: ""
  });

  return result;
}

/**
 * NetlifyにデプロイされているTechplayスクレイピングAPIを叩き、
 * Slackに返却すべき情報用に整形して返却
 *
 * @param {int} eventId techplayのイベントID
 * @return {object} bot通知に必要な情報のみを詰め込んだオブジェクト
 *                  ただし、本日日付以降のイベントならnullを返却
 **/
function getTechplayInfoNetlify(eventId) {

  // URL設定
  var url = _define.url.techplay;

  // Functionに渡すパラメータの準備
  var payload = {
    "event_id": eventId
  };

  var options = {
    "method": "POST",
    "payload": JSON.stringify(payload)
  };

  // Function実行
  var techplayInfo = UrlFetchApp.fetch(url, options);

  // オブジェクト化
  var json = JSON.parse(techplayInfo.getContentText());
  Logger.log(json);

  // bot通知に必要な情報を作成
  //  日付と時刻
  var day = Moment.moment(json.day.substr(0, 10));
  var textDay = "*開催日時* : " + json.day + " " + json.time + "\n";
  var textHuman = "*合計人数* : " + json.total + "\n";
  if (json.detail_list !== null && json.detail_list.length > 0) {
    json.detail_list.forEach(function (e, idx) {
      textHuman += "*" + e.category + "* : " + e.capacity;
      textHuman += (json.detail_list.length - 1) == idx ? "" : "\n";
    });
  }

  var result = null;
  if (_todayYYYYMMDD.isBefore(day) ||
    _todayYYYYMMDD.format("YYYY-MM-DD") === day.format("YYYY-MM-DD")) {
    result = {
      "pretext": "",
      "title": json.title,
      "title_link": json.event_url,
      "text": textDay + textHuman,
      "mrkdwn": true
    };
  }

  // _notificationへ情報セット
  _notification.push({
    title: json.title,
    title_link: json.event_url,
    day: day,
    time_from: "",
    time_to: ""
  });

  return result;
}

/**
 * 対象文字列から改行コードと空白を削除して返却する処理
 * 
 * @param {string} src 対象文字列
 * @return {string} srcから改行コードと空白が削除された文字列
 **/
function trimString(src) {
  if (src === null || src === undefined) {
    return "";
  }

  return src.replace(/\r?\n/g, "").replace(/\s+/g, "");
}