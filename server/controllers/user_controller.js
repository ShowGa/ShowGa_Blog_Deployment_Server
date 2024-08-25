import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import Comment from "../models/commentModel.js";

export const updateUser = async (req, res) => {
  try {
    const bodyData = req.body;
    const { userId } = req.params;

    if (req.user.id !== userId) {
      return res.status(400).json({ error: "You Sneaky peeky !" });
    }

    // check if update profile data duplicate
    const checkedUser = await User.find({ username: bodyData.username });

    if (checkedUser && checkedUser.length !== 0) {
      return res.status(400).json({
        error: "Username had been used ! Please change another one .",
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        ...(bodyData.username && { username: bodyData.username }),
        ...(bodyData.email && { email: bodyData.email }),
        ...(bodyData.avatar && { avatar: bodyData.avatar }),
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(400).json({ error: "User not found !" });
    }

    return res.status(201).json({ updatedUser });
  } catch (e) {
    console.log("Error in updateUser controller !" + e);
    return res.status(500).json({ error: "Internal server error !" });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.id !== userId) {
      return res.status(400).json({ error: "You Sneaky peeky !" });
    }

    // delete user , posts , comments(later)
    await Promise.all([
      User.findOneAndDelete({ _id: userId }),
      Post.deleteMany({ belongAuthorID: userId }),
      Comment.deleteMany({ belongUserID: userId }),
    ]);

    res.clearCookie("jwt");
    return res.status(201).json({ message: "User Deleted successfully !" });
  } catch (e) {
    console.log("Error in deleteUser route !" + e);
    res.status(500).json({ error: "Internal server error" });
  }
};
