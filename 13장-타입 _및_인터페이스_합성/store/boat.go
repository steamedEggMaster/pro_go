package store

// 2.
//
//	인클로징 타입
type Boat struct {
	// 임베디드 타입
	// 합성 기능의 중요한 역할 수행
	*Product
	Capacity  int
	Motorized bool
}

func NewBoat(name string, price int, capacity int, motorized bool) *Boat {
	return &Boat{
		NewProduct(name, "WaterSports", price), capacity, motorized,
	}
}
