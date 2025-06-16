##### 파일 경로 작업
1. os 패키지가 정의한 공통 위치 함수
   os.Getwd() (dir string, error)     : 현재 작업 디렉토리 반환
     .UserHomeDir() (string, error)   : 현재 사용자의 홈 디렉토리 경로 반환
     .UserCacheDir() (string, error)  : 현재 사용자에 대한 캐시 저장 디렉토리 경로 반환
     .UserConfigDir() (string, error) : 현재 사용자의 설정 파일 저장 위치 반환
     .TempDir() string                : 임시 파일을 저장하는 디렉토리 반환
                                        - os.CreateTemp(os.TempDir(), ...) 이런식으로 사용

2. 경로를 위한 path/filepath 함수
   filepath.Abs(path) (string, error)          : 상대 경로 path를 절대 경로로 변환
                                                 - 현재 작업 디렉토리를 기준으로 계산
           .IsAbs(path) bool                   : path가 절대 경로인지 여부
           .Base(path) string                  : 경로에서 마지막 요소(파일명 or 디렉명) 반환
           .Clean(path) string                 : .. or . or // 등 정리 후 정규화된 경로 반환
           .Dir(path) string                   : 경로에서 마지막 요소(파일명 or 디렉명)를 제외한 경로 반환
           .EvalSymlinks(path) (string, error) : path에 있는 심볼릭 링크를 실제 경로로 해석
                                                 - 존재하는 경로여야 동작
                                                 ex) realPath, err := filepath.EvalSymlinks("/usr/bin/go")
                                                     // 예: "/usr/local/go/bin/go"
           .Ext(path) string                   : path에서 확장자 반환 (. 포함)
                                                 - path의 마지막 마침표 뒤에 오는 접미사로 간주
           .FromSlash(path) string             : 각 슬래시를 플랫폼(Window 등)의 파일 구분 문자로 변경
           .ToSlash(path) string               : 플랫폼의 파일 구분 기호를 슬래시로 변경
           .Join(...elements) string           : 플랫폼의 파일 구분 기호를 사용하여 여러 경로 요소 결합
           .Match(pattern, path) (bool, error) : 와일드 카드 pattern으로 경로 path와 일치하는지 여부
           .Glob(pathPattern) ([]string, error): 패턴에 매칭되는 모든 파일/디렉토리 경로 찾아 반환
                                                 - 내부적으론 filepath.Match() 기반 동작
                                                 - "현재 디렉토리 기준" 탐색 수행
           .Split(path) (dir, file string)     : path를 디렉토리와 파일명으로 분리
           .SplitList(path) []string           : 환경 변수 안의 여러 경로 목록 분리 (: 또는 ; 기준)
           .VolumeName(path) string            : path의 볼룸 구성 요소 반환 or 경로에 볼륨을 포함하지 않은 경우 빈 문자열 반환
                                                 - 주로 Windows의 드라이브 문자나 네트워크 공유 경로(UNC) 를 의미
                                                 - Linux/macOS에서는 거의 항상 "" 반환됨
  - "pattern에 사용되는 구문"
    1. *     : 경로 구분 기호를 제외한 모든 문자 시퀀스와 일치
    2. ?     :        ''         모든 단일 문자와 일치
    3. [a-Z] : 지정한 범위의 모든 문자와 일치

##### 파일과 디렉터리 관리
1. os 패키지 함수
   os.Chdir(dir) error                             : 현재 작업 디렉토리를 dir 디렉토리로 변경
     .Mkdir(name, permfs.Filemode) error           : 지정한 이름 및 모드/권한을 가진 단일 디렉토리 생성
                                                     - 상위 디렉토리 없으면 에러 ⭕️
     .MkdirAll(name, permfs.Filemode) error        : Mkdir과 동일하지만, 상위 디렉토리 모두 생성
                                                     - 디렉토리들이 존재해도 에러 ❌
     .MkdirTemp(parantDir, name) (*os.File, error) : CreateTemp와 유사하지만, 파일이 아닌 디렉토리 생성
                                                     - parentDir == "" 이면, 시스템 기본 임시 디렉토리(/tmp 등) 사용
     .Remove(name) error                           : 파일 또는 빈 디렉토리 삭제
                                                     - 디렉토리가 비어있지 않으면 에러 ⭕️
     .RemoveAll(name) error                        : 파일 도는 디렉토리 및 하위 모든 내용 삭제(재귀적)
     .Rename(old, new) error                       : 파일 또는 디렉토리 이름 or 위치 변경
                                                     - 디렉토리 간 이동 가능
                                                     - 드라이브 간에는 에러 발생 가능
     .Symlink(old string, new string) error        : old에 대한 심볼릭 링크 파일 생성 


##### 파일 시스템 탐색
1. 디렉토리 리스팅을 위한 os 패키지 함수
   os.ReadDir(path) ([]os.DirEntry, error) : path에 있는 디렉토리 내부의 항목(파일, 폴더 등) 목록을 읽어옴
                                             - []os.DirEntry : 디렉토리 항목 정보
                                             - 정렬되지 않은 상태로 반환됨

1-1. DirEntry 인터페이스가 정의하는 메서드
     os.DirEntry.Name() string               : 해당 항목의 이름(파일명 or 디렉명) 반환
                                               - 전제 경로 ❌
                .IsDir() bool                : 해당 항목이 디렉토리인지 여부
                                               - 심볼릭 링크는 대상이 디렉토리여도 false 나올 수 있음
                .Type() fs.FileMode          : 해당 항목의 파일 모드 반환
                                               - FileMode 값은 uint32의 별칭
                                               - 디렉토리 여부, 퍼미션 등을 포함하지만, Info() 호출 시보다 빠름
                .Info() (fs.FileInfo, error) : 해당 항목의 정확한 파일 정보 포함하는 인터페이스 반환
                                               - 내부적으로 stat() 시스템 호출 발생(비용 소모)

1-1-1. FileInfo 인터페이스가 정의하는 유용 메서드
       fs.FileInfo.Name() string       : 파일 또는 디렉토리 이름만 반환 (경로 제외)
                  .Size() int64        : 파일 크기(바이트 단위) 반환
                                         - 디렉토리인 경우, 구현에 따라 0일 수 있음
                  .Mode() fs.FildMode  : 파일의 모드 및 타입 반환
                  .ModTime() time.Time : 파일의 마지막 수정 시각 반환

2. 파일 검사를 위한 os 패키지 함수
   os.Stat(path) (fs.FileInfo, error) : 단일 파일에 대한 FileInfo 값 가져옴
                                        - 경로 존재 ❌ -> os.ErrNotExist 반
                                        - os.IsNotExist(err)로 사용됨
                                        ex) info, err := os.Stat("report.txt")
                                            if err != nil {
                                                if os.IsNotExist(err) {
                                                    fmt.Println("파일이 존재하지 않아요.")
                                                } else {
                                                    log.Fatal(err)
                                                }
                                            }

3. 디렉토리 내 모든 파일 처리
   filepath.WalkDir(dir string, func fs.WalkDirFunc) error
     - WalkDirFunc의 시그니처 : type WalkDirFunc func(path string, d fs.DirEntry, err error) error
   : dir 기준 모든 하위 포러와 파일을 재귀적으로 순회하며,
     콜백 함수를 통해 반환하는 값에 따라 특정 디렉토리 탐색 여부 결정 가능