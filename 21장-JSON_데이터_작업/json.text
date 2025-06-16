##### encoding/json 패키지
1. JSON 데이터를 위한 encoding/json 생성자 함수
   json.NewEncoder(writer) : Json 데이터 인코딩 및 writer에 쓰기 가능한 *json.Encoder 반환
       .NewDecoder(reader) : reader에서 Json 데이터를 읽고 디코딩 가능한 *json.Decoder 반환

2. JSON 데이터 생성 및 파싱 함수
   json.Marshal(v interface{})              : v를 JSON 형식의 []byte 슬라이스로 변환(인코딩)
                                              - Exported 필드(대문자 시작)만 JSON으로 변환됨           
       .Unmarshal(byteSlice, v interface{}) : Json 데이터(바이트 슬라이스)를 v에 디코딩(역직렬화) 수행
                                              - v는 반드시 포인터(&변수)로 넘겨야 내부에 값 할당됨

##### JSON 데이터 인코딩
1. *json.Encoder 메서드
   ec.Encode(v interface{})     : v를 JSON으로 인코딩(직렬화) 후 io.Writer로 직접 씀
                                  - 임베디드 구조체의 Exported 필드들도 전부 인코딩함
                                  - 자동으로 줄바꿈(\n)이 추가됨
                                  - 내부적으로 Marshal(v) + Writer.Write() 동작 수행 
     .SetEscapeHTML(on bool)    : JSON 문자열 안의 <, >, &를 HTML 이스케이프 처리할지 여부 설정 
                                  - 기본값 : true
                                           => 이스케이프될 위험이 있는 문자를 인코딩
                                           => HTML에 안전하지만, 읽기 불편한 JSON 나올 수 있음
     .SetIndent(prefix, indent) : JSON 인코딩 시, 각 필드 이름에 적용하는 접두사 및 들여쓰기 지정
                                  ex) u := map[string]interface{}{
                                        "name": "Bob",
                                        "age":  28,
                                        "skills": []string{"Go", "Docker"},
                                      }

                                      enc := json.NewEncoder(os.Stdout)
                                      enc.SetIndent("", "  ")
                                      enc.Encode(u)

                                      // 출력:
                                      // {
                                      //   "age": 28,
                                      //   "name": "Bob",
                                      //   "skills": [
                                      //     "Go",
                                      //     "Docker"
                                      //   ]
                                      // }

1-1. 기본 Go 데이터 타입을 JSON으로 표현하는 방식
     1. bool             : JSON true, false로 표현
     2. string           : JSON 문자열로 표현
                           - 기본적으로 안전하지 않은 HTML 문자를 이스케이프 함
     3. float32, float64 : JSON 숫자로 표현
     4. int, int<size>   :     ''
     5. uint, uint<size> :     ''
     6. byte             :     ''
     7. rune             :     ''
     8. nil              : JSON null 값으로 표현
     9. Pointers         : JSON 인코더는 포인터를 역참조해 포인터가 가리키는 값을 인코딩

1-2. 구조체 JSON
     1. 필드 뒤에 문자열 리터럴인 "구조체 태그"를 사용하여 JSON 키 사용자 지정 가능
        ex) type DiscountedProduct struct {
                *Product         `json:"product"`
                Discount float64 `json:"-"`   // JSON 인코딩 시 필드 생략
            }

     2. 구조체 생성 시 정의하지 않은 필드도 Encoding 시 nil로 포함시킴
        ex) dp2 := DiscountedProduct{ Discount: 10.50 }
            encoder.Encode(&dp2)
            fmt.Println(writer.String())
            // 출력
            // {"product":null}
     
     2-1. nil 필드 포함 방지를 위한 설정 - omitempty
          ex) type DiscountedProduct struct {
                  *Product         `json:"product, omitempty"`
                  Discount float64 `json:"-"`
              }
     2-2. 필드는 상속받아 출력하지만, 동일한 들여쓰기로 만들고 싶은 경우
          ex) type DiscountedProduct struct {
                  *Product         `json:", omitempty"`
                  Discount float64 `json:"-"`
              }
              // 출력
              // 1. 기존
              //    {"product":{"Name":"Kayak", "Category":"Watersports", "Price":279}}
              // 2. 적용 시
              //    {"Name":"Kayak", "Category":"Watersports", "Price":279}
     2-3. 필드값을 문자열로 강제 인코딩 - string
          ex) type DiscountedProduct struct {
                  *Product         `json:", omitempty"`
                  Discount float64 `json:", string"` // 숫자 -> 문자열 강제 인코딩
              }
              // 출력
              // 1. 기존
              //    {"Discount":25.34}
              // 2. 적용 후
              //    {"Discount":"25.34"}

