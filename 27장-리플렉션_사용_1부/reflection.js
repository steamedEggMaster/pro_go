1. 상황에 따른 리플렉션
   - 리플렉션 사용 시 컴파일 타임에 타입을 정의하지 않은 경우에도
     런타임에 타입과 값 검사가 가능
   - 리플렉션은 프로젝트 컴파일 시 타입을 알 수 없는 경우에만 필요

2. 빈 인터페이스 사용 시
   - 모든 타입을 받을 수 있지만,
   - 메서드가 없기에 특정 기능에 대한 액세스를 허용하지 않음
   - 타입 단언을 통해 접근해야함

##### 리플렉션 사용하기
1. reflect 패키지의 함수
   reflect.TypeOf(val any) reflect.Type   : val의 타입 정보를 설명하는 Type 인터페이스 구현체 반환
          .ValueOf(val any) reflect.Value : val의 값 정보를 설명하는 Value 구조체 반환
   - any는 사실상 interface{}의 Alias

2. reflect.Type 인터페이스에 정의된 메서드
   reflect.Type.Name() string                     : 타입 이름 반환
                                                    ex) int, 사용자정의구조체 등
               .PkgPath() string                  : 타입이 정의된 패키지 경로 반환
                                                    - 익명 타입 or 내장 타입 -> "" 반환
               .Kind() reflect.Kind               : 타입이 기본 타입 중 어떤 종류인지 상수 반환
               .String() string                   : 타입을 문자열로 표현한 것 반환
                                                    - Name()과 유사하지만, 더 정확한 표현 포함 가능
               .Comparable() bool                 : 해당 타입이 비교 가능한 타입인지 여부 반환 (==, != 등)
               .AssignableTo(u reflect.Type) bool : 현재 타입이 주어진 타입에 대입 가능한지 여부
                                                    ex) var a int
                                                        var b int64
                                                        t1 := reflect.TypeOf(a)
                                                        t2 := reflect.TypeOf(b)
                                                        fmt.Println(t1.AssignableTo(t2)) // false

2-1. Kind 상수
     reflect.Bool
            .Int / Int8 / Int16 / Int32 / Int64
            .Uint / Uint8 / Uint16 / Uint32 / Uint64
            .Float32 / Float64
            .String
            .Struct
            .Array
            .Slice
            .Map
            .Chan
            .Func
            .Interface
            .Ptr
            .Uintptr

3. reflect.Value 구조체 메서드
   v.Kind() reflect.Kind  : 값의 종류 반환 (Type().Kind()와 같은 역할)
    .Type() reflect.Type  : 값의 타입 정보 반환(reflect.TypeOf()와 동일)
    .IsNil() bool         : Nil 인지 확인
                            - Nil 이 가능한 타입인지 확인해야함
                              => 불가능한 타입에 사용 시 panic 발생
    .IsZero() bool        : 기본값인지 확인
                            - 0, "", nil 등
    .Bool() bool          : 내부 값이 bool 인 경우 값 반환
    .Bytes() []byte       :   ''    []byte 인 경우 값 반환
    .Int() int64          :   ''    int       ''
    .Uint() int64         :   ''    uint      ''
    .Float() int64        :   ''    float     ''
    .String() string      :   ''    string    ''
    .Elem() reflect.Value : 포인터일때, 그 포인터가 가리키는 참조 값 반환
    
    => v의 Kind() 실행이 위의 값 반환 메서드들의 타입과 다른 경우 panic 발생
    
    .IsValid() bool       : Value가 유효한 값이 들어있는건지 여부
                            - nil, 존재 X 필드 등에서 reflect.Value 만들면 false

##### 기본값 얻기
1. 기본값을 얻기 위한 reflect.Value 구조체 메서드
   v.Interface() any     : 값을 interface{}로 반환하여 기본값으로 만듬
                           - exported가 아닌 구조체 필드에 사용 시 panic 발생
                           - Value에는 어떤 타입이든 들어갈 수 있기에,
                             interface{}를 통해 감싸서 가져온 후,
                             "타입 단언"을 통해 사용 가능하게 함
    .CanInterface() bool : 값을 Interface()로 꺼낼 수 있는지 여부
                           - exported가 아닌 구조체 필드 등


