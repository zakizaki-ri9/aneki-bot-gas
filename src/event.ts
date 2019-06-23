// @ts-nocheck

interface ISlackMessage {
  preText: string;
  title: string;
  titleLink: string;
  text: string;
  mrkdwn: boolean;
}

namespace GasSettingUrls {
  enum PropertyName {
    connpass = "CONNPASS_INFO_URL",
    techplay = "TECHPLAY_INFO_URL",
    slackPost = "SLACK_POST_URL",
    slackPostTest = "SLACK_POST_URL_TEST"
  }
  function get(propertyName: PropertyName) {
    PropertiesService.getDocumentProperties().getProperty(
      propertyName.toString()
    );
  }
}
