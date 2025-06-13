package store

// 3.
type RentalBoat struct {
	*Boat
	IncludeCrew bool
}

func NewRentalBoat(
	name string, price, capacity int, motorized, crewed bool,
) *RentalBoat {
	return &RentalBoat{NewBoat(name, price, capacity, motorized), crewed}
}
