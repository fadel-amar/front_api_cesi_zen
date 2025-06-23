
export interface ActivityResponseDTO {
  id: number;
  title: string;
  imagePresentation: string;
  type: string;
  status: boolean;
  category: string;
}

export interface FullActivityResponseDTO {
  id: number;
  title: string;
  imagePresentation: string;
  description: string;
  url: string;
  status: boolean;
  type: string;
  durationMin: number;
  category: string;
  user: number;
  createdAt: string; 
  updatedAt: string; 
}

export interface ListActivityResponseDTO {
  activities: ActivityResponseDTO[];
}
