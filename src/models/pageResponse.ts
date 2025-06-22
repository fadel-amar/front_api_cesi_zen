export interface UserShortResponseDTO {
  id: number;
  username: string;
}

export interface PageResponseDTO {
  id: number;
  title: string;
  visibility: boolean;
}

export interface FullPageResponseDTO extends PageResponseDTO {
  content: string;
  videoLink: string;
  createdAt: string;
  user: UserShortResponseDTO;
}

export interface ListPageResponseDTO {
  pages: PageResponseDTO[];
}

export interface CreatePageDTO {
  title: string;
  content: string;
  link: string;
  visibility: boolean;
}

export interface UpdatePageDTO {
  title?: string;
  content?: string;
  link?: string;
  visibility?: boolean;
}
