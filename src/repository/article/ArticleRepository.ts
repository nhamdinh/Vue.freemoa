import Repository from './../Repository'
import { authHeader } from './../authHeader'

export default {
    getArticleList(payload: any) {
        return Repository.post(`/article/get-list`, payload, { headers: authHeader() })
    },
    getArticleById(payload: any) {
        return Repository.post(`/article/get-detail?articleId=${payload.articleId}&nextId=${payload.nextId ?? -1}&previousId=${payload.previousId ?? -1}`, payload, { headers: authHeader() })
    },
    deleteArticleById(payload: any) {
        return Repository.delete(`/article/delete?id=${payload.articleId}`, { headers: authHeader() })
    },
    likeDislikeArticle(payload: any) {
        return Repository.put(`/article/like-dislike?articleId=${payload.articleId}`, payload, { headers: authHeader() })
    },
    getCommentById(payload: any) {
        return Repository.post(`/article/reply-comment/get-by?articleCommentId=${payload.articleCommentId}`, payload, { headers: authHeader() })
    },
    createArticleComment(payload: any) {
        return Repository.post(`/article/article-comment/save`, payload, { headers: authHeader() })
    },
    createReplyComment(payload: any) {
        return Repository.post(`/article/reply-comment/save`, payload, { headers: authHeader() })
    },
    getUsersLike(payload: any) {
        return Repository.get(`/article/get-all/user-like?articleId=${payload.articleId}`, { headers: authHeader() })
    },
    createPost(payload: any) {
        return Repository.post(`/article/register`, payload, { headers: authHeader() })
    },
    updatePost(payload: any) {
        return Repository.post(`/article/edit`, payload, { headers: authHeader() })
    },
    deleteCommentArticleById(payload: any) {
        return Repository.delete(`/article/article-comment/delete?id=${payload?.id}`, { headers: authHeader() })
    },
    deleteReplyCommentById(payload: any) {
        return Repository.delete(`/article/reply-comment/delete?id=${payload?.id}`, { headers: authHeader() })
    },
}
