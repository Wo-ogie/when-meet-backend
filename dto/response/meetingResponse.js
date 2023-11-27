class MeetingResponse {
  constructor(
    id,
    title,
    purpose,
    startDate,
    endDate,
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
      meeting.maxParticipants,
      meeting.voteExpiresAt,
      meeting.isClosed,
      meeting.confirmedTime,
    );
  }
}

module.exports = MeetingResponse;
