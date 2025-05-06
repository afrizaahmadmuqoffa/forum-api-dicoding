const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class RepliesHandler {
    constructor(container) {
        this._container = container;

        this.postReplyHandler = this.postReplyHandler.bind(this);
        this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
    }

    async postReplyHandler(request, h) {
        const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
        const { threadId, commentId } = request.params;
        const { id: owner } = request.auth.credentials;
        const addedReply = await addReplyUseCase.execute(request.payload, commentId, threadId, owner);

        const response = h.response({
            status: 'success',
            data: {
                addedReply,
            },
        });
        response.code(201);
        return response;
    }

    async deleteReplyHandler(request, h) {
        const { id: owner } = request.auth.credentials;
        const { replyId } = request.params;
        const { commentId } = request.params;

        const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
        await deleteReplyUseCase.execute(replyId, owner, commentId);

        const response = h.response({
            status: 'success',
        });
        response.code(200);
        return response;
    }
}

module.exports = RepliesHandler;