package main

import "fmt"

type CategoryCountMessage struct {
	Category string
	Count    int

	// 고루틴 패닉 복구 2
	TerminalError interface{}
}

// 고루틴 패닉 복구 1, 2
func processCategories(categories []string, outChan chan<- CategoryCountMessage) {
	defer func() {
		if arg := recover(); arg != nil {
			// fmt.Println(arg)

			// 1. 간단하게 채널 닫아 main에서 생기는 데드락 방지하기
			// close(outChan)
			// 여기서 close를 해주지 않으면
			// main 함수에서 기다리기에 데드락이 발생하게 됨

			// 2. 종료되기 전 이유를 채널에 넘기고 종료하기
			outChan <- CategoryCountMessage{
				TerminalError: arg,
			}
			close(outChan)
		}
	}()

	channel := make(chan ChannelMessage, 10)
	go Products.TotalPriceAsync(categories, channel)
	for message := range channel {
		if message.CategoryError == nil {
			outChan <- CategoryCountMessage{
				Category: message.Category,
				Count:    int(message.Total),
			}
		} else {
			panic(message.CategoryError)
		}
	}
	close(outChan)
	// 이건 panic 발생 후 실행되지 않음
}

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
	// recoveryFunc := func() {
	// 	if arg := recover(); arg != nil {
	// 		if err, ok := arg.(error); ok {
	// 			fmt.Println("Error:", err.Error())
	// 			panic(err) // 디시 패닉 호출
	// 		} else if str, ok := arg.(string); ok {
	// 			fmt.Println("Message:", str)
	// 		} else {
	// 			fmt.Println("Panic recovered")
	// 		}
	// 	}
	// }
	// defer recoveryFunc()

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

	// -------------- 고루틴 패닉 복구 1 ---------------
	// categories := []string{"Watersports", "Chess", "Running"}

	// channel := make(chan CategoryCountMessage)
	// go processCategories(categories, channel)

	// for message := range channel {
	// 	fmt.Println(message.Category, "Total :", message.Count)
	// }

	// -------------- 고루틴 패닉 복구 2 ---------------
	categories := []string{"Watersports", "Chess", "Running"}

	channel := make(chan CategoryCountMessage)
	go processCategories(categories, channel)

	for message := range channel {
		if message.TerminalError == nil {
			fmt.Println(message.Category, "Total :", message.Count)
		} else {
			fmt.Println(message.TerminalError)
		}
	}
}
