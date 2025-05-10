const RepliesRepository = require('../../Domains/replies/RepliesRepository');
const InvariantError = require('../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class RepliesRepositoryPostgres extends RepliesRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(addReply) {
    const { commentId, content, owner } = addReply;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5) RETURNING id, owner, content',
      values: [id, content, commentId, owner, date],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Reply gagal ditambahkan');
    }

    return result.rows[0];
  }

  async verifyReplyIsExistById(replyId) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Reply tidak ditemukan');
    }
  }

  async verifyReplyOwner(replyId, owner) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1 AND owner = $2',
      values: [replyId, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async deleteReplyById(replyId) {
    const query = {
      text: 'UPDATE replies SET is_delete = true WHERE id = $1',
      values: [replyId],
    };

    await this._pool.query(query);
  }

  async getReplyByCommentId(commentIds) {
    const query = {
      text: 'SELECT replies.id, replies.comment_id, replies.content, replies.date, users.username, replies.is_delete FROM replies LEFT JOIN users ON users.id = replies.owner WHERE replies.comment_id = ANY($1::text[]) ORDER BY replies.date ASC',
      values: [commentIds],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = RepliesRepositoryPostgres;
