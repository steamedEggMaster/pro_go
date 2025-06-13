package store

// 3.
var standardTax = newTaxRate(2, 20)

// 1.
type Product struct {
	Name, Category string
	price          int
}

// 2.
func NewProduct(name, category string, price int) *Product {
	return &Product{name, category, price}
}

func (p *Product) Price() int {
	return standardTax.calcTax(p)
}

func (p *Product) SetPrice(price int) {
	p.price = price
}
