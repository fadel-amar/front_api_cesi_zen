export interface UserShortResponse {
  id: number;
  username: string;
}

export interface PageResponse {
  id: number;
  title: string;
  createdAt :string;
  visibility: boolean;
}

export interface FullPageResponse extends PageResponse {
  Title: string;
  content: string;
  visibility: boolean;
  videoLink: string;
  createdAt: string;
  user: UserShortResponse;
}

export interface ListPageResponse {
  pages: PageResponse[];
}

export interface CreatePage {
  title: string;
  content: string;
  link: string;
}

export interface UpdatePage {
  title?: string;
  content?: string;
  link?: string;
  visibility?: boolean;
}
