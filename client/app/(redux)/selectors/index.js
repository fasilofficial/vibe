export const selectUser = (userId) => (state) => {
  return { user: state?.data?.users?.find((user) => user?._id === userId) };
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
