package store

// 1.
type Product struct {
	Name, Category string
	price          int
}

func NewProduct(name, category string, price int) *Product {
	return &Product{name, category, price}
}

func (p *Product) Price(taxRate int) int {
	return p.price + (p.price * taxRate)
}

// 8.
type Describable interface {
	GetName() string
	GetCategory() string
	ItemForSale
}

func (p *Product) GetName() string {
	return p.Name
}

func (p *Product) GetCategory() string {
	return p.Category
}
