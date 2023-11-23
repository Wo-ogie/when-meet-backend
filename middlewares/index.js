exports.isAuthenticated = (req, res, next) => {
  const participantData = JSON.parse(req.signedCookies.participantData);
  if (!participantData || participantData.meetingId !== req.params.meetingId) {
    const error = new Error('접근 권한이 없습니다.');
    error.status = 401;
    next(error);
    return;
  }
  next();
};
