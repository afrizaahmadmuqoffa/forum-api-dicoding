const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentsRepository');

describe('DeleteCommentUseCase', () => {
  it('should orchestrate the delete comment action correctly', async () => {
  // Arrange
    const useCasePayload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    };
    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.verifyCommentIsExistById = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = jest.fn(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(
      useCasePayload.commentId,
      useCasePayload.owner,
      useCasePayload.threadId,
    );

    // Assert
    expect(
      mockCommentRepository.verifyCommentIsExistById,
    ).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.threadId,
    );
    expect(
      mockCommentRepository.verifyCommentOwner,
    ).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.owner,
    );
    expect(mockCommentRepository.deleteCommentById).toBeCalledWith(useCasePayload.commentId);
  });
});
