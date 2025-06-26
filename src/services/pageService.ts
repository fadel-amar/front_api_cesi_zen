import type {
  CreatePageDTO,
  FullPageResponseDTO,
  ListPageResponseDTO,
  PageResponseDTO,
  UpdatePageDTO,
} from "../models/pageResponse";
import api from "./api";

const pageService = {
  async getAll(): Promise<PageResponseDTO[]> {
    const response = await api.get<ListPageResponseDTO>("/pages");
    return response.data.pages;
  },

  async getById(id: number): Promise<FullPageResponseDTO> {
    const response = await api.get<FullPageResponseDTO>(`/pages/${id}`);
    return response.data;
  },

  async create(data: CreatePageDTO): Promise<FullPageResponseDTO> {
    const response = await api.post("/pages", data);
    return response.data.data;
  },

  async update(id: number, data: UpdatePageDTO): Promise<FullPageResponseDTO> {
    const response = await api.put(`/pages/${id}`, data);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/pages/${id}`);
  },
};

export default pageService;
