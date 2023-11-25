const ScheduleResponse = require('./scheduleResponse');

class SchedulesResponse {
  constructor(schedules) {
    this.schedules = schedules;
  }

  static from(schedules) {
    return new SchedulesResponse(
      schedules.map((schedule) => ScheduleResponse.from(schedule)),
    );
  }
}

module.exports = SchedulesResponse;
