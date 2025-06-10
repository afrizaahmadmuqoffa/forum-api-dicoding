const LikeCommentUseCase = require('../LikeCommentUseCase');
const CommentsRepository = require('../../../Domains/comments/CommentsRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');

describe('LikeCommentUseCase', () => {
  it('should orchestrate the like comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    };
    const mockCommentsRepository = new CommentsRepository();
    const mockLikeRepository = new LikeRepository();

    mockCommentsRepository.verifyCommentIsExistById = jest.fn(() => Promise.resolve());
    mockLikeRepository.isCommentLikedByUser = jest.fn(() => Promise.resolve(false));
    mockLikeRepository.addLike = jest.fn(() => Promise.resolve());
    mockLikeRepository.removeLike = jest.fn(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      commentRepository: mockCommentsRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await likeCommentUseCase.execute(
      useCasePayload.commentId,
      useCasePayload.owner,
      useCasePayload.threadId,
    );

    // Assert
    expect(mockCommentsRepository.verifyCommentIsExistById).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.threadId,
    );
    expect(mockLikeRepository.isCommentLikedByUser).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.owner,
    );
    expect(mockLikeRepository.addLike).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.owner,
    );
    expect(mockLikeRepository.removeLike).not.toBeCalled();
  });

  it('should orchestrate the unlike comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    };
    const mockCommentsRepository = new CommentsRepository();
    const mockLikeRepository = new LikeRepository();
    mockCommentsRepository.verifyCommentIsExistById = jest.fn(() => Promise.resolve());
    mockLikeRepository.isCommentLikedByUser = jest.fn(() => Promise.resolve(true));
    mockLikeRepository.removeLike = jest.fn(() => Promise.resolve());
    mockLikeRepository.addLike = jest.fn(() => Promise.resolve());
    const likeCommentUseCase = new LikeCommentUseCase({
      commentRepository: mockCommentsRepository,
      likeRepository: mockLikeRepository,
    });
    // Action
    await likeCommentUseCase.execute(
      useCasePayload.commentId,
      useCasePayload.owner,
      useCasePayload.threadId,
    );
    // Assert
    expect(mockCommentsRepository.verifyCommentIsExistById).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.threadId,
    );
    expect(mockLikeRepository.removeLike).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.owner,
    );
    expect(mockLikeRepository.isCommentLikedByUser).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.owner,
    );
    expect(mockLikeRepository.addLike).not.toBeCalled();
  });
});
