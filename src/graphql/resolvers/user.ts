import connection from '../../db';

const userQueries = {
  user: async (_: any, args: any) => {
    const filter = {};
    if (args.filters.id) {
      // @ts-ignore
      filter.id = args.filters.id;
    }
    if (args.filters.username) {
      // @ts-ignore
      filter.username = args.filters.username;
    }

    const user = await connection('User').where(filter).first();
    console.log(user);
    return {
      id: user.id,
      username: user.username,
      displayName: user.display_name,
      profilePictureURI: user.profile_picture_uri,
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
