class DeleteReplyUseCase {
  constructor({ repliesRepository }) {
    this._repliesRepository = repliesRepository;
  }

  async execute(replyId, owner, commentId) {
    await this._repliesRepository.verifyReplyIsExistById(replyId, commentId);
    await this._repliesRepository.verifyReplyOwner(replyId, owner);
    await this._repliesRepository.deleteReplyById(replyId);
  }
}

module.exports = DeleteReplyUseCase;
