package store

import "fmt"

// 6.
// var categoryMaxPrices = map[string]int{
// 	"WaterSports": 250 + (250 * defaultTaxRate),
// 	"Soccer":      150 + (150 * defaultTaxRate),
// 	"Chess":       50 + (50 * defaultTaxRate),
// }
// 위처럼 하나하나 해주지 않고,
// 아래처럼 init을 통해 수행 가능

var categoryMaxPrices = map[string]int{
	"WaterSports": 250,
	"Soccer":      150,
	"Chess":       50,
}

// 해당 패키지에서 자동으로 호출됨
// 직접 호출 불가
// 단일 파일에서 초기화 함수 여러번 정의 가능
// 다른 초기화 함수에 의존적이면 안됨
func init() {
	fmt.Println("init 초기화 함수 실행됨")
	for category, price := range categoryMaxPrices {
		categoryMaxPrices[category] = price + (price * defaultTaxRate)
	}
}

func (taxRate *taxRate) calcTax(product *Product) (price int) {
	if product.price > taxRate.threshold {
		price = product.price + (product.price * taxRate.rate)
	} else {
		price = product.price
	}
	if max, ok := categoryMaxPrices[product.Category]; ok && price > max {
		price = max
	}
	return
}

// 3.
const defaultTaxRate int = 2
const minThreshold = 10

type taxRate struct {
	rate, threshold int
}

func newTaxRate(rate, threshold int) *taxRate {
	if rate == 0 {
		rate = defaultTaxRate
	}
	if threshold < minThreshold {
		threshold = minThreshold
	}
	return &taxRate{rate, threshold}
}

// func (taxRate *taxRate) calcTax(product *Product) int {
// 	if product.price > taxRate.threshold {
// 		return product.price + (product.price * taxRate.rate)
// 	}
// 	return product.price
// }
