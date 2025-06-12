package main

import (
	"fmt"
)

// 4.
type calcFunc func(int) int

// 7.
var isTrue bool

func main() {
	// --------- 1. 함수 타입 이해 --------
	var variable func() // 대입될 함수와 동일한 타입이어야함
	variable = func1    // 함수 이름으로만
	var variable2 func(int) int
	variable2 = func2

	variable() // 사용 방법
	price := variable2(134)
	fmt.Println(price)

	// 함수와 비교문이 아닌, 함수를 할당받은 객체와 비교
	if variable == nil {
		fmt.Println("Function is not Assigned in varible")
	}

	// --------- 2. 함수의 인자로 함수 사용 -------
	func3("Maple", 1004, variable2)

	// --------- 3. 함수의 결과로 함수 사용 -------
	fmt.Println(func5(100)(3000))

	// --------- 4. 함수 타입 별칭 생성 ----------
	fmt.Println(func6(1004, func2)(3000))

	// --------- 5. 리터널 함수 구문 사용 --------
	fmt.Println(func7(100)(3000))

	// --------- 6. 함수 클로져 이해 ------------
	// 함수 내부에서 외부 변수를 사용했고, 해당 함수가 반환되고 나서
	// 그 변수의 내용을 지속적으로 사용할 수 있는 것
	//
	// 원래는 함수 외부에 있는 변수는 사용되고 끝나야 하지만
	// 해당 함수 내부에서 캡쳐되어 지속적으로 사용되는 기능

	// --------- 7. 클로저가 평가되는 순간 이해 -----
	// 1. isTrue를 true로
	isTrue = true
	fmt.Println(func8(300)(500))
	// 2. isTrue를 false로
	isTrue = false
	fmt.Println(func8(400)(500))
	// 클로져를 통해 사용된 전역 외부 변수는 함수가 호출될 때 평가됨
	// 만약 조기 평가를 강제하고 싶으면
	// => 함수 내부에서 전역변수값을 할당한 변수를 만들어
	//    그 변수를 사용할것

	// ---------- 8. 조기 평가를 피하기 위한 포인터 사용 -----
	// 전역 변수를 만들지 않고도 가능
	isTrueInLocal := true
	fmt.Println(func9(300, &isTrueInLocal)(800))
	isTrueInLocal = false
	fmt.Println(func9(500, &isTrueInLocal)(800))
}

// 1.
func func1() {
	fmt.Println("func1")
}
func func2(price int) int {
	return price * 2
}

// 2.
func func3(products string, price int, calculator func(int) int) {
	fmt.Println(products, " ", calculator(price))
}

// 3.
func func4(price int) int {
	return price * 5
}

func func5(price int) func(int) int {
	if price > 300 {
		return func2 // func2 함수 반환
	}
	return func4
}

// 4.
// calcFunc : 맨위에 정의되어 있음
func func6(price int, calculator calcFunc) calcFunc {
	if price > 300 {
		return calculator
	}
	return func4
}

// 5.
func func7(price int) calcFunc {
	if price > 300 {
		var calc1 calcFunc = func(funcPrice int) int {
			return funcPrice * 2
		}
		return calc1
	}
	var calc2 calcFunc = func(funcPrice int) int {
		return funcPrice * 5
	}
	return calc2
}

// 7.
func func8(price int) calcFunc {
	return func(funcPrice int) int {
		if isTrue { // 전역 정의된 변수를 사용함
			return price + funcPrice
		} else if price > 300 { // 이 price는 calcFunc가 불리기 전에 이미 고정됨
			return funcPrice * 3
		}
		return funcPrice * 5
	}
}

// 8.
func func9(price int, isTrueInLocal *bool) calcFunc {
	return func(funcPrice int) int {
		if *isTrueInLocal { // 전역 정의된 변수를 사용함
			return price + funcPrice
		} else if price > 300 { // 이 price는 calcFunc가 불리기 전에 이미 고정됨
			return funcPrice * 3
		}
		return funcPrice * 5
	}
}
