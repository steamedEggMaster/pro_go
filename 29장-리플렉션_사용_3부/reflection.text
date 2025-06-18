##### 함수 타입 작업
1. 함수 작업을 위한 reflect.Type 인터페이스 메서드
   Type.NumIn() int                 : 함수의 입력 매개변수 개수 반환
       .In(index int) reflect.Type  : 순서 상 인덱스 위치에 존재하는 매개변수의 Type 반환 
       .IsVariadic() bool           : 마지막 매개변수가 가변적인지 여부 반환
       .NumOut() int                : 함수의 반환값 개수 반환
       .Out(index int) reflect.Type : 순서 상 인덱스 위치에 존재하는 반환 값의 Type 반환


##### 함수 값 작업
1. 함수 호출을 위한 reflect.Value 메서드
   v.Call(params []reflect.Value) []reflect.Value : v가 함수인경우, 해당 함수를 실행
                                                    - params가 매개변수
                                                    - 결과가 Value 슬라이스로 반환됨

2. 새 함수 타입과 함수 값을 생성하기 위한 reflect 함수
   reflect.FuncOf(params, results []reflect.Type, variadic bool) reflect.Type                       : 매개변수, 결과 타입을 통해 함수 타입을 리플렉트하는 새로운 Type 생성
          .MakeFunc(type reflect.Type, fn func(args []reflect.Value) []reflect.Value) reflect.Value : FuncOf() 로 생성된 Type에 대응되는 함수 동작(fn)을 정의하여 해당 함수 타입을 리플렉트하는 Value 반환
   ex) func main() {
           // 1. func(int, int) int 타입 만들기
           typ := reflect.FuncOf(
               []reflect.Type{reflect.TypeOf(0), reflect.TypeOf(0)},
               []reflect.Type{reflect.TypeOf(0)},
               false,
           )

           // 2. 해당 타입의 함수 로직 정의해서 생성
           fn := reflect.MakeFunc(typ, func(args []reflect.Value) []reflect.Value {
               a := args[0].Int()
               b := args[1].Int()
               sum := a + b
               return []reflect.Value{reflect.ValueOf(int(sum))}
           })

           // 3. 실행해 보기
           result := fn.Call([]reflect.Value{
               reflect.ValueOf(3),
               reflect.ValueOf(5),
           })
           fmt.Println(result[0].Interface()) // 결과: 8
       }


##### 메서드 작업
1. 메서드 작업을 위한 reflect.Type 인터페이스 메서드
   Type.NumMethod() int                                  : 리플렉트한 구조체 타입이 공개(export) 메서드를 몇 개 가지고 있는지 반환
       .Method(index int) reflect.Method                 :        ''       의 index번째 공개 메서드 정보 반환
       .MethodByName(name string) (reflect.Method, bool) : name으로 메서드를 찾아 반환
                                                           - bool : 메서드 존재하는지 여부

2. reflect.Method 구조체의 필드 - "공개 메서드"만 포함
   m.Name string        : 메서드 이름
    .PkgPath string     : 비공개 메서드만 값을 가지는 패키지 경로(공개는 "")
    .Type reflect.Type  : 메서드 함수 타입을 설명하는 Type 반환
                          ex) 기존 메서드 표현 : func (m MyStruct) Hello(name string) string
                              일반 함수처럼 표현 : func(MyStruct, string) string
                              => 이렇게 reflect.Type에 담겨 있음
    .Func reflect.Value : 메서드 함수 값을 리플렉트하는 Value 반환
                          - 실제로 호출 가능한 Value이기에 Call()로 실행 가능
    .Index int          : Type.Method(index)에서 반환되는 index값임

3. 메서드 작업을 위한 Value 메서드
   v.NumMethod()                                     : v가 가진 exported 메서드 개수 반환
                                                       - 내부적으로 Type.NumMethod() 호출
    .Method(index int) reflect.Value                 : Index번째 메서드 함수를 리플렉트하는 Value 반환
    .MethodByName(name string) (reflect.Value, bool) : 이름 기반으로 메서드 함수를 찾아 리플렉트하는 Value 반환
   => 첫 인자로 리시버를 넘겨야함 ( 2번의 .Type 참고 )


