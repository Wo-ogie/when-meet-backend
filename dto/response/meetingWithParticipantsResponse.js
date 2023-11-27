const ParticipantWithSchedulesResponse = require('./participantWithSchedulesResponse');

class MeetingWithParticipantsResponse {
  constructor(
    id,
    title,
    purpose,
    startDate,
    endDate,
    currentParticipants,
    maxParticipants,
    voteExpiresAt,
    isClosed,
    confirmedTime,
    participants,
  ) {
    this.id = id;
    this.title = title;
    this.purpose = purpose;
    this.startDate = startDate;
    this.endDate = endDate;
    this.currentParticipants = currentParticipants;
    this.maxParticipants = maxParticipants;
    this.voteExpiresAt = voteExpiresAt;
    this.isClosed = isClosed;
    this.confirmedTime = confirmedTime;
    this.participants = participants;
  }

  static from(meeting) {
    return new MeetingWithParticipantsResponse(
      meeting.id,
      meeting.title,
      meeting.purpose,
      meeting.startDate,
      meeting.endDate,
      meeting.currentParticipants,
      meeting.maxParticipants,
      meeting.voteExpiresAt,
      meeting.isClosed,
      meeting.confirmedTime,
      meeting.Participants.map((participant) =>
        ParticipantWithSchedulesResponse.from(participant),
      ),
    );
  }
}

module.exports = MeetingWithParticipantsResponse;
