import ical from "ical-generator";
import fs from "fs"; // Node.js 파일 시스템 모듈

// --- 설정 ---
const numberOfEvents = 50; // 생성할 총 이벤트 수
const outputFileName = "./public/mock_calendar_data.ics"; // 저장할 파일 이름
const defaultTimezone = "Asia/Seoul"; // 기본 시간대
const otherTimezones = ["America/New_York", "Europe/London", "UTC"]; // 사용할 다른 시간대 목록
const startDateRange = new Date(); // 이벤트 시작 날짜 범위 (오늘부터)
const endDateRange = new Date(); // 이벤트 종료 날짜 범위 (오늘로부터 120일 뒤까지)
endDateRange.setDate(startDateRange.getDate() + 120);

// --- 도우미 함수 ---

// 지정된 범위 내 임의의 날짜/시간 생성
function getRandomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

// 배열에서 임의의 요소 선택
function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// 정수 범위 내 임의의 숫자 생성
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 임의의 참석자 목록 생성
function generateRandomAttendees(count) {
  const attendees = [];
  const statuses = ["NEEDS-ACTION", "ACCEPTED", "DECLINED", "TENTATIVE"];
  const roles = ["REQ-PARTICIPANT", "OPT-PARTICIPANT", "NON-PARTICIPANT"];
  for (let i = 0; i < count; i++) {
    attendees.push({
      email: `attendee${i + 1}@example.com`,
      name: `참석자 ${i + 1}`,
      status: getRandomElement(statuses),
      role: getRandomElement(roles),
      rsvp: Math.random() < 0.5, // 50% 확률로 RSVP 필요
    });
  }
  return attendees;
}

// 임의의 반복 규칙 생성 (ical-generator 형식)
function generateRandomRepeatingRule() {
  const freq = getRandomElement(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]);
  const rule = { freq };
  const choice = Math.random();

  if (choice < 0.4) {
    rule.count = getRandomInt(3, 15); // 횟수 제한
  } else if (choice < 0.8) {
    const untilDate = getRandomDate(startDateRange, endDateRange);
    // UNTIL은 보통 그 날 자정까지 포함하므로, 날짜만 사용하거나 시간을 명확히 설정
    rule.until = untilDate;
  } // else: 무한 반복

  rule.interval = getRandomInt(1, 3); // 간격

  if (freq === "WEEKLY") {
    const days = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
    const numDays = getRandomInt(1, 3);
    rule.byDay = [];
    while (rule.byDay.length < numDays) {
      const day = getRandomElement(days);
      if (!rule.byDay.includes(day)) {
        rule.byDay.push(day);
      }
    }
  } else if (freq === "MONTHLY") {
    if (Math.random() < 0.5) {
      rule.byMonthDay = getRandomInt(1, 28); // 특정 일 반복
    } else {
      // 특정 주, 특정 요일 반복 (예: 2번째 일요일)
      rule.byDay = getRandomElement(["SU", "MO", "TU", "WE", "TH", "FR", "SA"]);
      rule.bySetPos = getRandomInt(1, 4); // N번째
    }
  }

  return rule;
}

// --- 메인 로직 ---

// 캘린더 객체 생성
const calendar = ical({
  domain: "mycalendarapp.dev",
  prodId: "//MyCalendarApp//Mock Generator//KO",
  name: "생성된 Mock 캘린더",
  timezone: defaultTimezone, // 캘린더 자체의 기본 시간대 (선택 사항)
  // METHOD:PUBLISH 등 다른 VCALENDAR 속성도 필요시 추가 가능
});

// 타임존 정의 추가 (ical-generator가 자동으로 필요한 VTIMEZONE 생성)
// 사용할 모든 시간대를 명시적으로 알려주는 것이 좋습니다.
// calendar.timezone(defaultTimezone); // 이미 생성자에 설정됨
// otherTimezones.forEach(tz => calendar.timezone(tz)); // 필요시 추가

