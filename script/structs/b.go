package structs

import (
	"fmt"
	"math"
	"strings"
)

// B1. 다음은 귀사의 사업체 현황 및 규모에 관한 설문입니다.
// B1-1 귀사의 종사자수는 어떻게 되십니까?
// B1-2 귀사의 컨테이너 운송수단 보유현황은 어떻게 되십니까?
// B1-3 귀사의 연간 매출액은 어떻게 되십니까?
type B1 struct {
	NumberOfEmployees               int                             `firestore:"numberOfEmployees,omitempty"`
	NumberOfContainerTransportation NumberOfContainerTransportation `firestore:"containerTransportation,omitempty"`
	AnnualRevenue                   AnnualRevenue                   `firestore:"annualRevenue,omitempty"`
}

func (b B1) PrintHeader() []string {
	return []string{
		"B1-1-종사자수",
		"B1-2-컨테이너차량(총)",
		"B1-2-컨테이너차량(직영)",
		"B1-2-컨테이너차량(위수탁)",
		"B1-2-사유화차",
		"B1-3-매출액(총)",
		"B1-3-매출액(내륙컨운송)",
	}
}

func (b B1) PrintString() []string {
	return []string{
		fmt.Sprintf("%d", b.NumberOfEmployees),
		fmt.Sprintf("%d", b.NumberOfContainerTransportation.ContainerVehicle.Total),
		fmt.Sprintf("%d", b.NumberOfContainerTransportation.ContainerVehicle.Direct),
		fmt.Sprintf("%d", b.NumberOfContainerTransportation.ContainerVehicle.Consigned),
		fmt.Sprintf("%d", b.NumberOfContainerTransportation.PrivateVehicle),
		fmt.Sprintf("%d", b.AnnualRevenue.Total),
		fmt.Sprintf("%d", b.AnnualRevenue.ContainerInlandTransport),
	}
}

type NumberOfContainerTransportation struct {
	ContainerVehicle ContainerVehicle `firestore:"containerVehicle,omitempty"`
	PrivateVehicle   int              `firestore:"privateVehicle,omitempty"`
}

type ContainerVehicle struct {
	Total     int `firestore:"total,omitempty"`
	Direct    int `firestore:"direct,omitempty"`
	Consigned int `firestore:"consigned,omitempty"`
}

type AnnualRevenue struct {
	Total                    int `firestore:"total,omitempty"`
	ContainerInlandTransport int `firestore:"inland,omitempty"`
}

// B2. 2024년 기준 귀사의 연간 컨테이너 운송량은 어떻게 되십니까?
type B2 struct {
	Total   int `firestore:"total,omitempty"`
	Road    int `firestore:"road,omitempty"`
	Rail    int `firestore:"rail,omitempty"`
	Coastal int `firestore:"coastal,omitempty"`
}

func (b B2) PrintHeader() []string {
	return []string{
		"B2-운송량(총)",
		"B2-운송량(도로)",
		"B2-운송량(철도)",
		"B2-운송량(연안해운)",
	}
}

func (b B2) PrintString() []string {
	return []string{
		fmt.Sprintf("%d", b.Total),
		fmt.Sprintf("%d", b.Road),
		fmt.Sprintf("%d", b.Rail),
		fmt.Sprintf("%d", b.Coastal),
	}
}

// B3. 귀사의 컨테이너 화주 고객사는 어떻게 구성되어 있습니까?
type B3 struct {
	UnderTen     NumberPercentage `firestore:"underTen,omitempty"`
	UnderHundred NumberPercentage `firestore:"underHundred,omitempty"`
	OverHundred  NumberPercentage `firestore:"overHundred,omitempty"`
}

func (b B3) PrintHeader() []string {
	return []string{
		"B3-업체수(<=9)",
		"B3-업체수(10~99)",
		"B3-업체수(>=100)",
		"B3-비중(<=9)",
		"B3-비중(10~99)",
		"B3-비중(>=100)",
	}
}

func (b B3) PrintString() []string {
	return []string{
		fmt.Sprintf("%d", b.UnderTen.Number),
		fmt.Sprintf("%d", b.UnderHundred.Number),
		fmt.Sprintf("%d", b.OverHundred.Number),
		fmt.Sprintf("%d", b.UnderTen.Percentage),
		fmt.Sprintf("%d", b.UnderHundred.Percentage),
		fmt.Sprintf("%d", b.OverHundred.Percentage),
	}
}

