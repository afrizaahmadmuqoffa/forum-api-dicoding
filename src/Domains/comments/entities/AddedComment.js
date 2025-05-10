/* eslint-disable class-methods-use-this */
class AddedComment {
  constructor(payload) {
    const { content, owner, id } = payload;
    this._validatePayload(payload);

    this.content = content;
    this.owner = owner;
    this.id = id;
  }

  _validatePayload({ content, owner, id }) {
    if (!content || !owner || !id) {
      throw new Error('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof owner !== 'string' || typeof id !== 'string') {
      throw new Error('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedComment;
