package main

import (
	"fmt"
	"time"
)

func main() {
	fmt.Println("main function started")
	CalcStoreTotal(Products)
	// 리스트 14-8
	time.Sleep(time.Second * 5)
	fmt.Println("main function complete")
}
