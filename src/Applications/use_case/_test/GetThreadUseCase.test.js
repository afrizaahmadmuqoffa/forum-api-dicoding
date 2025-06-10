const GetThreadUseCase = require('../GetThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentsRepository');
const RepliesRepository = require('../../../Domains/replies/RepliesRepository');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const DetailReply = require('../../../Domains/replies/entities/DetailReply');
const LikeRepository = require('../../../Domains/likes/LikeRepository');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };
    const mockThread = {
      id: 'thread-123',
      title: 'title',
      body: 'body',
      date: '2025-05-11T08:23:45.678Z',
      username: 'dicoding',
    };
    const mockComments = [
      {
        id: 'comment-123',
        content: 'content',
        date: '2025-05-11T08:23:45.678Z',
        username: 'dicoding',
        is_delete: false,
      },
      {
        id: 'comment-456',
        content: 'content',
        date: '2025-05-11T08:23:45.678Z',
        username: 'dicoding',
        is_delete: true,
      },
    ];

    const mockReplies = [
      {
        id: 'reply-123',
        content: 'content',
        date: '2025-05-11T08:23:45.678Z',
        username: 'dicoding',
        comment_id: 'comment-123',
        is_delete: false,
      },
      {
        id: 'reply-456',
        content: 'content',
        date: '2025-05-11T08:23:45.678Z',
        username: 'dicoding',
        comment_id: 'comment-456',
        is_delete: true,
      },
    ];

    const expectedDetailThread = new DetailThread({
      id: 'thread-123',
      title: 'title',
      body: 'body',
      date: '2025-05-11T08:23:45.678Z',
      username: 'dicoding',
      comments: [
        new DetailComment({
          id: 'comment-123',
          content: 'content',
          date: '2025-05-11T08:23:45.678Z',
          username: 'dicoding',
          likeCount: 1,
          isDelete: false,
          replies: [
            new DetailReply({
              id: 'reply-123',
              content: 'content',
              date: '2025-05-11T08:23:45.678Z',
              username: 'dicoding',
              isDelete: false,
            }),
          ],
        }),
        new DetailComment({
          id: 'comment-456',
          content: '**komentar telah dihapus**',
          date: '2025-05-11T08:23:45.678Z',
          username: 'dicoding',
          likeCount: 1,
          isDelete: true,
          replies: [],
        }),
      ],
    });
    // prepare dependency for use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockRepliesRepository = new RepliesRepository();
    const mockLikeRepository = new LikeRepository();
    // mocking needed function
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockThreadRepository.verifyThreadIsExistById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComments));
    mockRepliesRepository.getReplyByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockReplies));
    mockLikeRepository.countLikesByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve(1));

    // create use case instance
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      repliesRepository: mockRepliesRepository,
      likeRepository: mockLikeRepository,
    });
    // Action
    const detailThread = await getThreadUseCase.execute(useCasePayload.threadId);
    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.threadId);
    expect(mockThreadRepository.verifyThreadIsExistById).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCasePayload.threadId);
    expect(mockRepliesRepository.getReplyByCommentId).toBeCalledWith([
      mockComments[0].id,
      mockComments[1].id,
    ]);
    expect(mockLikeRepository.countLikesByCommentId).toBeCalledWith(mockComments[0].id);
    expect(detailThread).toEqual(expectedDetailThread);
  });
});
