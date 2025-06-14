##### 숫자 작업
1. math 패키지의 유용한 함수 - 모두 float64를 기준으로 동작
   math.Abs(val)         : float64 갑의 절댓값 반환
       .Cell(val)        : float64 값인 val보다 크거나 같은 가장 작은 정수 반환
                           - 정수를 반환해도 float64 값임
       .Copysign(x, y)   : x의 절대값에 y의 부호를 붙여 반환
       .Floor(val)       : float64 값인 val보다 작거나 같은 가장 큰 정수 반환
                           - 정수를 반환해도 float64 값임
       .Max(x, y)        : x, y 중 가장 큰 값 반환
       .Min(x, y)        : x, y 중 가장 작은 값 반환
       .Mod(x, y)        : x / y의 나머지 값 반환
       .Pow(x, y)        : x의 y제곱 수 반환
       .Round(val)       : 반올림한 정수 반환
                           - 정수를 반환해도 float64 값임
       .RoundToEven(val) : 가장 가까운 짝수 정수로 반올림
                           - 정수를 반환해도 float64 값임

2. math 패키지의 한계 상수
   1. math.MaxInt8 : int8을 사용해 저장 가능한 가장 큰 / 작은 값 나타냄
          .MinInt8
   2.     .MaxInt16 : int16을 사용해 저장 가능한 가장 큰 / 작은 값 나타냄
          .MinInt16
   3.     .MaxInt32 : int32을 사용해 저장 가능한 가장 큰 / 작은 값 나타냄
          .MinInt32
   4.     .MaxInt64 : int64을 사용해 저장 가능한 가장 큰 / 작은 값 나타냄
          .MinInt64
   5.     .MaxUint8 : Uint8을 사용해 저장 가능한 가장 큰 값 나타냄
   6.     .MaxUint16 : Uint16을 사용해 저장 가능한 가장 큰 값 나타냄
   7.     .MaxUint32 : Uint32을 사용해 저장 가능한 가장 큰 값 나타냄
   8.     .MaxUint64 : Uint64을 사용해 저장 가능한 가장 큰 값 나타냄
   => Uint의 가장 작은 값 : 0
   9.     .MaxFloat32 : float32, 64로 나타낼 수 있는 가장 큰값
          .MinFloat64
  10.     .SmallestNonzeroFloat32 : float32, 64로 나타낼 수 있는 가장 작은 0이 아닌 값
          .SmallestNonzeroFloat64

3. math/rand 패키지의 난수 생성
   rand.Seed(s int64) : 지정한 int64 값을 사용하여 난수 생성기 시드 설정
       .Float32()     : 0.0 <= < 1.0의 float32 난수 생성
       .Float64()     : 0.0 <= < 1.0의 float64 난수 생성
       .Int()         : int 범위 내에서 난수 생성
       .Intn(max)     : 0 <= < max의 정수 난수 생성
       .Uint32()      : 임의의 uint32 값 생성
       .Uint64()      : 임의의 uint64 값 생성
       .Shuffle(count, func(i, j int)) : 값 무작위로 섞기 위해 사용
                                         ex) arr := []string{"apple", "banana", "cherry"}
                                             rand.Shuffle(len(arr), func(i, j int) {
                                                 arr[i], arr[j] = arr[j], arr[i]
                                             })
                                             fmt.Println(arr)  // 랜덤 순서로 출력됨

