# 점검스케줄 v2 계획서 (Claude Code용)

현재 앱: jeomgeom/index.html (단일 HTML, 원본은 Claude 아티팩트와 동일 코드).
저장소: Firebase RTDB REST `tokdama/jeomgeom/seobu` (entries/cfg/done/pin/seeded).
사용 주소: https://nagnema3-cpu.github.io/tokdama/jeomgeom/

## 요구사항 (2026-11-01 사용자)
1. 희망시간 있으면 그 시간에 고정
2. 희망시간 없으면 빈 시간에 자동 배치
3. 검사시간 기본 60분, 설정에서 변경 + 일정마다(업로드 열) 따로 지정 가능
4. 이동거리·시간은 네이버 지도(Directions) 기준으로 반영
5. 조 수 N개 변수 (설정에서 변경, 조 색은 N에 맞춰 자동 생성)
6. 조가 다른 구로 넘어가도 됨 → "한 조 하루 한 지역" 규칙 삭제, 전체 효율 동선
7. 업로드 파일 열: 주소, 검사시간, 검사희망시간, 날짜 → 올리면 자동 배분
   (정기/사용 구분 대신: 희망시간 있으면 고정, 없으면 자유)
8. 서버 저장, 다른 기기·PC 웹에서도 같은 화면 (현 Firebase 유지, PC 브라우저에서도 동작 확인)

## 진행 상황 (2026-11-01)
- 1·2·3·5·6·7·8 반영 완료 (v2 배분, 조 수·기본 검사시간·같은 동 이동시간 설정, 4열 엑셀)
- 4번 임시 기준(사용자 지정): 번지 주소는 그 동 주민센터(행정복지센터) 위치, 같은 동 이동 15분 기본
  ※ 지금 좌표는 행정동 대표점(경계 안 한 점). 실제 주민센터 좌표표로 바꾸면 더 정확
- 네이버 사용량 상한 완료: naverAllowed('geo'|'dir')가 false면 호출 금지(월 무료건수 80%), 호출할 때마다 countNaver(k) — RTDB usage/{YYYY-MM}/{k} 서버 증가
- 남은 것: 4번 네이버 실제 도로시간·주민센터 정확 좌표

## 설계
### 데이터
- entry: {id, date, addr, dur(분, 없으면 cfg.dur), want('HH:MM'|''), name?, sample?}
  - region은 저장하지 않고 주소에서 계산(regionOf), 좌표 ll은 지오코딩 결과 캐시(cfg 아님, geo/{주소해시})
- cfg: {teams:N(기본5), dur:60, ws, we, ls, le, start{name,addr,ll}}

### 배분 알고리즘 (차량 경로 + 시간창, 휴리스틱)
- 조마다 순서 리스트. 시간 계산 simulate(list): t=ws(출발지), 도착=t+travel;
  고정이면 도착>want → 불가(허용오차 0), 시작=want / 자유면 시작=도착(10분 올림), 점심 걸치면 le로;
  끝=시작+dur; 마지막 끝 ≤ we.
- 1단계: 고정 일정을 시간순으로, 가능한 조·위치 중 "추가 이동시간 + 10분×그 조 건수(분산)" 최소에 삽입
- 2단계: 자유 일정은 출발지에서 먼 것부터 최저비용 삽입
- 3단계: 개선 반복(relocate, swap, 2-opt within team) 비용 줄면 채택, 시간 제한 300ms
- 못 넣으면 '배정 못함' + 다음 근무일 넘기기(기존 기능 유지)
- 결정적 결과(모든 폰 동일): 입력을 id순 정렬, 난수 없음

### 이동시간 (네이버)
- 배분 계산용: 직선거리 어림(현행 공식)으로 빠르게
- 확정 동선: 조별 최종 순서에 대해 구간마다 네이버 Directions 5(driving) 호출 →
  실제 분·km로 표시하고 시간 다시 계산, 안 맞으면 '시간 빠듯' 경고
- 네이버 Directions/Geocoding은 브라우저 직접 호출 불가(CORS·비밀키) →
  작은 중계 서버 필요: Cloudflare Worker(무료) 권장
  - GET /geocode?q=주소 → {lat,lng}
  - GET /route?s=lat,lng&g=lat,lng → {min, km}
  - 비밀키는 Worker 환경변수, 응답은 RTDB에 캐시(같은 구간 재호출 방지)
- 지도 화면: 네이버 지도 JS v3(ncpKeyId, 도메인 nagnema3-cpu.github.io 등록)로 실제 지도 위 점·선
  (지금의 동 경계 그림 지도는 대체 또는 보조)
- 키 없을 때는 현재 어림값으로 동작(대체 경로)

### 화면 변경
- 조 카드: 지역 대신 방문 구 목록, 조 수 N개
- 업로드 안내: 주소·검사시간·검사희망시간·날짜
- 설정: 조 수, 기본 검사시간, 네이버 연결 상태
- 네이버 앱 길찾기 링크(nmap://route/car, 경유지 최대 3) 유지, 같은 좌표 벌리기 유지

## 사용자 준비물 (네이버)
1. 네이버 클라우드 플랫폼 가입 → Maps 이용 신청
2. Application 등록: Dynamic Map, Geocoding, Directions 5 체크, 웹 서비스 URL에 https://nagnema3-cpu.github.io
3. Client ID(공개용)와 Client Secret(Worker에만) 전달
4. Cloudflare 가입(무료) → Worker 배포는 Claude가 코드 제공, 사용자는 붙여넣기·키 입력
