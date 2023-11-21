class ScheduleResponse {
  constructor(availableDate, availableTimes) {
    this.availableDate = availableDate;
    this.availableTimes = availableTimes;
  }

  static from(schedule) {
    return new ScheduleResponse(
      schedule.availableDate,
      schedule.availableTimes,
    );
  }
}

module.exports = ScheduleResponse;
