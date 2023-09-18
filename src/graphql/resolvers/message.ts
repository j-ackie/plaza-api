import connection from '../../db';
import { pubsub } from '.';
import { withFilter } from 'graphql-subscriptions';

type MessageCreateInput = {
  message: {
    chatID: number;
    text: string;
  };
};

const messageQueries = {
  message: async (_: any, args: any) => {},
  messages: async (_: any, args: any) => {
    const messages = await connection('Message')
      .select('Message.id as message_id', 'User.id as user_id', '*')
      .join('User', 'Message.sender_id', '=', 'User.id')
      .where('Message.chat_id', args.chatID)
      .orderBy('Message.created_at', 'desc');

    return messages.map((message) => ({
      id: message.message_id,
      sender: {
        id: message.sender_id,
        username: message.username,
        displayName: message.display_name,
        profilePictureURI: message.profile_picture_uri,
        description: message.description,
      },
      chatID: message.chat_id,
      text: message.text,
      createdAt: message.created_at,
    }));
  },
};

const messageMutations = {
  createMessage: async (parent: undefined, args: MessageCreateInput) => {
    const insertedObject = (
      await connection('Message')
        .insert({
          sender_id: Math.round(Math.random()) + 1,
          chat_id: args.message.chatID,
          text: args.message.text,
          created_at: new Date().toISOString(),
        })
        .returning('*')
    )[0];

    const sender = await connection('User')
      .select('*')
      .where('id', insertedObject.sender_id)
      .first();

    const senderResult = {
      id: sender.id,
      username: sender.username,
      displayName: sender.display_name,
      profilePictureURI: sender.profile_picture_uri,
      description: sender.description,
    };

    const result = {
      id: insertedObject.id,
      sender: senderResult,
      chatID: parseInt(insertedObject.chat_id),
      text: insertedObject.text,
      createdAt: insertedObject.created_at,
    };

    pubsub.publish('MESSAGE_ADDED', { messageAdded: result });

    return result;
  },
};

const messageSubscriptions = {
  messageAdded: {
    subscribe: () => pubsub.asyncIterator(['MESSAGE_ADDED']),
  },
};

export { messageQueries, messageMutations, messageSubscriptions };
