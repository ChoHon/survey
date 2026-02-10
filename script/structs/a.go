package structs

type Survey struct {
	Respondent Respondent `firestore:"respondent,omitempty"`
	Company    Company    `firestore:"company,omitempty"`
	B1         B1         `firestore:"b1,omitempty"`
	B2         B2         `firestore:"b2,omitempty"`
	B3         B3         `firestore:"b3,omitempty"`
	B4         B4         `firestore:"b4,omitempty"`
	B5         B5         `firestore:"b5,omitempty"`
	B6         B6         `firestore:"b6,omitempty"`
	B7         B7         `firestore:"b7,omitempty"`
	B8         B8         `firestore:"b8,omitempty"`
	B9         B9         `firestore:"b9,omitempty"`
	B10        B10        `firestore:"b10,omitempty"`
	B11        B11        `firestore:"b11,omitempty"`
	B12        B12        `firestore:"b12,omitempty"`
	C          []C        `firestore:"c,omitempty"`
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
