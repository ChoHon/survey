package structs

import "time"

type Question interface {
	PrintString() []string
}

type Survey struct {
	A1        Respondent `firestore:"respondent,omitempty"`
	A2        Company    `firestore:"company,omitempty"`
	B1        B1         `firestore:"B1,omitempty"`
	B2        B2         `firestore:"B2,omitempty"`
	B3        B3         `firestore:"B3,omitempty"`
	B4        B4         `firestore:"B4,omitempty"`
	B5        B5         `firestore:"B5,omitempty"`
	B6        B6         `firestore:"B6,omitempty"`
	B7        B7         `firestore:"B7,omitempty"`
	B8        B8         `firestore:"B8,omitempty"`
	B9        B9         `firestore:"B9,omitempty"`
	B10       B10        `firestore:"B10,omitempty"`
	B11       B11        `firestore:"B11,omitempty"`
	B12       B12        `firestore:"B12,omitempty"`
	B13       B13        `firestore:"B13,omitempty"`
	C1        C          `firestore:"C1,omitempty"`
	C2        C          `firestore:"C2,omitempty"`
	C3        C          `firestore:"C3,omitempty"`
	C4        C          `firestore:"C4,omitempty"`
	C5        C          `firestore:"C5,omitempty"`
	C6        C          `firestore:"C6,omitempty"`
	C7        C          `firestore:"C7,omitempty"`
	C8        C          `firestore:"C8,omitempty"`
	C9        C          `firestore:"C9,omitempty"`
	C10       C          `firestore:"C10,omitempty"`
	Questions []int      `firestore:"questions,omitempty"`
	CreatedAt time.Time  `firestore:"created_at,omitempty"`
}

type Respondent struct {
	Name       string `firestore:"name,omitempty"`
	Department string `firestore:"department,omitempty"`
	Position   string `firestore:"position,omitempty"`
	Phone      string `firestore:"phone,omitempty"`
	Email      string `firestore:"email,omitempty"`
}

func (a Respondent) PrintHeader() []string {
	return []string{
		"A1-성명", "A2-부서", "A3-직위",
		"A4-전화번호", "A5-이메일",
	}
}

func (a Respondent) PrintString() []string {
	return []string{
		a.Name,
		a.Department,
		a.Position,
		a.Phone,
		a.Email,
	}
}

type Company struct {
	Name    string `firestore:"name,omitempty"`
	Address string `firestore:"address,omitempty"`
}

func (a Company) PrintHeader() []string {
	return []string{
		"A6-사업체명", "A7-주소",
	}
}

func (a Company) PrintString() []string {
	return []string{
		a.Name,
		a.Address,
	}
}
