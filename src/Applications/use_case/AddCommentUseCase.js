const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, threadId, owner) {
    await this._threadRepository.verifyThreadIsExistById(threadId);
    const comment = new AddComment({
      ...useCasePayload,
      threadId,
      owner,
    });

    const addedComment = await this._commentRepository.addComment(comment);
    return addedComment;
  }
}

module.exports = AddCommentUseCase;
