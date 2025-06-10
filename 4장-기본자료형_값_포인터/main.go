package main

import (
	"fmt"
	"math/rand"
)

func main() {
	const price float32 = 279.00
	const quantity int = 32
	fmt.Println(rand.Int())

	// price * quantity 에러 발생
	// => 타입이 선언된 경우 자동 형변환 지원 X

	const p = 279.00
	const q = 5
	fmt.Println(q * p) // 자동 형변환 지원 O

	// => 상수(const)는 타입 선언 X 시 자동 형변환 가능함

	// --------- 변수 ---------------
	// var pri float32 = 333.00
	// var qua int = 32
	// fmt.Println(pri * qua) 에러발생 -> 형변환 지원 X

	// var priV = 322.00
	// var quaV = 12
	// fmt.Println(priV + quaV) 에러발생 -> 형변환 지원 X

	// => 변수는 타입 선언 or 선언 X 전부 자동 형변환 지원 X

	// --------- 변수2 --------------
	pri := 1 // 짧은 변수 선언
	fmt.Println(pri)

	pr := 2
	fmt.Println(pr)
	pr = 3
	// 변수 재정의

	// ------- 포인터 ---------------
	first := 100
	var second *int = &first // 1번 방식
	second2 := &first        // 2번 방식
	// & : 메모리 주소를 가리킴
	//     => second와 second2는 first 값을 가진 메모리의 주소를 가짐

	fmt.Println(first, " ", second, " ", second2)
	fmt.Println(*second) // 메모리의 값 출력

	// -------- 포인터의 포인터 --------
	third := 200     // 값
	fourth := &third // third의 주소값
	fifth := &fourth // fourth의 주소값
	fmt.Println(third, " ", fourth, " ", fifth)
	fmt.Println(**fifth)
}
