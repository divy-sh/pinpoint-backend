import model from "../models/PostModel.js";
export const createPost = (post) => {
    delete post._id
    return model.create(post);
}
export const findAllPosts = (page, size) => model.find().sort({date: -1}).skip((page - 1) * size).limit(size);
export const findPostByUser = (userid) => model.find({ userid: userid }).sort({date: -1});
export const getPostById = (postId) => model.findById(postId).sort({date: -1});
export const updatePost = (postId, post) => model.updateOne({ _id: postId }, { $set: post });
export const deletePost = (postId) => model.deleteOne({ _id: postId });
export const findPostOfFollowing = async (userids) => {
    const query = { userid: { $in: userids } };
    return await model.find(query).sort({date: -1})
        .then(docs => {
            return docs
        })
        .catch(err => {
            return []
        });
}
export const searchPosts = async (searchTerm) => {
    const query = {
        $or: [
            { 'options.1': { $regex: new RegExp(`.*${searchTerm}.*`, 'i') } },
            { 'options.2': { $regex: new RegExp(`.*${searchTerm}.*`, 'i') } },
            { 'options.3': { $regex: new RegExp(`.*${searchTerm}.*`, 'i') } },
            { 'options.4': { $regex: new RegExp(`.*${searchTerm}.*`, 'i') } },
            { 'options.5': { $regex: new RegExp(`.*${searchTerm}.*`, 'i') } }
        ]
    }
    return await model.find(query).limit(10).sort({date: -1})
        .then(docs => {
            return docs
        })
        .catch(err => {
            return []
        });
}

export const getPostsVotedByUser = async (userid) => {
    try {
      const posts = await model.find({ [`votes.${userid}`]: { $exists: true } }).sort({date: -1});
      return posts;
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  };