type NumberPercentage struct {
	Number     int `firestore:"number,omitempty"`
	Percentage int `firestore:"percentage,omitempty"`
}

// B4. 컨테이너 운송수단 선택에 귀사가 가지는 결정권의 수준은 어느정도입니까?
type DecisionLevel int

const (
	DecisionLevelCompletely DecisionLevel = iota + 1 // 0: 전적으로 운송수단 선택권을 가짐
	DecisionLevelInGeneral                           // 1: 전반적으로 운송수단 선택권을 가지나 일부 화주사의 선호나 요청사항 반영
	DecisionLevelFew                                 // 2: 일부에 한해 운송수단 선택권을 가지며, 전반적으로 화주사가 운송수단을 선택
	DecisionLevelNone                                // 3: 전적으로 화주사가 운송수단 선택권을 가짐
	DecisionLevelSingleOnly                          // 4: 해당없음(단일 운송수단만 이용)
)

type B4 struct {
	LevelOfDecisionMakingPower DecisionLevel `firestore:"levelOfDecisionMakingPower,omitempty"`
}

func (b B4) PrintHeader() []string {
	return []string{"B4-운송결정권"}
}

func (b B4) PrintString() []string {
	return []string{
		fmt.Sprintf("%d", b.LevelOfDecisionMakingPower),
	}
}

// B5. 컨테이너 화물을 국내 목적지(항만 또는 화주 문전)까지 운송을 완료하는 데까지 요구되는 시간은 어느 정도입니까?
type B5 struct {
	SameDayPercentage     int      `firestore:"sameDayPercentage,omitempty"`
	NextDayPercentage     int      `firestore:"nextDayPercentage,omitempty"`
	WithinAWeekPercentage int      `firestore:"withinAWeekPercentage,omitempty"`
	OverAWeekPercentage   int      `firestore:"overAWeekPercentage,omitempty"`
	Average               Duration `firestore:"average,omitempty"`
}

func (b B5) PrintHeader() []string {
	return []string{
		"B5-운송기한(당일)",
		"B5-운송기한(익일)",
		"B5-운송기한(일주일 내)",
		"B5-운송기한(일주일 이상)",
		"B5-운송기한(평균)",
	}
}

func (b B5) PrintString() []string {
	return []string{
		fmt.Sprintf("%d", b.SameDayPercentage),
		fmt.Sprintf("%d", b.NextDayPercentage),
		fmt.Sprintf("%d", b.WithinAWeekPercentage),
		fmt.Sprintf("%d", b.OverAWeekPercentage),
		b.Average.ConvertHours(),
	}
}

type Duration struct {
	Days    int `firestore:"days,omitempty"`
	Hours   int `firestore:"hours,omitempty"`
	Minutes int `firestore:"minutes,omitempty"`
}

func (d Duration) ConvertHours() string {
	minutesToHour := float64(d.Minutes) / 60.0
	rounded := math.Round(minutesToHour*10) / 10

	hours := d.Days*24 + d.Hours
	result := float64(hours) + rounded

	s := fmt.Sprintf("%.3f", result)
	s = strings.TrimRight(s, "0")
	s = strings.TrimRight(s, ".")
	return s
}

// B6. 단거리 셔틀운송을 제외하고, 귀사가 가장 많은 컨테이너를 운송하는 대표운송구간이 어떻게 되십니까?(시군구 기준)
// 단, 귀사가 철도를 이용중이라면 철도물동량이 가장 많은 구간을 기준으로 응답해주시기 바라며, 동일 구간의 도로운송현황도 응답해주시기 바랍니다.
// 철도를 전혀 이용하지 않는다면 도로운송에 한해서 응답해주시기 바랍니다.
type B6 struct {
	InlandOD              OriginDestination     `firestore:"inlandOD,omitempty"`
	Intermediate          Intermediate          `firestore:"intermediate,omitempty"`
	PortOD                OriginDestination     `firestore:"portOD,omitempty"`
	AnnualTransportVolume AnnualTransportVolume `firestore:"annualTransportVolume,omitempty"`
}

