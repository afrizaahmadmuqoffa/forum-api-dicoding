const CommentsTestTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('CommentRepositoryPostgres', () => {
  afterEach( async () => {
    await CommentsTestTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll( async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment and return added comment correctly', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
        const comment = {
          content: 'A Comment',
          owner: 'user-123',
          threadId: 'thread-123',
        };
        const fakeIdGenerator = () => '123';
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
        // Action
        await commentRepositoryPostgres.addComment(comment);
        // Assert
        const foundComment = await CommentsTestTableTestHelper.findCommentById('comment-123');
        expect(foundComment).toHaveLength(1);
        
    });

    it('should throw invariant error when add comment failed', async () => {
        // Arrange
        const comment = {
          content: 'A Comment',
          owner: 'user-123',
    }
    const fakeIdGenerator = () => '123'; 
    const fakePool = {
      query: jest.fn().mockResolvedValue({
        rows: [{}],
      }),
    };
  
    const commentRepositoryPostgres = new CommentRepositoryPostgres(fakePool, fakeIdGenerator);
        // Action & Assert
        await expect(commentRepositoryPostgres.addComment(comment)).rejects.toThrowError(InvariantError);
    });
});

describe('verifyCommentIsExistById function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentIsExistById('comment-123', 'thread-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTestTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentIsExistById('comment-123', 'thread-123'))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw AuthorizationError when comment owner is not the same', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTestTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-456'))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when comment owner is the same', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTestTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123'))
        .resolves.not.toThrowError(AuthorizationError);
  })
});

  describe('deleteCommentById function', () => {
    it('should soft delete comment by id', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTestTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      // Action
      await commentRepositoryPostgres.deleteCommentById('comment-123');
      // Assert
      const deletedComment = await CommentsTestTableTestHelper.findCommentById('comment-123');
      expect(deletedComment[0].is_delete).toBe(true);
    }
    )
  }
);

describe('getCommentsByThreadId function', () => {
  it('should return comments by thread id', async () => {
    // Arrange
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
    await CommentsTestTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123' });
    const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
    // Action
    const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');
    // Assert
    expect(comments).toHaveLength(1);
  });
})
})
