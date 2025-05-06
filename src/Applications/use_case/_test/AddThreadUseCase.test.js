const AddThreadUseCase = require('../AddThreadUseCase');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddThreadUseCase', () => {
    it('should orchestrating the addThread action correctly', async () => {
      // Arrange
      const useCasePayload = {
        title: 'title',
        body: 'body',
      };
  
      const mockAddedThread = new AddedThread({
        id: 'thread-123',
        title: useCasePayload.title,
        owner: 'user-123',
      });
  
      // prepare dependency for use case
      const mockThreadRepository = new ThreadRepository();
  
      // mocking needed function
      mockThreadRepository.addThread = jest.fn()
        .mockImplementation(() => Promise.resolve(mockAddedThread));
  
      // create use case instance
      const addThreadUseCase = new AddThreadUseCase({
        threadRepository : mockThreadRepository,
      });
  
      // Action
      const addedThread = await addThreadUseCase.execute(useCasePayload, mockAddedThread.owner);
  
      // Assert
  
        // assert addedThread use case
      expect(addedThread).toStrictEqual(new AddedThread({
        id: mockAddedThread.id,
        title: mockAddedThread.title,
        owner: mockAddedThread.owner,
      }));
  
        // assert value sent to parameter
      expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
        owner: mockAddedThread.owner,
      }));
    });
  });

