package main

import "fmt"

func main() {
	// categories := []string{"Watersports", "Chess", "Running"}

	// for _, cat := range categories {
	// 	total, err := Products.TotalPrice(cat)
	// 	if err != nil {
	// 		fmt.Println(cat, ": (no such category)")
	// 	} else {
	// 		fmt.Println(cat, "Total:", ToCurrency(total))
	// 	}
	// }

	// --------- 채널을 통한 에러 보고 --------------
	categories := []string{"Watersports", "Chess", "Running"}

	channel := make(chan ChannelMessage, 10)

	go Products.TotalPriceAsync(categories, channel)

	for message := range channel {
		if message.CategoryError == nil {
			fmt.Println(message.Category, "Total :", ToCurrency(message.Total))
		} else {
			fmt.Println(message.Category, ": (no such category)")
		}
	}
}
