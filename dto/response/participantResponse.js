class ParticipantResponse {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  static from(participant) {
    return new ParticipantResponse(participant.id, participant.name);
  }
}

module.exports = ParticipantResponse;
