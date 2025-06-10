class LikeCommentUseCase {
  constructor({ commentRepository, likeRepository }) {
    this.commentRepository = commentRepository;
    this.likeRepository = likeRepository;
  }

  async execute(commentId, owner, threadId) {
    await this.commentRepository.verifyCommentIsExistById(commentId, threadId);

    const isLiked = await this.likeRepository.isCommentLikedByUser(commentId, owner);

    // Call the repository method to like the comment
    if (isLiked) {
      await this.likeRepository.removeLike(commentId, owner);
    } else {
      await this.likeRepository.addLike(commentId, owner);
    }
  }
}

module.exports = LikeCommentUseCase;
