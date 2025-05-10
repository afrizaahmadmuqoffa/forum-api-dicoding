const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const RepliesRepository = require('../../../Domains/replies/RepliesRepository');
const CommentsRepository = require('../../../Domains/comments/CommentsRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should orchestrating add reply function', async () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'A Reply',
    };

    const params = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const owner = 'johndoe';

    const expectedAddedReply = new AddedReply({
      id: 'reply-123',
      content: 'A Reply',
      owner,
    });

    const mockRepliesRepository = new RepliesRepository();
    const mockCommentsRepository = new CommentsRepository();

    mockCommentsRepository.verifyCommentIsExistById = jest.fn(() => Promise.resolve());

    mockRepliesRepository.addReply = jest.fn(() => Promise.resolve(
      new AddedReply({
        id: payload.id,
        content: payload.content,
        owner,
      }),
    ));

    const addReplyUseCase = new AddReplyUseCase({
      repliesRepository: mockRepliesRepository,
      commentRepository: mockCommentsRepository,
    });

    // Action
    const addedReply = await addReplyUseCase.execute(
      payload,
      params.commentId,
      params.threadId,
      owner,
    );

    // Assert
    expect(
      mockCommentsRepository.verifyCommentIsExistById,
    ).toBeCalledWith(params.commentId, params.threadId);
    expect(mockRepliesRepository.addReply).toBeCalledWith(
      new AddReply({
        content: payload.content,
        commentId: params.commentId,
        owner,
      }),
    );
    expect(addedReply).toStrictEqual(expectedAddedReply);
  });
});
