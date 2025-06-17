1. HTTP 리스너 및 핸들러 생성
   http.ListenAndServe(addr string, handler http.Handler) error : 지정된 주소에서 HTTP 서버 시작
                                                                  - handler : http.Handler 인터페이스 구현체 (ServeHTTP 구현)
                                                                  - handler로 nil을 넘길 경우, DefaultServeMux가 사용됨
       .ListenAndServerTLS(addr, cert, key, handler) error      : HTTPS 서버 시작
                                                                  - cert : SSL 인증서 경로 (.crt)
                                                                  - key : SSL 개인 키 경로 (.key)
                                                                  - 내부적으로 tls.Listen() 사용

1-1. http.Handler 인터페이스가 정의한 메서드
     1. http.Handler.ServeHTTP(w http.ResponseWriter, r *http.Request)
        : 요청 처리의 진입점
          - w는 클라이언트에 응답 보낼 때 사용
          - r은 클라이언트 요청을 담고 있음

2. Request 구조체가 정의한 필드
   1. Method string       : HTTP 메서드를 문자열로 제공
                            - net/http 패키지는 MethodGet, MethodPost와 같은 상수 정의
   2. URL *url.URL        : 요청한 URL의 경로, 쿼리 스트링 등을 포함한 구조체 반환
   3. Proto string        : 사용중인 HTTP 프로토콜 버전 문자열 반환
   4. Host string         : 요청의 Host 헤더(도메인 + 포트 포함 가능)
   5. Header http.Header  : map[string][]string의 별칭인 Header를 반환하고 요청 헤더를 포함함
                            - 맵 키 : 헤더 이름
                            - 맵 값 : 헤더 값을 포함하는 string 슬라이스
   6. Trailer http.Header : Body 이후 요청에 포함한 추가 헤더를 포함하는 map[string]string 반환
                            - 주로 스트리밍 시 사용 (일반적으로 잘 안쓰임)
   7. Body io.ReadCloser  : 요청 본분
                            - ‼️‼️직접 읽고 나면 다시 읽을 수 없음‼️‼️
                            - 복사는 가능
                            - Reader 인터페이스의 Read 메서드와 Closer 인터페이스의 Close 메서드를 결합한 인터페이스인 ReadCloser 반환
   8. ContentLength int64       : int64 값을 사용하여 Content-Length 헤더를 설정하기 위해 사용
                                  - 알 수 없으면 -1로 설정
   9. TransferEncoding []string : 전송 인코딩 방식을 담는 Transfer-Encoding 헤더를 설정하기 위해 사용

##### 요청 필터링 및 응답 생성
1. URL 구조체가 정의한 유용한 필드 및 메서드
   Scheme string        : URL의 프로토콜 (http, https, ftp 등)
   Host string          : 도메인 + 포트 번호 (전체 주소)
   RawQuery string      : ? 뒤의 쿼리 스트링 전체 (인코딩된 상태)
                          - Query()를 사용하여 쿼리 문자열을 맵으로 처리
   Path string          : 도메인 + 포트번호 이후의 경로
   Fragment string      : # 이후의 URL 조각
   Hostname() string    : Host에서 포트를 제외한 순수 도메인
   Port() string        : Host에서 추출한 포트 번호 (없으면 빈 문자열)
   Query() url.Values   : RawQuery를 파싱하여 map[string][]string 형태로 반환
   User() *url.Userinfo : 인증정보(username[:password]@에 해당)
   String() string      : 현재 URL 구조체 전체를 문자열로 재조합

2. http.ResponseWriter 인터페이스의 메서드
   rw.Header() http.Header          : 응답 헤더 조작 가능한 http.Header 맵 반환
                                      - Header는 map[string][]string 별칭
                                      - WriteHeader() 또는 Write() 호출 전에 설정해야 정상적으로 설정됨
     .WriterHeader(code)            : 응답의 HTTP 상태 코드 설정
                                      - 기본값 : 200
                                      - 한번만 호출 가능‼️
                                      - Write() 먼저 호출 시 상태코드 200이 자동 전송되어 이후 WriteHeader()는 무시됨
                                      - net/http 패키지의 "상태코드 상수" 넘기면 됨
     .Write(byteslice) (int, error) : 응답 본문에 데이터 작성

