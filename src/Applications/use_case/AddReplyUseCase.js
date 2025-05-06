const AddReply = require('../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
    constructor({ repliesRepository, commentRepository }) {
        this._repliesRepository = repliesRepository;
        this._commentRepository = commentRepository;
    }
    
    async execute(useCasePayload, commentId, threadId, owner) {
        await this._commentRepository.verifyCommentIsExistById(commentId, threadId);
        const addReply = new AddReply({ ...useCasePayload, commentId, owner });
        return this._repliesRepository.addReply(addReply);
    }
}

module.exports = AddReplyUseCase;