##### 리플렉션을 사용한 값 설정
1. 값 설정을 위한 reflect.Value 구조체 메서드
   v.CanSet() bool          : Value가 값을 설정 가능한 상태인지 여부
                              - 값이 포인터로 접근 가능해야 true
    .SetBool(val bool)      : 기본값을 지정한 bool로 설정
    .SetBytes(slice []byte) :      ''     byte 슬라이스로 설정
    .SetFloat(val float64)  :      ''     float64      ''
    .SetInt(val int64)      :      ''     int64        ''
    .SetUint(val int64)     :      ''     uint64       ''
    .SetString(val string)  :      ''     string       ''
    .Set(val reflect.Value) :             Value의 기본값으로 설정

2. 타입이 비교 가능한지 결정하기 위한 reflect.Type 인터페이스 메서드
   reflect.Type.Comparable() bool : 해당 타입이 비교 가능한 타입인지 여부 반환 (==, != 등) 

3. 비교 편의 함수
   - 값을 비교하기 위한 Go 비교 연산자 대안 reflect 패키지 함수
     reflect.DeepEqual(val, val) bool : Go에서 두 값을 깊게 비교하는 함수
                                        - 기본 비교 연산자(==)로 비교 불간으한 슬라이스, 맵, 구조체 등 비교 시 사용됨


##### 값 변환
1. 타입 변환을 평가하기 위한 reflect.Type 인터페이스 메서드
   reflect.Type.ConvertibleTo(u reflect.Type) bool : 구현체t 가 u로 변환 가능한지 여부

2. 타입 변환을 위한 reflect.Value 구조체 메서드
   v.Convert(type reflect.Type) reflect.Value : v값을 t타입으로 변환한 새로운 reflect.Value 반환
                                                - 위의 ConvertibleTo()로 panic 방지를 위한 사전체크 수행

3. 숫자 타입 변환 - 오버플로 유발 여부 확인을 위한 reflect.Value 구조체 메서드
   v.OverflowFloat(val float64) bool : val를 v.Type()의 float 타입으로 변환 시 오버플로 발생 여부
    .OverflowInt(val int64) bool     :       ''        정수 타입으로 변환 시 오버플로 발생 여부 
    .OverflowUint(val uint64) bool   :       ''        unsigned 정수 타입으로 변환 시 오버플로 발생 여부
   => v,Kind()가 맞게나오지 않으면 panic 발생될 것


##### 새 값 생성 - 슬라이스 및 맵 제외(이후 장에서 설명)
1. 새 값을 생성하기 위한 reflect 함수
   reflect.New(type reflect.Type) reflect.Value                             : 지정 타입의 기본값으로 초기화한 값을 가리키는 reflect.Value(포인터) 반환
          .Zero(type reflect.Type) reflect.Value                            : 주어진 타입의 기본값 반환
          .MakeMap(type reflect.Type) reflect.Value                         : 빈 맵을 생성 (Type은 반드시 map 타입이어야 함)
          .MakeMapWithSize(type reflect.Type, size int) reflect.Value       : MakeMap과 동일하되, 초기 해시 버킷 크기를 지정할 수 있음.
                                                                              - 실질적인 차이는 크지 않지만, 성능 최적화 가능
          .MakeSlice(type reflect.Type, length, capacity int) reflect.Value : 지정한 타입의 슬라이스 생성
                                                                              - 슬라이스의 길이(len)와 용량(cap)을 설정
          .MakeChan(type reflect.Value, buffer int) reflect.Value           : 지정한 함수 타입에 맞는 함수 구현체 생성
          .MakeFunc(type reflect.Type, fn func(args []reflect.Value) []reflect.Value) reflect.Value : 주어진 채널 타입의 채널을 생성
                                                                                                      - buffer는 버퍼 크기 (0은 기본 채널)