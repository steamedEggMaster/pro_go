package main

import "fmt"

func main() {
	slice := []string{"hi", "faker"}
	func4("1004", slice...)
	// 이미 존재하는 슬라이스를 넘길땐 ...을 붙이자

	price := 1004
	func5("food", &price) // 주소 넘기기
}

// 1. 매개변수 타입 생략
func func1(price, product string) {

}

// 2. 매개변수 이름 생략
func func2(price, _ string) {
	// 이것은 인터페이스에 정의된 함수들을 가져다 오버라이딩할때
	// 필요없는 매개변수를 사용 안하기 위함
}

// 3. 매개변수 모든 이름 생략
func func3(string, float64, float64) {

}

// 4. 가변 매개변수
func func4(price string, products ...string) {
	// products는 슬라이스임
	// 인수 제공이 안될 수 있는데 ex) func4("1004")
	// 이때 products == nil 이기 때문에 로직에 따라 위험할 수 있음
	// => if else 처리를 해줄 것
}

// 5. 포인터 매개변수
func func5(product string, price *int) { // 포인터임을 명시
	fmt.Println(*price) // 값 접근
}

// 6. 함수 결과 반환
func func6(price int) int {
	return price * 2
}

// 7. 여러 함수 결과 반환
func func7(price int) (int, int) {
	return price * 2, price * 3
	// 하나의 변수에 여러 의미를 담기 보단, 여러 결과를 반환하자
	// ex) value, err := func7(1004)
}

// 8. 변수가 선언된 함수 결과
func func8(price int) (tax int) {
	tax = price * 20
	// 결과로 정의된 변수를 내부에서 사용 가능!!
	return tax
}
