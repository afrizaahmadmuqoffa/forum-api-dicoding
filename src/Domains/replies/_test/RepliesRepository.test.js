const RepliesRepository = require('../RepliesRepository');

describe('RepliesRepository interface', () => {
    it('should throw error when invoke abstract behaviour', async () => {
        const repliesRepository = new RepliesRepository();

        await expect(repliesRepository.addReply({})).rejects.toThrowError(
            'REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED',
        );
        await expect(repliesRepository.verifyReplyIsExistById('')).rejects.toThrowError(
            'REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED',
        );
        await expect(repliesRepository.deleteReplyById('')).rejects.toThrowError(
            'REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED',
        );
        await expect(repliesRepository.verifyReplyOwner('', '')).rejects.toThrowError(
            'REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED',
        );
        await expect(repliesRepository.getReplyByCommentId('')).rejects.toThrowError(
            'REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED',
        );
    });
})