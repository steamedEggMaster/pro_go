##### 포인터 작업
1. 포인터에 대한 reflect 패키지 함수 및 메서드
   reflect.PtrTo(type reflect.Type) reflect.Type : 인수로 받은 타입의 포인터 타입을 반환
                                                   ex) t := reflect.TypeOf(int(0))      // int
                                                       pt := reflect.PtrTo(t)           // *int
                                                       fmt.Println(pt)                  // *int
                                                       fmt.Println(pt.Kind())           // ptr
   ptr.Elem() reflect.Value                      : 포인터가 가리키는 값 반환
                                                   - 포인터가 아닌 타입이라면 panic 반환

2. 포인터 타입 작업을 위한 reflect.Value 메서드
   v.CanAddr() bool       : v.Addr()가 동작 가능한지 확인
                            - 주소값을 가질 수 있는 값인지 확인
    .Addr() reflect.Value : v에 대한 포인터 v를 반환
                            ex) x := 42
                                v := reflect.ValueOf(&x).Elem()

                                if v.CanAddr() {
                                    ptr := v.Addr()
                                    fmt.Println(ptr.Type())         // *int
                                    fmt.Println(ptr.Interface())    // *int 형태로 출력
                                }
    .Elem() reflect.Value : v가 포인터, 슬라이스, 인터페이스, 배열 등일 때 사용
                            - 해당 포인터 or 인터페이스가 참조하는 실제 값 반환
                            ex) x := 10
                                vp := reflect.ValueOf(&x)
                                ve := vp.Elem()              // *int → int 값
                                fmt.Println(ve.Int())        // 10
   

##### 배열 및 슬라이스 타입 작업
1. 배열 및 슬라이스에 대한 reflect.Type 인터페이스의 메서드
   reflect.Type.Elem() reflect.Type : 배열, 슬라이스, 맵, 포인터, 채널, 함수의 요소 타입 반환
                                      - 매우 자주 쓰임‼️
                                      ex) t := reflect.TypeOf([]string{"a", "b"})
                                          fmt.Println(t.Elem()) // string
               .Len() int           : 배열 타입의 길이 반환
                                      - 배열 타입에만 적용 가능
                                      - 슬라이스에 적용 시 panic 발생

2. 배열 및 슬라이 타입을 생성하기 위한 reflect 함수
   reflect.ArrayOf(len int, type reflect.Type) reflect.Type : 지정한 크기 및 요소 타입으로 배열을 설명하는 Type 반환
                                                              ex) t := reflect.ArrayOf(3, reflect.TypeOf(int(0)))  // [3]int 타입 생성
                                                                  fmt.Println(t)           // [3]int
                                                                  fmt.Println(t.Kind())    // array
                                                                  fmt.Println(t.Elem())    // int
                                                                  fmt.Println(t.Len())     // 3
          .SliceOf(type reflect.Type) reflect.Type          : 지정한 요소 타입으로 슬라이스를 설명하는 Type 반환
                                                              - 해당 요소 타입을 가지는 슬라이스 타입을 반환
                                                              ex) t := reflect.SliceOf(reflect.TypeOf(string("")))  // []string 타입 생성
                                                                  fmt.Println(t)           // []string
                                                                  fmt.Println(t.Kind())    // slice
                                                                  fmt.Println(t.Elem())    // string


##### 배열 및 슬라이스 값 작업
1. 배열 및 슬라이스 작업을 위한 reflect.Value 구조체 메서드
   v.Index(i int) reflect.Value               : 슬라이스, 배열, 문자열에 대해 특정 인덱스의 요소를 나타내는 Value 반환
    .Len() int                                : 배열 슬라이스, 맵, 문자열, 채널 길이 반환
    .Cap() int                                : 슬라이스, 배열, 채널의 용량 반환
    .SetLen(n int)                            : 슬라이스 길이 설정
                                                - reflect.MakeSlice 또는 reflect.AppendSlice 등으로 생성한 주소 설정이 가능한 슬라이스에서만 가능
    .SetCap(n int)                            : 슬라이스의 Capacity 설정
                                                - 값이 설정된 이후 cap이 작아지면, 기존 값 일부가 잘릴 수 있음
                                                - 잘 사용되지 않음
                                                - reflect.MakeSlice로 생성한 경우에만 사용 가능
    .Slice(low, high int) reflect.Value       : 슬라이스, 배열, 문자열에 대해 v[low:high]로 만든 슬라이스 반환
                                                - 범위를 벗어날 경우 panic 발생
    .Slice3(low, high, max int) reflect.Value : v[low:high:max] 값을 갖는 새 슬라이스 생성
                                                ex) v := reflect.ValueOf([]int{1, 2, 3, 4, 5})
                                                    s := v.Slice3(1, 3, 4) // []int{2, 3} with cap 3 (4-1)
                                                    fmt.Println(s.Interface()) // [2 3]

