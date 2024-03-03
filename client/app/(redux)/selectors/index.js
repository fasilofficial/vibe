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