3. net/http의 응답 편의 함수
   http.Error(writer, message, code)         : 헤더를 지정한 코드로 설정하고,
                                               Content-Type 헤터를 text/plain으로 설정하고,
                                               응답에 에러 메시지 작성 및
                                               브라우저가 응답을 텍스트 이외의 것으로 해석하지 못하도록 X-Content-Type-Options 헤더 설정
                                               - 내부적으로 WriteHeader(code) + Write([]byte(message)) 실행
       .NotFound(writer, request)            : 404 Not Found 응답을 간편하게 전송
                                               - 내부적으로 http.Error() 사용
       .Redirect(writer, request, url, code) : 클라이언트를 다른 URL로 리디렉션
                                               - code로는 http.StatusFound(302), http.StatusMovedPermanently (301) 등이 주로 사용됨
       .ServeFile(writer, request, fileName) : 지정된 파일을 HTTP 응답으로 전송
                                               - Content-Type 헤더는 파일 확장자를 기반으로 설정하지만,
                                                 함수 호출 전, 헤더를 명시적으로 설정하여 재정의 가능
                                               - 파일 존재 X or 오류 발생 시 자동으로 404 또는 500 전송

4. 라우팅 규칙을 위한 net/http 함수
   http.Handler(pattern, handler http.Handler)                      : 특정 URL 경로 pattern과 ServeHTTP() 구현체를 매핑
       .HandlerFunc(pattern, handlerFunc(ResponseWriter, *Request)) : 익명 함수 형태의 핸들러 등록
                                                                      - 내부적으로 해당 함수를 http.HadlerFunc로 변환하여 Handle()에 넘김

5. 요청 핸들러 생성을 위한 net/http 함수
   http.FileServer(root http.FileSystem) http.Handler : 정적 파일을 서빙하는 핸들러 생성
                                                        - 주로 http.Dir("static") 형태로 디렉토리 지정
                                                        ex) fsHandler := http.FileServer(http.Dir("./static"))
                                                            http.Handle("/files/", http.StripPrefix("/files", fsHandler))
       .NotFoundHandler() http.Handler                : 404 응답을 반환하는 핸들러
                                                        - 커스텀 Mux 또는 미들웨어에서 기본 fallback 용도로 사용됨
       .RedirectHandler(url, code) http.Handler       : 요청을 특정 URL로 리디렉션하는 핸들러
       .StripPrefix(prefix, handler) http.Handler     : 요청 경로에서 접두사 prefix 제거후, 지정된 핸들러로 전달
                                                        - 주로 FileServer()과 함께 사용됨
       .TimeoutHandler(handler http.Handler, duration time.Duration, message) http.Handler : 지정한 Handler에 요청 전달 후, 기간 내 응답되지 않으면 타임아웃 에러 메시지 자동 응답
    
6. Request 폼 데이터 필드 및 메서드
   r.Form map[string][]string      : 파싱한 폼 데이터 + 쿼리 문자열 매개변수를 포함하는 map 반환
                                     - ParseForm() 메서드 호출 후 접근 가능
     PostForm map[string][]string  : Form 과 유사하지만 요청 바디의 데이터만 맵에 포함
                                     - POST, PUT, PATCH 요청의 application/x-www-form-urlencoded 데이터만 포함
                                     - ParseForm() 메서드 호출 후 접근 가능
     MultipartForm *multipart.Form : mime/multipart 패키지가 정의한 Form 구조체를 사용하여 표현한 멀티파트 폼 반환
                                     - multipart/form-data(파일 업로드 포함) 요청에 사용
                                     - ParseMultipartForm(maxMemory) 호출 후 사용
     FormValue(key) string         : Form 키의 첫 번째 값 반환
                                     - 값이 없으면 빈 문자열 반환
                                     - 해당 메서드의 데이터 소스 : Form 필드
                                     - FormValue 메서드를 호출하면 자동으로 ParseForm 또는 ParseMultipartForm을 호출하여 폼을 파싱
     PostFormValue(key) string     : Form 키의 첫 번째 값 반환
                                     - 값이 없으면 빈 문자열 반환
                                     - 해당 메서드의 데이터 소스 : PostForm 필드
                                     - PostFormValue 메서드를 호출하면 자동으로 ParseForm 또는 ParseMultipartForm을 호출하여 폼을 파싱
     FormFile(key) (multipart.File, *multipart.FileHeader, error) : 클라이언트가 전송한 파일을 폼을 통해 추출하고, key를 통해 파일 추출
                                                                    - FormFile 메서드를 호출하면 자동으로 ParseForm 또는 ParseMultipartForm을 호출하여 폼을 파싱
     ParseForm() error                   : URL 쿼리 파라미터(GET)와 폼 본문 데이터(POST x-www-form-urlencoded) 파싱
                                           - 파싱 결과는 r.Form에 저장됨
     ParseMultipartForm(max int64) error : 파일 업로드를 포함한 MIME multipart(multipart/form-data) 폼 파싱
                                           - 파싱 결과는
                                             1. 일반 필드 => r.MultipartForm.Value
                                             2. 파일 필드 => r.MultipartForm.File
                                             에 저장
                                           - 메모리 제한(max) 이상은 임시 파일로 저장됨 (os.TempDir())