// 지정된 수만큼 이벤트 생성
for (let i = 0; i < numberOfEvents; i++) {
  const eventData = {};
  const randomStart = getRandomDate(startDateRange, endDateRange);
  const randomDurationHours = getRandomInt(1, 4); // 1~4시간 지속
  const randomEnd = new Date(
    randomStart.getTime() + randomDurationHours * 60 * 60 * 1000
  );

  eventData.start = randomStart;
  eventData.end = randomEnd;

  // 이벤트 유형 및 속성 랜덤 결정
  const eventTypeChoice = Math.random();

  if (eventTypeChoice < 0.15) {
    // 15% 확률로 종일 일정
    eventData.allDay = true;
    // 종일 일정은 보통 시작 날짜만 중요하고, end는 다음날 시작으로 설정되거나 무시됨
    // ical-generator 는 allDay:true 시 자동으로 처리
    eventData.summary = getRandomElement([
      "종일 휴가",
      "워크샵 (종일)",
      "컨퍼런스 참가",
    ]);
    eventData.description = "하루 종일 진행되는 일정입니다.";
    eventData.transparency = "TRANSPARENT"; // 종일 일정은 보통 free/busy에 영향 없음
  } else {
    // 일반 시간 지정 일정
    eventData.summary = getRandomElement([
      "팀 회의",
      "고객 미팅",
      "프로젝트 논의",
      "개인 약속",
      "개발 작업",
    ]);
    eventData.description = `자동 생성된 이벤트 ${
      i + 1
    }에 대한 설명입니다.\n여러 줄 테스트.\nRandom number: ${Math.random()}`;
    eventData.location = getRandomElement([
      "회의실 A",
      "온라인",
      "고객사 사무실",
      "2층 카페",
      "지정되지 않음",
    ]);
    eventData.transparency = "OPAQUE"; // 기본값 (바쁨)

    // 30% 확률로 시간대 지정
    if (Math.random() < 0.3) {
      eventData.timezone = getRandomElement([
        defaultTimezone,
        ...otherTimezones,
      ]);
    } else {
      // 기본 시간대(서울) 또는 UTC 사용
      eventData.timezone = Math.random() < 0.2 ? "UTC" : defaultTimezone;
    }

    // 20% 확률로 반복 일정
    if (Math.random() < 0.2) {
      eventData.repeating = generateRandomRepeatingRule();
      eventData.summary += " (반복)";
    }

    // 30% 확률로 알림 추가
    if (Math.random() < 0.3) {
      const triggerMinutes = getRandomElement([5, 15, 30, 60]); // 5분, 15분, 30분, 1시간 전
      eventData.alarms = [
        {
          type: "display", // 또는 'audio'
          trigger: triggerMinutes * 60, // 초 단위 (음수 허용, 예: -60*15 는 15분 전)
          // description: `알림: ${eventData.summary}` // VALARM 설명 (선택 사항)
        },
      ];
    }

    // 25% 확률로 참석자 추가
    if (Math.random() < 0.25) {
      const numAttendees = getRandomInt(1, 5);
      eventData.attendees = generateRandomAttendees(numAttendees);
      // 주최자 추가
      eventData.organizer = {
        name: "주최 관리자",
        email: "organizer@mycalendarapp.dev",
      };
    }

    // 10% 확률로 상태 변경 (Tentative 또는 Cancelled)
    const statusChoice = Math.random();
    if (statusChoice < 0.05) {
      eventData.status = "CANCELLED";
      eventData.summary = `(취소됨) ${eventData.summary}`;
    } else if (statusChoice < 0.1) {
      eventData.status = "TENTATIVE";
      eventData.summary = `(미확정) ${eventData.summary}`;
    } else {
      eventData.status = "CONFIRMED"; // 기본값
    }

    // 15% 확률로 카테고리 추가
    if (Math.random() < 0.15) {
      eventData.categories = [
        { name: getRandomElement(["업무", "개인", "중요", "프로젝트X"]) },
      ];
      if (Math.random() < 0.3) {
        // 30% 확률로 카테고리 하나 더
        eventData.categories.push({
          name: getRandomElement(["회의", "교육", "마감일"]),
        });
      }
    }

    // 5% 확률로 첨부파일 링크 추가
    if (Math.random() < 0.05) {
      eventData.url = "https://example.com/shared-document"; // URL 속성 사용
      // 또는 ATTACH 사용 (ical-generator가 지원하는지 확인 필요 - 간단히는 URL로 대체)
      // eventData.attachments = ['https://example.com/meeting_notes.pdf']; // ical-generator v3+ 필요
    }
  }

  // 캘린더에 이벤트 추가
  try {
    calendar.createEvent(eventData);
  } catch (error) {
    console.error(`이벤트 생성 실패 (이벤트 ${i}):`, error);
    console.error("실패한 이벤트 데이터:", eventData);
  }
}

// --- 결과 출력 및 저장 ---

// 생성된 ICS 데이터 문자열 얻기
const icsDataString = calendar.toString();

// 콘솔에 일부 출력 (디버깅용)
console.log("--- 생성된 ICS 데이터 일부 ---");
console.log(icsDataString.substring(0, 500) + "..."); // 처음 500자만 출력
console.log("\n-----------------------------\n");

// 파일로 저장
fs.writeFileSync(outputFileName, icsDataString);
console.log(
  `총 ${calendar.length()}개의 이벤트가 포함된 '${outputFileName}' 파일이 생성되었습니다.`
);

// 생성된 이벤트 수 확인 (라이브러리 기능)
// console.log(`캘린더에 추가된 이벤트 수: ${calendar.length()}`);