func (b B6) PrintHeader() []string {
	return []string{
		"B6-내륙기종점(시도)",
		"B6-내륙기종점(시군구)",
		"B6-내륙기종점(대표지점)",

		"B6-항만기종점(시도)",
		"B6-항만기종점(시군구)",
		"B6-항만기종점(대표지점)",

		"B6-철도경유지(화물역1)",
		"B6-철도경유지(화물역2)",

		"B6-도로경유지(시도)",
		"B6-도로경유지(시군구)",
		"B6-도로경유지(경유지명)",

		"B6-연간운송량(총량)",
		"B6-연간운송량(수출)",
		"B6-연간운송량(수입)",
		"B6-연간운송량(철도)",
		"B6-연간운송량(도로)",
	}
}

func (b B6) PrintString() []string {
	return []string{
		// 내륙 기종점
		b.InlandOD.SiDo,
		b.InlandOD.SiGunGu,
		b.InlandOD.Point,
		// 항만 기종점
		b.PortOD.SiDo,
		b.PortOD.SiGunGu,
		b.PortOD.Point,
		// 철도 경유지
		b.Intermediate.Station1,
		b.Intermediate.Station2,
		// 도로 경유지
		b.Intermediate.Road.SiDo,
		b.Intermediate.Road.SiGunGu,
		b.Intermediate.Road.Point,
		// 운송량
		fmt.Sprintf("%d", b.AnnualTransportVolume.Total),
		fmt.Sprintf("%d", b.AnnualTransportVolume.Direction.Export),
		fmt.Sprintf("%d", b.AnnualTransportVolume.Direction.Import),
		fmt.Sprintf("%d", b.AnnualTransportVolume.Transport.Rail),
		fmt.Sprintf("%d", b.AnnualTransportVolume.Transport.Road),
	}
}

type OriginDestination struct {
	SiDo    string `firestore:"sido,omitempty"`
	SiGunGu string `firestore:"sigungu,omitempty"`
	Point   string `firestore:"point,omitempty"`
}

type Intermediate struct {
	Station1 string            `firestore:"railInter1,omitempty"`
	Station2 string            `firestore:"railInter2,omitempty"`
	Road     OriginDestination `firestore:"road,omitempty"`
}

type AnnualTransportVolume struct {
	Total     int            `firestore:"total,omitempty"`
	Direction Direction      `firestore:"direction,omitempty"`
	Transport Transportation `firestore:"transport,omitempty"`
}

type Direction struct {
	Export int `firestore:"export,omitempty"`
	Import int `firestore:"import,omitempty"`
}

type Transportation struct {
	Rail int `firestore:"rail,omitempty"`
	Road int `firestore:"road,omitempty"`
}

// B7. 문6에서 응답한 대표운송구간을 기준으로 철도 운송과정별로 소요되는 시간과 비용을 기입해주십시오.
// (※문6에서 철도를 응답하지 않았을 경우 문8로 이동)
type B7 struct {
	Suttle1        Transport     `firestore:"suttle1,omitempty"`
	Transshipment1 Transshipment `firestore:"transshipment1,omitempty"`
	Main           Transport     `firestore:"main,omitempty"`
	Transshipment2 Transshipment `firestore:"transshipment2,omitempty"`
	Suttle2        Transport     `firestore:"suttle2,omitempty"`
}

func (b B7) PrintHeader() []string {
	return []string{
		"B7-셔틀운송1(운송시간)",
		"B7-셔틀운송1(비용-20ft)",
		"B7-셔틀운송1(비용-40ft)",

		"B7-상하역1(운송시간)",
		"B7-상하역1(비용-20ft)",
		"B7-상하역1(비용-40ft)",

		"B7-보관1(운송시간)",
		"B7-보관1(비용-20ft)",
		"B7-보관1(비용-40ft)",

		"B7-본선(운송시간)",
		"B7-본선(비용-20ft)",
		"B7-본선(비용-40ft)",

		"B7-상하역2(운송시간)",
		"B7-상하역2(비용-20ft)",
		"B7-상하역2(비용-40ft)",

		"B7-보관2(운송시간)",
		"B7-보관2(비용-20ft)",
		"B7-보관2(비용-40ft)",

		"B7-셔틀운송2(운송시간)",
		"B7-셔틀운송2(비용-20ft)",
		"B7-셔틀운송2(비용-40ft)",
	}
}

func (b B7) PrintString() []string {
	result := []string{}

	// 셔틀운송1
	result = append(result, b.Suttle1.PrintString()...)
	result = append(result, b.Transshipment1.LoadAndUnload.PrintString()...)
	result = append(result, b.Transshipment1.Storage.PrintString()...)
	result = append(result, b.Main.PrintString()...)
	result = append(result, b.Transshipment2.LoadAndUnload.PrintString()...)
	result = append(result, b.Transshipment2.Storage.PrintString()...)
	result = append(result, b.Suttle2.PrintString()...)

	return result
}

