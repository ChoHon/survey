package structs

import (
	"fmt"
	"math"
)

// B1. 다음은 귀사의 사업체 현황 및 규모에 관한 설문입니다.
// B1-1 귀사의 종사자수는 어떻게 되십니까?
// B1-2 귀사의 컨테이너 운송수단 보유현황은 어떻게 되십니까?
// B1-3 귀사의 연간 매출액은 어떻게 되십니까?
type B1 struct {
	NumberOfEmployees               int                             `firestore:"number_of_employees,omitempty"`
	NumberOfContainerTransportation NumberOfContainerTransportation `firestore:"container_transportation,omitempty"`
	AnnualRevenue                   AnnualRevenue                   `firestore:"annual_revenue ,omitempty"`
}

func (b *B1) PrintString() []string {
	return []string{
		fmt.Sprintf("%d", b.NumberOfEmployees),
		fmt.Sprintf("%d", b.NumberOfContainerTransportation.ContainerVehicle.Total),
		fmt.Sprintf("%d", b.NumberOfContainerTransportation.ContainerVehicle.Direct),
		fmt.Sprintf("%d", b.NumberOfContainerTransportation.ContainerVehicle.Indirect),
		fmt.Sprintf("%d", b.NumberOfContainerTransportation.PrivateVehicle),
		fmt.Sprintf("%d", b.AnnualRevenue.Total),
		fmt.Sprintf("%d", b.AnnualRevenue.ContainerInlandTransport),
	}
}

type NumberOfContainerTransportation struct {
	ContainerVehicle ContainerVehicle `firestore:"container_vehicle,omitempty"`
	PrivateVehicle   int              `firestore:"private_vehicle,omitempty"`
}

type ContainerVehicle struct {
	Total    int `firestore:"total,omitempty"`
	Direct   int `firestore:"direct,omitempty"`
	Indirect int `firestore:"indirect,omitempty"`
}

type AnnualRevenue struct {
	Total                    int `firestore:"total,omitempty"`
	ContainerInlandTransport int `firestore:"container_inland_transport,omitempty"`
}

// B2. 2024년 기준 귀사의 연간 컨테이너 운송량은 어떻게 되십니까?
type B2 struct {
	Total   int `firestore:"total,omitempty"`
	Road    int `firestore:"road,omitempty"`
	Rail    int `firestore:"rail,omitempty"`
	Coastal int `firestore:"coastal,omitempty"`
}

func (b *B2) PrintString() []string {
	return []string{
		fmt.Sprintf("%d", b.Total),
		fmt.Sprintf("%d", b.Road),
		fmt.Sprintf("%d", b.Rail),
		fmt.Sprintf("%d", b.Coastal),
	}
}

// B3. 귀사의 컨테이너 화주 고객사는 어떻게 구성되어 있습니까?
type B3 struct {
	UnderTen     NumberPercentage `firestore:"under_ten,omitempty"`
	UnderHundred NumberPercentage `firestore:"under_hundred,omitempty"`
	OverHundred  NumberPercentage `firestore:"over_hundred,omitempty"`
}

func (b *B3) PrintString() []string {
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
	LevelOfDecisionMakingPower DecisionLevel `firestore:"level_of_decision_making_power,omitempty"`
}

// B5. 컨테이너 화물을 국내 목적지(항만 또는 화주 문전)까지 운송을 완료하는 데까지 요구되는 시간은 어느 정도입니까?
type B5 struct {
	SameDayPercentage     int      `firestore:"same_day_percentage,omitempty"`
	NextDayPercentage     int      `firestore:"next_day_percentage,omitempty"`
	WithinAWeekPercentage int      `firestore:"within_a_week_percentage,omitempty"`
	OverAWeekPercentage   int      `firestore:"over_a_week_percentage,omitempty"`
	Average               Duration `firestore:"average,omitempty"`
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

	return fmt.Sprintf("%f", result)
}

