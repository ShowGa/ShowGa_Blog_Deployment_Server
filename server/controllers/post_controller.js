import Post from "../models/postModel.js";
import Comment from "../models/commentModel.js";

export const createPost = async (req, res) => {
  if (!req.user.isAdmin) {
    return res
      .status(402)
      .json({ message: "Sorry ! Only admin allow to create post ." });
  }

  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-z0-9-]/g, "");

  const newPost = new Post({
    ...req.body,
    slug,
    belongAuthorID: req.user.id,
  });

  // add _id at the end of slug
  newPost.slug += `-${newPost._id}`;

  try {
    const savedPost = await newPost.save();
    res.status(201).json({ message: "Create post successfully !" });
  } catch (e) {
    console.log("Error in createPost controller !" + e);
    res
      .status(500)
      .json({ error: "Internal server error ! Please contact us ." });
  }
};

export const deletePost = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res
        .status(402)
        .json({ message: "Sorry ! Only admin allow to delete post ." });
    }

    const { postID } = req.params;

    await Promise.all([
      Post.findOneAndDelete({ _id: postID }),
      Comment.deleteMany({ belongPostID: postID }),
    ]);

    return res.status(201).json({ message: "Delete post successfully !" });
  } catch (e) {
    console.log("Error in deletePost controller !" + e);
    res
      .status(500)
      .json({ error: "Internal server error ! Please contact us ." });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const queryContent = req.query;

    const startIndex = parseInt(queryContent.startIndex) || 0;
    const limit = parseInt(queryContent.limit) || 6;
    const sort = queryContent.sort || "createdAt";
    const order = queryContent.order || "desc";

    const foundPost = await Post.find({
      ...(queryContent.category && { category: queryContent.category }),
      ...(queryContent.isFeatured && { isFeatured: queryContent.isFeatured }),
      ...(queryContent.searchTerm && {
        $or: [
          { title: { $regex: queryContent.searchTerm, $options: "i" } },
          { content: { $regex: queryContent.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ [sort]: order })
      .skip(startIndex)
      .limit(limit);

    if (!foundPost) {
      return res.status(400).json({ error: "No post founded !" });
    }

    const totalPosts = await Post.countDocuments({
      ...(queryContent.category && { category: queryContent.category }),
      ...(queryContent.isFeatured && { isFeatured: queryContent.isFeatured }),
      ...(queryContent.searchTerm && {
        $or: [
          { title: { $regex: queryContent.searchTerm, $options: "i" } },
          { content: { $regex: queryContent.searchTerm, $options: "i" } },
        ],
      }),
    });

    // check is there any more post
    const isEnd = startIndex + limit >= totalPosts;

    return res.status(200).json({ foundPost, isEnd });
  } catch (e) {
    console.log("Error in getAllPosts controller !" + e);
    return res.status(500).json({ error: "Internal server error !" });
  }
};

export const getPost = async (req, res) => {
  try {
    const { slug } = req.params;

    // populate username and avatar
    const foundPost = await Post.findOneAndUpdate(
      { slug },
      {
        $inc: { views: 1 },
      },
      { new: true }
    ).populate({
      path: "belongAuthorID",
      select: "username avatar",
    });

    if (!foundPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Calculate number post Comments
    const postComments = await Comment.countDocuments({
      belongPostID: foundPost._id,
    });

    return res.status(200).json({ foundPost, postComments });
  } catch (e) {
    console.log("Error in getPost controller !" + e);
    return res.status(500).json({ error: "Internal server error !" });
  }
};

export const getSidebarPostCard = async (req, res) => {
  try {
    const queryContent = req.query;

    const limit = parseInt(queryContent.limit) || 3;
    const sort = queryContent.sort || "createdAt";
    const order = queryContent.order || "desc";

    // find target field
    const foundPost = await Post.find(
      {
        ...(queryContent.isFeatured && { isFeatured: queryContent.isFeatured }),
      },
      "title banerImg category slug createdAt"
    )
      .sort({ [sort]: order })
      .limit(limit);

    if (!foundPost) {
      return res.status(400).json({ error: "No relevant article found !" });
    }

    return res.status(200).json({ foundPost });
  } catch (e) {
    console.log("Error in getSidebarPost controller !" + e);
    return res.status(500).json({ error: "Internal server error !" });
  }
};

export const getPostAdmin = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res
        .status(402)
        .json({ message: "Sorry ! Only admin allow to create post ." });
    }

    const { postID } = req.params;

    const foundPost = await Post.findOne({ _id: postID });

    if (!foundPost) {
      return res.status(400).json({ error: "Post not found !" });
    }

    return res.status(200).json({ foundPost });
  } catch (e) {
    console.log("Error in getPostAdmin controller !" + e);
    return res.status(500).json({ error: "Internal server error !" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!req.user.isAdmin) {
      return res
        .status(402)
        .json({ message: "Sorry ! Only admin allow to create post ." });
    }

    await Post.findOneAndUpdate({ slug }, { ...req.body });

    return res.status(201).json({ message: "Update post successfully !" });
  } catch (e) {
    console.log("Error in updatePost controller !" + e);
    return res.status(500).json({ error: "Internal server error !" });
  }
};

export const postClickLike = async (req, res) => {
  try {
    const { slug, addLike } = req.body;

    await Post.findOneAndUpdate({ slug }, { $inc: { numOfLikes: addLike } });

    return res.status(201).json({ message: "Click like successfully !" });
  } catch (e) {
    console.log("Error in postClickLike controller !" + e);
    return res.status(500).json({ error: "Internal server error !" });
  }
};