2. 슬라이스에 요소를 추가하기 위한 reflect 패키지 함수
   reflect.MakeSlice(type reflect.Type, len, cap int) reflect.Value : Type을 사용해 요소의 타입을 나타내고 지정한 길이, 용량을 통해 슬라이스 생성
                                                                      - Type은 reflect.SliceOf(elemType)으로 만들어야 함
          .Append(slice, elems ...reflect.Value) reflect.Value      : 기존 슬라이스에 요소를 추가한 새 슬라이스 반환
                                                                      - 기존 슬라이스는 변환 X
          .AppendSlice(dst, src reflect.Value) reflect.Value        : src 슬라이스를 dst 슬라이스에 추가
          .Copy(dst, src reflect.Value) int                         : 실제 복사된 요소 수 반환
                                                                      - 배열 or 슬라이스만 가능


##### 맵 타입 작업
1. 맵을 위한 reflect.Type 메서드
   reflect.Type.Key() reflect.Type  : 맵의 Key의 타입 반환
               .Elem() reflect.Type : 맵의 Value의 타입 반환
                                      - 슬라이스, 배열, 맵, 채널, 포인터, 함수 등에서도 사용 가능

2. 맵 타입 생성을 위한 reflect 함수
   reflect.MapOf(keyType, valueType reflect.Type) reflect.Type : 주어진 타입을 기반으로 맵 타입 생성
                                                                 ex) keyType := reflect.TypeOf("key")       // string
                                                                     valType := reflect.TypeOf(123)         // int
                                                                     mapType := reflect.MapOf(keyType, valType) // map[string]int

                                                                     fmt.Println(mapType.Kind()) // map
                                                                     fmt.Println(mapType.String()) // map[string]int

##### 맵 값 작업
1. 맵 작업을 위한 reflect.Value 메서드
   v.MapKeys() []reflect.Value                 : 맵의 모든 키 Value들을 슬라이스로 반환 (순서 랜덤)
    .MapIndex(key reflect.Value) reflect.Value : 특정 키에 대응하는 값 Value 반환
    .MapRange() *reflect.MapIter               : 맵의 키-값 쌍을 순회하는 반복자 반환
    .SetMapIndex(key, val reflect.Value)       : 맵에 값을 설정하거나 삭제
                                                 - 삭제 : val에 reflect.Value{} 또는 reflect.Zero(...) 설정
    .Len() int                                 : 맵의 현재 키-값 쌍의 개수 반환

2. *reflect.MapIter 구조체의 메서드
   mi.Next() bool           : 맵의 다음 키-값 쌍이 존재하는지 확인 후 이동 및 이동 가능 여부 반환
     .Key() reflect.Value   : 현재 위치에서 맵 키를 나타내는 Value 반환
     .Value() reflect.Value : 현재 위치에서 맵 값을        ''

3. 맵 생성을 위한 reflect 패키지 함수
   reflect.MakeMap(type reflect.Type) reflect.Value                   : 주어진 타입의 빈 맵 생성
                                                                        ex) typ := reflect.TypeOf(map[string]int{})
                                                                            m := reflect.MakeMap(typ)
                                                                            fmt.Println(m.Interface()) // 출력: map[]
          .MakeMapWithSize(type reflect.Type, size int) reflect.Value : 주어진 타입의 맵 초기 용량을 지정하여 생성
                                                                        ex) typ := reflect.TypeOf(map[string]int{})
                                                                            m := reflect.MakeMapWithSize(typ, 10)
                                                                            fmt.Println(m.Len()) // 출력: 0


