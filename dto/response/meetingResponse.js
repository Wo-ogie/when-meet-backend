class MeetingResponse {
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
  }

  static from(meeting) {
    return new MeetingResponse(
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
    );
  }
}

module.exports = MeetingResponse;
