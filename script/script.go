package main

import (
	"context"
	"encoding/csv"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"time"

	"survey/structs"

	firebase "firebase.google.com/go"
	"google.golang.org/api/iterator"
	"google.golang.org/api/option"
)

func main() {
	// 실행파일의 디렉토리 경로 가져오기
	exePath, _ := os.Executable()
	exeDir := filepath.Dir(exePath)
	keyName := "firebaseKey.dev.json"

	exportSurbey(exeDir, keyName)
}

func exportSurbey(exeDir, keyName string) {
	// Firestore 초기화
	ctx := context.Background()

	keyPath := filepath.Join(exeDir, keyName)
	sa := option.WithAuthCredentialsFile(option.ServiceAccount, keyPath)

	app, err := firebase.NewApp(ctx, nil, sa)
	if err != nil {
		log.Fatalln(err)
	}

	client, err := app.Firestore(ctx)
	if err != nil {
		log.Fatalln(err)
	}
	defer client.Close()

	// CSV 파일 생성
	filename := fmt.Sprintf("survey_export_%s.csv", time.Now().Format("20060102_150405"))
	filePath := filepath.Join(exeDir, filename)

	file, err := os.Create(filePath)
	if err != nil {
		log.Fatalln(err)
	}
	defer file.Close()

	writer := csv.NewWriter(file)
	defer writer.Flush()

	// UTF-8 BOM 추가 (Excel에서 한글 깨짐 방지)
	file.Write([]byte{0xEF, 0xBB, 0xBF})

	var survey structs.Survey
	headers := []string{"문서ID", "제출 날짜"}

	// A
	headers = append(headers, []string{
		"A1-성명", "A2-부서", "A3-직위",
		"A4-전화번호", "A5-이메일",
		"A6-사업체명", "A7-주소",
	}...)

	// B
	headers = append(headers, survey.B1.PrintHeader()...)
	headers = append(headers, survey.B2.PrintHeader()...)
	headers = append(headers, survey.B3.PrintHeader()...)
	headers = append(headers, survey.B4.PrintHeader()...)
	headers = append(headers, survey.B5.PrintHeader()...)
	headers = append(headers, survey.B6.PrintHeader()...)
	headers = append(headers, survey.B7.PrintHeader()...)
	headers = append(headers, survey.B8.PrintHeader()...)
	headers = append(headers, survey.B9.PrintHeader()...)
	headers = append(headers, survey.B10.PrintHeader()...)
	headers = append(headers, survey.B11.PrintHeader()...)
	headers = append(headers, survey.B12.PrintHeader()...)

	// cHeaders := []string{
	// 	// C1
	// 	"C1-철도 비용", "C1-철도 시간", "C1-철도 정시도착율", "C1-철도 운행횟수",
	// 	"C1-도로 비용", "C1-도로 시간", "C1-도로 정시도착율",
	// 	"C1-철송률", "C1-철송선택",
	// 	// C2
	// 	"C2-철도 비용", "C2-철도 시간", "C2-철도 정시도착율", "C2-철도 운행횟수",
	// 	"C2-도로 비용", "C2-도로 시간", "C2-도로 정시도착율",
	// 	"C2-철송률", "C2-철송선택",
	// 	// C3
	// 	"C3-철도 비용", "C3-철도 시간", "C3-철도 정시도착율", "C3-철도 운행횟수",
	// 	"C3-도로 비용", "C3-도로 시간", "C3-도로 정시도착율",
	// 	"C3-철송률", "C3-철송선택",
	// 	// C4
	// 	"C4-철도 비용", "C4-철도 시간", "C4-철도 정시도착율", "C4-철도 운행횟수",
	// 	"C4-도로 비용", "C4-도로 시간", "C4-도로 정시도착율",
	// 	"C4-철송률", "C4-철송선택",
	// 	// C5
	// 	"C5-철도 비용", "C5-철도 시간", "C5-철도 정시도착율", "C5-철도 운행횟수",
	// 	"C5-도로 비용", "C5-도로 시간", "C5-도로 정시도착율",
	// 	"C5-철송률", "C5-철송선택",
	// 	// C6
	// 	"C6-철도 비용", "C6-철도 시간", "C6-철도 정시도착율", "C6-철도 운행횟수",
	// 	"C6-도로 비용", "C6-도로 시간", "C6-도로 정시도착율",
	// 	"C6-철송률", "C6-철송선택",
	// 	// C7
	// 	"C7-철도 비용", "C7-철도 시간", "C7-철도 정시도착율", "C7-철도 운행횟수",
	// 	"C7-도로 비용", "C7-도로 시간", "C7-도로 정시도착율",
	// 	"C7-철송률", "C7-철송선택",
	// 	// C8
	// 	"C8-철도 비용", "C8-철도 시간", "C8-철도 정시도착율", "C8-철도 운행횟수",
	// 	"C8-도로 비용", "C8-도로 시간", "C8-도로 정시도착율",
	// 	"C8-철송률", "C8-철송선택",
	// 	// C9
	// 	"C9-철도 비용", "C9-철도 시간", "C9-철도 정시도착율", "C9-철도 운행횟수",
	// 	"C9-도로 비용", "C9-도로 시간", "C9-도로 정시도착율",
	// 	"C9-철송률", "C9-철송선택",
	// 	// C10
	// 	"C10-철도 비용", "C10-철도 시간", "C10-철도 정시도착율", "C10-철도 운행횟수",
	// 	"C10-도로 비용", "C10-도로 시간", "C10-도로 정시도착율",
	// 	"C10-철송률", "C10-철송선택",
	// }

	writer.Write(headers)

	iter := client.Collection("surveys").Documents(ctx)
	for {
		doc, err := iter.Next()
		if err != nil {
			if err == iterator.Done {
				break
			}
			log.Fatalln(err)
		}

		if doc.Ref.ID == "metadata" {
			print(doc.Data())
			continue
		}

		var survey structs.Survey
		if err := doc.DataTo(&survey); err != nil {
			log.Fatalln(err)
		}

		loc, _ := time.LoadLocation("Asia/Seoul")
		createdAt := survey.CreatedAt.In(loc).Format("2006-01-02 15:04:05")
		row := []string{doc.Ref.ID, createdAt}

		// A
		row = append(row, []string{
			survey.Respondent.Name, survey.Respondent.Department, survey.Respondent.Position,
			survey.Respondent.Phone, survey.Respondent.Email,
			survey.Company.Name, survey.Company.Address,
		}...)

		// B
		row = append(row, survey.B1.PrintString()...)
		row = append(row, survey.B2.PrintString()...)
		row = append(row, survey.B3.PrintString()...)
		row = append(row, survey.B4.PrintString()...)
		row = append(row, survey.B5.PrintString()...)
		row = append(row, survey.B6.PrintString()...)
		row = append(row, survey.B7.PrintString()...)
		row = append(row, survey.B8.PrintString()...)
		row = append(row, survey.B9.PrintString()...)
		row = append(row, survey.B10.PrintString()...)
		row = append(row, survey.B11.PrintString()...)
		row = append(row, survey.B12.PrintString()...)

		writer.Write(row)
	}

}
