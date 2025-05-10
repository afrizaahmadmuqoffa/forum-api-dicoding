class DeleteCommentUseCase {
  constructor({commentRepository}) {
    this._commentRepository = commentRepository;
  }

  async execute(commentId, owner, threadId) {
    await this._commentRepository.verifyCommentIsExistById(commentId, threadId);
    await this._commentRepository.verifyCommentOwner(commentId, owner);
    await this._commentRepository.deleteCommentById(commentId);
  }
}

module.exports = DeleteCommentUseCase;