const AddThread = require('../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, owner) {
    const addThread = new AddThread({ ...useCasePayload, owner });
    return this._threadRepository.addThread(addThread);
  }
}

module.exports = AddThreadUseCase;
