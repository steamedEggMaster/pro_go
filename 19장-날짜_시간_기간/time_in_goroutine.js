##### 고루틴 및 채널에 시간 기능 사용
1. time 패키지 함수
   time.Sleep(duration) : 현재 고루틴을 일정 시간 정지시킴
       .AfterFunc(duration, func) : 일정 시간 후 실행할 함수를 설정
       .After(duration) <-chan time.Time : 특정 시간 지나면 time.Time 값을 채널로 반환
                                           - 고루틴과 함께 select에 자주 사용
       .Tick(duration) <-chan time.Time : 주기적으로 값을 보내는 타이머 채널 반환
                                          - 무한 채널이므로 반드시 고루틴 or select로 사용해야함
                                          - time.Tick은 GC 대상이 안됨 -> 프로그램 종료 전가지 메모리에 계속 남은
                                            => 주기가 끝나면 time.NewTicker() + Stop() 사용이 더 나음

2. 타이머 중지 및 리셋
   time.NewTimer(duration) : 일정 시간 후 값을 보내는 *Timer 객체를 생성
2-1. Timer 구조체의 필드 및 메서드
     t.C : *time.Timer 타입의 내장 채널 필드
           - 역할 : duration이 만료되면 현재 시간(time.Time)을 채널로 보내줌.
           - 사용 목적 : "비동기적"으로 타이머 이벤트 처리 가능
           - 채널로 들어간 값은 반드시 소비해줄것. -> 소비 안하면 메모리 누수 가능
      .Stop() : 타이머가 아직 만료되지 않았다면 타이머 취소
                - 결과 : 타이머 종료 시 true / 타이머가 이미 메시지 보낸 경우 false 
                - 이미 타이머 만료 or 채널을 읽지 않으면 "메모리 누수 위험" 존재   
      .Reset(duration) : 기존 타이머를 중지하고 duration에 따른 타이머로 재사용함
                         - 타이머가 이미 만료된 상황이라면
                           => 타이머 재활성화

3. Ticker 생성을 위한 time 함수
   time.NewTicker(duration) : duration 마다 반복적인 이벤트를 발생시키는 타이머(*time.Ticker) 생성
3-1. Ticker 구조체의 필드 및 메서드
     t.C : 주기적으로 현재시각(time.Time)을 보낼 채널
      .Stop() : Ticker 중지시키고, 더 이상 t.C 채널에 값이 들어오지 않도록 함
                - 채널을 닫는 것은 아님
                - 반드시 호출해줘야 "고루틴 리소스 누수 방지가 가능"함
      .Reset(duration) : 기존 Ticker를 중지시키고, duration에 맞게 재설정한 Ticker 반환