##### 인터페이스 작업
1. 인터페이스 작업을 위한 reflect.Type 인터페이스 메서드
   Type.Implements(u reflect.Type) bool                 : t 인터페이스가 u 인터페이스를 구현하는지 여부 반환
                                                          - u는 반드시 인터페이스 타입(u.Kind() == reflect.Interface)이어야 함
       .Elem() reflect.Type                             : t가 포인터, 슬라이스, 맵, 채널, 인터페이스일 때,
                                                          내부 요소 타입을 리플렉트 하는 Type 반환
                                                          ex) []T → T
                                                              *T → T
                                                              map[K]V → V
       .NumMethod() int                                 : t가 가지고 있는 export된 메서드 개수 반환
                                                          - 인터페이스 타입이면, 해당 인터페이스가 요구하는 메서드 반환
       .Method(index int) reflect.Method                : index번째 리플렉트 메서드 반환(이름, 시그니처 등 포함)
       .MethodByName(name string) (reflect.Method, bool) : name으로 리플렉스 메서드 반환값
                                                           - bool : 존재하는지 여부


##### 채널 타입 작업
1. 채널을 위한 reflect.Type 인터페이스 메서드
   Type.ChanDir() reflect.ChanDir : 채널 방향을 설명하는 ChanDir 값 반환
                                    - 값 종류
                                      1. reflect.SendDir : 송신 전용(chan<- T)
                                      2. reflect.RecvDir : 수신 전용(<-chan T)
                                      3. reflect.BothDir : 양방향 채널(chan T)
       .Elem() reflect.Type       : 채널이 보내거나 받는 요소 타입을 리플렉트하는 Type 반환
                                    - 슬라이스, 배열, 포인터, 맵 등에서도 공통적으로 사용됨


##### 채널 값 작업
1. 채널을 위한 reflect.Value 구조체 메서드
   v.Send(val reflect.Value)                : val 인수가 리플렉트한 값을 전송
                                              - 수신자가 받을 때까지 "블로킹" 전송 수행
                                              - v.Kind() == reflect.Chan && v.Type().ChanDir() == reflect.SendDir 또는 BothDir 이어야 함
    .Recv() (val reflect.Value, ok bool)    : 채널에서 값 수신 후, 리플렉션을 위한 Value로 반환
                                              - 송신자가 전송할때까지 or 채널이 닫힐 때까지 "블로킹" 수신 수행
                                              - ok : 값을 수신했는지 여부
                                                     - 채널이 닫히면 false 반환
    .TrySend(val reflect.Value) bool        : 버퍼 채널에 대해 "논블로킹 전송" 시도
                                              - bool : 전송 성공했는지 여부 반환
                                                       - 버퍼 꽉차있거나, 수신자가 없다면 false
    .TryRecv() (val reflect.Value, ok bool) : 채널에서 "논블로킹 수신" 시도
                                              - val : 읽은 값에 대한 리플렉트하는 Value
                                              - ok  : 값을 받았는지 여부
                                              => 읽은 값이 없다면, val.IsValid() == false && ok == false
    .Close()                                : 채널을 닫음
                                              - 이미 닫힌 채널은 재차단 금지 -> 패닉 발생


##### 새 채널 타입 및 값 생성
1. 채널 타입 및 값 생성을 위한 reflect 패키지 함수
   reflect.ChanOf(dir reflect.ChanDir, t reflect.Type) reflect.Type : 특정 방향과 채널 요소 타입을 가진 채널 타입 생성
          .MakeChan(t reflect.Type, buffer int) reflect.Value       : 주어진 채널 Type 및 버퍼로 생성한 채널을 리플렉트하는 값 반환
                                                                      - make(chan T, N) + 리플렉트 느낌


##### 여러 채널 선택
1. 채널 선택을 위한 reflect 패키지 함수
   reflect.Select(cases []reflect.SelectCase) (chosen int, recv reflect.Value, recvOK bool)
   : Go의 고루틴 + Select 문을 동적으로 구성 가능하게 해주는 함수
     => 여러 채널 중 하나가 준비되었을 때 처리
     - chosen : 선택된 case의 Index값(cases[index])
     - recv   : 채널을 통해 받은 값을 리플렉트하는 Value
     - recvOK : 해당 채널이 열려있는지 여부
1-1. reflect.SelectCase 구조체 필드
     1. Chan reflect.Value     : 채널을 리플렉트하는 Value가 할당됨
     2. Dir  reflect.SelectDir : SelectDir 값을 해당 필드에 할당 
                                 - 채널 연산 타입 지정
     3. Send reflect.Value     : 채널을 통해 전송할 값을 리플렉트하는 Value가 할당됨
1-2. reflect.SelectDir 상수
     1. reflect.SelectSend    : 채널에 값 보내기 (ch <- x)
     2.        .SelectRecv    : 채널에서 값 받기 (x := <-ch)
     3.        .SelectDefault : 기본 case (select의 default)