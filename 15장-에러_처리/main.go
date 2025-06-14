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
	// categories := []string{"Watersports", "Chess", "Running"}

	// channel := make(chan ChannelMessage, 10)

	// go Products.TotalPriceAsync(categories, channel)

	// for message := range channel {
	// 	if message.CategoryError == nil {
	// 		fmt.Println(message.Category, "Total :", ToCurrency(message.Total))
	// 	} else {
	// 		fmt.Println(message.CategoryError)
	// 	}
	// }

	// ----------- 복구 불가능한 에러 처리 -------------
	// categories := []string{"Watersports", "Chess", "Running"}

	// channel := make(chan ChannelMessage, 10)

	// go Products.TotalPriceAsync(categories, channel)

	// for message := range channel {
	// 	if message.CategoryError == nil {
	// 		fmt.Println(message.Category, "Total :", ToCurrency(message.Total))
	// 	} else {
	// 		panic(message.CategoryError)
	// 		// panic()과 error를 함께 호출하는 것은 유용한 방법
	// 		// panic : 함수 실행 중지 및 모든 defer 함수 실행 및 종료
	// 	}
	// }

	// ------------- 패닉 복구 ----------------
	recoveryFunc := func() {
		if arg := recover(); arg != nil {
			if err, ok := arg.(error); ok {
				fmt.Println("Error:", err.Error())
				panic(err) // 디시 패닉 호출
			} else if str, ok := arg.(string); ok {
				fmt.Println("Message:", str)
			} else {
				fmt.Println("Panic recovered")
			}
		}
	}
	defer recoveryFunc()

	categories := []string{"Watersports", "Chess", "Running"}

	channel := make(chan ChannelMessage, 10)

	go Products.TotalPriceAsync(categories, channel)

	for message := range channel {
		if message.CategoryError == nil {
			fmt.Println(message.Category, "Total :", ToCurrency(message.Total))
		} else {
			panic(message.CategoryError)
			// panic()과 error를 함께 호출하는 것은 유용한 방법
			// panic : 함수 실행 중지 및 모든 defer 함수 실행 및 종료
		}
	}
}
