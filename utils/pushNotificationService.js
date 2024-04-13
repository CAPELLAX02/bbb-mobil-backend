import { Expo } from 'expo-server-sdk';
let expo = new Expo();

// Yardımcı sendNotification fonksiyonu
const sendNotificationHelper = async (token, title, body) => {
  let messages = [];
  if (!Expo.isExpoPushToken(token)) {
    console.error(`Push token ${token} is not a valid Expo push token.`);
    return;
  }

  messages.push({
    to: token,
    sound: 'default',
    title: title,
    body: body,
    data: { withSome: 'data' },
  });

  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log(ticketChunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error(error);
    }
  }
};

export { sendNotificationHelper };
