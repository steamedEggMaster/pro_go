1. net/http 패키지의 HTTP 요청을 위한 편의 메서드
   http.Get(url) (resp *http.Response, error)         : URL에 GET 요청 전송
       .Head(url) (resp *http.Response, error)        : URL에 HEAD 요청(본문 없음) 전송
                                                        - GET 요청이 반환하는 헤더와 동일하게 반환
                                                        - 주로 리소스 존재 여부, 크기, 메타정보 확인용
       .Post(url, contentType string, body io.Reader) : 지정한 content 타입을 통해 URL에 POST 요청 전송
                                                        - body : 요청 바디
       .PostForm(url, data url.Values)                : application/x-www-form-urlencoded 형식으로 form POST 요청 보냄
                                                        - 내부적으로 data.Encode() 후 Post() 호출
                                                        ex) form := url.Values{}
                                                            form.Add("username", "alice")
                                                            form.Add("password", "1234")

                                                            resp, _ := http.PostForm("https://example.com/login", form)
                                                            defer resp.Body.Close()

1-1. *http.Response 구조체의 필드 및 메서드
     r.StatusCode int               : HTTP 응답 상태 코드
      .Status string                : 상태 코드 + 메시지 ex) 200 OK, 404 Not Found
      .Proto string                 : HTTP 프로토콜 버전 ex) HTTP/1.1, HTTP/2.0
      .Header Header                : 응답 헤더 map[string][]string
      .Body io.ReadCloser           : Close()가 정의되고, 응답 바디에 대한 액세스를 제공하는 Reader인 ReadCloser 반환
                                      - 응답 본문 스트림
                                      - defer rc.Close() 필수!!
      .Trailer Header               : 응답의 트레일러 헤더
                                      - 일반적으로 HTTP/1.1 chunked에 사용
      .ContentLength int64          : 응답 본문의 길이
                                      - int64로 파싱한 Content-Length 헤더의 값 반환
                                      - 알 수 없다면 -1 반환
      .TransferEncoding []string    : Transfer-Encoding 헤더 값 슬라이스 반환
                                      - "chunked" 등 전송 인코딩 방식
      .Close bool                   : 응답 후 HTTP 연결을 닫아야 함을 의미하는 close로 설정한 Connection 헤더를 응답에 포함한 경우 true 반환
      .Uncompressed bool            : net/http 패키지가 압축 해제한 압축 응답을 서버가 보낸 경우 true 반환
                                      - 자동 압축 해제 여부
      .Request *http.Request        : 해당 응답을 얻기 위해 사용한 요청 객체 반환
                                      - 구조체에 대한 설명은 24장에
      .TLS *tls.ConnectionState     : HTTPS 응답이라면 연결의 세부 정보 반환
                                      - HTTP면 nil
      .Cookies() []*http.Cookie     : 응답 헤더의 Set-Cookie를 파싱하여 쿠키 슬라이로 반환
                                      - 구조체에 대한 설명은 24장에
      .Location() (*url.URL, error) : Location 헤더를 URL로 파싱하여 반환
                                      - Location 헤더 포함 X 시 error 반환
      .Write(w io.Writer) error     : *http.Response 전체를 Raw 형식으로 Writer에 출력
                                      - 디버깅, 프록시 구현 시 유용


##### 클라이언트 요청 구성
1. http.Client 구조체의 필드 및 메서드
   c.Transport http.RoundTripper         : HTTP 요청을 전송하는 방식 정의
                                           - 기본값 : http.DefaultTransport
                                           - 타임아웃, TLS 설정, 프록시 등 설정 가능
    .CheckRedirect [func(req *http.Request, via []*http.Requst) error] : 반복되는 리디렉션을 처리하기 위해 사용자 지정 정책 지정 시 사용
                                                                         - 기본은 최대 10회까지 자동 리디렉션
                                                                         - 커스텀 시 리디렉션 제한, 로그 남기기, 차단 등 가능
    .Jar http.CookieJar                          : 쿠키 관리를 위한 객체인 CookieJar 반환
                                                   - 쿠키를 자동 저장하고 요청 시 자동 전송하는 쿠키 저장소
                                                   - 쿠키 유지 필요한 로그인/세션 API 호출에 유용
    .Timeout time.Duration                       : 연결 및 응답 시간을 합한 전체 요청 수명에 대한 타임아웃 설정
                                                   - 지정된 시간 내 작업이 수행되지 않으면 취소됨
    .Do(r *http.Request) (*http.Response, error) : 직접 만든 HTTP 요청 객체를 실행하여 전송
    .CloseIdleConnections()                      : 열려있는 커넥션 중 유휴 연결 닫음
                                                   - 오래된 커넥션 정리, 커넥션 누수 방지 시 유용
    .Get(url)                                    : http.Get처럼 간단한 요청 보냄
                                                   - 내부적으로 http.NewRequest() + Do() 수행
    .Head(url)                                   : 지정한 URL에 HTTP HEAD 요청 전송
    .Post(url, contentType, reader)              : 지정한 URL에 POST 요청 보냄
    .PostForm(url, data)                         : application/x-www-form-urlencoded 형식으로 POST 요청 전송
                                                   - 내부적으로 data.Encode() + .Post() 호출
