### time 패키지
1. 날짜 및 시간 표현
   time.Now() : 현재 로컬 시간을 time.Time 타입 생성
       .Date(y, m, d, h, min, sec, nsec, loc) : 지정한 날짜 및 시간을 나타내는 time.Time 값 생성
                                                - loc : 시간대 ex) time.Local, time.UTC
       .Unix(sec, nsec) : Unix 타임스탬프(1970년 1월 1일 00:00:00 UTC 기준)를 기반으로 time.Time 생성
   - nsec : 나노세컨드

2. Time의 구성 요소 접근 메서드
   t.Date()       : 연(int), 월(Month), 일(int) 반환
    .Clock()      : 시, 분, 초 반환
    .Year()       : int로 표현된 연도 반환
    .YearDay()    : 1~366 사이 반환 (윤년 수용)
    .Month()      : time.Month 타입 반환
    .Day()        : 1~31 사이 반환
    .Weekday()    : time.Weekday 타입 반환
    .Hour()       : 0~23 사이 반환
    .Minute()     : 0~59 사이 반환
    .Second()     : 0~59 사이 반환
    .Nanosecond() : 나노초(0~999999999) 반환

3. 문자열로 시간 포매팅
   t.Format(layout) : 잘모르겠음..

3-1. time 패키지가 정의한 레이아웃 상수
     ANSIC       : Mon Jan _2 15:04:05 2006
     UnixDate    : Mon Jan _2 15:04:05 MST 2006
     RubyDate    : Mon Jan 02 15:04:05 -0700 2006
     RFC822      : 02 Jan 06 15:04 MST
     RFC822Z     : 02 Jan 06 15:04 -0700
     RFC850      : Monday, 02-Jan-06 15:04:05 MST
     RFC1123     : Mon, 02 Jan 2006 15:04:05 MST
     RFC1123Z    : Mon, 02 Jan 2006 15:04:05 -0700
     RFC3339     : 2006-01-02T15:04:05Z07:00
     RFC3339Nano : 2006-01-02T15:04:05.999999999Z07:00
     Kitchen     : 3:04PM
     Stamp       : Jan _2 15:04:05
     StampMilli  : Jan _2 15:04:05.000
     StampMicro  : Jan _2 15:04:05.000000
     StampNano   : Jan _2 15:04:05.000000000

4. 문자열에서 시간 값 파싱
   time.Parse(layout, str) : 레이아웃을 사용하여 문자열 파싱 및 time.Time 생성
       .ParseInLocation(layout, str, location) : 레이아웃을 사용하고 문자열에 시간대 포함 안한경우, location을 사용하여 문자열 파싱
   => 결과 : time.Time, error

5. Location 생성 함수
   time.LoadLocation(name) : 시간대("Asia/Seoul" 등) 이름을 통해 *Location 반환
       .LoadLocationFromTZData(name, data) : OS에 zoneinfo 없을때, 사용자가 직접 tzdata 파일 파싱 시 사용
                                             - import _ "time/tzdata" 이거 사용 시 표준 시간대 내장 DB 사용함
       .FixedZone(name, offset) : 고정된 오프셋(예시 : +9시간 = 9 x 3600초)을 갖는 사용자 정의 시간대 생성
                                  예시) loc := time.FixedZone("KST", 9*60*60)  // +09:00
                                       t := time.Date(2025, 6, 15, 12, 0, 0, 0, loc)
                                       fmt.Println(t)  // 2025-06-15 12:00:00 +0900 KST

6. 시간 값 조작
   t.Add(duration)      : t에 duration 만큼 더한 새 time.Time 반환    
    .Sub(time)          : t와 time 간의 차 구한 후, time.Duration 반환
    .AddDate(y, m, d)   : t에 연/월/일 단위로 더한 새 time.Time 반환
    .After(time)        : t가 time보다 뒤 시간인지 확인 (t > time인지?)
    .Before(time)       : t가 time보다 앞 시간인지 확인 (t < time인지?)
    .Equal(time)        : t와 time이 동일한지 확인
    .isZero()           : t가 1년 1월 1일 00:00:00 UTC인 0-시간 순간 나타내는지 확인
    .In(loc)            : t를 설정한 loc 시간대로 변환 (*time.Location)
    .Location()         : t의 현재 시간대(*time.Location) 반환 
    .Round(duration)    : duration은 단위이며(ex: time.Minute) 해당 단위에서 반올림
    .Truncate(duration) :                       ''                     내림

7. 기간 표현
   time.Hour        : 1시간
       .Minute      : 1분
       .Second      : 1초
       .Millisecond : 1밀리초
       .Microsecond : 1마이크로초
       .Nanosecond  : 1나노초
   => 결과 : time.Duration 반환

7-1. time.Duration 관련 메서드
     d.Hours()            : d를 float64 시간 단위로 변환
      .Minutes()          :     ''      분 단위로 변환
      .Seconds()          :     ''      초 단위로 변환
      .Milliseconds()     : d를 int64 밀리초 단위로 변환
      .Microseconds()     :     ''    마이크로초 단위로 변환
      .Nanoseconds()      :     ''    나노초 단위로 변환
      .Round(duration)    : duration은 단위이며(ex: time.Minute) 해당 단위에서 반올림
      .Truncate(duration) :                       ''                     내림

8. 시간 기준 기간 생성
   time.Since(time.Time) : 지정한 time 값 이후 경과한 시간을 나타내는 time.Duration 반환 
       .Until(time.Time) :      ''      까지 경과한            ''

9. 문자열에서 기간 생성
   time.ParseDuration(str) : 문자열을 파싱하여 Duration 및 error 반환
   - 지원하는 문자열 포맷 1. h
                     2. m
                     3. s
                     4. ms : 밀리초
                     5. us : 마이크로초
                     6. ns : 나노초

