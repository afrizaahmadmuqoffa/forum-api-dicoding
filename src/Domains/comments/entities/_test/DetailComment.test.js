const DetailComment = require('../DetailComment');

describe('DetailComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            id: 'comment-123',
            date: new Date().toISOString(),
            username: 'user-123',
        };

        // Action and Assert
        expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
        }
    )

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            id: 'comment-123',
            content: true,
            date: 123,
            username: 'user-123',
            isDelete: 'false',
            replies: [],
        };

        // Action and Assert
        expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create DetailComment object correctly', () => {
        // Arrange
        const payload = {
            id: 'comment-123',
            content: 'A Comment',
            date: new Date().toISOString(),
            username: 'user-123',
            isDelete: false,
            replies: [],
        };

        // Action
        const { id, content, date, username, isDelete, replies } = new DetailComment(payload);

        // Assert
        expect(id).toEqual(payload.id);
        expect(content).toEqual(payload.content);
        expect(date).toEqual(payload.date);
        expect(username).toEqual(payload.username);
        expect(isDelete).toEqual(payload.isDelete);
        expect(replies).toEqual(payload.replies);
    });
})