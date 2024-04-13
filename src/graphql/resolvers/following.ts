import connection from '../../db';

type FollowInput = {
  follow: {
    followingID: number;
  };
};

// limit reviews later
const followQueries = {
  following: async (_: any, args: any, ctx: any) => {
    console.log("here:", ctx.user.id)
    const followings = await connection('Following')
      .select('*')
      .where('following_id', ctx.user.id);

    return followings.map((follow) => ({
      id: follow.id,
      followingID: follow.following_id,
      followerID: follow.follower_id,
    }));
  },
  followers: async (_: any, args: any, ctx: any) => {
    console.log("here:", ctx.user.id)
    const followers = await connection('Following')
      .select('*')
      .where('follower_id', ctx.user.id);

    return followers.map((follow) => ({
      id: follow.id,
      followingID: follow.following_id,
      followerID: follow.follower_id,
    }));
  },
  isFollowing: async (_: any, args: any, ctx: any) => {
    console.log("here:", ctx.user.id)
    const follows = await connection('Following')
      .select('*')
      .where('follower_id', ctx.user.id)
      .where('following_id', args.followID);

    return follows.length != 0;
  },
};

const followMutations = {
  // Prevent duplicate likes being made
  createFollow: async (parent: undefined, args: FollowInput, ctx: any) => {
    console.log(ctx);

    const insertedObject = (
      await connection('Following')
        .insert({
          follower_id: ctx.user.id,
          following_id: args.follow.followingID,
        })
        .returning('*')
    )[0];

    return {
      id: insertedObject.id,
      followerID: insertedObject.follower_id,
      followingID: insertedObject.following_id,
    };
  },
  deleteFollow: async (parent: undefined, args: FollowInput, ctx: any) => {
    console.log(ctx);

    const deletedObject = (
      await connection('Following')
        .where({
          follower_id: ctx.user.id,
          following_id: args.follow.followingID,
        }).delete()
        .returning('*')
    )[0];

    return {
      id: deletedObject.id,
      followerID: deletedObject.follower_id,
      followingID: deletedObject.following_id,
    };
  },
};

export { followQueries, followMutations };
