const RepliesRepository = require('../../../Domains/replies/RepliesRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {

    it('should orchestrate the delete reply action correctly', async () => {
        // Arrange
        const useCasePayload = {
            replyId: 'reply-123',
            commentId: 'comment-123',
            owner: 'user-123',
        };
        const mockRepliesRepository = new RepliesRepository();

        mockRepliesRepository.verifyReplyIsExistById = jest.fn(() => Promise.resolve());
        mockRepliesRepository.verifyReplyOwner = jest.fn(() => Promise.resolve());
        mockRepliesRepository.deleteReplyById = jest.fn(() => Promise.resolve());

        const deleteReplyUseCase = new DeleteReplyUseCase({
            repliesRepository: mockRepliesRepository,
        });

        // Action
        await deleteReplyUseCase.execute(
            useCasePayload.replyId,
            useCasePayload.owner,
            useCasePayload.commentId,
        );

        // Assert
        expect(mockRepliesRepository.verifyReplyIsExistById).toBeCalledWith(useCasePayload.replyId, useCasePayload.commentId);
        expect(mockRepliesRepository.verifyReplyOwner).toBeCalledWith(useCasePayload.replyId, useCasePayload.owner);
        expect(mockRepliesRepository.deleteReplyById).toBeCalledWith(useCasePayload.replyId);
    });

})
