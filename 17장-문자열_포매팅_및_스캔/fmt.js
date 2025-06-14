##### 문자열 작성
1. 기본 fmt 함수
   fmt.Print(...vals)            : 가변 개수의 인수를 받아 해당 값들을 "표준 출력"에 기록
                                   - 문자열 인수 간 공백 없이 출력
                                   - 문자열이 아닌 인수 간엔 공백 추가
                                   - 개행 문자 없음
      .Println(...vals)          : 가변 개수의 인수를 받아 해당 값들을 "표준 출력"에 기록
                                   - 인수 간 공백 추가되어 출력
                                   - 개행 문자 있음
      .Fprint(writer, ...vals)   : writer(파일, 버퍼, HTTP 응답 등)에 가변 인수들을 기록
                                   - writer 자리에 os.Stdout 사용 시 Print와 동일
                                   - 특징 : Print와 동일
      .Fprintln(writer, ...vals) : writer(파일, 버퍼, HTTP 응답 등)에 가변 인수들을 기록
                                   - writer 자리에 os.Stdout 사용 시 Println와 동일
                                   - 특징 : Println와 동일

2. 문자열 포매팅을 위한 fmt 함수
   fmt.Sprintf(t string, ...vals)  : t 포맷 문자열에 vals 값들을 포매팅 동사에 넣어 생성한 문자열 반환
                                     - 출력 X 
      .Printf(t, ...vals)          : t 포맷 문자열에 vals 값들을 포매팅 동사에 넣어 생성한 문자열을 "표준 출력"에 기록
      .Fprintf(writer, t, ...vals) :                     ''                            writer(파일, 버퍼, HTTP 응답 등)에 기록
                                     - writer자리에 os.Stdout을 넣으면 Printf와 같음
      .Errorf(t, ...vals)          : t 포맷 문자열에 vals 값들을 포매팅 동사에 넣어 생성한 문자열을 통해 error 타입 객체를 생성 후 반환
   
   - 포매팅 동사?
     
     1. 범용 포매팅 동사
        1. %v  : 값의 기본 포맷을 표시
                 - 더하기 기호(%+v)로 수정 시 구조체 값을 작성할 때, 필드 이름을 포함시킴
                 ex) type User struct {
                         Name string
                         Age  int
                     }
                     
                     fmt.Printf("%%+v  : %+v\n", u)
                     // %+v  : {Name:찬영 Age:30}

        2. %#v : 값을 Go 코드 형태(리터럴 형태)로 출력
                 - 디버깅에 유용
                 - 구조체의 필드명까지 모두 나옴
                 ex) fmt.Printf("%#v\n", 123)              // 123
                     fmt.Printf("%#v\n", "hello")          // "hello"
                     fmt.Printf("%#v\n", []int{1, 2, 3})   // []int{1, 2, 3}

                     type User struct {
                         Name string
                         Age  int
                     }
                     u := User{"프로고", 28}
                     fmt.Printf("%#v\n", u)  // main.User{Name:"프로고", Age:28}
        
        3. %T  : 값의 타입(자료형) 출력
     
     2. 정수 포매팅 동사
        1. %b     : 정수 값을 이진 문자열로 표시
        2. %d     : 정수 값을 10진수 문자열로 표시
                    - 정수 값의 기본 포맷
                      => "%v를 정수에 사용 시 적용되는 기본 포맷"
        3. %o, %O : 정수 값을 8진수 문자열로 표시
                    - %O 는 0o 접두사 추가
        4. %x, %X : 정수 값을 16진수 문자열로 표시
                    - A~F 16진수는 x로 소문자, X로 대문자로 표시됨

     3. 부동 소수점 포매팅 동사 - float32, float64에 적용가능
        1. %b     : 지수가 있고, 소수점이 없는 부동 소수점 값 표시
                    - Go 내부 표현에 가까움
                    ex) fmt.Printf("%b\n", 12.34)  
                        // 출력: 8547144377454971p-49 (64비트 기반의 내부 표현)
        2. %e, %E : 지수와 소수점이 있는 부동 소수점 값 표시
                    - e는 소문자 지수 표시기, E는 대문자 지수 표시기 사용
                    ex) fmt.Printf("%e\n", 12.34)  // 1.234000e+01
