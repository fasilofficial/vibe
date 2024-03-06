export const selectUser = (userId) => (state) => {
  return {
    user: state?.data?.users?.find(
      (user) => user?._id?._id === userId || user?._id === userId
    ),
  };
};

export const selectPosts = (userId) => (state) => {
  return {
    posts: state?.data?.posts?.filter(
      (post) => post?.creator?._id === userId || post?.creator === userId
    ),
  };
};

export const selectChats = (senderId, receiverId) => (state) => {
  return {
    chats: state?.data?.chats?.filter(
      (chat) =>
        (chat?.sender?._id === senderId &&
          chat?.receiver?._id === receiverId) ||
        (chat?.sender?._id === receiverId && chat?.receiver?._id === senderId)
    ),
  };
};

export const selectSuggestions = (user) => (state) => {
  const userId = user?._id;
  const userFollowingIds = user?.followings.map(
    (following) => following?._id?._id || following?._id
  );
  const userFollowerIds = user?.followers.map(
    (follower) => follower?._id?._id || follower?._id
  );
  return {
    suggestions: state?.data?.users.filter(
      (user) =>
        !userFollowerIds.includes(user._id) && // filter out followers
        !userFollowingIds.includes(user._id) && // folter out followings
        user._id !== userId // filter out the user
    ),
  };
};
