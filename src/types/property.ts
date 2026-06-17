export type Property = {
  id: number;
  title: string;
  location: string;
  price: number;
  match: number;
  gradient: string;
  budget: string;

  pets: boolean;
  parking: boolean;

  typology: string | null;
  metro: string | null;
  address: string | null;

  project: string | null;

  unit_number: string | null;

  featured: boolean | null;

  description: string | null;

  photos: string | null;
  cover_photo: string | null;

  promotion: string | null;

  guarantee_installments: boolean | null;

  internal_notes: string | null;

  status: string | null;
};