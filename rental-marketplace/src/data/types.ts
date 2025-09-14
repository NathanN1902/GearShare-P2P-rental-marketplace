export type Tool = {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  priceDay: number;
  badge?: "Popular" | "New";
};

export type BrowseFilters = {
  query?: string;
  location?: string;
  onlyPopular?: boolean;
  priceCap?: number;
  page?: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  joinedAt: Date; 
  avatarUrl?: string; 
  bio?: string;   
};
