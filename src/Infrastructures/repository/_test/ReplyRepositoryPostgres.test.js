const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const pool = require('../../database/postgres/pool');
const RepliesRepositoryPostgres = require('../RepliesRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');

describe('RepliesRepositoryPostgres', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist add reply and return added reply correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const reply = {
        content: 'A Reply',
        owner: 'user-123',
        commentId: 'comment-123',
      };
      const fakeIdGenerator = () => '123';
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, fakeIdGenerator);
      // Action
      const addedReply = await repliesRepositoryPostgres.addReply(reply);
      const foundReply = await RepliesTableTestHelper.findReplyById('reply-123');
      // Assert
      expect(addedReply).toStrictEqual(new AddedReply({
        content: 'A Reply',
        owner: 'user-123',
        id: 'reply-123',
      }));

      expect(foundReply).toHaveLength(1);
    });

    it('should throw invariant error when add reply failed', async () => {
      // Arrange
      const reply = {
        content: null,
        owner: 'user-123',
        commentId: 'comment-123',
      };

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const fakeIdGenerator = () => '123';

      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, fakeIdGenerator);
      // Action & Assert
      await expect(repliesRepositoryPostgres.addReply(reply)).rejects.toThrowError(InvariantError);
    });
  });

  describe('verifyReplyIsExistById function', () => {
    it('should throw NotFoundError when reply not found', async () => {
      // Arrange
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(repliesRepositoryPostgres.verifyReplyIsExistById('reply-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when reply found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-123' });

      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(repliesRepositoryPostgres.verifyReplyIsExistById('reply-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw AuthorizationError when reply owner is not the same', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-123' });

      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(repliesRepositoryPostgres.verifyReplyOwner('reply-123', 'user-456')).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when reply owner is the same', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-123' });

      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(repliesRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123')).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteReply function', () => {
    it('should delete reply correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-123' });

      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {});
      // Action
      await repliesRepositoryPostgres.deleteReplyById('reply-123');
      // Assert
      const foundReply = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(foundReply[0].is_delete).toEqual(true);
    });
  });

  describe('getRepliesByCommentId function', () => {
    it('should return replies correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-123' });

      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {});
      // Action
      const replies = await repliesRepositoryPostgres.getReplyByCommentId(['comment-123']);
      // Assert
      expect(replies).toStrictEqual([{
        id: 'reply-123',
        comment_id: 'comment-123',
        content: 'A reply',
        date: '2025-05-11T08:23:45.678Z',
        username: 'dicoding',
        is_delete: false,
      }]);
      expect(replies).toHaveLength(1);
    });
  });
});
