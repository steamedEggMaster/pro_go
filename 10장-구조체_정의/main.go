package main

import (
	"encoding/json"
	"fmt"
	"strings"
)

// const 불가
type Product struct {
	name, category string
	price          int
}

// ------- 구조체 필드를 위한 포인터 타입 사용 -------
type Supplier struct {
	name, city string
}
type PtrProduct struct {
	name, category string
	price          int
	*Supplier
}

func main() {

	kayak := Product{
		name:     "kayak",
		category: "WaterSports",
		price:    275,
	}

	fmt.Println(kayak.name, " ", kayak.category, " ", kayak.price)
	kayak.price = 300
	fmt.Println(kayak.name, " ", kayak.category, " ", kayak.price)

	// -------- 구조체 값 부분 할당 ---------
	yacht := Product{
		name:  "yacht",
		price: 500,
	}
	// 명시되지 않은 필드는 기본값으로 생성됨

	fmt.Println(yacht.name, " ", yacht.category, " ", yacht.price)

	// ------ 구조체 초기화 추가적인 2가지 방법 --------
	ski := new(Product) // 1. new
	board := &Product{} // 2. 생성 후 포인터 주소
	// 둘다 생성된 Product 구조체에 대한 포인터 값임

	fmt.Println(ski.name, " ", ski.category, " ", ski.price)
	fmt.Println(board.name, " ", board.category, " ", board.price)

	// ------ 필드 위치를 통한 구조체 초기화 ---------
	ship := Product{"ship",
		"sea",
		400,
	}
	fmt.Println(ship.name, " ", ship.category, " ", ship.price)

	// ------ 임베디드 필드 정의하기 ---------------
	type StockLevel struct {
		Product // 임베디드 필드
		// 필드 타입이 구조체인 경우 임베디드 적합

		// 해당 필드 타입을 2번 사용해야 하는경우
		alterProduct Product
		// 이런 식으로 사용

		count int // 일반 필드
	}

	stockItem := StockLevel{
		Product: Product{
			name:     "kayak",
			category: "WaterSports",
			price:    275,
		},
		count: 100,
	}
	fmt.Println(
		stockItem.Product.name, // 구조체 이름으로 접근 가능
		" ",
		stockItem.Product.category,
		" ",
		stockItem.Product.price,
		" ",
		stockItem.count,
	)

	// ---------- 구조체 비교하기 ----------
	// 구조체가 달라도 모든 필드가 동일하면
	// if p1 == p2
	// 이런식으로 비교가 가능한데,
	// 슬라이스 필드가 있으면
	// 비교가 불가능하다.

	// ---------- 구조체 타입 간 변환 ---------
	type Item struct {
		name, category string
		price          int
	}

	prod := Product{
		name:     "boat",
		category: "sea",
		price:    100,
	}

	item := Item{
		name:     "boat",
		category: "sea",
		price:    100,
	}

	fmt.Println(prod == Product(item))
	// 동일한 필드, 동일한 순서, 동일한 값으로 정의되어 있다면
	// 명시적 타입 변환이 가능하다

	// ------ 익명 구조체 사용하기 -------
	printName(prod)
	printName(item)
	// 익명 구조체 사용 시
	// 정의와 동일한 구조체들을 전부 받을 수 있게 된다.

	// ------- 익명 구조체 정의와 동시에 값 넣기 -------
	var builder strings.Builder
	json.NewEncoder(&builder).Encode(struct {
		ProductName  string
		ProductPrice int
	}{
		prod.name,
		prod.price,
	})

	fmt.Println(builder.String())

	// -------- 구조체를 포함한 배열, 슬라이스, 맵 생성 --------
	array := [2]StockLevel{
		{
			Product: Product{"kayak", "WaterSports", 275},
			count:   150,
		},
		{
			Product: Product{"ship", "sea", 400},
			count:   300,
		},
	}

	slice := []StockLevel{
		{
			Product: Product{"kayak", "WaterSports", 275},
			count:   150,
		},
		{
			Product: Product{"ship", "sea", 400},
			count:   300,
		},
	}

	kvm := map[string]StockLevel{
		"kayak": {
			Product: Product{"kayak", "WaterSports", 275},
			count:   150,
		},
		"ship": {
			Product: Product{"ship", "sea", 400},
			count:   300,
		},
	}

	fmt.Println(array)
	fmt.Println(slice)
	fmt.Println(kvm["kayak"])

	// ------- 구조체와 포인터의 이해 --------
	p1 := Product{"kayak", "WaterSports", 275}
	p2 := p1  // 값이 복사됨
	p3 := &p1 // 같은 구조체 값을 바라봄

	p1.name = "origin kayak"
	fmt.Println("p1 : ", p1)
	fmt.Println("p2 : ", p2)
	fmt.Println("p3 : ", *p3)
	fmt.Println("p3.name : ", (*p3).name)
	fmt.Println("p3.name : ", p3.name)
	// 직접 포인터 값에 접근하는 것은 번거롭기에
	// Go에서는 바로 접근을 허용함

	// ------- 구조체 생성자 함수 ----------
	// 밑에 함수 있음
	kayak2 := newProduct("kayak2", "WaterSports", 275)
	kayak3 := newProduct("kayak3", "WaterSports", 300)
	fmt.Println(kayak2.price)
	fmt.Println(kayak3.price)

	// ------- 구조체 필드를 위한 포인터 타입 사용 -------
	// 위에 구조체, 아래 함수있음
	acme := &Supplier{"Acme Go", "New York"}
	products := [2]*PtrProduct{
		newPtrProduct("kayakPtr", "WaterSports", 275, acme),
		newPtrProduct("HatPtr", "Skiing", 42, acme),
	}

	for _, product := range products {
		fmt.Println("Name : ", product.name)
		fmt.Println("Supplicer City : ", product.Supplier.city)
		fmt.Println("Supplicer City : ", product.city)
		// 둘다 접근이 가능함!!
	}

	// ------- 포인터 필드 복사 이해 - 중요 ----------
	newAcme := &Supplier{"Acme Go", "New York"}
	p4 := newPtrProduct("kayakPtr", "WaterSports", 275, newAcme)
	p5 := *p4 // 역참조를 통해 주소값이 아닌 PtrProduct 자체를 복사하여 대입

	p4.name = "Origin kayakPtr"
	p4.Supplier.city = "hotel"

	fmt.Println("p4.name : ", p4.name, ", p5.name : ", p5.name)
	fmt.Println("p4.city : ", p4.city, ", p5.city : ", p5.city)
	// name은 다르지만, city는 같아짐!!
	// 분명 구조체를 새로 복사해서 가져온건데 왜그럴끼?
	// 현재 PtrProduct 구조체 안에는 포인터 필드가 있음
	// 복사되면서 같은 Supplier를 바라보는 주소값이 복사됨
	// => PtrProduct는 다르지만, 같은 Supplier를 참조하게됨

	// 내부 포인터 변수도 역참조를 통해 값을 복사해야함
	supplier := *p4.Supplier // 구조체 값 복사 후
	p5.Supplier = &supplier  // 주소 넣어 주기
	p5.city = "New York"

	fmt.Println("p4.name : ", p4.name, ", p5.name : ", p5.name)
	fmt.Println("p4.city : ", p4.city, ", p5.city : ", p5.city)

	// ------- 구조체 제로 값 및 구조체 포인터 이해 ---------
	// var prod Product     // 제로 값
	// var prodPtr *Product // nil
	// 포인터는 초기화를 안해주면 nil임
	// => 그렇다면 구조체 내부에 포인터 필드가 있다면??
	//    => 기본값으로라도 해당 포인터 필드를 정의해주어야 함
	prodSupp := PtrProduct{Supplier: &Supplier{}}
	fmt.Println(*prodSupp.Supplier)
}

// 익명 구조체 사용하기
func printName(val struct {
	name, category string
	price          int
}) {
	fmt.Println(val.name)
}

// 구조체 생성자 함수
// 이렇게 해야 복사된 구조체가 아닌 생성된 하나의 구조체를
// 받아서 사용 가능함
//
// 또 일관성있는 생성이 가능함
func newProduct(name, category string, price int) *Product {
	return &Product{name, category, price}
}

func newPtrProduct(name, category string, price int, supplier *Supplier) *PtrProduct {
	return &PtrProduct{name, category, price, supplier}
}
