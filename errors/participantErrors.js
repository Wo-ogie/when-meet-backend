exports.createParticipantIsAlreadyExistError = () => {
  const error = new Error(
    '이미 존재하는 참가자입니다. 같은 이름의 참가자를 중복 생성할 수 없습니다.',
  );
  error.status = 409;
  return error;
};
