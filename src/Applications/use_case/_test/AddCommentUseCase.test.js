const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const CommentRepository = require('../../../Domains/comments/CommentsRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating add comment function', async () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'A Comment',
    };

    const params = {
      threadId: 'thread-123',
    };

    const owner = 'johndoe';

    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: 'A Comment',
      owner,
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadIsExistById = jest.fn(() => Promise.resolve());

    mockCommentRepository.addComment = jest.fn(() => Promise.resolve(
      new AddedComment({
        id: payload.id,
        content: payload.content,
        owner,
      }),
    ));

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(
      payload,
      params.threadId,
      owner,
    );

    // Assert
    expect(mockThreadRepository.verifyThreadIsExistById).toBeCalledWith(params.threadId);
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new AddComment({
        content: payload.content,
        threadId: params.threadId,
        owner,
      }),
    );
    expect(addedComment).toStrictEqual(expectedAddedComment);
  });
});