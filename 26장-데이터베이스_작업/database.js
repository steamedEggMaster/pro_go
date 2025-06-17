1. 데이터베이스 SQL 드라이버 패키지 설치
   go get modernc.org/splite

2. 데이터베이스 열기 위한 database/sql 함수
   sql.Drivers() []string : 현재 등록된 SQL 드라이버들의 이름들을 문자열 슬라이스로 반환
                            - init() 함수 등을 통해 등록된 드라이브들만 표시됨
                              ex) _ "github.com/mattn/go-sqlite3"
      .Open(driver, connectionStr string) (*sql.DB, error) : 드라이버 이름과 연결 문자열을 사용하여 DB 열고, 상호작용을 위한 객체 생성
                                                             - 연결 자체는 바로 이루어지는게 아니라, 이후 "Ping()" 또는 쿼리 실행해야 실제 연결됨
                                                             ex) sql.Open("mysql", "root:password@tcp(localhost:3306)/testdb")
2-1. 데이터베이스 닫기 위한 *sql.DB 메서드
     db.Close() : 데이터베이스 커넥션 풀 종료


##### 스테이트먼트 및 쿼리 실행
1. SQL문을 실행하기 위한 *sql.DB 메서드
   db.Query(query, args ...any) (*sql.Rows, error)    : 여러 개의 행(Row)을 반환하는 SELECT 쿼리에 사용
                                                        - 반복문으로 Row를 읽어야함
                                                        - args는 쿼리문에 존재하는 플레이스홀더("?")에 대응되는 값을 위한 인수
     .QueryRow(query, args ...any) *sql.Row           : 단일 행을 반환하는 SELECT 쿼리에 사용
                                                        - 에러는 .Scan() 시점에 발생
                                                        ex) var name string
                                                            err := db.QueryRow("SELECT name FROM users WHERE id = ?", 1).Scan(&name)
     .Exec(query, args ...any) (sql.Result, error)    : INSERT, UPDATE, DELETE 같이 행만 변경하고 결과가 없는 쿼리에 사용
                                                        - sql.Result 반환

2. *sql.Rows 구조체 메서드
   rows.Next() bool                : 다음 행이 존재하는지 여부 반환 및 내부 커서를 해당 행으로 이동함
       .NextResultSet() bool       : 복수 쿼리 결과 중 다음 쿼리 결과로 이동 및 이동 가능 여부 반환
                                     - Query()가 여러 SQL 문을 동시에 실행한 경우 사용
       .Scan(targets ...any) error : 현재 행의 컬럼 값을 변수에 복사
                                     - 변수는 포인터로 넘겨야 함
                                     - 인수 순서, 타입, 개수가 결과의 것과 일치해야함
                                     - SQL 값 스캔 방법 이해하기
                                       1. SQL 문자열, 숫자, 부울 값은 해당하는 Go 값에 매핑 가능하지만,
                                          숫자 타입은 오버플로우를 방지하기 위해 주의를 기울여야 함
                                       2. SQL 숫자 및 부울 타입을 Go 문자열로 스캔 가능
                                       3. SQL 문자열은 Go 숫자 타입으로 스캔 가능하지만,
                                          일반 Go 기능을 사용하여 문자열 파싱이 가능하며, 오버플로가 없는 경우에만 가능
                                       4. SQL 시간 값은 Go 문자열 또는 *time.Time 값으로 스캔 가능
                                       5. 모든 SQL 값은 빈 인터페이스(interface{}) 포인터로 스캔 가능 및 다른 타입으로 변환 가능
                                     
                                     - 구조체로 매핑하는 기능은 없음

3. *sql.Row 구조체 메서드
   row.Scan(targets ...any) error : 현재 행의 SQL 값을 변수 포인터를 통해 할당
                                    - 응답에 여러 행이 있는 경우, 첫번째 행 이외에 모든 행을 삭제
      .Err() error                : .Scan() 호출 이후에 발생한 내부 에러를 명시적으로 확인 시 사용
                                    - 잘 사용되지 않지만, Scan()에서 에러를 처리하지 않은 경우 사용

4. sql.Result 구조체 메서드
   result.RowsAffected() (int64, error) : 스테이트먼트(INSERT, UPDATE, DELETE)의 영향을 받은 행(row) 수 반환
                                          - 로깅에 유용
         .LastInsertId() (int64, error) : AUTO_INCREMENT컬럼에 의해 생성된 마지막 삽입 ID 반환
                                          - DB 종류에 따라 동작방식이 다름

