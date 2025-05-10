const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AuthenticationTestHelper = require('../../../../tests/AuthenticationsTestHelper');

describe('/threads/{threadId}/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });
  afterEach(async () => {
    await CommentTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 401 when no access token provided', async () => {
      // Arrange
      const server = await createServer(container);

      const threadId = 'thread-123';
      const requestPayload = {
        content: 'A comment',
      };

      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });

      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner: 'user-123',
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const server = await createServer(container);
      const threadId = 'thread-123';
      const { accessToken } = await AuthenticationTestHelper.getAccessTokenHelper(server);
      const requestPayload = {};

      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });

      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner: 'user-123',
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat comment baru karena tidak mengandung properti yang dibutuhkan',
      );
    });

    it('should response 400 when request payload not meet data specifications', async () => {
      // Arrange
      const server = await createServer(container);
      const threadId = 'thread-123';
      const { accessToken } = await AuthenticationTestHelper.getAccessTokenHelper(server);
      const requestPayload = {
        content: 123,
      };

      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });

      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner: 'user-123',
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena spesifikasi tipe data tidak sesuai');
    });

    it('should response 201 and added comment', async () => {
      // Arrange
      const server = await createServer(container);
      const threadId = 'thread-123';
      const { accessToken } = await AuthenticationTestHelper.getAccessTokenHelper(server);
      const requestPayload = {
        content: 'A comment',
      };

      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });

      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner: 'user-123',
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
      expect(responseJson.data.addedComment.id).toBeDefined();
      expect(responseJson.data.addedComment.content).toBeDefined();
      expect(responseJson.data.addedComment.owner).toBeDefined();
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 401 when no access token provided', async () => {
      // Arrange
      const server = await createServer(container);
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 when comment or thread are not found', async () => {
      // Arrange
      const server = await createServer(container);
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const { accessToken } = await AuthenticationTestHelper.getAccessTokenHelper(server);

      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });

    it('should response 403 when no access to delete the comment', async () => {
      // Arrange
      const server = await createServer(container);
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const { accessToken } = await AuthenticationTestHelper.getAccessTokenHelper(server);

      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });

      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner: 'user-123',
      });

      await CommentTableTestHelper.addComment({
        id: commentId,
        owner: 'user-123',
      });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Anda tidak berhak mengakses resource ini');
    });

    it('should response 200 when delete comment correctly', async () => {
      // Arrange
      const server = await createServer(container);
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const { accessToken, userId } = await AuthenticationTestHelper.getAccessTokenHelper(server);

      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner: userId,
      });

      await CommentTableTestHelper.addComment({
        id: commentId,
        owner: userId,
      });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
