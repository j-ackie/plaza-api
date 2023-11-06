import connection from '../../db';

type LikedCreateInput = {
  liked: {
    videoID: number
  };
};

// limit reviews later
const likedQueries = {
  likedVideos: async (_: any, args: any) => {
    const likes = await connection("VideoLiked")
      .select("*")
      .where("user_id", args.userID);

    return likes.map(like => ({
      id: like.id,
      videoID: like.video_id,
      userID: like.user_id
    }));
    
}};
  

const likedMutations = {
  createLiked: async (parent: undefined, args: LikedCreateInput, ctx: any) => {
    console.log(ctx);
    
    const insertedObject = (await connection("VideoLiked").insert({
      video_id: args.liked.videoID,
      user_id: ctx.user.id,
    }).returning('*'))[0];

    return {
      id: insertedObject.id,
      videoID: insertedObject.video_id,
      userID: insertedObject.user_id
    };
  }
}

export { likedQueries, likedMutations };