const ParticipantWithSchedulesResponse = require('./participantWithSchedulesResponse');

class MeetingWithParticipantsResponse {
  constructor(
    id,
    title,
    purpose,
    startDate,
    endDate,
    availableVotingStartTime,
    availableVotingEndTime,
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
    this.availableVotingStartTime = availableVotingStartTime;
    this.availableVotingEndTime = availableVotingEndTime;
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
      meeting.availableVotingStartTime,
      meeting.availableVotingEndTime,
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
