package main

import (
	"fmt"
	"math"
	"strconv"
)

func main() {
	// --------------- 오버플로 ----------------------
	// 의도적 오버플로
	intVal := math.MaxInt64
	floatVal := math.MaxFloat64

	fmt.Println(intVal * 2)
	// 래핑??
	// -2 됨 -> 오버플로우 발생 → 64비트에서 앞자리가 1이 되면서 음수 처리

	fmt.Println(floatVal * 2)
	// float은 Inf 처리됨 +-Inf
	fmt.Println(math.IsInf(floatVal*2, 0)) // Inf인지 확인

	// --------------- % 음수가 가능한 나머지 연산 --------
	minus := -3
	fmt.Println(minus % 2) // -1

	// ------------- 비교자 넣기 --------------
	left := 300
	right := 200
	isRight := left > right
	fmt.Println(isRight)

	// ------------ 포인터 비교 ----------------
	p := 100
	pointer1 := &p
	pointer2 := &p

	fmt.Println(pointer1 == pointer2)

	// ------------ 명시적 타입 변환 -------------
	floatV := 255.01
	fmt.Println(int(floatV)) // 자료형(변수)

	floatV2 := 255.6
	fmt.Println(math.Ceil(floatV2), " ", math.Floor(floatV2), " ", math.Round(floatV2), " ", math.RoundToEven(floatV2)) // RoundToEven : 가장 가까운 짝수로 반올림

	// ----------- 문자열 파싱 -------------
	// 1. ParseBool
	stringV := "true" // "false", "TRUE", "FALSE", "True", "False", "T", "F", "0", "1"
	isTrue, err := strconv.ParseBool(stringV)
	if err != nil {
		fmt.Println("can not parse")
	} else {
		fmt.Println(isTrue)
	}

	// 2. ParseInt / ParseUint
	intV := "100"
	pInt, err := strconv.ParseInt(intV, 0, 8)
	// func ParseInt(s string, base int, bitSize int) (i int64, err error)
	// 	s	: 변환할 문자열 ("123", "0xff", "0755" 등)
	// base	: 진수 (2진수, 10진수, 16진수 등). 0이면 자동 감지
	// bitSize : 몇 비트 정수로 해석할지. 8, 16, 32, 64 중 하나를 줌
	fmt.Println(pInt)

	// 3. ParseFloat
	floatV3 := "432.44"
	pFloat, err := strconv.ParseFloat(floatV3, 64) // float64 or 32
	fmt.Println(pFloat)

	// ------------ 문자열 값 포매팅 ----------
	// 부동소수점 값 모패팅
	valFloat := 243.66
	Fstring := strconv.FormatFloat(valFloat, 'f', 2, 64)
	Estring := strconv.FormatFloat(valFloat, 'e', -1, 64)

	fmt.Println("Format F : " + Fstring)
	fmt.Println("Format E : " + Estring)
}
