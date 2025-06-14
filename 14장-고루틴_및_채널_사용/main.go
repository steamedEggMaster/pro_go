package main

import "fmt"

func receiveDispatches(channel <-chan DispatchNotification) {
	for details := range channel {
		fmt.Println("Dispatch to", details.Customer, ":", details.Quantity, "x", details.Product.Name)
	}
	fmt.Println("Channel has been closed")
}

func main() {
	// fmt.Println("main function started")
	// CalcStoreTotal(Products)
	// // 리스트 14-8
	// // time.Sleep(time.Second * 5)
	// fmt.Println("main function complete")

	// ------- 미정 개수 값 전송 및 수신 ---------
	// dispatchChannel := make(chan DispatchNotification, 100)
	// go DispatchOrders(dispatchChannel)
	// for {
	// 	if details, open := <-dispatchChannel; open {
	// 		fmt.Println("Dispatch to", details.Customer, ":", details.Quantity, "x", details.Product.Name)
	// 	} else {
	// 		fmt.Println("Channel has been closed")
	// 		break
	// 	}
	// }

	// ------------ 채널 값 열거 -------------
	// dispatchChannel := make(chan DispatchNotification, 100)
	// go DispatchOrders(dispatchChannel)
	// for details := range dispatchChannel {
	// 	fmt.Println("Dispatch to", details.Customer, ":", details.Quantity, "x", details.Product.Name)
	// }
	// fmt.Println("Channel has been closed")

	// ----------- 채널 인수 방향 제한 -----------
	dispatchChannel := make(chan DispatchNotification, 100)

	// 1. 변수로 분리
	var sendOnlyChannel chan<- DispatchNotification = dispatchChannel
	var receiveOnlyChannel <-chan DispatchNotification = dispatchChannel

	go DispatchOrders(sendOnlyChannel)
	receiveDispatches(receiveOnlyChannel)
	// 2. 명시적 형변환
	go DispatchOrders(chan<- DispatchNotification(dispatchChannel))
	receiveDispatches((<-chan DispatchNotification)(dispatchChannel))
}
