package main

import (
	"composition/store"
	"fmt"
)

func main() {
	// ---------- 1. 기본 타입 정의 -----------
	kayak := store.NewProduct("Kayak", "WaterSports", 275)
	lifejacket := store.Product{
		Name:     "Lifejacket",
		Category: "WaterSports",
	}

	for _, p := range []*store.Product{kayak, &lifejacket} {
		fmt.Println(p.Name, p.Category, p.Price(2))
	}

	// ----------- 2. 타입 합성 -------------
	boats := []*store.Boat{
		store.NewBoat("Kayak", 275, 1, false),
		store.NewBoat("Canoe", 400, 3, false),
		store.NewBoat("Tender", 650, 2, true),
	}

	for _, b := range boats {
		// Go에서는 임베디드 타입의 필드 접근 방식에 2가지가 잇음
		// 1. 임베디드 타입 접근 후 탐색
		// 2. 임베디드 필드 타입 직접 접근
		fmt.Println(b.Product.Name, b.Name)

		// 2번 방식을 사용하는 것 : "필드 승격"
		// => Go가 타입을 "평면화"시켜
		//    Boat가 Product의 필드 가진것처럼 수행

		// 임베디드 필드 타입에 따라 메서드 평면화가 수행됨
		// 1. Product와 같은 값인 경우
		//    : 리시버가 *Product or Product 전부 가져옴
		// 2. *Product와 같은 포인터인 경우
		//    : 리시버가 *Product 포인터만 가져옴
	}

	// ----------- 3. 임베디드 타입 체인 생성 -------------
	// 합성 기능을 사용 시 임베디드 타입의 복잡한 체인 생성 가능
	// => 모든 체인의 필드 및 메서드가 최상위 인클로징 타입으로 승격됨
	rentals := []*store.RentalBoat{
		store.NewRentalBoat("Rubber Ring", 10, 1, false, false),
		store.NewRentalBoat("Yacht", 50000, 5, true, true),
		store.NewRentalBoat("Super Yacht", 100000, 15, true, true),
	}

	for _, r := range rentals {
		// 2단계 체인이 연결된 Product의 필드에 바로 접근 가능
		fmt.Println(r.Name, r.Price(2))
	}

	// ---------- 4. 승격 수행 불가한 상황 -------------
	// 인클로징 타입에 동일한 이름으로 정의한 필드 or 메서드 없는 것만 승격됨
	product := store.NewProduct("Kayak", "WaterSports", 279)
	deal := store.NewSpecialDeal("Weekend Special", 50, product)
	Name, price, Price := deal.GetDetails()

	fmt.Println(Name)
	fmt.Println(price)
	fmt.Println(Price)

	// ---------- 5. 합성과 인터페이스 이해 -------------
	// 합성을 통해 상속을 받은 상태에서
	// 상위 구조체의 리스트에 하위 합성 구조체를 넣을 수 없다.
	// products := []*store.Product{
	// 	"Kayak": store.NewBoat("Kayak", 279, 1, false),
	// }
	// => 에러 발생함

	// ---------- 6. 인터페이스 구현을 위한 합성 사용 -----------
	// 5번과 달리 Interface를 사용할 경우
	// 하위 상위 상관없이 넣는게 가능해진다.
	products := map[string]store.ItemForSale{
		"Kayak": store.NewBoat("Kayak", 279, 1, false),
		"Bail":  store.NewProduct("Soccer Ball", "Soccer", 19),
	}
	// Boat에는 Interface에서 원하는 Price 메서드가 구현되지 않았지만,
	// Product를 합성하여 Price가 있다고 판단되기에 가능함

	for key, p := range products {
		fmt.Println(key, p.Price(2))
	}

	// ------------ 7. 타입 Switch 한계 이해 -------------
	products2 := map[string]store.ItemForSale{
		"Kayak": store.NewBoat("Kayak", 279, 1, false),
		"Bail":  store.NewProduct("Soccer Ball", "Soccer", 19),
	}

	for key, p := range products2 {
		switch item := p.(type) {
		// case *store.Product, *store.Boat:
		// 	fmt.Println(item.Name)
		// 인터페이스에선 위처럼 다중 조건 case 문은 실행할 수 없음
		// why?
		// 두 조건을 만족하는 건 ItemForSale라는 인터페이스이기에
		// 인터페이스에서는 필드 접근이 불가함
		//
		// => 해결 방법은 2가지가 존재
		// 1. 각각 case문 만들어주기
		case *store.Product:
			fmt.Println(key, item.Name)
		case *store.Boat:
			fmt.Println(key, item.Name)
		}
		// 2. 인터페이스의 메서드로 필드 가져오게 하기
		//    => 8번에서 수행한 것처럼
	}

	// -------------- 8. 인터페이스 합성 ---------------
	// product.go 파일
	products3 := map[string]store.ItemForSale{
		"Kayak": store.NewBoat("Kayak", 279, 1, false),
		"Bail":  store.NewProduct("Soccer Ball", "Soccer", 19),
	}

	for _, p := range products3 {
		switch item := p.(type) {
		case store.Describable:
			// 1. 현재 Boat가 Product를 합성했고,
			// 2. Product가 ItemForSale를 합성한
			//    Describable 인터페이스를 구현했기 때문에
			// => Boat 또한 Describable의 구현체이다.
			fmt.Println(item.GetName(), item.GetCategory(), item.Price(2))
		}
	}
}