type Transport struct {
	Duration Duration `firestore:"duration,omitempty"`
	Cost     Cost     `firestore:"cost,omitempty"`
}

func (t Transport) PrintString() []string {
	return []string{
		t.Duration.ConvertHours(),
		fmt.Sprintf("%d", t.Cost.FT20),
		fmt.Sprintf("%d", t.Cost.FT40),
	}
}

type Cost struct {
	FT20 int `firestore:"ft20,omitempty"`
	FT40 int `firestore:"ft40,omitempty"`
}

type Transshipment struct {
	LoadAndUnload Transport `firestore:"loadAndUnload,omitempty"`
	Storage       Transport `firestore:"storage,omitempty"`
}

// B8. 문B6에서 응답한 대표운송구간을 기준으로 도로 운송과정별로 소요되는 시간과 비용을 기입해주십시오.
type B8 struct {
	Main1         Transport     `firestore:"main1,omitempty"`
	Transshipment Transshipment `firestore:"transshipment,omitempty"`
	Main2         Transport     `firestore:"main2,omitempty"`
}

func (b B8) PrintHeader() []string {
	return []string{
		"B8-도로본선1(운송시간)",
		"B8-도로본선1(비용-20ft)",
		"B8-도로본선1(비용-40ft)",

		"B8-상하역(운송시간)",
		"B8-상하역(비용-20ft)",
		"B8-상하역(비용-40ft)",

		"B8-보관(운송시간)",
		"B8-보관(비용-20ft)",
		"B8-보관(비용-40ft)",

		"B8-도로본선2(운송시간)",
		"B8-도로본선2(비용-20ft)",
		"B8-도로본선2(비용-40ft)",
	}
}

func (b B8) PrintString() []string {
	result := []string{}

	result = append(result, b.Main1.PrintString()...)
	result = append(result, b.Transshipment.LoadAndUnload.PrintString()...)
	result = append(result, b.Transshipment.Storage.PrintString()...)
	result = append(result, b.Main2.PrintString()...)

	return result
}

// B9. 선적기한이나 화주의 요청기한 등에 영향을 주지 않는, 허용할 수 있는 지연시간은 평균 어느정도입니까?
type B9 struct {
	Duration Duration `firestore:"duration,omitempty"`
}

func (b B9) PrintHeader() []string {
	return []string{"B9-허용지연시간"}
}

func (b B9) PrintString() []string {
	return []string{b.Duration.ConvertHours()}
}

// B10. 각 운송수단별 정시도착률을 아래와 같이 정의할 때, 각 운송수단별 컨테이너 화물의 현 정시도착률 수준은 어느 정도입니까?
// 환적, 경유 등을 모두 감안하여 최종 목적지에 도착하는 것 기준으로 응답해주십시오. 철도를 이용하지 않을 경우 철도 정시도착율은 응답하지 않으셔도 됩니다.
type B10 struct {
	Rail OTP `firestore:"rail,omitempty"`
	Road OTP `firestore:"road,omitempty"`
}

func (b B10) PrintHeader() []string {
	return []string{
		"B10-철도 정시도착률(3시간 이내)",
		"B10-철도 정시도착률(허용지연시간 이내)",
		"B10-도로 정시도착률(3시간 이내)",
		"B10-도로 정시도착률(허용지연시간 이내)",
	}
}

func (b B10) PrintString() []string {
	return []string{
		fmt.Sprintf("%d", b.Rail.Under3Hours),
		fmt.Sprintf("%d", b.Rail.UnderB9Hours),
		fmt.Sprintf("%d", b.Road.Under3Hours),
		fmt.Sprintf("%d", b.Road.UnderB9Hours),
	}
}

type OTP struct {
	Under3Hours  int `firestore:"under3Hours,omitempty"`
	UnderB9Hours int `firestore:"underB9Hours,omitempty"`
}

// B11. 귀사가 컨테이너 화물의 운송수단을 선택할 때 고려하는 요인을 중요한 순서대로 3가지만 선택해 주십시오
type TransportationDecisionFactor int

