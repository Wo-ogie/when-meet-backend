exports.getMeetingNotFoundError = () => {
  const error = new Error('일치하는 약속을 찾을 수 없습니다.');
  error.status = 404;
  return error;
};

exports.getMeetingIsAlreadyClosedError = () => {
  const error = new Error('이미 닫힌 약속입니다.');
  error.status = 409;
  return error;
};

exports.getAdminPasswordNotMatchedError = () => {
  const error = new Error('약속 관리 비밀번호가 일치하지 않습니다.');
  error.status = 401;
  return error;
};