- Get, Head, Post, PostForm은 모두 (*http.Response, error) 를 응답으로 가짐
  => 1번에서 설명한 간단한 요청 편의 메서드와 동일

2. net/url의 URL 값 파싱을 위한 함수
   url.Parse(string) (*url.URL, error) : 문자열 URL을 *url.URL 타입으로 파싱
                                         ex) reqURL, erro := url.Parse("http://localhost:5000/echo")

3. net/http의 요청 생성을 위한 편의 함수 사용
   http.NewRequest(method, url string, body io.Reader) (*http.Request, error)                  : 지정한 HTTP 메서드, URL, 본문으로 요청 객체 생성
                                                                                                 - body = nil 이면, 본문없는 요청에 사용 가능
       .NewRequestWithContext(ctx context.Context, method, url, reader) (*http.Request, error) : NewRequest와 동일하지만, 
                                                                                                 요창에 context 추가하여 타임아웃, 취소, 트레이싱 등 제어 가능
                                                                                                 ex) ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
                                                                                                     defer cancel()
                                                                                                     req, _ := http.NewRequestWithContext(ctx, "GET", "https://example.com", nil)
                                                                                                     resp, err := http.DefaultClient.Do(req)

##### 쿠키 작업 - net/http/cookiejar
1. http.CookieJar 인터페이스가 정의한 메서드
   CookieJar.SetCookies(url *url.URL, cookies []*http.Cookie) : 클라이언트가 응답에서 받은 Set-Cookie 헤더들을 저장할 때 호출
                                                                - http.Client 내부에서 자동으로 호출됨 -> 사용자 직접 호출할일 드뭄
            .Cookies(url *url.URL) []*http.Cookie             : 특정 URL에 대해 전송할 쿠키 목록 반환
                                                                - 보통 http.Client가 자동 호출하지만, 수동으로 접근도 가능

2. CookieJar 생성자 함수
   cookiejar.New(o *cookiejar.Options) (*cookiejar.Jar, error) : CookieJar 인터페이스를 구현한 기본 구현체 생성
                                                                 - nil 넘기면 기본 설정임
                                                                 - http.Client의 .Jar 필드에 할당해서 에 넣어 쿠키 자동 저장/관리에 사용
                                                                 
##### 멀티파트 폼 생성
1. multipart.Writer 생성자 함수
   multipart.NewWriter(w io.Writer) *multipart.Writer : io.Writer에 폼 데이터를 쓰는 새로운  Writer 객체 생성
                                                        - 파일 업로드나 폼 전송(PostForm) 시, body를 직접 구성해야 할 경우 사용
1-1. *multipart.Writer의 메서드
     w.CreateFormField(fieldName) (io.Writer, error)          : 지정한 fieldName으로 새로운 폼 필드 생성
                                                                - 일반적인 폼 필드 작성 시 사용
                                                                  ex) <input type="text" name="..."> 같은 텍스트 필드에 해당
                                                                - 필드 데이터를 작성하기 위한 io.Writer 반환
                                                                ex) w, _ := writer.CreateFormField("username")
                                                                    w.Write([]byte("go_dev"))
      .CreateFormFule(fieldName, fileName) (io.Writer, error) : 지정한 fieldName과 fileName으로 새 파일 필드 작성
                                                                - 파일 필드 작성 시 사용
                                                                  ex) <input type="file" name="..." filename="...">에 해당됨
                                                                - 자동으로 Content-Disposition과 Content-Type 헤더를 설정해줌
                                                                ex) fw, _ := writer.CreateFormFile("profile", "pic.png")
                                                                    fw.Write([]byte("file contents here"))
      .FormDataContentType() string                           : HTTP 요청의 Content-Type 헤더에 사용될 값 반환
                                                                - 폼 부분 간의 경계를 나타내는 문자열을 포함
                                                                ex) multipart/form-data; boundary=...
      .Close() error                                          : 폼을 마무리하고, 폼 데이터의 끝을 나타내는 종료 boundary 작성
                                                                - 모든 필드 작성 후 반드시 호출 필요!!