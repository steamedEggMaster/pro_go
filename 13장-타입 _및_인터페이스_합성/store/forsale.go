package store

type ItemForSale interface {
	Price(taxRate int) int
}