const (
	CostFactor          TransportationDecisionFactor = iota + 1 // 1: 운송비
	TimeFactor                                                  // 2: 소요시간
	ReliabilityFactor                                           // 3: 정시도착률
	FrequencyFactor                                             // 4: 운송빈도
	SafetyFactor                                                // 5: 안전성
	FlexibilityFactor                                           // 6: 유연성
	StabilityFactor                                             // 7: 안정성
	EcoFactor                                                   // 8: 환경
	DistanceFactor                                              // 9: 거리
	AccessibilityFactor                                         // 10: 접근성
	VolumeFactor                                                // 11: 운송량
	ServiceFactor                                               // 12: 서비스
)

type B11 struct {
	First  TransportationDecisionFactor `firestore:"first,omitempty"`
	Second TransportationDecisionFactor `firestore:"second,omitempty"`
	Third  TransportationDecisionFactor `firestore:"third,omitempty"`
}

func (b B11) PrintHeader() []string {
	return []string{
		"B11-운송수단 선택 요인(1순위)",
		"B11-운송수단 선택 요인(2순위)",
		"B11-운송수단 선택 요인(3순위)",
	}
}

func (b B11) PrintString() []string {
	return []string{
		fmt.Sprintf("%d", b.First),
		fmt.Sprintf("%d", b.Second),
		fmt.Sprintf("%d", b.Third),
	}
}

// B12. 귀사가 철도로 컨테이너 화물을 운송한다면 다음의 항목별로 어느 정도 만족하십니까?
type SatisfactionLevel int

const (
	VeryDissatisfied SatisfactionLevel = iota + 1 // 1: 매우 불만족
	Dissatisfied                                  // 2: 불만족
	Neutral                                       // 3: 중립
	Satisfied                                     // 4: 만족
	VerySatisfied                                 // 5: 매우 만족
)

type B12 struct {
	CostFactor          SatisfactionLevel `firestore:"costFactor,omitempty"`
	TimeFactor          SatisfactionLevel `firestore:"timeFactor,omitempty"`
	ReliabilityFactor   SatisfactionLevel `firestore:"reliabilityFactor,omitempty"`
	FrequencyFactor     SatisfactionLevel `firestore:"frequencyFactor,omitempty"`
	SafetyFactor        SatisfactionLevel `firestore:"safetyFactor,omitempty"`
	FlexibilityFactor   SatisfactionLevel `firestore:"flexibilityFactor,omitempty"`
	StabilityFactor     SatisfactionLevel `firestore:"stabilityFactor,omitempty"`
	EcoFactor           SatisfactionLevel `firestore:"ecoFactor,omitempty"`
	DistanceFactor      SatisfactionLevel `firestore:"distanceFactor,omitempty"`
	AccessibilityFactor SatisfactionLevel `firestore:"accessibilityFactor,omitempty"`
	VolumeFactor        SatisfactionLevel `firestore:"volumeFactor,omitempty"`
	ServiceFactor       SatisfactionLevel `firestore:"serviceFactor,omitempty"`
}

func (b B12) PrintHeader() []string {
	return []string{
		"B12-운송비용",
		"B12-운송시간",
		"B12-운송 신뢰성 및 정시성",
		"B12-운행빈도",
		"B12-안전성",
		"B12-운송과정 조절 용이성",
		"B12-망 안정성",
		"B12-친환경성",
		"B12-총 운송거리",
		"B12-터미널 접근성",
		"B12-연간 출하량(물동량)",
		"B12-무형 서비스 및 관행",
	}
}

func (b B12) PrintString() []string {
	return []string{
		fmt.Sprintf("%d", b.CostFactor),
		fmt.Sprintf("%d", b.TimeFactor),
		fmt.Sprintf("%d", b.ReliabilityFactor),
		fmt.Sprintf("%d", b.FrequencyFactor),
		fmt.Sprintf("%d", b.SafetyFactor),
		fmt.Sprintf("%d", b.FlexibilityFactor),
		fmt.Sprintf("%d", b.StabilityFactor),
		fmt.Sprintf("%d", b.EcoFactor),
		fmt.Sprintf("%d", b.DistanceFactor),
		fmt.Sprintf("%d", b.AccessibilityFactor),
		fmt.Sprintf("%d", b.VolumeFactor),
		fmt.Sprintf("%d", b.ServiceFactor),
	}
}

type B13 struct {
	Text string `firestore:"text,omitempty"`
}

func (b B13) PrintHeader() []string {
	return []string{"B13-기타 의견"}
}

func (b B13) PrintString() []string {
	return []string{b.Text}
}
