import connection from '../../db';

const userQueries = {
  user: async (_: any, args: any) => {
    const user = await connection('User').where({ id: args.id }).first();

    return {
      id: user.id,
      username: user.username,
      displayName: user.display_name,
      profilePictureURI: user.profilePictureURI,
      description: user.description,
    };
  },
  // users: async (_: any, args: any) => {},
};

// const messageMutations = {
//   createMessage: async (parent: undefined, args: MessageCreateInput) => {
//     const insertedID = await connection('Message').insert({
//       sender_id: 1,
//       chat_id: args.message.chatID,
//       text: args.message.text,
//     });
//     console.log(insertedID);
//   },
// };

export { userQueries };
