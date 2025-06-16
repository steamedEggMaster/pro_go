1. io.Reader 인터페이스의 단일 메서드
   Read(p []byte) (n int, err error) : 데이터 소스(파일, 네트워크, 버퍼 등)에서 byte 슬라이스에 데이터를 읽어드림
                                       - n : 읽은 바이트 수
                                       - 데이터 끝에 도달하면 io.EOF 라는 에러를 반환

2. io.Writer 인터페이스의 단일 메서드
   Write(p []byte) (n int, err error) : byte 슬라이스에 담긴 데이터를 대상(파일, 네트워크, 버퍼 등)에 씀
                                        - n : 기록한 byte 수

3. io 패키지의 Reader 및 Writer 유틸리티 함수 사용
   io.Copy(w, r)                         : EOF 반환 or 다른 에러 발생 시까지 Reader -> Writer로 데이터 복사
                                           - 결과 : 복사된 바이트 개수 + error
     .CopyBuffer(w, r, buffer)           : 사용자 지정 버퍼 사용한 Copy
     .CopyN(w, r, count int)             : count 수 만큼만 바이트 복사
     .ReadAll(r) ([]byte, error)         : Reader로부터 모든 데이터를 읽어 byte 슬라이스로 반환
     .ReadAtLeast(r, byteSlice, min int) : Reader로부터 최소 min 만큼의 byte를 읽어 byteSlice에 배치
                                           - 최소만큼 못읽을 경우, error 반환
     .ReadFull(r, byteSlice)             : Reader로부터 읽어 byteSlice에 배치
                                           - byteSlice가 다 채워지기 전 EOF 발생 시 error 반환 
     .WriteString(w, str)                : 문자열 str을 []byte 변환 없이 직접 Writer에 씀
                                           - 내부적으로 Write([]byte(str)) 호출

4. 특수 Reader 및 Writer 사용
   io.Pipe()                        : Writer가 쓰면 Reader가 읽는 형태의 메모리 기반 연결 쌍 생성
                                      ex) pr, pw := io.Pipe()
                                          go func() {
                                             defer pw.Close()
                                             pw.Write([]byte("안녕하세요!"))
                                          }()
                                          io.Copy(os.Stdout, pr) // 출력: 안녕하세요!
     .MultiReader(...readers)       : 여러 Reader를 하나의 Reader처럼 연결해서 읽음
                                      - 앞의 Reader가 EOF면 다음 Reader로 넘어감
     .MultiWriter(...writers)       : 한번의 Write() 호출로 여러 Writer에 동시에 전송가능한 Writer 반환
                                      ex) f, _ := os.Create("log.txt")
                                          mw := io.MultiWriter(os.Stdout, f)
                                          mw.Write([]byte("기록 중...\n")) // 터미널 + 파일에 동시에 출력
     .LimitReader(r, limit int64)   : 최대 limit 바이트까지만 읽은 후 EOF 수행하는 읽기 크기 제한된 Reader 반환
                                      - 스트리밍 API에서 과도한 데이터 수신 방지용

4-1. Pipe 함수의 Closer 메서드
     pw.Close() : Writer를 닫음. 이후 Writer에 대한 후속 쓰기 작업은 모두 error 반환
     pr.Close() : Reader  '' . 이후 Reader에   ''    읽기 작업은 모두 0Byte와 EOF 에러 반환

5. bufio 패키지 - Reader와 Writer에 버퍼 추가
   1. Redaer
   bufio.NewReader()                : io.Reader 위에 기본 크기(4097 bytes)의 버퍼를 추가한 *bufio.Reader 생성
                                      - 매번 시스템 호출할 필요없이 버퍼에서 읽기 가능 -> 성능 향상
        .NewReaderSize(r, size int) : size bytes 만큼 버퍼 크기를 직접 지정하여 *bufio.Reader 생성
                                      - size 크기 너무 작 -> 자주 I/O 발생
                                                     큼 -> 메모리 낭비
   
   2. Writer
   bufio.NewWriter()            : io.Writer 위에 기본 크기(4097 bytes)의 버퍼를 추가한 *bufio.Writer 생성
        .NewWriterSize(w, size) : size bytes 만큼 버퍼 크기를 직접 지정하여 *bufio.Writer 생성
                                  - 버퍼가 가득 차거나, Flush() 함수 호출되면 w.Write()이 수행됨

5-1. bufio.Reader의 메서드
     br.Buffered()         : 현재 버퍼에 있는 읽기 가능한 데이터 바이트 수 반환
                             - 디버깅 or 성능 측정 시 사용
       .Discard(count int) : 버퍼에서 최대 n 바이트만큼 읽지 않고 건너뜀
                             - 결과 : 실제 건너뛴 바이트 수, error
       .Peek(count int)    : 버퍼에서 count byte 만큼 미리보기 수행 => 버퍼에서 빼지 않음
                             - count가 버퍼 사이즈보다 크면 안됨
                             - 결과 : []byte, error
       .Reset(reader)      : 기존 bufio.Reader의 데이터 삭제 후, 새 Reader로 교체하여 후속 읽기 진행
       .Size()             : 버퍼의 전체 바이트 크기(int) 반환

5-2. bufio.Writer의 메서드
     bw.Available()   : 버퍼에 남아있는 여유 공간 바이트 수 반환
       .Buffered()    : 버퍼에 현재 쌓여있는 데이터 크기
       .Flush()       : 버퍼에 있는 데이터를 실제 Writer에 쓰기
                        - Write()만 호출 시 실제로 파일/출력으로 가지 않음 -> 반드시 Flush() 수행
       .Reset(writer) : 기존 bufio.Writer의 데이터 삭제 후, 새 Writer로 교체하여 후속 쓰기 수행
       .Size()        : 버퍼의 전체 바이트 크기(int) 반환
   