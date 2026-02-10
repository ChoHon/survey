package main

import (
	"context"
	"encoding/csv"
	"fmt"
	"log"
	"os"
	"time"

	"survey/structs"

	firebase "firebase.google.com/go"
	"google.golang.org/api/iterator"
	"google.golang.org/api/option"
)

func main() {
	ctx := context.Background()

	sa := option.WithAuthCredentialsFile(option.ServiceAccount, "./firebaseKey.json")

	app, err := firebase.NewApp(ctx, nil, sa)
	if err != nil {
		log.Fatalln(err)
	}

	client, err := app.Firestore(ctx)
	if err != nil {
		log.Fatalln(err)
	}

	defer client.Close()

	iter := client.Collection("surveys").Documents(ctx)
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			log.Fatalln(err)
		}

		if doc.Ref.ID == "metadata" {
			continue
		}

		var survey structs.Survey
		if err := doc.DataTo(&survey); err != nil {
			log.Fatalln(err)
		}

		fmt.Println(survey.Respondent)
	}
}

func exportSurbey(docId string, survey *structs.Survey) {
	filename := fmt.Sprintf("survey_export_%s.csv", time.Now().Format("20060102_150405"))

	file, err := os.Create(filename)
	if err != nil {
		log.Fatalln(err)
	}
	defer file.Close()

	writer := csv.NewWriter(file)
	defer writer.Flush()

	// UTF-8 BOM 추가 (Excel에서 한글 깨짐 방지)
	file.Write([]byte{0xEF, 0xBB, 0xBF})

	// 헤더 작성
	metaHeaders := []string{"문서ID"}
	aHeaders := []string{
		"A1-성명", "A2-부서", "A3-직위", "A4-전화번호", "A5-이메일",
		"A6-사업체명", "A7-주소",
	}
	bHeaders := []string{
		"B1-1-종사자수",
		"B1-2-컨테이너차량(총)", "B1-2-컨테이너차량(직영)", "B1-2-컨테이너차량(위수탁)", "B1-2-사유화차",
		"B1-3-매출액(총)", "B1-3-매출액(내륙컨운송)",

		"B2-운송량(총)", "B2-운송량(도로)", "B2-운송량(철도)", "B2-운송량(연안해운)",

		"B3-업체수(<=9)", "B3-업체수(10~99)", "B3-업체수(>=100)",
		"B3-비중(<=9)", "B3-업체수(10~99)", "B3-업체수(>=100)",

		"B4-운송결정권",

		"B5-운송기한(당일)", "B5-운송기한(익일)", "B5-운송기한(일주일 내)", "B5-운송기한(일주일 이상)", "B5-운송기한(평균)",
		// B6
		"B6-내륙기종점(시도)", "B6-내륙기종점(시군)", "B6-내륙기종점(구)", "B6-내륙기종점(대표지점)",
		"B6-항만기종점(시도)", "B6-항만기종점(시군)", "B6-항만기종점(구)", "B6-항만기종점(대표지점)",
		"B6-철도경유지(화물역1)", "B6-철도경유지(화물역2)",
		"B6-도로경유지(시도)", "B6-도로경유지(시군)", "B6-도로경유지(구)", "B6-도로경유지(경유지명)",
		// B7
		"B7-셔틀운송1(운송시간)", "B7-셔틀운송1(비용-20ft)", "B7-셔틀운송1(비용-40ft)",
		"B7-상하역1(운송시간)", "B7-상하역1(비용-20ft)", "B7-상하역1(비용-40ft)",
		"B7-보관1(운송시간)", "B7-보관1(비용-20ft)", "B7-보관1(비용-40ft)",
		"B7-본선(운송시간)", "B7-본선(비용-20ft)", "B7-본선(비용-40ft)",
		"B7-상하역2(운송시간)", "B7-상하역2(비용-20ft)", "B7-상하역2(비용-40ft)",
		"B7-보관2(운송시간)", "B7-보관2(비용-20ft)", "B7-보관2(비용-40ft)",
		"B7-셔틀운송2(운송시간)", "B7-셔틀운송2(비용-20ft)", "B7-셔틀운송2(비용-40ft)",
		// B8
		"B7-도로본선1(운송시간)", "B7-도로본선1(비용-20ft)", "B7-도로본선1(비용-40ft)",
		"B7-상하역(운송시간)", "B7-상하역(비용-20ft)", "B7-상하역(비용-40ft)",
		"B7-보관(운송시간)", "B7-보관(비용-20ft)", "B7-보관(비용-40ft)",
		"B7-도로본선2(운송시간)", "B7-도로본선2(비용-20ft)", "B7-도로본선2(비용-40ft)",

		"B9-허용지연시간",

		"B10-철도 정시도착률(3시간 이내)", "B10-철도 정시도착률(허용지연시간 이내)",
		"B10-도로 정시도착률(3시간 이내)", "B10-도로 정시도착률(허용지연시간 이내)",

		"B11-운송수단 선택 요인(1순위)", "B11-운송수단 선택 요인(2순위)", "B11-운송수단 선택 요인(3순위)",

		"B12-운송비용", "B12-운송시간", "B12-운송 신뢰성 및 정시성", "B12-운행빈도",
		"B12-안전성", "B12-운송과정 조절 용이성", "B12-망 안정성", "B12-친환경성",
		"B12-총 운송거리", "B12-터미널 접근성", "B12-연간 출하량(물동량)", "B12-무형 서비스 및 관행",
	}
	cHeaders := []string{
		// C1
		"C1-철도 비용", "C1-철도 시간", "C1-철도 정시도착율", "C1-철도 운행횟수",
		"C1-도로 비용", "C1-도로 시간", "C1-도로 정시도착율",
		"C1-철송률", "C1-철송선택",
		// C2
		"C2-철도 비용", "C2-철도 시간", "C2-철도 정시도착율", "C2-철도 운행횟수",
		"C2-도로 비용", "C2-도로 시간", "C2-도로 정시도착율",
		"C2-철송률", "C2-철송선택",
		// C3
		"C3-철도 비용", "C3-철도 시간", "C3-철도 정시도착율", "C3-철도 운행횟수",
		"C3-도로 비용", "C3-도로 시간", "C3-도로 정시도착율",
		"C3-철송률", "C3-철송선택",
		// C4
		"C4-철도 비용", "C4-철도 시간", "C4-철도 정시도착율", "C4-철도 운행횟수",
		"C4-도로 비용", "C4-도로 시간", "C4-도로 정시도착율",
		"C4-철송률", "C4-철송선택",
		// C5
		"C5-철도 비용", "C5-철도 시간", "C5-철도 정시도착율", "C5-철도 운행횟수",
		"C5-도로 비용", "C5-도로 시간", "C5-도로 정시도착율",
		"C5-철송률", "C5-철송선택",
		// C6
		"C6-철도 비용", "C6-철도 시간", "C6-철도 정시도착율", "C6-철도 운행횟수",
		"C6-도로 비용", "C6-도로 시간", "C6-도로 정시도착율",
		"C6-철송률", "C6-철송선택",
		// C7
		"C7-철도 비용", "C7-철도 시간", "C7-철도 정시도착율", "C7-철도 운행횟수",
		"C7-도로 비용", "C7-도로 시간", "C7-도로 정시도착율",
		"C7-철송률", "C7-철송선택",
		// C8
		"C8-철도 비용", "C8-철도 시간", "C8-철도 정시도착율", "C8-철도 운행횟수",
		"C8-도로 비용", "C8-도로 시간", "C8-도로 정시도착율",
		"C8-철송률", "C8-철송선택",
		// C9
		"C9-철도 비용", "C9-철도 시간", "C9-철도 정시도착율", "C9-철도 운행횟수",
		"C9-도로 비용", "C9-도로 시간", "C9-도로 정시도착율",
		"C9-철송률", "C9-철송선택",
		// C10
		"C10-철도 비용", "C10-철도 시간", "C10-철도 정시도착율", "C10-철도 운행횟수",
		"C10-도로 비용", "C10-도로 시간", "C10-도로 정시도착율",
		"C10-철송률", "C10-철송선택",
	}

	headers := append(metaHeaders, aHeaders...)
	headers = append(headers, bHeaders...)
	headers = append(headers, cHeaders...)
	writer.Write(headers)

	metaRow := []string{docId}
	aRow := []string{
		survey.Respondent.Name, survey.Respondent.Department, survey.Respondent.Position,
		survey.Respondent.Phone, survey.Respondent.Email,
		survey.Company.Name, survey.Company.Address,
	}
	bRow := []string{}
	bRow = append(bRow, survey.B1.PrintString()...)
	bRow = append(bRow, survey.B2.PrintString()...)
	bRow = append(bRow, survey.B3.PrintString()...)
	bRow = append(bRow, fmt.Sprintf("%d", survey.B4.LevelOfDecisionMakingPower))
	bRow = append(bRow, survey.B5.PrintString()...)
	bRow = append(bRow, survey.B6.PrintString()...)
	bRow = append(bRow, survey.B7.PrintString()...)
	bRow = append(bRow, survey.B8.PrintString()...)
	bRow = append(bRow, survey.B9.PrintString()...)
	bRow = append(bRow, survey.B10.PrintString()...)
	bRow = append(bRow, survey.B11.PrintString()...)
	bRow = append(bRow, survey.B12.PrintString()...)

		fmt.Sprintf("%d", survey.B5.SameDayPercentage),
		fmt.Sprintf("%d", survey.B5.NextDayPercentage),
		fmt.Sprintf("%d", survey.B5.WithinAWeekPercentage),
		fmt.Sprintf("%d", survey.B5.OverAWeekPercentage),
		survey.B5.Average.ConvertHours(),

		survey.B6.InlandOD.SiDo, survey.B6.InlandOD.SiGun, survey.B6.InlandOD.Gu, survey.B6.InlandOD.Point,
		survey.B6.PortOD.SiDo, survey.B6.PortOD.SiGun, survey.B6.PortOD.Gu, survey.B6.PortOD.Point,
		survey.B6.Intermediate.Station1, survey.B6.Intermediate.Station2,
		survey.B6.Intermediate.Road.SiDo, survey.B6.Intermediate.Road.SiGun, survey.B6.Intermediate.Road.Gu, survey.B6.Intermediate.Road.Point,

		survey.B7.Suttle1.Duration.ConvertHours(),
		fmt.Sprintf("%d", survey.B7.Suttle1.Cost.FT20),
		fmt.Sprintf("%d", survey.B7.Suttle1.Cost.FT40),
		survey.B7.Transshipment1.LoadAndUnload.Duration.ConvertHours(),
		fmt.Sprintf("%d", survey.B7.Transshipment1.LoadAndUnload.Cost.FT20),
		fmt.Sprintf("%d", survey.B7.Transshipment1.LoadAndUnload.Cost.FT40),
		survey.B7.Transshipment1.Storage.Duration.ConvertHours(),
		fmt.Sprintf("%d", survey.B7.Transshipment1.Storage.Cost.FT20),
		fmt.Sprintf("%d", survey.B7.Transshipment1.Storage.Cost.FT40),
		survey.B7.Main.Duration.ConvertHours(),
		fmt.Sprintf("%d", survey.B7.Main.Cost.FT20),
		fmt.Sprintf("%d", survey.B7.Main.Cost.FT40),
		survey.B7.Transshipment2.LoadAndUnload.Duration.ConvertHours(),
		fmt.Sprintf("%d", survey.B7.Transshipment2.LoadAndUnload.Cost.FT20),
		fmt.Sprintf("%d", survey.B7.Transshipment2.LoadAndUnload.Cost.FT40),
		survey.B7.Transshipment2.Storage.Duration.ConvertHours(),
		fmt.Sprintf("%d", survey.B7.Transshipment2.Storage.Cost.FT20),
		fmt.Sprintf("%d", survey.B7.Transshipment2.Storage.Cost.FT40),
		survey.B7.Suttle2.Duration.ConvertHours(),
		fmt.Sprintf("%d", survey.B7.Suttle2.Cost.FT20),
		fmt.Sprintf("%d", survey.B7.Suttle2.Cost.FT40),

		survey.B8.Main1.Duration.ConvertHours(),
		fmt.Sprintf("%d", survey.B8.Main1.Cost.FT20),
		fmt.Sprintf("%d", survey.B8.Main1.Cost.FT40),
		survey.B8.Transshipment.LoadAndUnload.Duration.ConvertHours(),
		fmt.Sprintf("%d", survey.B8.Transshipment.LoadAndUnload.Cost.FT20),
		fmt.Sprintf("%d", survey.B8.Transshipment.LoadAndUnload.Cost.FT40),
		survey.B8.Transshipment.Storage.Duration.ConvertHours(),
		fmt.Sprintf("%d", survey.B8.Transshipment.Storage.Cost.FT20),
		fmt.Sprintf("%d", survey.B8.Transshipment.Storage.Cost.FT40),
		survey.B8.Main2.Duration.ConvertHours(),
		fmt.Sprintf("%d", survey.B8.Main2.Cost.FT20),
		fmt.Sprintf("%d", survey.B8.Main2.Cost.FT40),
	}
}
