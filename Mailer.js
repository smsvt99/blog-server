const nodemailer = require("nodemailer"),
      User       = require('./model/user'),
      Post       = require('./model/post');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PW,
    },
});

exports.newPost = async function(postUser, post){
    try{
        const users = await User.find({notify: true});
        for (const user of users){
            await transporter.sendMail({
                from: `"Blog Admin" <${process.env.EMAIL}>`,
                to: user.email, 
                subject: `New post by ${postUser.name}`,
                text: `${postUser.name} has written a new post: ${post.title}. You can read it at ${process.env.APP_URL}/post/${post._id}.\n\nThanks!\nBlog Admin`,
            })
        }
    } catch (e) {
        console.log("Unable to notify users of new Post: " + e)
    }
}
exports.newComment = async function(commentUser, comment){
    try{
        const user = await User.findById(comment.user);
        const post = await Post.findById(comment.postId);
        await transporter.sendMail({
            from: `"Blog Admin" <${process.env.EMAIL}>`,
            to: user.email, 
            subject: `${commentUser.name} replied to your post ${post.title}`,
            text: `${commentUser.name} replied to your post ${post.title}\n\n${comment.body}\n\nSee this comment in context at ${process.env.APP_URL}/post/${post._id}.\n\nThanks!\nBlog Admin`,
        })
    } catch (e){
        console.log("Unable to notify author of new comment: " + e)
    }
}