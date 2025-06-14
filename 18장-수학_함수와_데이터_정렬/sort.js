##### 데이터 정렬 - sort 패키지
1. 정렬 기본 함수
   sort.Float64s(slice)          : float64 슬라이스를 오름차순 정렬
       .Float64sAreSorted(slice) :       ''      가 정렬되어 있는지 여부 반환
       .Ints(slice)              : int 슬라이스를 오름차순 정렬
       .IntsAreSorted(slice)     :     ''    가 정렬되어 있는지 여부 반환
       .Strings(slice)           : string 슬라이스를 사전순으로 정렬
       .StringsAreSorted(slice)  :     ''       가 정렬되어 있는지 여부 반환
   => "새 슬라이드 만들지 않음!!"

2. 정렬 데이터 검색
   sort.SearchInts(slice, val)          : 정렬된 int 슬라이스에서 val 값 이진 탐색 후 결과 반환
                                          => 결과 : 지정한 val의 인덱스 or 값 x시 정렬 순서 유지하면서 값 삽입 가능한 인덱스
       .SearchFloat64s(slice, val)      : SearchInts의 float64 버전
       .SearchStrings(slice, val)       : SearchInts의 string 버전
       .Search(n int, func(i int) bool) : func가 true가 되는 가장 작은 i를 이진 탐색으로 찾음

3. 사용자 정의 자료형 정렬
   1. sort.interface 인터페이스 구현에 필요한 메서드
      Len()      : 정렬할 슬라이스의 전체 길이 반환
      Less(i, j) : i번째 요소가 j번째 요소보다 먼저 정렬한 순서로 나타나야 한다면 true 반환
                   - Less(i, j)와 (j, i)가 모두 false 이면 요소가 동일한 것이라 판단
      Swap(i, j) : i번째 요소와 j번째 요소의 순서를 교환
   
   2. 구현 후 사용 가능한 sort의 함수
      sort.Sort(data)     : sort.interface가 구현된 방식에 따라 사용자 정의 슬라이스 정렬
          .Stable(data)   :               ''               동일한 값의 요소 순서 변경 없이 사용자 정의 슬라이스 정렬
          .IsSorted(data) : 사용자 정의 슬라이스가 정렬되어 있는지 여부 반환
          .Reverse(data)  : sort.interface가 구현된 방식의 반대로 사용자 정의 슬라이스 정렬