f                       fmt.Printf("%E\n", 12.34)  // 1.234000E+01
        3. %f, %F : 소수점이 있는 부동 소수점 값 표시 -> 지수 표현 X
                    - 고정 소수점 표기법
                    - f, F의 출력 동일
                    ex) fmt.Printf("%f\n", 12.34)  // 12.340000
                        fmt.Printf("%F\n", 12.34)  // 12.340000
        4. %g, %G : 부동 소수점 값 출력시 지수 형식(%g -> %e, %G -> %E) 또는 고정 소수점 방식(%g와 %G -> %f) 중 짧을 쪽을 골라 출력
                    - %g => "%v 동사 사용 시 적용되는 기본 포맷"
                    ex) fmt.Printf("%g\n", 12.34)         // 12.34  ← 고정 소수점 출력
                        fmt.Printf("%g\n", 123456789.0)   // 1.23456789e+08  ← 지수 표기 출력
        6. %x, %X : 16 진수 지수 형식으로 부동 소수점 값 표현
                    - A~F를 x는 소문자, X는 대문자로 출력
    
     3-1. 부동 소수점 포매팅 동사 수정자
          1. + : 음수(-) 기호 뿐만 아니라, 양수에도 양수(+) 기호 붙임
          2. 0 : 전체 폭을 지정 시, 자릿수를 맞추기 위해 빈 공간 -> 0으로 채움
          3. - : 기본은 오른쪽 정렬이지만, - 지정 시 왼쪽 정렬됨
                 - 전체 폭 지정해야 명확함

     4. 문자열 및 문자(Rune) 포매팅 동사
        1. %s : 문자열을 표시
                - "%v 동사 사용 시 적용되는 기본 포맷"
        2. %c : 문자 표시
                - 개별 문자 포맷 시 주의
                  : 일부 문자는 N개의 바이트를 사용 -> 일부 바이트만 포매팅되지 않도록 해야함
                    => "rune 단위로 접근하기"!
                  ex) s := "가나다라마바사"
                      runes := []rune(s)
                      fmt.Printf("%c\n", runes[0])  // 출력: 가
        3. %U : "U+16진수" 형태로 출력되는 유니코드 코드 포인트 출력
     
     5. bool 포매팅 동사
        1. %t : true or false 출력
     
     6. 포인터 포매팅 동사
        1. %p : 포인터의 저장 위치 주소를 16진수로 출력

##### 문자열 스캔
1. 문자열 스캔 fmt 함수 - "&"를 붙여서 넣어주기!
   fmt.Scan(...vals)                     : 표준 입력(stdin)에서 공백으로 구분한 값을 지정한 인수에 저장
                                           - 개행 -> 공백 처리
                                           - 모든 인수에 대한 값을 읽을 때까지 읽음
                                           ex) var name string
                                               var age int
                                               fmt.Scan(&name, &age)
      .ScanIn(...vals)                   : Scan과 동일, but 줄바꿈 전까지만 입력받고 종료
      .Scanf(template, ...vals)          : printf처럼 입력에 대한 값을 포매팅 동사를 사용하여 값 선택
                                           ex) var name string
                                               var age int
                                               fmt.Scanf("%s %d", &name, &age)
      .Fscan(reader, ...vals)            : Scan과 같지만, 입력을 표준 입력(stdin)이 아닌, io.Reader로부터 받음
                                           ex) reader := strings.NewReader("hello 30")
                                               var name string
                                               var age int
                                               fmt.Fscan(reader, &name, &age)
      .FscanIn(reader, ..vals)           : 
      .Fscanf(reader, template, ...vals) : 
      .Sscan(str, ...vals)               : 문자열 str을 공백 단위로 파싱하여 인수에 넣음
      .SscanIn(str, ...vals)             : 
      .Sscanf(str, template, ...vals)    : 
   
   => 결과 : 읽은 값의 개수, error
