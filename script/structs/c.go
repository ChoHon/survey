package structs

import "fmt"

// 3. 운송수단선택 선호도 조사

// 다음은 컨테이너 화물의 운송 비용, 운송 시간 등의 조건에 따른 운송수단 선택행태를 조사하기 위한 문항들입니다.
// 각 문항에 제시된 조건을 고려했을 때 귀사가 컨테이너 운송 시 이용할 철도와 도로의 비율과 함께,
// 두 수단 중 한 수단만 이용할 경우 어떤 수단을 선택할 것인지 최대한 현실적으로 응답해 주시기 바랍니다.

// 제시될 조건은 귀사의 대표운송구간의 응답결과(보관 시간·비용은 제외)를 토대로 하였으며,
// 40ft 컨테이너 1개 운송에 소요되는 비용과 시간을 기준으로 합니다.
// 철도 운송이 물리적으로 불가능하지 않다고 가정하고 귀사의 제반여건과 운송전략, 제시된 조건을 고려하여 응답해주시면 됩니다.(총 10문항)

type C struct {
	Rail   Codition `firestore:"rail,omitempty"`
	Road   Codition `firestore:"road,omitempty"`
	Select string   `firestore:"select,omitempty"`
}

type Codition struct {
	Cost       int
	Duration   float64
	UsePercent int
}

func (c C) PrintString() []string {
	return []string{
		fmt.Sprintf("%d", c.Rail.Cost),
		fmt.Sprintf("%0.1f", c.Rail.Duration),
		fmt.Sprintf("%d", c.Rail.UsePercent),
		fmt.Sprintf("%d", c.Road.Cost),
		fmt.Sprintf("%0.1f", c.Road.Duration),
		c.Select,
	}
}
