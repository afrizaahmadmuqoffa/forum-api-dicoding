const AddedReply = require('../AddedReply');

describe('AddedReply entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            content: 'A Reply',
            owner: 'user-123',
        };

        // Action and Assert
        expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            content: 'A Reply',
            id: 123,
            owner: 'user-123',
        };

        // Action and Assert
        expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create AddedReply object correctly', () => {
        // Arrange
        const payload = {
            content: 'A Reply',
            id: 'reply-123',
            owner: 'user-123',
        };

        // Action
        const { content, id, owner } = new AddedReply(payload);

        // Assert
        expect(content).toEqual(payload.content);
        expect(id).toEqual(payload.id);
        expect(owner).toEqual(payload.owner);
    });
})