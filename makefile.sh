#!/bin/bash

echo -n "Go 모듈명을 입력하세요 : "
read moduleName
go mod init moduleName
touch main.go text.txt