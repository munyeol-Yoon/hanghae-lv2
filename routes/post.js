const express = require('express');
const router = express.Router();
const Posts = require('../schemas/post');
const authMiddleware = require('../middlewares/auth-middleware');

// 게시판 생성하기
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { postTitle, postContent } = req.body;
        const { userId, nickname } = res.locals.user;

        //Error 예외처리
        if (!req.body) {
            return res.status(412).json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
        }
        if (!postTitle) {
            return res.status(412).json({ errorMessage: '게시글 제목의 형식이 일치하지 않습니다.' });
        }
        if (!postContent) {
            return res.status(412).json({ errorMessage: '게시글 내용의 형식이 일치하지 않습니다.' });
        }

        await Posts.create({ userId, nickname, postTitle, postContent });
        res.status(201).json({ message: '게시글을 생성하였습니다.' });
    } catch (err) {
        // body 데이터가 정상적으로 전달되지 않는 경우
        if (!req.body.postTitle || !req.body.postContent) {
            return res.status(412).json({ message: '데이터 형식이 올바르지 않습니다.' });
        }
        res.status(400).json({ errorMessage: '게시글 작성에 실패하였습니다.' });
        console.log(err);
    }
});

// 게시판 전체 가져오기 (수정 완료)
router.get('/', async (req, res) => {
    try {
        const findPosts = await Posts.find({});
        const postList = findPosts.map((post) => {
            return {
                postId: post['_id'],
                userId: post['userId'],
                nickname: post['nickname'],
                title: post['postTitle'],
                createdAt: post['createdAt'],
                updatedAt: post['updatedAt'],
            };
        });
        res.status(200).json({ posts: postList });
    } catch (err) {
        res.status(400).json({ errorMessage: '게시글 조회에 실패하였습니다. ' });
        console.log(err);
    }
});

// 게시판 하나 가져오기
router.get('/:postId', async (req, res) => {
    try {
        const { postId } = req.params;
        const findPost = await Posts.findOne({ _id: postId });
        const post = {
            postId: findPost['_id'],
            userId: findPost['userId'],
            nickname: findPost['nickname'],
            postTitle: findPost['postTitle'],
            postContent: findPost['postContent'],
            createdAt: findPost['createdAt'],
            updatedAt: findPost['updatedAt'],
        };
        res.status(200).json({ post: post });
    } catch (err) {
        res.status(400).json({ errorMessage: '게시글 조회에 실패했습니다.' });
        console.log(err);
    }
});

// 게시판 수정하기
router.put('/:postId', authMiddleware, async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId } = res.locals.user;
        const { postTitle, postContent } = req.body;

        const post = await Posts.findOne({ _id: postId });

        // title 의 형식이 비정상인 경우
        if (!postTitle) {
            return res.status(412).json({ errorMessage: '게시글 제목의 형식이 일치하지 않습니다.' });
        }

        // content 의 형식이 비정상인 경우
        if (!postContent) {
            return res.status(412).json({ errorMessage: '게시글 내용의 형식이 일치하지 않습니다. ' });
        }

        // 게시글 수정 권한이 존재하지 않는 경우
        if (userId !== post.userId) {
            return res.status(403).json({ errorMessage: '게시글 수정의 권한이 존재하지 않습니다.' });
        }

        const updatePost = await Posts.updateOne(
            { _id: postId },
            { $set: { postTitle, postContent, updatedAt: Date.now() } }
        );
        // 게시글 수정이 실패한 경우
        if (!updatePost) {
            return res.status(401).json({ errorMessage: '게시글 수정에 실패하였습니다. ' });
        }

        res.status(201).json({ message: '게시글을 수정하였습니다.' });
    } catch (err) {
        // body 데이터가 정상적으로 전달되지 않는 경우
        if (!req.body.postTitle || !req.body.postContent) {
            return res.status(412).json({ message: '데이터 형식이 올바르지 않습니다.' });
        }
        res.status(400).json({ errorMessage: '게시글 수정에 실패하였습니다.' });
        console.log(err);
    }
});

// 게시판 지우기
router.delete('/:postId', authMiddleware, async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId } = res.locals.user;
        const post = await Posts.findOne({ _id: postId });

        // 게시글이 존재하지 않는 경우
        if (!post) {
            return res.status(404).json({ errorMessage: '게시글이 존재하지 않습니다.' });
        }
        // 게시글 삭제 권한이 존재하지 않는 경우
        if (userId !== post.userId) {
            return res.status(403).json({ errorMessage: '게시글 삭제 권한이 존재하지 않습니다.' });
        }

        const deletePost = await Posts.deleteOne({ _id: postId });
        // 게시글 삭제에 실패한 경우
        if (!deletePost) {
            res.status(401).json({ errorMessage: '게시글이 정상적으로 삭제되지 않았습니다.' });
        }

        res.status(201).json({ message: '게시글을 삭제되었습니다.' });
    } catch (err) {
        res.status(404).json({ errorMessage: '게시글 삭제에 실패하였습니다.' });
        console.log(err);
    }
});

module.exports = router;
