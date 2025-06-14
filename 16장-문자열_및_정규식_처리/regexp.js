1. regexp 패키지의 기본 함수
   regexp.Match(pattern, slice []byte) : 패턴과 바이트 슬라이스의 매칭 여부 나타내는 bool 반환
         .MatchString(pattern, s)      : 패턴과 문자열 s의 매칭 여부 나타내는 bool 반환
         
         .Compile(pattern)             : 패턴을 기반으로 컴파일을 통해 *Regexp를 반환하고, 해당 객체를 여러번 사용 가능
         .MustCompile(pattern)         : Compile과 동일하게 작동하지만, 패턴이 잘못되어 있으면 panic이 발생됨
                                         - 주로 실행 도중이 아닌, 정적 패턴을 코드 상에 작성 시 사용
         => 두 함수는 *Regexp, error를 반환한다.

2. Regexp 타입의 기본 메서드
   re.MatchString(s)             : 문자열 s와 컴파일된 pattern이 일치하는 지 여부 반환
     .FindStringIndex(s)         : 문자열 s에서 pattern이 처음 매칭되는 시작 + 끝 인덱스 슬라이스 반환 / 없음 -> nil 반환  - ex) [1, 5]
     .FindAllStringIndex(s, max) :        ''           매칭되는 모든 위치에서의 시작 + 끝 인덱스 슬라이스 반환 / ''     - ex) [[1, 3], [7, 9]]
     .FindString(s)              :        ''           처음 매칭되는 문자열 반환 / 없음 -> "" 반환
     .FindAllString(s, max)      :        ''           매칭되는 모든 문자열 슬라이스 반환 / ''
     .Split(s, max)              : 문자열 s를 pattern을 구분자로하여 분할 및 문자열 슬라이스 반환

  => max는 최대 찾을 개수 (-1 설정 시 모두 찾음)

3. Regexp 타입의 하위 표현식에 대한 메서드
   re.FindStringSubmatch(s)              : 문자열 s에서 처음 매칭되는 전체 문자열 + 하위 표현식들을 string 슬라이스로 반환
                                           - ex) re := regexp.MustCompile(`(\d+)-(\w+)`)
                                                 fmt.Println(re.FindStringSubmatch("123-abc"))  
                                                 // ["123-abc", "123", "abc"]
     .FindAllStringSubmatch(s, max)      : 문자열 s에서 매칭되는 모든 매칭된 문자열 + 하위 표현식들을 2차원 string 슬라이스로 반환
                                           - ex) re := regexp.MustCompile(`(\d+)-(\w+)`)
                                                 fmt.Println(re.FindAllStringSubmatch("123-abc 456-def", -1))
                                                 // [["123-abc", "123", "abc"], ["456-def", "456", "def"]]
     .FindStringSubmatchIndex(s)         : 문자열 s에서 처음 매칭되는 전체 문자열 + 각 하위 표현식의 [start, end] 인덱스를 int 슬라이스로 반환
                                           - ex) re := regexp.MustCompile(`(\d+)-(\w+)`)
                                                 fmt.Println(re.FindStringSubmatchIndex("123-abc"))
                                                 // [0 7 0 3 4 7] → 전체, 첫 그룹, 두 번째 그룹의 [시작, 끝]
     .FincAllStringSubmatchIndex(s, max) : 문자열 s에서 매칭되는 모든 문자열 + 각 하위 표현식의 [start, end] 인덱스를 int 슬라이스로 반환
                                           - ex) re := regexp.MustCompile(`(\d+)-(\w+)`)
                                                 fmt.Println(re.FindAllStringSubmatchIndex("123-abc 456-def", -1))
                                                 // [[0 7 0 3 4 7], [8 15 8 11 12 15]]
     .NumSubexp()                        : 정규식에서 하위 표현식의 개수 반환
                                           - ex) re := regexp.MustCompile(`(\d+)-(\w+)`)
                                                 fmt.Println(re.NumSubexp())  // 2
     .SubexpIndex(name)                  : 정규식에서 이름이 있는 하위표현식(?P<name>...) 중 문자열 name에 해당하는 index 반환 
                                           - ex) re := regexp.MustCompile(`(?P<id>\d+)-(?P<word>\w+)`)
                                                 fmt.Println(re.SubexpIndex("word"))  // 2
     .SubexpNames()                      : 모든 하위 표현식의 이름들을 string 슬라이스로 반환 / 없음 -> "" 반환
                                           - ex) re := regexp.MustCompile(`(?P<id>\d+)-(?P<word>\w+)`)
                                                 fmt.Println(re.SubexpNames())  
                                                 // ["", "id", "word"]
                                                 // ""이 있는 이유는 정규 표현식 전체를 하나의 하위 표현식으로 보고 이름이 없으니 첫 인덱스엔 ""로 무조건 들어가게됨
                                    
4. Regexp 타입의 부분 문자열 치환을 위한 메서드
   re.ReplaceAllString(s, template)                  : 문자열 s에서 정규식과 매칭되는 모든 부분을 template 문자열로 치환 후 새 문자열 반환
                                                       - 캡처 그룹(하위 표현식)을 $1, $2 이런식으로 참조 가능
                                                       ex) re := regexp.MustCompile(`(\d+)-(\w+)`)
                                                           result := re.ReplaceAllString("123-abc 456-def", "$2:$1")
                                                           fmt.Println(result)
                                                           // "abc:123 def:456"
     .ReplaceAllLiteralString(s, sub)                : 문자열 s에서 정규식과 매칭되는 모든 부분을 sub 문자열을 어떠한 해석없이 그대로 치환 후 새 문자열 반환
     .ReplaceAllStringFunc(s, func(string) string)   : 문자열 s에서 정규식과 매칭되는 모든 부분을 함수를 호출하여 return 값으로 치환 후 새 문자열 반환
                                                       - 동적으로 치환 값을 만들고 싶을 때 유용