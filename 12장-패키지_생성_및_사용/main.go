package main

import (
	"fmt"
	"packages/store"
	"packages/store/cart"
)

func main() {
	// ------- 1. 다른 패키지 가져다 쓰기 -----------
	// 대문자 시작 필드는 외부 패키지에서 정의 및 접근 가능
	product := store.Product{
		Name:     "Kayak",
		Category: "WagerSports",
		// price:    123, 정의 못함
	}

	fmt.Println(product.Name, product.Category)

	// ------- 2. 다른 패키지의 메서드 가져다 쓰기 ---------
	product2 := store.NewProduct("Kayak", "WagerSports", 300)

	fmt.Println(product2.Price())

	// --------- 3. 패키지에 파일 코드 추가 ---------
	fmt.Println(product2.Price())

	// --------- 4. 패키지 이름 충돌 해결 -----------
	// 같은 패키지 이름이 존재할때
	// 1. 별칭 이용하기
	//    store2 "packages/store"
	// 2. 점(.) import 사용
	//    . "packages/store"
	//    => 접두사 없이 해당 패키지 내부 사용 가능함

	// ----------- 5. 중첩 패키지 생성 -------------
	cart := cart.Cart{
		CustomerName: "Alice",
		Products:     []store.Product{product, *product2},
	}

	fmt.Println(cart.CustomerName, cart.GetTotal())

	// ---------- 6. 패키지 초기화 함수 사용 ----------
	// tax.go 파일 확인하기

	// ---------- 7. 패키지 초기화만을 위한 Import -----------
	// _ "패키지명" 으로 사용은 안하지만 초기화 함수는 실행 시킬 수 있음

	// ---------- 8. 외부 패키지 사용 -----------
	// go get github.com~
	// 을 통해 설치
	// 유용한 패키지 찾기
	// 1. https://pkg.go.dev
	// 2. https://github.com/golang/go/wiki/Projects
	//
	// => 패키지는 지속적으로 개발되는 것을 사용해야함

	// 모듈을 가져올 때 go.sum 파일이 생성되고
	// 패키지를 확인하기 위해 사용하는 Checksum 포함함
}
