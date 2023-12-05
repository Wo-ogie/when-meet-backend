exports.createMeetingNotFoundError = () => {
  const error = new Error('일치하는 약속을 찾을 수 없습니다.');
  error.status = 404;
  return error;
};

exports.createMeetingIsAlreadyClosedError = () => {
  const error = new Error('이미 닫힌 약속입니다.');
  error.status = 409;
  return error;
};

exports.createPasswordNotMatchedError = () => {
  const error = new Error('비밀번호가 일치하지 않습니다.');
  error.status = 401;
  return error;
};

exports.createPasswordIsNullError = () => {
  const error = new Error('필요한 비밀번호가 전달되지 않았습니다.');
  error.status = 400;
  return error;
};

exports.createMostConfirmedTimeNotFoundError = () => {
  const error = new Error(
    '데이터가 충분하지 않아 통계 정보를 찾을 수 없습니다.',
  );
  error.status = 404;
  return error;
};
