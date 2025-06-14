bytes.~([]bytes(문자열), []bytes{})
// 문자에서 동작하는 모든 strings의 함수는 byte 슬라이스에서 동작하는 bytes 패키지의 대응 함수 존재

### strings 패키지
##### 문자열 처리
1. 문자열 비교
   strings.Contains(s, substr)    : 문자열 s가 문자열 substr을 포하는지 여부
           ContainsAny(s, substr) : 문자열 s가 문자열 substr의 문자 하나라도 포함하는지 여부
           ContainsRune(s, rune)  : 뮨저욜 S가 특정 rune을 포함하는지 여부
           EqualFold(s1, s2)      : 대소문자 구분 없는 비교 후 같은지 여부
           HasPrefix(s, prefix)   : 문자열 s가 문자열 prefix로 시작하는지 여부
           HsaSuffix(s, suffix)   : 문자열 s가 문자열 suffix로 끝나는지 여부

2. 문자열 대소문자 변환
   strings.ToLower(str)  : 문자열 str을 소문자로 변환한 새 문자열 반환
           ToUpper(str)  : 문자열 str을 대문자로 변환한 새 문자열 반환
           Title(str)    : 각 단어의 첫번째 문자가 대문자고 나머지 문자를 소문자로 만든 새 문자열 반환
           ToTitle(str)  : 제목 케이스로 매핑한 문자열의 문자를 포함하는 새 문자열 반환

3. 문자열 대소문자 작업
   strings.IsLower(rune)  : 지정한 룬이 소문자인지 여부
           ToLower(rune)  : 지정한 룬과 관련된 소문자 룬 반환
           IsUpper(rune)  : 지정한 룬이 대문자인지 여부
           ToUpper(rune)  : 지정한 룬과 관련된 대문자 룬 반환
           isTitle(rune)  : 지정한 룬이 제목 대소문자인지 여부
           ToTitle(rune)  : 지정한 룬과 관련된 제목 대소문자인지 여부

4. 문자열 검사
   strings.Count(s, sub)          : 문자열 sub이 문자열 s에서 발견된 횟수 int 반환
           Index(s, sub)          : 문자열 s 내에서 문자열 sub이 처음으로 나타나는 Index 반환 / 발생 X -> -1 반환
           LastIndex(s, sub)      :         ''              마지막으로            ''
           IndexAny(s, chars)     : 문자열 s 내에서 문자열 chars 중 하나라도 처음 등장하는 Index 반환 / 발생 X -> -1 반환
           LastIndexAny(s, chars) :         ''                       마지막            ''
           IndexByte(s, b)        : 문자열 s 내에서 지정한 byte(문자 하나) 처음 나타나는 Index 반환 / 발생 X -> -1 반환
           LastIndexByte(s, b)    :         ''                      마지막             ''
           IndexFunc(s, func)     : 지정한 함수에 대입 시 true를 반환하는 첫 문자 Index 반환
           LastIndexFunc(s, func) :         ''                    마지막    ''

##### 문자열 조작
1. 문자열 분할
   strings.Fields(s)                      : 공백 문자로 문자열 분할 후 슬라이스 반환
           FieldsFunc(s, func(rune) bool) : 사용자 정의 함수 func에서 true가 되는 문자를 기준으로 분할 후 슬라이스 반환
           Split(s, sub)                  : 문자열 sub이 나타날때마다 문자열 분할 후 슬라이스 반환
           SplitN(s, sub, max)            : 최대 max 크기로 반환되는 슬라이스 크기에 맞게 문자열 s를 sub으로 분할
                                            - 마지막 원소는 분할되지 못한 문자열 전체
           SplitAfter(s, sub)             : Split과 같지만, 분할에 사용된 sub이 사라지지 않고 분할된 원소 뒤에 붙음
                                            - ex) strings.SplitAfter("a,b,c", ",")  // 결과: ["a," "b," "c"]
           SplitAfterN(s, sub, max)       : SplitAter과 같지만, SplitN처럼 동작

2. 문자열 트리밍
   strings.TrimSpace(s)                      : 앞 뒤 공백 제거 후 새 문자열 반환
           Trim(s, set)                      : 앞 뒤에 문자열 set에 포함된 모든 문자 제거 후 새 문자열 반환 
           TrimLeft(s, set)                  : 앞에                  ''
           TrimRight(s, set)                 : 뒤에                  ''
           TrimPrefix(s, prefix)             : 앞에 문자열 prefix 제거 후 새 문자열 반환
           TrimSuffix(s, suffix)             : 뒤에             ''
           TrimFunc(s, func(rune) bool)      : 앞 뒤에 사용자 정의 함수 func가 true가 되는 문자 제거 후 새 문자열 반환
           TrimLeftFunc(s, func(rune) bool)  : 앞에                   ''
           TrimRightFunc(s, func(rune) bool) : 뒤에                   ''

3. 문자열 변경
   strings.Replace(s, old, new, n) : 문자열 s를 문자열 old -> new로 최대 n번 변화한 새 문자열 반환
           ReplaceAll(s, old, new) :             ''             변화한 새 문자열 반환
           Map(func(rune) rune, s) : 문자열 s의 각 문자에 대해 func 적용 후 생성된 새로운 문자열 반환
                                     - 음수 값이 나오면 해당 문자는 삭제됨

4. 문자열 Replacer 사용
   r := strings.NewReplacer(old1, new1, old2, new2, ...) : 문자열을 한번에 바꿔주는 Replacer 객체 생성
   
   r.Replcae(s) : 문자열 s에 존재하는 모든 old들을 new로 교체 후 새 문자열 반환
    .WriteString(writer, s) : Replace를 수행 후 문자열 반환대신 직접 출력

5. 문자열 형성 및 생성
   string.Join(slice []string, sep) : 문자열 슬라이스의 요소 사이에 문자열 sep를 끼워 만든 하나의 새 문자열 반환
          Repeat(s, count)          : 문자열 s를 count만큼 반복한 새 문자열 반환

6. 문자열 형성
   b := string.Builder

   b.WriteString(string) : 문자열 s를 형성중인 문자열에 추가
     WriteRune(rune)     : 문자 r을        ''
     WriteByte(byte)     : 바이트 b를       ''
     String()            : 빌더가 만든 문자열 반환
     Reset()             : 빌더가 만든 문자열 초기화
     Len()               : 현재 형성중인 문자열 길이
     Cap()               : 현재 버퍼 용량
     Grow(size)          : 빌더가 문자열을 저장가능한 바이트 수 증가
   
   ex) b.Grow(50) // 성능 최적화를 위해 미리 공간 확보
       b.WriteString("Hello, ")
       b.WriteRune('世')
       b.WriteByte('界')
       b.WriteString("!")

       fmt.Println(b.String())  // "Hello, 世界!"
       fmt.Println(b.Len())     // 10 (문자 길이)
       fmt.Println(b.Cap())     // 최소 50 이상 (Grow한 만큼)