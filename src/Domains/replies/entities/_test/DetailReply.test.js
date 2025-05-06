const DetailReply = require('../DetailReply');

describe('DetailReply entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            content: 'A Reply',
            id: 'reply-123',
            username: 'user-123',
        };

        // Action and Assert
        expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            content: 'A Reply',
            id: 123,
            date: new Date().toISOString(),
            username: 'user-123',
            isDelete: false,
        };

        // Action and Assert
        expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create DetailReply object correctly', () => {
        // Arrange
        const payload = {
            id: 'reply-123',
            content: 'A Reply',
            date: new Date().toISOString(),
            username: 'user-123',
            isDelete: false,
        };

        // Action
        const { content, id, date, username, isDelete } = new DetailReply(payload);

        // Assert
        expect(content).toEqual(payload.content);
        expect(id).toEqual(payload.id);
        expect(date).toEqual(payload.date);
        expect(username).toEqual(payload.username);
        expect(isDelete).toEqual(payload.isDelete);
    });
})