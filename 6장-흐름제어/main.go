package main

import (
	"fmt"
	"strconv"
)

func main() {
	// ------------ 초기화 If 문 --------
	priceString := "275"

	if kayakPrice, err := strconv.Atoi(priceString); err == nil {
		fmt.Println(kayakPrice)
	} else {
		fmt.Println(kayakPrice) // else 나 if else에서도 사용 가능
	}

	// ------------ for 문 ------------
	count := 0
	for { // 무한 루프
		count++
		if count == 3 {
			break
		}
	}

	for count <= 6 { // 조건 for문
		count++
	}

	for i := 0; i < count; i++ { // 초기화 및 종결 for문
		fmt.Println(i)
	}

	stringV := "hifaker"
	for i, v := range stringV {
		fmt.Println(i, " ", v) // v가 아스키코드값으로 나옴
		fmt.Println(i, " ", string(v))
	}

	// --------- 시퀀스 열거 for문 ----------

	list := []int{1, 2, 3}
	for index, value := range list {
		fmt.Println(index, " ", value)
	}

	for index := range list {
		fmt.Println(index)
	}

	// ----------- Switch 문 -------------
	product := "Kayak"
	for _, character := range product {
		switch character {
		case 'K', 'k':
			fmt.Println(string(character))
			//break
			fallthrough
		case 'a':
			fmt.Println(string(character))
		default:
			fmt.Println("아무것도 아닌 " + string(character))
		}
	}

	c := 300
	switch cV := c / 2; cV { // 초기화 스위치 문
	case cV:
	}

	for i := 0; i <= 10; i++ {
		switch { // 조건문으로 사용 가능한 go 스위치 문
		case i == 0:
			fmt.Println("hi i am ", i)
		case i < 3:
			fmt.Println("good i am ", i)
		}
	}

	// ---------- 라벨 + goto --------------

	intCount := 300
	switch {
	case intCount == 300:
		goto gotoTest
	}

gotoTest:
	fmt.Println("goto Test")
}
