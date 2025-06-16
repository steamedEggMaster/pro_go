##### Reader 및 Writer로 포매팅 및 스캔
1. Reader에서 값 스캔
   fmt.Fscanf(io.Reader, template string, ...vals)
      .Fscan(io.Reader, ...vals)
    
2. Writer에 포매팅한 문자열 쓰기
   fmt.Fprintf(io.Writer, template string, ...vals)

3. Writer로 Replacer 사용
   ex) replacer := strings.NewReplacer(substring ...string)
       replacer.WriteString(writer, str string)
       : 치환한 문자열 s를 Writer에 바로 씀
   