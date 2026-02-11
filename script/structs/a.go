package structs

type Survey struct {
	Respondent Respondent `firestore:"respondent,omitempty"`
	Company    Company    `firestore:"company,omitempty"`
	B1         B1         `firestore:"B1,omitempty"`
	B2         B2         `firestore:"B2,omitempty"`
	B3         B3         `firestore:"B3,omitempty"`
	B4         B4         `firestore:"B4,omitempty"`
	B5         B5         `firestore:"B5,omitempty"`
	B6         B6         `firestore:"B6,omitempty"`
	B7         B7         `firestore:"B7,omitempty"`
	B8         B8         `firestore:"B8,omitempty"`
	B9         B9         `firestore:"B9,omitempty"`
	B10        B10        `firestore:"B10,omitempty"`
	B11        B11        `firestore:"B11,omitempty"`
	B12        B12        `firestore:"B12,omitempty"`
	C          []C        `firestore:"C,omitempty"`
}

type Respondent struct {
	Name       string `firestore:"name,omitempty"`
	Department string `firestore:"department,omitempty"`
	Position   string `firestore:"position,omitempty"`
	Phone      string `firestore:"phone,omitempty"`
	Email      string `firestore:"email,omitempty"`
}

type Company struct {
	Name    string `firestore:"name,omitempty"`
	Address string `firestore:"address,omitempty"`
}
