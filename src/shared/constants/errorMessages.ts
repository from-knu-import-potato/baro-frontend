export const API_ERROR_MESSAGES: Record<string, string> = {
  // 외부 서비스 장애 — AI / OCR
  AI_UNAVAILABLE:
    'AI 서비스(Gemini)에 일시적인 장애가 발생했습니다. 서비스 문제가 아닌 외부 AI 서비스 문제이므로, 잠시 후 다시 시도해 주세요.',
  OCR_FAILED:
    '이미지 인식 서비스(CLOVA OCR)에 일시적인 장애가 발생했습니다. 외부 서비스 상태로 인한 오류이므로, 잠시 후 다시 시도해 주세요.',
  OCR_EMPTY:
    '이미지에서 텍스트를 인식하지 못했습니다. 사진이 흐리거나 글씨가 작을 경우 더 선명한 사진으로 다시 시도해 주세요.',
  PARSE_FAILED: 'AI 분석 결과 파싱 중 외부 서비스 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',

  // 파일 / 업로드
  UPLOAD_FAILED: '이미지 업로드에 실패했습니다. 네트워크 상태를 확인 후 다시 시도해 주세요.',

  // 인증
  UNAUTHORIZED: '인증이 만료되었습니다. 다시 로그인해 주세요.',
  FORBIDDEN: '접근 권한이 없습니다.',

  // 리소스
  NOT_FOUND: '요청한 정보를 찾을 수 없습니다.',
  CONFLICT: '이미 존재하는 데이터입니다.',

  // 가게
  INVALID_INVITE_CODE: '유효하지 않은 초대 코드입니다.',
  ALREADY_MEMBER: '이미 참여 중인 가게입니다.',
  INVALID_OWNER: '가게 멤버가 아닙니다.',
  OWNER_CANNOT_LEAVE: '가게 대표자는 가게를 나갈 수 없습니다.',
  CANNOT_REMOVE_SELF: '자기 자신을 내보낼 수 없습니다.',

  // 마감
  KAKAO_AUTH_FAILED: '카카오 로그인에 실패했습니다. 다시 시도해 주세요.',
};

export const DEFAULT_ERROR_MESSAGE = '오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
