package main

import (
	"fmt"
	"sort"
)

func main() {
	// ----------- 배열 ----------------
	var names [3]string

	names[0] = "Kayak"
	names[1] = "LifeJacket"
	names[2] = "Paddle"

	fmt.Println(names)

	// 배열 리터럴 구문
	names2 := [3]string{"Kayak", "LifeJacket", "Paddle"}
	fmt.Println(names2)

	// 배열 길이 위임
	names3 := [...]string{"Kayak", "LifeJacket", "Paddle"}
	fmt.Println(names3)

	// 배열은 값이 복사된다.
	names4 := names3
	names3[0] = "NoNoNo"
	fmt.Println(names3)
	fmt.Println(names4)
	// 참조를 위해선 포인터 사용!
	names5 := &names3
	fmt.Println(*names5)

	// ---------- 슬라이스 --------------
	slice := make([]string, 3)
	slice[0] = "Kayak"
	slice[1] = "LifeJacket"
	slice[2] = "Paddle"

	fmt.Println(slice)

	// 슬라이스 리터럴 구문
	slice2 := []string{"Kayak", "LifeJacket", "Paddle"}

	// 슬라이스에 값 추가
	slice3 := append(slice2, "test") // slice2에 더해진 새로운 슬라이스를 반환함
	fmt.Println(slice2)
	fmt.Println(slice3)

	// 용량 설정하기
	slice4 := make([]string, 3, 6)
	// 3 : 만들어진 슬라이스가 바라 볼 수 있는 배열의 크기
	// 6 : append()로 추가되어 다른 슬라이스가 바라 볼 수 있는 크기
	//     기본값으로 설정되어 있음
	// => 배열이 새로 생성되지 않고 각각의 슬라이스가 바라보는 값들이 달라짐
	// p 187 그림 참고
	fmt.Println(slice4)

	// ------------ 슬라이스 연결하기 -------------
	originSlice := make([]string, 3)
	originSlice[0] = "Kayak"
	originSlice[1] = "LifeJacket"
	originSlice[2] = "Paddle"

	newSlice := []string{"Kayak", "LifeJacket", "Paddle"}

	sumSlice := append(originSlice, newSlice...) // ...을 반드시 붙일것
	fmt.Println(sumSlice)

	// --------- 배열에서 슬라이스 만들기 -----------
	array := []string{"Kayak", "LifeJacket", "Paddle"}
	someSlice := array[0:2]
	allSlice := array[:]
	capSlice := array[1:3:3] // low : high : max
	// max를 통해 Capacity를 지정하는 이유
	// : 지정하지 않았을 때, append를 수행하면 원본 배열의 공간을 사용함
	//   지정하면, Cap이 남아있으면 원본 배열의 공간을
	//                남지 않았으면 새로운 배열을 만들어서 반환함
	// => 원본 배열에서 얼마나 공간을 사용 가능한지를 명시하는 역할!!

	fmt.Println(someSlice)
	fmt.Println(allSlice)

	capSlice = append(capSlice, "Hello", "Capacity", "Test")
	fmt.Println(capSlice)

	// ---------- 슬라이스에서 슬라이스 만들기 ----------
	array3 := [3]string{"Kayak", "LifeJacket", "Paddle"}
	fSlice := array3[:]
	sSlice := fSlice[1:3]
	// 배열을 바라봄 (Not 슬라이스)

	fmt.Println(fSlice)
	fmt.Println(sSlice)

	// ------------ Copy 함수 사용하기 -------------
	array4 := [3]string{"Kayak", "LifeJacket", "Paddle"}

	fSlice2 := array4[:]
	sSlice2 := make([]string, 2)
	copy(sSlice2, fSlice2)
	// destination, source
	// 1. 슬라이스 크기는 상관없음 -> 끝에 도달할때까지만 넣어버림
	// 2. 용량이 남아 있더라도 바라보는 부분까지만 넣어버림

	fmt.Println(fSlice2)
	fmt.Println(sSlice2)

	// ------------ 초기화되지 않은 슬라이스에 Copy ----------
	array5 := [3]string{"Kayak", "LifeJacket", "Paddle"}

	fSlice3 := array5[:]
	var sSlice3 []string
	copy(sSlice3, fSlice3)
	// 초기화되지 않은 슬라이스의 크기 : 0
	// => 아무것도 복사되지 않음

	fmt.Println(fSlice3)
	fmt.Println(sSlice3)

	// ---------- 범위 Copy ---------
	array6 := [3]string{"Kayak", "LifeJacket", "Paddle"}
	fSlice4 := array6[:]
	sSlice4 := make([]string, 3)
	copy(sSlice4[1:], fSlice4[2:3])

	fmt.Println(fSlice4)
	fmt.Println(sSlice4)

	// ---------- 슬라이스 항목 삭제 --------
	array7 := [3]string{"Kayak", "LifeJacket", "Paddle"}
	fSlice5 := array7[:]
	// 여기서 cap 기본값이 3이기 때문에

	deleted := append(fSlice5[0:1], fSlice5[2:]...)
	// fSlice5[0:1]로 새로운 슬라이스를 만들면서
	// cap 값 3을 받았고
	// append가 수행되면서 3개까지는 원본 배열이 수정되기 때문에
	// 원본 배열이 달라진것!
	fmt.Println(array7)
	fmt.Println(fSlice5)
	fmt.Println(deleted)

	// --------- 슬라이스 정렬하기 ----------
	array8 := []string{"LifeJacket", "Paddle", "Kayak"}
	fSlice6 := array8[:]
	sort.Strings(fSlice6)
	// 원본 배열 자체가 수정됨

	fmt.Println(array8)
	fmt.Println(fSlice6)

	// --------- 슬라이스 -> 배열로 형변환하기 ----------
	array9 := []string{"LifeJacket", "Paddle", "Kayak"}
	fSlice7 := array9[:]
	sToArrPtr := (*[2]string)(fSlice7)
	sToArr := *sToArrPtr // 주소에 있는 값을 꺼내욤
	// & : 주소를 가져옴

	fmt.Println(sToArr)

	// ---------- Map -----------
	map1 := make(map[string]float64, 10)
	// 10 : 초기 크기
	// slice 처럼 자동 조절되기에 꼭 명시할 필요는 없음

	map1["hi"] = 244.43

	fmt.Println(len(map1))
	fmt.Println(map1["hi"])

	// --------- 맵 리터럴 구문 ------
	// map2 := map[string]float64{
	// 	"hi":    278.02,
	// 	"faker": 233.0, // 마지막 쉼표 필수
	// }

	// --------- 맵 값 읽기 -------
	map3 := map[string]float64{
		"hi":    278.02,
		"faker": 233.0, // 마지막 쉼표 필수
	}

	fmt.Println(map3["park"])
	// 맵은 없는 키를 호출하면 기본 값을 반환해버림
	// 아래처럼 해야함
	value, ok := map3["park"]
	if ok {
		fmt.Println(value)
	} else {
		fmt.Println("없는 키값")
	}
	// if 초기화 구문도 가능
	// if value, ok := map3["park"]; ok {}

	// --------- 맵 키 삭제하기 ---------
	map4 := map[string]float64{
		"hi":    278.02,
		"faker": 233.0, // 마지막 쉼표 필수
	}

	delete(map4, "hi") // 내장함수 (map, 키)

	fmt.Println(len(map4))

	// ------- 맵 정렬하고 읽기 ---------
	map5 := map[string]float64{
		"hi":    278.02,
		"faker": 233.0,
		"long":  244.3,
		"time":  3232.33,
		"no":    3.4,
		"see":   455.3,
	}

	// 1. 슬라이스 만들기
	keys := make([]string, 0, len(map5))

	// 2. 키값만 뽑아 슬라이스에 추가하기
	for key, _ := range map5 {
		keys = append(keys, key)
	}

	// 3. 정렬하기
	sort.Strings(keys)

	// 4. 정렬된 슬라이스를 통해 출력하기
	for _, key := range keys {
		fmt.Println(map5[key])
	}

	// --------- 문자열의 이중 특성 --------
	stringV := "hi, faker" // byte 배열

	var byteV byte = stringV[1] // 하나하나는 byte로 보임
	var stringV2 string = stringV[2:5]

	fmt.Println(byteV)
	fmt.Println(stringV2)

	// 여기서 문제 발생!!
	// 모든 문자가 1byte로 표현되지 못함
	// => 해당 문자가 차지하는 byte 개수만큼
	//    len(string)이 보이는 개수보다 증가함

	// ----------- 문자열 -> rune 으로 변환 --------
	// var price []rune = []rune("hi, faker")
	// var runeToString string = string(price[2])
}
