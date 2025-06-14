package main

import "fmt"

func main() {
	// fmt.Println("main function started")
	// CalcStoreTotal(Products)
	// // 리스트 14-8
	// // time.Sleep(time.Second * 5)
	// fmt.Println("main function complete")

	// ------- 미정 개수 값 전송 및 수신 ---------
	dispatchChannel := make(chan DispatchNotification, 100)
	go DispatchOrders(dispatchChannel)
	for {
		if details, open := <-dispatchChannel; open {
			fmt.Println("Dispatch to", details.Customer, ":", details.Quantity, "x", details.Product.Name)
		} else {
			fmt.Println("Channel has been closed")
			break
		}
	}
}
