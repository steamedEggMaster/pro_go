package main

import (
	"fmt"
	"math"
	"math/rand"
	"sync"
	"time"
)

var waitGroup = sync.WaitGroup{}
var rwmutex = sync.RWMutex{}

// 두 코드의 차이점을 잘 알아야한다.
// var readyCond = sync.NewCond(rwmutex.RLocker())
var readyCond = sync.NewCond(&rwmutex)

var squares = map[int]int{}

func generateSquares(max int) {
	rwmutex.Lock()
	println("Generating data...")
	for val := 0; val < max; val++ {
		squares[val] = int(math.Pow(float64(val), 2))
	}
	rwmutex.Unlock()
	println("Broadcating condition")
	readyCond.Broadcast()
	waitGroup.Done()
}

func readSquares(id, max, iterations int) {
	readyCond.L.Lock()
	for len(squares) == 0 {
		readyCond.Wait()
	}
	for i := 0; i < iterations; i++ {
		key := rand.Intn(max)
		fmt.Printf("#%v Read value: %v = %v\n", id, key, squares[key])
		time.Sleep(time.Millisecond * 100)
	}
	readyCond.L.Unlock()
	waitGroup.Done()
}

func main() {
	rand.Seed(time.Now().UnixNano())
	numRoutines := 2
	waitGroup.Add(numRoutines)
	for i := 0; i < numRoutines; i++ {
		go readSquares(i, 10, 5)
	}
	waitGroup.Add(1)
	go generateSquares(10)
	waitGroup.Wait()
	fmt.Printf("Cached values: %v\n", len(squares))
}
