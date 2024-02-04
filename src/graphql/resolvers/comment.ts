import connection from '../../db';

type ChatCreateInput = {
  comment: {
    videoID: number;
    comment: string;
  };
};

const commentQueries = {
  comments: async (_: any, args: any, ctx: any) => {
    const comments = await connection('Comment')
      .select('*')
      .where('Comment.video_id', args.videoID);

    return comments.map(async (comment) => {
      const user = await connection('User')
      .select("*")
      .where('User.id', comment.user_id)

      return {
        id: comment.id,
        videoID: comment.video_id,
        userID: comment.user_id,
        username: user[0].display_name,
        profilePicture: user[0].profile_picture_bucket_key,
        comment: comment.comment,
        createdAt: comment.created_at
      }
    })
  },
};

const commentMutations = {
  createComment: async (parent: undefined, args: ChatCreateInput, ctx: any) => {
    const currentTimestamp = new Date().toISOString();

    const insertedObject = (
      await connection('Comment')
        .insert({
          video_id: args.comment.videoID,
          user_id: ctx.user.id,
          comment: args.comment.comment,
          created_at: currentTimestamp,
        })
        .returning('*')
    )[0];

    const user = await connection('User')
    .select("*")
    .where('User.id', ctx.user.id)

    return {
      id: insertedObject.id,
      videoID: insertedObject.video_id,
      userID: insertedObject.user_id,
      comment: insertedObject.comment,
      createdAt: insertedObject.created_at,
      profilePicture: user[0].profile_picture_bucket_key,
      username: user[0].display_name
    };
  },
};

export { commentMutations, commentQueries };
