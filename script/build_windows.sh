CGO_ENABLED=0 GOOS=windows GOARCH=amd64 go build -o get_survey_windows_x86_64.exe script.go

zip -m get_survey.zip get_survey_windows_x86_64.exe

mv get_survey.zip ~/Documents/