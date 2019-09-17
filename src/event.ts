export namespace Aneki {
  /**
   * Slack系の処理を制御する名前空間
   */
  export namespace Slack {
    export interface IAttachment {
      pretext: string
      title: string
      title_link: string
      text: string
      mrkdwn: boolean
    }
    export class Messages {
      private attachments: IAttachment[]
      constructor() {
        this.attachments = new Array<IAttachment>()
      }
      public stack(attachment: IAttachment) {
        this.attachments.push(attachment)
      }
      public spitOut(url: string) {
        // Slackへポスト
        const option: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
          contentType: 'application/json',
          method: 'post',
          payload: JSON.stringify({ attachments: this.attachments })
        }
        UrlFetchApp.fetch(url, option)

        // 空にする
        this.attachments = new Array<IAttachment>()
      }
    }
  }

  /**
   * Scriptプロパティの情報を取得するための名前空間
   */
  export namespace GasSettingUrls {
    // export function get(propertyName: PropertyName): string | null {
    //   return PropertiesService.getScriptProperties().getProperty(
    //     propertyName.toString()
    //   )
    // }

    export enum PropertyName {
      connpass = 'CONNPASS_INFO_URL',
      techplay = 'TECHPLAY_INFO_URL',
      slackPost = 'SLACK_POST_URL',
      slackPostTest = 'SLACK_POST_URL_TEST'
    }
  }
}

// function testMain() {
//   const slackMessages = new Aneki.Slack.Messages()
//   slackMessages.stack({
//     pretext: 'test_preText',
//     title: 'title_Test',
//     title_link: 'https://trattoria-e-bar-porto-yamanashi.netlify.com/',
//     text: 'text_Test',
//     mrkdwn: true
//   })
//   const url = Aneki.GasSettingUrls.get(
//     Aneki.GasSettingUrls.PropertyName.slackPostTest
//   )
//   if (url) {
//     slackMessages.spitOut(url)
//   } else {
//     Logger.log('slack post url is null!!')
//   }
// }
