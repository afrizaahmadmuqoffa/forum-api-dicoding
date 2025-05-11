const DetailThread = require('../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../Domains/comments/entities/DetailComment');
const DetailReply = require('../../Domains/replies/entities/DetailReply');

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, repliesRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._repliesRepository = repliesRepository;
  }

  async execute(threadId) {
    await this._threadRepository.verifyThreadIsExistById(threadId);
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);
    const commentIds = comments.map((comment) => comment.id);
    const replies = await this._repliesRepository.getReplyByCommentId(commentIds);

    const processedComments = comments.map((comment) => {
      const filteredReplies = replies
        .filter((reply) => reply.comment_id === comment.id)
        .map(({
          id, content, date, username, is_delete,
        }) => new DetailReply({
          id,
          content,
          date,
          username,
          isDelete: is_delete,
        }));

      return new DetailComment({
        id: comment.id,
        content: comment.content,
        date: comment.date,
        username: comment.username,
        isDelete: comment.is_delete,
        replies: filteredReplies,
      });
    });

    // 5. Kembalikan DetailThread
    const detailThread = new DetailThread({
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.date,
      username: thread.username,
      comments: processedComments,
    });
    return JSON.parse(JSON.stringify(detailThread));
  }
}

module.exports = GetThreadUseCase;
