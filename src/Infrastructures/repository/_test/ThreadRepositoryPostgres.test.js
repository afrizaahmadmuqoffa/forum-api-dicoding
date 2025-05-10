const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const pool = require('../../database/postgres/pool');
const comments = require('../../../Interfaces/http/api/comments');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should throw InvariantError when add thread failed', async () => {
      // Arrange
      const thread = new AddThread({
        title: 'A Thread',
        body: 'A body',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const pool = {
        query: jest.fn().mockResolvedValue({
          rows: [{}],
        }),
      };
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(threadRepositoryPostgres.addThread(thread))
        .rejects.toThrowError(InvariantError);
    });

    it('should persist add thread and return added thread correctly', async () => {

      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      const thread = new AddThread({
        title: 'A Thread',
        body: 'A body',
        owner: 'user-123',
      });
      
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);


      await threadRepositoryPostgres.addThread(thread);

      const foundThread = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(foundThread).toHaveLength(1);
    });
  });
  
  describe('verifyThreadIsExistById function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      expect(() => threadRepositoryPostgres.verifyThreadIsExistById('thread-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread is found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadIsExistById('thread-123'))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('getThreadById function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      expect(() => threadRepositoryPostgres.getThreadById('thread-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should return thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepositoryPostgres.getThreadById('thread-123');
      // Assert
      expect(thread).toStrictEqual({
        id: 'thread-123',
        title: 'A Thread',
        body: 'A Thread Body',
        date: expect.any(String),
        username: 'dicoding',
      });
    });
  });
});