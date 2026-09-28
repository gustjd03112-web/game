// 각 층 복도의 정답 번호
// 왼쪽 복도(-1) = left, 오른쪽 복도(-2) = right
export const ROOM_NUMBERS = {
  2: { left: 7, right: 14 },
  3: { left: 3, right: 9 },
  4: { left: 21, right: 5 },
  5: { left: 11, right: 17 },
  6: { left: 4, right: 23 },
  7: { left: 8, right: 19 },
  8: { left: 6, right: 27 }
};

// 최종 비밀번호: 위 번호들을 순서대로 이어 붙인 것
// 2층→8층까지 왼쪽 먼저, 그 다음 오른쪽
export const CORRECT_PASSWORD = "714392151117423819627";

// 이동 가능한 층 (2~8층)
export const FLOORS = [8, 7, 6, 5, 4, 3, 2];

// 층 이름 표시
export const FLOOR_NAMES = {
  1: "1층 로비",
  2: "2층",
  3: "3층",
  4: "4층",
  5: "5층",
  6: "6층",
  7: "7층",
  8: "8층"
};