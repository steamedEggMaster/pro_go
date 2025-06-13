package store

// 4.
type SpecialDeal struct {
	// Product에 있는 동일한 2개의 필드 중복 정의
	Name  string
	price int
	*Product
}

func NewSpecialDeal(name string, discount int, p *Product) *SpecialDeal {
	return &SpecialDeal{name, p.price - discount, p}
}

func (deal *SpecialDeal) GetDetails() (string, int, int) {
	return deal.Name, deal.price, deal.Price(0)
	// deal.Price(0)가 문제가 되는데,
	// 순서를 정리해보자
	// 1. SpecialDeal.price가 정의되어
	//    Product.price는 승격하지 못한 상태
	//    => 외부에서 .price 접근 시 SpecialDeal.price이 가져와짐
	// 2. Product.Price는 승격되어
	//    deal.Price로 접근이 되는 상태.
	// 3. 하지만,
	//    deal.Price 내부에서는 SpecialDeal.price가 아닌,
	//    Product.price 값을 사용중임.
	// => 사용하는 변수가 다르다는 문제점 발생!!
	//
	// 이를 해결하기 위해,
	// 아래와 같이 수정하여 명확히 해주는 것이 좋다.
	// deal.Product.Price(0)

	// 만약, SpecialDeal.price를 사용하는 Price 함수를 사용해야한다면
	// 인클로징 타입에서 동일한 함수를 만들어야 한다.
}
