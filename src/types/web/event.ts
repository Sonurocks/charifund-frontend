export interface ApiEvent {
  id: string;
  title: string;
  description: string;
  summary: string;
  keyPoints: string[];
  images: string[];
  location: string;
  latitude: number;
  longitude: number;
  startTime: string;
  endTime: string;
}

export interface EventsResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  events: ApiEvent[];
}
