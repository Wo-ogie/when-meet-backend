const nodemailer = require('nodemailer');
const aws = require('@aws-sdk/client-ses');

const ses = new aws.SES({
  region: 'ap-northeast-2',
});

exports.sendMeetingVoteEndNotificationEmail = async (
  destMailAddress,
  meetingId,
) => {
  const title = '[언제모임] 약속 일정 투표가 종료되었습니다.';
  const meetingResultPageUrl = `${process.env.SERVICE_URL}/resultend/${meetingId}`;
  const content = `
  <h1>약속 일정 투표 종료 알림</h1>
  <p>약속 일정 투표가 종료되었습니다.</p>
  <p>다음 링크에 접속하여 참가자들의 일정을 확인해보고, 약속 일정을 확정해주세요.</p>
  <a href="${meetingResultPageUrl}">${meetingResultPageUrl}</a>
  `;

  const transporter = nodemailer.createTransport({
    SES: { ses, aws },
  });

  await transporter.sendMail(
    {
      from: process.env.SERVICE_MAIL_ADDRESS,
      to: destMailAddress,
      subject: title,
      html: content,
    },
    (err, info) => {
      if (err) {
        throw err;
      }
    },
  );
};
