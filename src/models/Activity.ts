export interface ActivityResponse {
  id: number;
  title: string;
  imagePresentation: string;
  type: string;
  status: boolean;
  category: string;
}

export interface ListActivityResponse {
  activities: ActivityResponse[];
}
export interface CreateActivity {
  title: string;
  description: string;
  durationMin: number;
  imagePresentation: File | null;
  url: File | null;
  typeActivitty: number;
  categoryId: number;
}

export interface FullActivityResponse {
  id: number;
  title: string;
  description: string | null;
  durationMin: number | null;
  imagePresentation: string | null;
  url: string | null;
  type: string;
  category: string;
  status: boolean;
  user: number;
  createdAt: string;
  updatedAt: string;
  isFavorite: false,
  isToLater: true
}

export interface UpdateActivity {
  title: string | null;
  description: string | null;
  durationMin: number | null;
  imagePresentation: File | null;
  url: File | null;
  typeActivitty: number | null;
  categoryId: number | null;
  status: boolean | null;
}
