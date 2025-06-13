package main

import "fmt"

type Product struct {
	name, category string
	price          int
}

func newProduct(name, category string, price int) *Product {
	return &Product{name, category, price}
}

//  1. 메서드 만들기
//     리시버
func (product *Product) printDetalis() {
	fmt.Println(product.name, " ", product.category, " ", product.price, " ", product.calcTax(5, 10))
}

// 2. 결과가 있는 메서드
func (product *Product) calcTax(rate, threshold int) int {
	if product.price > threshold {
		return product.price + (product.price * rate)
	}
	return product.price
}

// 3. 메서드 오버로딩 이해
type Supplier struct {
	name, city string
}

// 리시버 타입이 다르면 동일한 메서드가 허용됨
func (supplier *Supplier) printDetalis() {
	fmt.Println(supplier.name, " ", supplier.city)
}

// 3-1. 아래처럼 동일한 이름, 동일한 리시버를 쓰면 매개변수 상관없이 에러 발생
// func (supplier *Supplier) printDetalis(showName bool) {
// 	fmt.Println(supplier.name, " ", supplier.city)
// }

// 3-2. 아래처럼 기본 타입 리시버 써도 매개변수 상관없이 에러 발생
// func (supplier Supplier) printDetalis(showName bool) {
// 	fmt.Println(supplier.name, " ", supplier.city)
// }

// 4-1. 리시버 타입을 사용한 메서드 호출
func (s Supplier) testMethod() {
	fmt.Println(s.name, " ", s.city)
}

// 5. 타입 별칭을 통한 메서드 호출
type ProductList []Product

func (products *ProductList) calcCategoryTotals() map[string]int {
	totals := make(map[string]int)
	for _, product := range *products {
		totals[product.category] = totals[product.category] + product.price
	}
	return totals
}

// 6. 인터페이스 정의 및 사용
type Expense interface {
	getName() string
	getCost(annual bool) int
}

// 6-1. 구조체에 인터페이스의 모든 함수 구현하기
func (p Product) getName() string {
	return p.name
}

func (p Product) getCost(_ bool) int { // 매개변수가 필요하지 않은 경우
	return p.price
}

// 7. 함수 내 인터페이스 사용
func calcToal(expenses []Expense) (total int) {
	for _, item := range expenses {
		total += item.getCost(true)
	}
	return total
}

// 8. 구조체 필드로 인터페이스 사용
type Account struct {
	accountNumber int
	expenses      []Expense
}