1-3. 완전한 사용자 정의 JSON 인코더 생성
     - Encoder는 구조체가 Marshaler 인터페이스를 구현하는지 여부 확인
     - Marshaler 인터페이스의 메서드
       json.Marshaler.MarshalJSON() ([]byte, error)
       : JSON으로 표현할 방식을 커스터마이징하기 위한 메서드



##### JSON 데이터 디코딩
1. *json.Decoder 메서드
   dc.Decode(v interface{})   : Decoder 생성 시 설정한 Writer로부터 읽어 디코딩(역직렬화) 수행하여 v에 넣음
                                - v는 반드시 "포인터!!"
                                - 결과 : error
     .DisallowUnknownFields() : 구조체 디코딩 시, 정의되지 않은 필드가 JSON에 존재하면 에러 발생
     .UseNumber()             : JSON의 숫자 값은 기본으로 float64로 변환되는데,
                                이때 큰 숫자가 손실될 수 있음
                                => 문자열처럼 안전하게 파싱 후 json.Number 타입 반환
                                => 이후 Number.Int64() or Float64() 수행
                            
1-1. json.Number 메서드
     num.Int64()   : 디코딩한 값을 int64로 변환
        .Float64() :     ''     float64로 변환
        .String()  : JSON 데이터에서 변환하지 않은 string 반환
     - 결과 : 타입, error
     ex) data := `{"num": 12345678901234567890}`
         dc := json.NewDecoder(strings.NewReader(data))
         dc.UseNumber()

         var m map[string]interface{}
         _ = dc.Decode(&m)

         num := m["num"].(json.Number) // 중요!!
         i, _ := num.Int64() // 정확한 정수 추출
         fmt.Println(i)      // 12345678901234567890

1-2. 배열 디코딩
     - Json에서는 배열에 다른 타입이 들어가는 걸 허용함
       => Go는 아니기에, 주의해야 함
       => []interface{} {} : 빈 인터페이스 슬라이스로 정의하기!

1-3. 구조체 디코딩
     - Decoder는 JSON 객체를 디코딩하고 키를 사용하여 export 필드의 값 설정
     - "필드와 JSON 키의 대소문자 일치 필요 X"
     - Decoder는 구조체 필드가 없는 모든 JSON를 무시하고,
                JSON 키가 없는 구조체 필드를 무시함
       => DisallowUnknownFields 메서드를 통해 엄격한 처리 가능

1-4. 인터페이스 디코딩
     - JSON은 동적 타입의 export 필드(대문자)를 사용해 값을 인코딩하여 인터페이스를 처리
       -> JSON이 키-값 쌍을 처리하고 메서드를 표현할 수 없기 때문
     => 따라서,
        JSON에서 인터페이스 변수로 직접 디코딩 불가
        -> 구조체 또는 맵으로 디코딩 후 인터페이스 변수에 할당해야 함

1-5. 완전한 사용자 정의 JSON 디코더 생성
     - Decoder는 구조체가 Unmarshaler 인터페이스를 구현하는지 여부 확인
     - Unmarshaler 인터페이스의 메서드
       json.Unmarshaler.UnmarshalJSON(byteslice) (error)
       : byteslice의 JSON 데이터 디코딩 커스터마이징을 위한 메서드