##### 구조체 타입 작업
1. 구조체를 위한 reflect.Type 메서드
   reflect.Type.NumField() int : 구조체의 필드 개수 반환
                                 - 익명 필드(embedding) 포함
               .Field(idnex int) reflect.StructField                 : 주어진 인덱스에 위치한 구조체 필드 정보 반환
                                                                       - 인덱스는 0 <= <= NumField() -1 사이
               .FieldByIndex(index []int) reflect.StructField        : 중첩 구조체에서 특정 필드에 접근하기 위해 인덱스 경로로 찾음
                                                                       ex) type Address struct {
                                                                               City string
                                                                           }
                                                                           type User struct {
                                                                               Name    string
                                                                               Address Address
                                                                           }

                                                                           t := reflect.TypeOf(User{})
                                                                           f := t.FieldByIndex([]int{1, 0}) // Address.City
                                                                           fmt.Println(f.Name) // "City" 
               .FieldByName(name string) (reflect.StructField, bool) : 문자열 이름으로 필드를 직접 찾음
                                                                       - bool : 존재 여부
               .FieldByNameFunc(match func(string) bool) (reflect.StructField, bool) : 각 필드에 콜백 함수를 적용하여 처음으로 true를 반환하는 필드를 반환
                                                                                       - bool : 조건을 만족하는 필드 존재 여부

2. reflect.StructField 필드
   StructField.Name string           : 필드의 이름 반환
                                       - export되지 않은 필드 : "" 빈문자열 반환
              .PkgPath string        : 필드가 unexported인 경우 패키지 경로를 포함
                                       - 해당 필드가 unexported인지 확인을 위해 사용
                                       - export된 필드 : "" 빈 문자열 반환
              .Type reflect.Type     : 필드의 타입 정보 반환
              .Tag reflect.StructTag : 필드와 연결한 구조체 태그(json 등) 반환
                                       ex) type Person struct {
                                               Name string `json:"name"`
                                           }
                                           f := reflect.TypeOf(Person{}).Field(0)
                                           fmt.Println(f.Tag.Get("json")) // "name"
              .Index []index         : 해당 필드에 접근하기 위한 인덱스 경로
                                       - 중첩 구조체인 경우, 경로로 구성됨
              .Anonymous bool        : 익명 필드(Embedded) 여부 반환

3. reflect.StructTag 타입 메서드
   st.Get(key string) string            : 해당 key에 대응하는 값만 반환
                                          - key가 없으면 "" 반환
                                          - 값이 정의되지 않은 경우도 "" 반환
                                          => 확실한 구분 안됨
     .Lookup(key string) (string, bool) : key에 해당하는 값이 있으면 값 + true 반환
                                          없으면 "", false 반환

4. 구조체 타입 생성을 위한 reflect 패키지 함수
   reflect.StructOf(fields) reflect.Type : 구조체에 들어갈 필드들의 정보를 배열로 전달하여 구조체 타입인 Type 반환
                                           ex) 	fields := []reflect.StructField{
                                                    {
                                                        Name: "ID",
                                                        Type: reflect.TypeOf(int(0)),
                                                        Tag:  `json:"id"`,
                                                    },
                                                    {
                                                        Name: "Name",
                                                        Type: reflect.TypeOf(""),
                                                        Tag:  `json:"name"`,
                                                    },
                                                }
                                                structType := reflect.StructOf(fields)


##### 구조체 값 작업
1. 구조체 작업을 위한 reflect.Value 메서드
   v.NumField() int : 구조체 필드 개수 반환
                      - v가 구조체 타입일 때만 사용 가능
    .Field(index int) reflect.Value          : 지정된 인덱스에 위치하는 필드 값 반환
                                               - 인덱스는 0 <= <= NumField() -1 사이
    .FieldByIndex(index []int) reflect.Value : 중첩 구조체 필드에 접근하여 Value 반환
    .FieldByName(name string) reflect.Value  : name에 해당하는 필드 값 반환
                                               - name 존재 X => 기본값 reflect.Value가 반환되며, .IsValid()로 확인 가능
    .FieldByNameFunc(match func(string) bool) reflect.Value : 각 필드를 콜백 함수에 대입 후 처음 true가 되는 첫 필드 Value 반환