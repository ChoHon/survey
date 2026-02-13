package main

import (
	"bufio"
	"context"
	_ "embed"
	"encoding/csv"
	"fmt"
	"os"
	"path/filepath"
	"reflect"
	"strconv"
	"strings"
	"time"

	"survey/structs"

	firebase "firebase.google.com/go"
	"google.golang.org/api/iterator"
	"google.golang.org/api/option"
)

//go:embed firebaseKey.json
var firebaseKeyJSON []byte

func main() {
	// 실행파일의 디렉토리 경로 가져오기
	exePath, _ := os.Executable()
	exeDir := filepath.Dir(exePath)

	if err := exportSurbey(exeDir); err != nil {
		fmt.Printf("\n오류 발생: %v\n", err)

		fmt.Println("\n엔터를 누르면 종료됩니다...")
		bufio.NewReader(os.Stdin).ReadBytes('\n')
	}

}

func exportSurbey(exeDir string) error {
	// Firestore 초기화
	ctx := context.Background()

	sa := option.WithAuthCredentialsJSON(option.ServiceAccount, firebaseKeyJSON)

	app, err := firebase.NewApp(ctx, nil, sa)
	if err != nil {
		return fmt.Errorf("Firebase 앱 초기화 실패: %w", err)
	}

	fmt.Println("1. Firebase 연동 완료 ")

	client, err := app.Firestore(ctx)
	if err != nil {
		return fmt.Errorf("Firestore 클라이언트 생성 실패: %w", err)
	}
	defer client.Close()

	fmt.Println("2. Firestore Database 연동 완료 ")

	// CSV 파일 생성
	filename := fmt.Sprintf("survey_export_%s.csv", time.Now().Format("20060102_150405"))
	filePath := filepath.Join(exeDir, filename)

	file, err := os.Create(filePath)
	if err != nil {
		return fmt.Errorf("CSV 파일 생성 실패: %w", err)
	}
	defer file.Close()

	fmt.Println("3. CSV 파일 생성 완료 ")

	writer := csv.NewWriter(file)
	defer writer.Flush()

	// UTF-8 BOM 추가 (Excel에서 한글 깨짐 방지)
	file.Write([]byte{0xEF, 0xBB, 0xBF})

	var survey structs.Survey
	headers := []string{"문서ID", "제출 날짜", "C문항 유형"}

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

	cHeaders := []string{
		// C1
		"C1-철도 비용", "C1-철도 시간", "C1-철송률",
		"C1-도로 비용", "C1-도로 시간",
		"C1-철송선택",
		// C2
		"C2-철도 비용", "C2-철도 시간", "C2-철송률",
		"C2-도로 비용", "C2-도로 시간",
		"C2-철송선택",
		// C3
		"C3-철도 비용", "C3-철도 시간", "C3-철송률",
		"C3-도로 비용", "C3-도로 시간",
		"C3-철송선택",
		// C4
		"C4-철도 비용", "C4-철도 시간", "C4-철송률",
		"C4-도로 비용", "C4-도로 시간",
		"C4-철송선택",
		// C5
		"C5-철도 비용", "C5-철도 시간", "C5-철송률",
		"C5-도로 비용", "C5-도로 시간",
		"C5-철송선택",
		// C6
		"C6-철도 비용", "C6-철도 시간", "C6-철송률",
		"C6-도로 비용", "C6-도로 시간",
		"C6-철송선택",
		// C7
		"C7-철도 비용", "C7-철도 시간", "C7-철송률",
		"C7-도로 비용", "C7-도로 시간",
		"C7-철송선택",
		// C8
		"C8-철도 비용", "C8-철도 시간", "C8-철송률",
		"C8-도로 비용", "C8-도로 시간",
		"C8-철송선택",
		// C9
		"C9-철도 비용", "C9-철도 시간", "C9-철송률",
		"C9-도로 비용", "C9-도로 시간",
		"C9-철송선택",
		// C10
		"C10-철도 비용", "C10-철도 시간", "C10-철송률",
		"C10-도로 비용", "C10-도로 시간",
		"C10-철송선택",
		// C11
		"C11-철도 비용", "C11-철도 시간", "C11-철송률",
		"C11-도로 비용", "C11-도로 시간",
		"C11-철송선택",
		// C12
		"C12-철도 비용", "C12-철도 시간", "C12-철송률",
		"C12-도로 비용", "C12-도로 시간",
		"C12-철송선택",
		// C13
		"C13-철도 비용", "C13-철도 시간", "C13-철송률",
		"C13-도로 비용", "C13-도로 시간",
		"C13-철송선택",
		// C14
		"C14-철도 비용", "C14-철도 시간", "C14-철송률",
		"C14-도로 비용", "C14-도로 시간",
		"C14-철송선택",
		// C15
		"C15-철도 비용", "C15-철도 시간", "C15-철송률",
		"C15-도로 비용", "C15-도로 시간",
		"C15-철송선택",
		// C16
		"C16-철도 비용", "C16-철도 시간", "C16-철송률",
		"C16-도로 비용", "C16-도로 시간",
		"C16-철송선택",
		// C17
		"C17-철도 비용", "C17-철도 시간", "C17-철송률",
		"C17-도로 비용", "C17-도로 시간",
		"C17-철송선택",
		// C18
		"C18-철도 비용", "C18-철도 시간", "C18-철송률",
		"C18-도로 비용", "C18-도로 시간",
		"C18-철송선택",
		// C19
		"C19-철도 비용", "C19-철도 시간", "C19-철송률",
		"C19-도로 비용", "C19-도로 시간",
		"C19-철송선택",
	}
	headers = append(headers, cHeaders...)

	writer.Write(headers)

	fmt.Println("4. CSV 헤더 쓰기 완료 ")

	total := 0
	success := 0

	iter := client.Collection("surveys").Documents(ctx)
	for {
		doc, err := iter.Next()
		if err != nil {
			if err == iterator.Done {
				break
			}
			return fmt.Errorf("문서 조회 실패: %w", err)
		}

		if doc.Ref.ID == "metadata" {
			print(doc.Data())
			continue
		}

		total++

		func() {
			defer func() {
				if r := recover(); r != nil {
					fmt.Printf("⚠️  문서 처리 중 panic 발생 (ID: %s): %v\n", doc.Ref.ID, r)
				}
			}()

			var survey structs.Survey
			if err := doc.DataTo(&survey); err != nil {
				fmt.Printf("⚠️  문서 데이터 파싱 실패 (ID: %s): %v\n", doc.Ref.ID, err)
				return
			}

			loc := time.FixedZone("KST", 9*60*60)
			createdAt := survey.CreatedAt.In(loc).Format("2006-01-02 15:04:05")

			questionStrs := make([]string, len(survey.Questions))
			for i, q := range survey.Questions {
				questionStrs[i] = strconv.Itoa(q)
			}

			row := []string{doc.Ref.ID, createdAt, strings.Join(questionStrs, ", ")}

			// A
			row = append(row, []string{
				survey.Respondent.Name, survey.Respondent.Department, survey.Respondent.Position,
				survey.Respondent.Phone, survey.Respondent.Email,
				survey.Company.Name, survey.Company.Address,
			}...)

			// B
			v := reflect.ValueOf(survey)
			for i := 1; i <= 12; i++ {
				field := v.FieldByName(fmt.Sprintf("B%d", i))
				if field.IsValid() {
					if p, ok := field.Interface().(interface{ PrintString() []string }); ok {
						row = append(row, p.PrintString()...)
					}
				}
			}

			// C
			for i := 1; i <= 19; i++ {
				field := v.FieldByName(fmt.Sprintf("C%d", i))
				if field.IsValid() {
					if p, ok := field.Interface().(interface{ PrintString() []string }); ok {
						row = append(row, p.PrintString()...)
					}
				}
			}

			if err := writer.Write(row); err != nil {
				fmt.Printf("⚠️  CSV 쓰기 실패 (ID: %s): %v\n", doc.Ref.ID, err)
				return
			}

			success++
		}()
	}

	fmt.Printf("5. CSV 데이터 쓰기 완료(%d/%d)\n", success, total)

	return nil
}
