exports.createScheduleAlreadyExistError = () => {
  const error = new Error(
    '기존에 저장한 스케줄이 존재합니다. 기존 스케줄 데이터를 삭제한 후 다시 시도하거나, 수정하기 API를 사용해주세요.',
  );
  error.status = 409;
  return error;
};