6-1. *multipart.FileHeader 필드 및 메서드
    fh.Name string                    : HTML 폼에서 <input type="file" name=".."> 에 지정된 name 속성 값
      .Size int64                     : 업로드된 파일의 크기 (바이트 단위)
      .Header textproto.MIMEHeader    : 해당 파일 파트의 HTTP 헤더 정보
                                        - Content-Type, Content-Disposition 등 포함
                                        - MIMEHeader는 map[string][]string 타입의 별칭
      .Open() (multipart.File, error) : 파일 내용을 읽기 위한 스트림 객체 반환
                                        - 반환된 multipart.File은 io.Reader, io.Seeker 인터페이스 만족
                                        - 읽은 후 Close() 필수‼️
    
6-2. *multipart.Form 구조체의 필드
     f.Value map[string][]string      : 일반적인 텍스트 입력 필드들을 담음
                                        - ex) <input type="text" name="username"> 등의 필드
      .File  map[string][]*FileHeader : 파일 업로드 필드들을 담음
                                        - key : HTML 폼의 <input type="file" name="...">의 name 값
                                        - value : 해당 필드에 업로드된 파일들(*multipart.FileHeader)의 슬라이스

7. 쿠키 설정을 위한 net/http 함수
   http.SetCookie(w http.ResponseWriter, cookie *http.Cookie) : ResponseWriter에 Set-Cookie 헤더 추가

7-1. *http.Cookie 구조체의 필드
     c.Name string            : 쿠키 이름
                                - 필수이며 고유해야 함
      .Value string           : 쿠키의 실제 값
                                - 문자열만 가능 (json 같은 데이터는 인코딩 필요)
      .Path string            : 해당 경로와 일치하는 URL에만 쿠키가 자동으로 전송됨
                                - / 로 설정 시 모든 경로에서 전송됨
      .Domain string          : 쿠키가 전송된 도메인 지정
                                - 기본 : 현재 요청 도메인
                                - .example.com : 서브 도메인들이 포함됨
      .Expires time.Time      : 쿠키 만료 시각
                                - 과거 시간 설정 시 쿠키 즉시 삭제됨
      .MaxAge int             : 쿠키 유효 시간(초 단위)
                                - 0보다 큰 경우 : 초 단위 유지 시간 설정
                                - 0인 경우 : 브라우저 종료 시 삭제
                                - 0보다 작은 경우 : 즉시 삭제
      .Secure bool            : true인 경우, HTTPS 요청에서만 전송됨
      .HttpOnly bool          : true인 경우, JS 코드가 쿠키에 액세스 하는 것 방지함
                                (XSS 공격 방어용)
      .SameSite http.SameSite : SameSite 상수를 사용하여 쿠키에 대한 cross-orgin 정책 지정
                                - SameSite 상수
                                  1. http.SameSiteDefaultMode :
                                  2.     .SameSiteLaxMode     : 대부분의 요청에 쿠키 전송하지만, 크로스 사이트 POST/PUT 등에서는 제외함
                                                                - GET/HEAD같은 안전한 요청은 허용
                                                                - 실제 서비스에서 가장 많이 사용됨 
                                  3.     .SameSiteStrictMode  : 완전한 보안 우선 모드
                                                                - 출처가 완벽히 동일한 요청에만 쿠키 전송
                                  4.     .SameSiteNoneMode    : 모든 요청에 쿠키 전송 허용
                                                                - 단 Secure=true여야만 됨(https가 아니면 브라우저가 쿠키를 막음)

7-2. 쿠키를 위한 Request 메서드
     r.Cookie(name) (*http.Cookie, error) : 해당 name을 가진 Cookie 값 포인터 반환
                                            - 쿠키 없으면 http.ErrNoCookie 반환
      .Cookies() []*http.Cookie           : 요청에 포함된 모든 쿠키를 슬라이스 형태로 반환