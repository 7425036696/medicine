export interface Medicine {
  brandName: string;
  salt: string;
  dosage: string;
  company: string;
}

export interface SearchedMedicine extends Medicine {}

export interface MedicineCategory {
  title: string;
  medicines: Medicine[];
}

export interface GeminiApiResponse {
  searchedMedicine: SearchedMedicine | null;
  categories: MedicineCategory[];
}
