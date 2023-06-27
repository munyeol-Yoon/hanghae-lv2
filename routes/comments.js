const express = require('express');
const router = express.Router();
const Comments = require('../schemas/comment');
const Posts = require('../schemas/post');
const authMiddleware = require('../middlewares/auth-middleware');

// 댓글 생성하기
router.post('/:postId/comments', authMiddleware, async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId, nickname } = res.locals.user;
        const { commentContent } = req.body;
        const post = await Posts.findOne({ _id: postId });
        // 댓글을 작성할 게시글이 존재하지 않는 경우
        if (!post) {
            return res.status(404).json({ errorMessage: '게시글이 존재하지 않습니다.' });
        }
        await Comments.create({ postId, userId, nickname, commentContent });
        res.status(201).json({ message: '댓글을 생성하였습니다.' });
    } catch (err) {
        // body 데이터가 정상적으로 전달되지 않는 경우
        if (!req.body.commentContent) {
            return res.status(412).json({ message: '데이터 형식이 올바르지 않습니다.' });
        }
        res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
        console.log(err);
    }
});

// 댓글 전체 가져오기
router.get('/:postId/comments', async (req, res) => {
    try {
        // 게시판 하나의 댓글 전체를 가져오기 때문에, postid를 넣어줘야한다.
        const { postId } = req.params;
        const findCommentsList = await Comments.find({ postId: postId });
        const post = await Posts.findOne({ _id: postId });
        // 댓글을 작성할 게시글이 존재하지 않는 경우
        if (!post) {
            return res.status(404).json({ errorMessage: '게시글이 존재하지 않습니다.' });
        }

        // 빈 배열 생성
        const commentsList = findCommentsList.map((list) => {
            return {
                commentId: list['_id'],
                userId: list['userId'],
                nickname: list['nickname'],
                commentContent: list['commentContent'],
                createdAt: list['createdAt'],
                updatedAt: list['updatedAt'],
            };
        });
        res.status(200).json({ data: commentsList });
    } catch (err) {
        res.status(400).json({ errorMessage: '댓글 조회에 실패하였습니다.' });
        console.log(err);
    }
});

// 댓글 수정하기
router.put('/:postId/comments/:commentId', authMiddleware, async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const { userId } = res.locals.user;
        const { commentContent } = req.body;

        const post = await Posts.findOne({ _id: postId });
        const comment = await Comments.findOne({ _id: commentId });

        // 댓글이 존재하지 않을 경우
        if (!comment) {
            return res.status(404).json({ errorMessage: '댓글이 존재하지 않습니다.' });
        }
        // 댓글을 작성할 게시글이 존재하지 않는 경우
        if (!post) {
            return res.status(404).json({ errorMessage: '게시글이 존재하지 않습니다.' });
        }
        // 댓글 수정 권한이 존재하지 않는 경우
        if (userId !== comment.userId) {
            return res.status(403).json({ errorMessage: '댓글 수정의 권한이 존재하지 않습니다.' });
        }

        const updateComment = await Comments.updateOne(
            { _id: commentId, postId },
            { $set: { commentContent, updatedAt: Date.now() } }
        );
        // 댓글 수정에 실패한 경우
        if (!updateComment) {
            return res.status(400).json({ errorMessage: '댓글 수정이 정상적으로 처리되지 않았습니다. ' });
        }

        res.status(201).json({ message: '댓글을 수정하였습니다.' });
    } catch (err) {
        // body 데이터가 정상적으로 전달되지 않은 경우
        if (!req.body.commentContent) {
            return res.status(412).json({ message: '데이터 형식이 올바르지 않습니다.' });
        }
        res.status(400).json({ message: '댓글 수정에 실패하였습니다.' });
        console.log(err);
    }
});

// 댓글 지우기
router.delete('/:postId/comments/:commentId', authMiddleware, async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const { userId } = res.locals.user;

        const post = await Posts.findOne({ _id: postId });
        const comment = await Comments.findOne({ _id: commentId });
        // 댓글을 작성할 게시글이 존재하지 않는 경우
        if (!post) {
            return res.status(404).json({ errorMessage: '게시글이 존재하지 않습니다.' });
        }
        // 댓글이 존재하지 않을 경우
        if (!comment) {
            return res.status(404).json({ errorMessage: '댓글이 존재하지 않습니다.' });
        }
        // 댓글의 삭제 권한이 존재하지 않는 경우
        if (userId !== comment.userId) {
            return res.status(403).json({ errorMessage: '댓글 수정의 권한이 존재하지 않습니다.' });
        }

        const deleteComment = await Comments.deleteOne({ _id: commentId, postId });
        // 댓글 삭제에 실패한 경우
        if (!deleteComment) {
            return res.status(400).json({ errorMessage: '댓글 삭제가 정상적으로 처리되지 않았습니다. ' });
        }
        res.status(201).json({ message: '댓글을 삭제하었습니다.' });
    } catch (err) {
        res.status(404).json({ message: '댓글 삭제에 실패하였습니다.' });
        console.log(err);
    }
});

module.exports = router;
