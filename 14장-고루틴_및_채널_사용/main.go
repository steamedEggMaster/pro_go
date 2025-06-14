package main

import (
	"fmt"
	"time"
)

// func receiveDispatches(channel <-chan DispatchNotification) {
// 	for details := range channel {
// 		fmt.Println("Dispatch to", details.Customer, ":", details.Quantity, "x", details.Product.Name)
// 	}
// 	fmt.Println("Channel has been closed")
// }

// func enumerateProducts(channel chan<- *Product) {
// 	for _, p := range ProductList[:3] {
// 		channel <- p
// 		time.Sleep(time.Microsecond * 800)
// 	}
// 	close(channel)
// }

// select 문 - 블로킹 없는 전송
// func enumerateProducts(channel chan<- *Product) {
// 	for _, p := range ProductList[:3] {
// 		select {
// 		case channel <- p:
// 			fmt.Println("Sent Product:", p.Name)
// 		default:
// 			fmt.Println("Discarding product:", p.Name)
// 			time.Sleep(time.Second)
// 		}
// 	}
// 	close(channel)
// }

func enumerateProducts(channel1, channel2 chan<- *Product) {
	for _, p := range ProductList {
		select {
		case channel1 <- p:
			fmt.Println("Sent via channel 1")
		case channel2 <- p:
			fmt.Println("Sent via channel 2")
		}
	}
	close(channel1)
	close(channel2)
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
	// dispatchChannel := make(chan DispatchNotification, 100)

	// // 1. 변수로 분리
	// var sendOnlyChannel chan<- DispatchNotification = dispatchChannel
	// var receiveOnlyChannel <-chan DispatchNotification = dispatchChannel

	// go DispatchOrders(sendOnlyChannel)
	// receiveDispatches(receiveOnlyChannel)
	// // 2. 명시적 형변환
	// go DispatchOrders(chan<- DispatchNotification(dispatchChannel))
	// receiveDispatches((<-chan DispatchNotification)(dispatchChannel))

	// ------ Select문 - 블로킹 없는 수신 ---------
	// 	dispatchChannel := make(chan DispatchNotification, 100)
	// 	go DispatchOrders(chan<- DispatchNotification(dispatchChannel))

	//	for {
	//		select {
	//		case details, ok := <-dispatchChannel:
	//			if ok {
	//				fmt.Println("Dispatch to", details.Customer, ":", details.Quantity, "x", details.Product.Name)
	//			} else {
	//				fmt.Println("Channel has been closed")
	//				goto alldone
	//			}
	//		default:
	//			fmt.Println("-- No message ready to be received")
	//			time.Sleep(time.Millisecond * 500)
	//		}
	//	}
	//
	// alldone:
	//
	//	fmt.Println("All values received")

	// -------- select 문 - 여러 채널로 수신 ---------
	// 	dispatchChannel := make(chan DispatchNotification, 100)
	// 	go DispatchOrders(chan<- DispatchNotification(dispatchChannel))
	// 	productChannel := make(chan *Product)
	// 	go enumerateProducts(productChannel)

	// 	openChannels := 2

	//	for {
	//		select {
	//		case details, ok := <-dispatchChannel:
	//			if ok {
	//				fmt.Println("Dispatch to", details.Customer, ":", details.Quantity, "x", details.Product.Name)
	//			} else {
	//				fmt.Println("Dispatch channel has been closed")
	//				dispatchChannel = nil
	//				openChannels--
	//			}
	//		case product, ok := <-productChannel:
	//			if ok {
	//				fmt.Println("Product:", product.Name)
	//			} else {
	//				fmt.Println("Product channel has been closed")
	//				productChannel = nil
	//				// 이것을 하지 않으면
	//				// 채널이 닫혀도 select문에 의해 해당 case가 계속 실행됨
	//				openChannels--
	//			}
	//		default:
	//			if openChannels == 0 {
	//				goto alldone
	//			}
	//			fmt.Println("-- No message ready to be received")
	//			time.Sleep(time.Millisecond * 500)
	//		}
	//	}
	//
	// alldone:
	//
	//	fmt.Println("All values received")

	// -------- select 문 - 블로킹 없는 전송 --------------
	// 위에 함수 있음
	// productChannel := make(chan *Product, 5)
	// go enumerateProducts(productChannel)

	// time.Sleep(time.Second)

	// for p := range productChannel {
	// 	fmt.Println("Received product:", p.Name)
	// }

	// -------- Select 문 - 여러 채널로 전송 -------------
	c1 := make(chan *Product, 2)
	c2 := make(chan *Product, 2)
	go enumerateProducts(c1, c2)

	time.Sleep(time.Second)

	for p := range c1 {
		fmt.Println("Channel 1 received product:", p.Name)
	}
	for p := range c2 {
		fmt.Println("Channel 2 received product:", p.Name)
	}
}
