/* eslint-disable class-methods-use-this */
class DetailReply {
  constructor(payload) {
    this._verifyPayload(payload);
    const {
      id, content, date, username, isDelete,
    } = payload;
    this.id = id;
    this.content = isDelete ? '**balasan telah dihapus**' : content;
    this.username = username;
    this.date = date;
    this.isDelete = isDelete;
  }

  _verifyPayload({
    id, content, date, username, isDelete,
  }) {
    if (!id || !content || !username || !date || isDelete === undefined) {
      throw new Error('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof username !== 'string' || typeof date !== 'string' || typeof isDelete !== 'boolean') {
      throw new Error('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailReply;
