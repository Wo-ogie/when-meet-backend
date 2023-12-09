function getParticipantDataFromSession(req, res, next) {
  const participantData = req.session.participant;
  if (!participantData) {
    const error = new Error('인증 권한이 없습니다.');
    error.status = 401;
    return next(error);
  }
  return participantData;
}

exports.isAuthenticated = (req, res, next) => {
  const participantData = getParticipantDataFromSession(req, res, next);
  if (participantData.meetingId !== req.params.meetingId) {
    const error = new Error('접근 권한이 없습니다.');
    error.status = 401;
    next(error);
    return;
  }
  next();
};

exports.getLoggedInParticipantId = (req, res, next) => {
  const participantData = getParticipantDataFromSession(req, res, next);
  return participantData?.participantId;
};
