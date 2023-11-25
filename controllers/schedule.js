const { Schedule, sequelize } = require('../models');
const { getLoggedInParticipantId } = require('../middlewares/auth');
const SchedulesResponse = require('../dto/response/schedulesResponse');
const { createScheduleAlreadyExistError } = require('../errors/scheduleErrors');

async function validateScheduleNotExist(participantId) {
  const numOfSchedules = await Schedule.count({
    where: {
      ParticipantId: participantId,
    },
  });
  if (numOfSchedules > 0) {
    throw createScheduleAlreadyExistError();
  }
}

exports.createMySchedules = async (req, res, next) => {
  const participantId = getLoggedInParticipantId(req, res, next);
  const { availableSchedules } = req.body;
  try {
    await validateScheduleNotExist(participantId);

    const schedules = await sequelize.transaction(async (transaction) =>
      Promise.all(
        availableSchedules.map((availableSchedule) =>
          Schedule.create(
            {
              availableDate: availableSchedule.availableDate,
              availableTimes: availableSchedule.availableTimes,
              ParticipantId: participantId,
            },
            { transaction },
          ),
        ),
      ),
    );
    return res.json(SchedulesResponse.from(schedules));
  } catch (error) {
    return next(error);
  }
};
