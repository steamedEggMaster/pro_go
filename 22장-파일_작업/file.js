##### 파일 읽기
1. os 패키지 함수
   os.ReadFile(path string) ([]byte, error) : path에 위치한 파일을 한번에 전부 읽어 byte 슬라이스로 반환
                                              - 내부적으로 Open -> Read -> Close를 한번에 처리
     .Open(path string) (*os.File, error) : 파일을 열어 *os.File 핸들 반환
                                            - 관련 메서드 수행 가능
                                            - 스트리밍 방식, 큰파일 등에 적합
                                            - *os.File은 Reader 인터페이스 구현
                                            - defer file.Close() 필수!!

- os 패키지는 표준 입력, 표준 출력, 표준 에러에 대한 엑세스를 제공하는 Stdin, Stdout, Stderr라는 이름의 세 가지 *File 번수 정의

2. 파일의 특정 위치에서 읽기 위한 *os.File 구조체의 메서드
   f.ReadAt(slice, offset int64) (n int, error) : 파일의 offset 위치에서부터 데이터를 읽어 byte 슬라이스에 저장
                                                  - 현재 파일 포인터(Seek 위치)와 무관하게 동작
                                                  - 병렬 읽기에도 안전
                                                  - 결과 : 읽은 바이트 수, 에러
    .Seek(offset int64, how int) (int64, error) : 파이르이 읽기/쓰기 위치 이동시킴
                                                  - offset : 이동 거리, how : 기준점(어디서부터 offset을 적용할지)
                                                    - how의 값 1. 0(io.SeekStart)   : 파일 시작 위치 기준
                                                              2. 1(io.SeekCurrent) : 현재 위치 기준
                                                              3. 2(io.SeekEnd)     : 파일 끝 기준


##### 파일 쓰기
1. os 패키지 함수
   os.WriteFile(path, slice, permfs.FileMode) error           : 지정한 경로, 모드, 권한으로 파일 만든 후, byte 슬라이스의 내용 씀
                                                                - 파일 이미 존재 시 덮어쓰기 수행
                                                                - 내부적으로 Create -> Write -> Close 처리
     .OpenFile(path, flag, permfs.Filemode) (*os.File, error) : 파일을 어떻게 열지(읽기, 쓰기, 추가, 생성 여부 등)를 결정하는 flag를 사용해 파일 열기
                                                                - 새 파일 생성 시 지정한 모드 및 권한 적용
   - permfs.FileMode 예시 : 0666 - 0:모드, 666:권한
   - flag 종류
     1. O_RDONLY : 읽기 전용
     2. O_WRONLY : 쓰기 전용
     3. O_RDWR   : 읽기-쓰기 전용
     4. O_APPEND : 파일 끝에 이어 쓰기
     5. O_CREATE : 파일이 존재하지 않으면 새로 생성
     6. O_EXCL   : 새 파일을 생성했는지 확인하기 위해 O_CREATE와 함께 사용
                   - 파일 이미 존재 시 해당 플래그는 에러 유발
     7. O_SYNC   : 데이터를 쓸 때, 버퍼에만 저장하지 않고, 디스크에 즉시 동기화 보장
                   - Write()가 수행 후 리턴될때 쯤엔 디스크에 물리적으로 저장된 상태
                   - 속도 느리지만 안정성 ⬆️
     8. O_TRUNC  : 파일 열때 기존 내용 모두 삭제
     
     => flag 간에는 |(or) 연산자로 여러개 적용 가능

2. 데이터를 쓰기 위한 *os.File 메서드
   f.Seek(offset int64, how int) (int64, error) : 위의 Seek 함수와 동일
    .Write(slice) (n int, error)                : 현재 커서 위치에서 시작해 byte 슬라이스의 내용을 적용
                                                  - Seek()을 먼저 호출하지 않으면, 파일 처음부터 씀
                                                    (이어쓰기 flag 사용 시 끝에서)
    .WriteAt(slice, offset int64)               : 커서 위치 무시하고, offset 위치에 직접 byte 슬라이스 내용 적용
                                                  - "병렬 쓰기" or "임의 위치 쓰기"에 적합
    .WriteString(str)                           : 문자열을 파일에 직접 씀
                                                  - 내부적으로 byte 변환 수행

##### 편의 함수를 사용한 새 파일 생성
1. 파일 생성을 위한 os 패키지 함수
   os.Create(path) (*os.File, error)                  : 지정한 경로에 새 파일 생성
                                                        - 이미 파일 존재 시, 내용을 모두 비우고, 새로 시작
                                                        - 생성된 파일은 쓰기 및 읽기 모드로 열림
                                                          => O_RDWR | O_CREATE | O_TRUNC 플래그 조합으로 OpenFile 수행하는 것과 동일
                                                        - 권한 디폴트 값 : 0666
     .CreateTemp(dirName, fileName) (*os.File, error) : 지정한 디렉토리에 임시 파일 생성
                                                        - 디렉토리를 ""로 설정 시, OS의 기본 임시 디렉토리(/tmp, %TEMP% 등) 사용
                                                        - 생성된 파일은 O_RDWR | O_CREATE | O_EXCL 플래그로 열림
                                                        - 파일을 닫아도 파일이 제거되지 않음‼️‼️