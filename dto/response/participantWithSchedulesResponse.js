const ScheduleResponse = require('./scheduleResponse');

class ParticipantWithSchedulesResponse {
  constructor(id, name, availableSchedules) {
    this.id = id;
    this.name = name;
    this.availableSchedules = availableSchedules;
  }

  static from(participant) {
    return new ParticipantWithSchedulesResponse(
      participant.id,
      participant.name,
      participant.Schedules.map((schedule) => ScheduleResponse.from(schedule)),
    );
  }
}

module.exports = ParticipantWithSchedulesResponse;
