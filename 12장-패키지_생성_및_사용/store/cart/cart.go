package cart

import "packages/store"

type Cart struct {
	CustomerName string
	Products     []store.Product
}

func (cart *Cart) GetTotal() (total int) {
	for _, p := range cart.Products {
		total += p.Price()
	}
	return // total을 굳이 명시 안해도 됨
}