##### Prepared Statement 사용
1. Prepared Statement 생성을 위한 *sql.DB 메서드
   db.Prepare(query string) (*sql.Stmt, error) : SQL 쿼리를 컴파일하여 "재사용 가능"한 Statement 객체로 생성 
                                                 - 같은 쿼리 반복적 실행 시 성능 향상됨
                                                 - 보안 측면에서도 "SQL Injection 방지"에 도움됨
                                                 - defer stmt.Close()로 자원정리 필수‼️‼️

2. *sql.Stmt 구조체 메서드
   stmt.Query(vals ...any) (*sql.Rows, error)
       .QueryRow(vals ...any) *sql.Row
       .Exec(vals ...any) (sql.Result, error)
   - *sql.DB의 메서드들과 동알
   - vals는 플레이스홀더("?")에 대응되는 값


##### 트랜잭션 사용
1. 트랜잭션 생성을 위한 *sql.DB 메서드
   db.Begin() (*sql.Tx, error) : DB에서 트랜잭션을 시작
                                 - 이후의 Exec, Query, Commit, Rollback 등의 작업을 Tx 객체를 통해 실행
                                 - 트랜잭션은 ‼️반드시 명시적으로 Commit() 또는 Rollback() 해야함‼️

2. *sql.Tx 구조체 메서드
   tx.Query(query, args ...any) (*sql.Rows, error)
     .QueryRow(query, args ...any) *sql.Row
     .Exec(query, args ...any) (sql.Result, error)
     .Prepare(query) (*Stmt, error) : 트랜잭션 전용 Prepared Statement 생성
                                      - 반환된 *Stmt는 해당 "트랜잭션 내에서만 유효"함
     .Stmt(statement) *Stmt         : *sql.DB(외부)에서 생성한 *Stmt를 트랜잭션 전용으로 변환
     .Commit() error                : 모든 작업을 정상적으로 반영
                                      - ‼️마지막에 한번만 실행해야함‼️
                                      - 호출 후에는 tx를 더이상 사용 불가‼️
     .Rollback() error              : 트랜잭션 내 모든 작업을 취소
                                      - ‼️쿼리 실패 시에도 반드시 호출해야함‼️
                                        (안할 시, 커넥션이 풀에 반영되지 않아 "리소스 누수 발생 가능")


##### 데이터를 구조체로 스캔하기 위한 리플렉션 사용
- 리플렉션?
  : 런타임에 타입과 값을 검사하고 사용 가능하도록 하는 기능
    - 이후 장에서 상세히 설명할 예정

1. 리플렉션과 함께 사용하는 *sql.Rows 메서드
   rows.Columns() ([]string, error)              : 쿼리 결과에 포함된 컬럼 이름 목록 반환
       .ColumnTypes() ([]*sql.ColumnType, error) : 각 컬럼의 메타데이터(자료형, 길이, nullable 등)를 담은 목록 반환

2. *sql.ColumnType 구조체 메서드
   ct.Name() string                                   : 컬럼의 이름 반환
                                                        - SQL 쿼리에서 지정한 이름 그대로 나옴
     .DatabaseTypeName() string                       : DB에서 사용된 원시 타입 이름 반환
                                                        - VARCHAR, INT, DECIMAL, TEXT 등
     .Nullable() (nullable bool, ok bool)             : 해당 컬럼이 NULL 값을 허용하는지 여부 반환
                                                        - ok는 드라이버가 nullable을 지원하는지 여부
     .DecimalSize() (precision, scale int64, ok bool) : 숫자형 컬럼의 정밀도(precision)와 소수점 자리수(scale) 반환
                                                        - ok는 10진수인지 여부
     .Length() (length int64, ok bool)                : 문자열, 바이너리 타입의 최대 길이 반환
                                                        ex) VARCHAR(255) → 255
                                                        - ok는 길이가 지정되는 타입인지 여부
     .ScanType() reflect.Type                         : 해당 컬럼을 Scan()으로 읽을 때 ‼️어떤 Go 타입으로 매핑될지 알려줌‼️
                                                        - 동적 객체 생성이 가능해짐
                                                        - 리플렉션에 대한 내용은 이후 장에서 나옴