func main() {
	// --------- 1. 메서드 만들기 ------------
	products := []*Product{
		newProduct("kayak", "WaterSports", 275),
		newProduct("ship", "sea", 400),
	}

	for _, prod := range products {
		prod.printDetalis()
	}

	// ---------- 2. 결과가 있는 메서드 -----------
	// 위에 코드 보기

	// ---------- 3. 메서드 오버로딩 이해 -----------
	suppliers := []*Supplier{
		{"kayak", "WaterSports"},
		{"ship", "sea"},
	}

	for _, sup := range suppliers {
		sup.printDetalis()
	}

	// --------- 4. 포인터와 값 리시버 이해 ---------
	// 현재 위에서 정의한 메서드는 포인터 리시버임
	// 하지만 저 메서드를 사용하기 위해서 바로 위의 코드처럼
	// *Supplier 타입으로 만들 필요가 없음
	// => Supplier라고 해도 문제없이 사용 가능함
	//    => Go가 알아서 주소값을 취하여
	//    => 값 복사 없이 진행됨
	suppliersTest := []Supplier{
		{"kayak", "WaterSports"},
		{"ship", "sea"},
	}

	for _, sup := range suppliersTest {
		sup.printDetalis()
	}

	// 반대로 값 리시버를 가진 메서드를 사용 시
	// &형태로 정의한 포인터 변수에서
	// 해당 메서드를 부르면
	// => Go가 알아서 역참조하여
	//    => 값 복사되어 메서드가 실행됨

	// --------- 4-1. 리시버 타입을 사용한 메서드 호출 ---------
	// 리시버 타입을 통해 메서드 호출이 가능한데,
	// 1. 리시버가 값 타입인 경우
	Supplier.testMethod(Supplier{"boat", "sea"})

	// 2. 리시버가 포인터 타입인 경우
	//    : 포인터 타입을 통해 호출하고, 포인터 인수를 전달해야 함
	(*Supplier).printDetalis(&Supplier{"boat", "sea"})

	// 포인터 타입을 통한 호출 시
	// 4번과 달리 자동 변환 처리가 안됨
	// => 철저히 따라야함

	// --------- 5. 타입 별칭으로 메서드 정의 ------------
	productList := ProductList{
		{"kayak", "WaterSports", 275},
		{"ship", "sea", 400},
	}

	for category, total := range productList.calcCategoryTotals() {
		fmt.Println(category, " ", total)
	}

	// --------- 6. 인터페이스 정의 및 사용 ------------
	expense := []Expense{ // 구현체들이 들어갈 수 있음
		Product{"kayak", "WaterSports", 275},
		Product{"ship", "sea", 400},
	}

	for _, ex := range expense {
		fmt.Println(ex.getName(), " ", ex.getCost(true))
	}

	// --------- 7. 함수 내 인터페이스 사용 ----------
	fmt.Println("total :", calcToal(expense))

	// -------- 8. 구조체 필드로 인터페이스 사용 ---------
	account := Account{
		accountNumber: 12345,
		expenses: []Expense{
			Product{"kayak", "WaterSports", 275},
			Product{"ship", "sea", 400},
		},
	}
	for _, expense := range account.expenses {
		fmt.Println(expense.getName(), " ", expense.getCost(true))
	}

	// ------- 9. 포인터 메서드 리시버 효과 이해 --------
	product := Product{"kayak", "WaterSports", 275}
	var expense1 Expense = product // 값 복사됨
	product.price = 100

	fmt.Println(product.price)
	fmt.Println(expense1.getCost(true))

	var expense2 Expense = &product // 참조됨
	fmt.Println(expense2.getCost(true))

	// 현재 인터페이스를 (p Product) 로 구현하고 있음 - 값 타입
	// => Expose 인터페이스에는 값 또는 포인터 타입이 들어갈 수 있음
	// 인터페이스를 (p *Product) 로 구현할 경우 - 포인터 타입
	// => 값 타입은 들어갈 수 없게 됨
	// 메서드로 들어갈 땐 값이 복사되었지만,
	// Interface 자체에는 구현체에 대한 참조가 가능한데
	// 인터페이스 타입에 대한 변경없이 주소값만 넣어주면 참조가 바로 발동함
	// => 코드 균일성 증가

	// -------- 10. 타입 단언 수행 --------
	// 위에서 사용한 코드들은 인터페이스에 정의된 함수만 접근 가능했음
	// ex 8번 코드
	//
	// 이제 원하는 것은, 타입 단언을 통한 구현체에 정의된 값 접근하기
	expense3 := []Expense{ // 구현체들이 들어갈 수 있음
		Product{"kayak", "WaterSports", 275},
		Product{"ship", "sea", 400},
	}

	for _, expense := range expense3 {
		p := expense.(Product) // 타입 단언
		fmt.Println(p.name, p.category, p.price)
	}
	// 타입 단언에 실패할 수 있기 때문에
	for _, expense := range expense3 {
		p, ok := expense.(Product) // 타입 단언
		if !ok {
			fmt.Println(p.name, p.category, p.price)
		}
	}

	// -------- 11. 동적 타입에 대한 Switch 문 ----------
	for _, expense := range expense3 {
		switch value := expense.(type) {
		case Product: // 구현체
			fmt.Println(value.category)
		default:
			fmt.Println("구현체가 아닙니다")
		}
	}

	// ---------- 12. 빈 인터페이스 사용 -----------
	fmt.Println("12. 빈 인터페이스 사용")

	// 빈 인터페이스는 여러 타입을 넣을 수 있음
	data := []interface{}{
		expense,
		Product{"kayak", "WaterSports", 275},
		&Product{"ship", "sea", 400},
		"this is string",
		100,
		true,
	}

	for _, item := range data {
		switch value := item.(type) {
		case Product:
			fmt.Println(value.name, value.category, value.price)
		case *Product:
			fmt.Println(value.name, value.category, value.price)
		case string, int, bool:
			fmt.Println(value)
		default:
			fmt.Println("Default :", value)
		}
	}

	// --------- 13. 함수 매개변수로 빈 인터페이스 사용 ----------
	for _, item := range data {
		processItem(item)
	}
	processItem2(data...) // ...을 꼭 붙이자!
}

// 13-1. 함수 매개변수로 빈 인터페이스 사용
// 1개씩 받기
func processItem(item interface{}) {
	fmt.Println("processItem")
	switch value := item.(type) {
	case Product:
		fmt.Println(value.name, value.category, value.price)
	case *Product:
		fmt.Println(value.name, value.category, value.price)
	case string, int, bool:
		fmt.Println(value)
	default:
		fmt.Println("Default :", value)
	}
}

// 13-2. 여러 값 바로 받기
func processItem2(data ...interface{}) {
	fmt.Println("processItem2")
	for _, item := range data {
		switch value := item.(type) {
		case Product:
			fmt.Println(value.name, value.category, value.price)
		case *Product:
			fmt.Println(value.name, value.category, value.price)
		case string, int, bool:
			fmt.Println(value)
		default:
			fmt.Println("Default :", value)
		}
	}
}
