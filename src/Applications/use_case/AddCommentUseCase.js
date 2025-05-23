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

    return this._commentRepository.addComment(comment);
  }
}

module.exports = AddCommentUseCase;