// B6. 단거리 셔틀운송을 제외하고, 귀사가 가장 많은 컨테이너를 운송하는 대표운송구간이 어떻게 되십니까?(시군구 기준)
// 단, 귀사가 철도를 이용중이라면 철도물동량이 가장 많은 구간을 기준으로 응답해주시기 바라며, 동일 구간의 도로운송현황도 응답해주시기 바랍니다.
// 철도를 전혀 이용하지 않는다면 도로운송에 한해서 응답해주시기 바랍니다.
type B6 struct {
	InlandOD              OriginDestination     `firestore:"inland_od,omitempty"`
	Intermediate          Intermediate          `firestore:"intermediate,omitempty"`
	PortOD                OriginDestination     `firestore:"port_od,omitempty"`
	AnnualTransportVolume AnnualTransportVolume `firestore:"annual_transport_volume,omitempty"`
}

type OriginDestination struct {
	SiDo  string `firestore:"si_do,omitempty"`
	SiGun string `firestore:"si_gun_gu,omitempty"`
	Gu    string `firestore:"gu,omitempty"`
	Point string `firestore:"point,omitempty"`
}

type Intermediate struct {
	Station1 string            `firestore:"station1,omitempty"`
	Station2 string            `firestore:"station2,omitempty"`
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

type Transport struct {
	Duration Duration `firestore:"duration,omitempty"`
	Cost     Cost     `firestore:"cost,omitempty"`
}

type Cost struct {
	FT20 int `firestore:"ft20,omitempty"`
	FT40 int `firestore:"ft40,omitempty"`
}

type Transshipment struct {
	LoadAndUnload Transport `firestore:"load_and_unload,omitempty"`
	Storage       Transport `firestore:"storage,omitempty"`
}

// B8. 문B6에서 응답한 대표운송구간을 기준으로 도로 운송과정별로 소요되는 시간과 비용을 기입해주십시오.
type B8 struct {
	Main1         Transport     `firestore:"main1,omitempty"`
	Transshipment Transshipment `firestore:"transshipment,omitempty"`
	Main2         Transport     `firestore:"main2,omitempty"`
}

// B9. 선적기한이나 화주의 요청기한 등에 영향을 주지 않는, 허용할 수 있는 지연시간은 평균 어느정도입니까?
type B9 struct {
	Duration Duration `firestore:"duration,omitempty"`
}

// B10. 각 운송수단별 정시도착률을 아래와 같이 정의할 때, 각 운송수단별 컨테이너 화물의 현 정시도착률 수준은 어느 정도입니까?
// 환적, 경유 등을 모두 감안하여 최종 목적지에 도착하는 것 기준으로 응답해주십시오. 철도를 이용하지 않을 경우 철도 정시도착율은 응답하지 않으셔도 됩니다.
type B10 struct {
	Rail OTP `firestore:"rail,omitempty"`
	Road OTP `firestore:"road,omitempty"`
}

type OTP struct {
	Under3Hours  int `firestore:"under_3_hours,omitempty"`
	UnderB9Hours int `firestore:"under_b9_hours,omitempty"`
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
	CostFactor          SatisfactionLevel `firestore:"cost_factor,omitempty"`
	TimeFactor          SatisfactionLevel `firestore:"time_factor,omitempty"`
	ReliabilityFactor   SatisfactionLevel `firestore:"reliability_factor,omitempty"`
	FrequencyFactor     SatisfactionLevel `firestore:"frequency_factor,omitempty"`
	SafetyFactor        SatisfactionLevel `firestore:"safety_factor,omitempty"`
	FlexibilityFactor   SatisfactionLevel `firestore:"flexibility_factor,omitempty"`
	StabilityFactor     SatisfactionLevel `firestore:"stability_factor,omitempty"`
	EcoFactor           SatisfactionLevel `firestore:"eco_factor,omitempty"`
	DistanceFactor      SatisfactionLevel `firestore:"distance_factor,omitempty"`
	AccessibilityFactor SatisfactionLevel `firestore:"accessibility_factor,omitempty"`
	VolumeFactor        SatisfactionLevel `firestore:"volume_factor,omitempty"`
	ServiceFactor       SatisfactionLevel `firestore:"service_factor,omitempty"`
}
