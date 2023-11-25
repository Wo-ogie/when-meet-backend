const { Schedule, sequelize } = require('../models');
const { getLoggedInParticipantId } = require('../middlewares/auth');
const SchedulesResponse = require('../dto/response/schedulesResponse');
const { createScheduleAlreadyExistError } = require('../errors/scheduleErrors');

async function createSchedules(participantId, schedules) {
  console.log('participantId', participantId);
  console.log('schedules', schedules);
  return sequelize.transaction(async (transaction) =>
    Promise.all(
      schedules.map(async (availableSchedule) =>
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
}

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
  const { schedules } = req.body;
  try {
    await validateScheduleNotExist(participantId);
    const createdSchedules = await createSchedules(participantId, schedules);
    return res.json(SchedulesResponse.from(createdSchedules));
  } catch (error) {
    return next(error);
  }
};

exports.getMySchedules = async (req, res, next) => {
  const participantId = getLoggedInParticipantId(req, res, next);
  try {
    const mySchedules = await Schedule.findAll({
      where: {
        ParticipantId: participantId,
      },
    });
    return res.json(SchedulesResponse.from(mySchedules));
  } catch (error) {
    return next(error);
  }
};

async function deleteAllByParticipantId(participantId) {
  await Schedule.destroy({
    where: {
      ParticipantId: participantId,
    },
  });
}

exports.updateMySchedules = async (req, res, next) => {
  const participantId = getLoggedInParticipantId(req, res, next);
  const { schedules } = req.body;
  try {
    await deleteAllByParticipantId(participantId);
    const createdSchedules = await createSchedules(participantId, schedules);
    return res.json(SchedulesResponse.from(createdSchedules));
  } catch (error) {
    return next(error);
  }
};
