import connection from '../../db';

type ChatCreateInput = {
  chat: {
    name: string;
    memberIDs: [number];
  };
};

const chatQueries = {
  chats: async (_: any, args: any, ctx: any) => {
    const chats = await connection('Chat')
      .select('Chat.*')
      .join('ChatMember', 'Chat.id', '=', 'ChatMember.chat_id')
      .where('ChatMember.member_id', 1);

    return chats.map(async (chat) => {
      const members = await connection('User')
        .select('User.*')
        .join('ChatMember', 'User.id', '=', 'ChatMember.member_id')
        .where('ChatMember.chat_id', chat.id);

      return {
        id: chat.id,
        name: chat.name,
        members: members.map((member) => ({
          id: member.id,
          username: member.username,
          displayName: member.display_name,
          profilePictureURI: member.profile_picture_uri,
          description: member.description,
        })),
        lastActivityAt: chat.last_activity_at,
      };
    });
  },
};

const chatMutations = {
  createChat: async (parent: undefined, args: ChatCreateInput) => {
    const uniqueMemberIDs = [...new Set(args.chat.memberIDs)];

    const users = await connection('User')
      .select('*')
      .whereIn('id', uniqueMemberIDs);

    const currentTimestamp = new Date().toISOString();

    const insertedID = (
      await connection('Chat')
        .insert({
          name: args.chat.name,
          last_activity_at: currentTimestamp,
        })
        .returning('id')
    )[0].id;

    uniqueMemberIDs.forEach(async (memberId) => {
      await connection('ChatMember').insert({
        member_id: memberId,
        chat_id: insertedID,
        joined_at: currentTimestamp,
      });
    });

    return {
      id: insertedID,
      name: args.chat.name,
      members: users.map((user) => ({
        id: user.id,
        username: user.username,
        displayName: user.display_name,
        profilePictureURI: user.profile_picture_uri,
        description: user.description,
      })),
      lastActivityAt: new Date(currentTimestamp),
    };
  },
};

export { chatQueries, chatMutations };
