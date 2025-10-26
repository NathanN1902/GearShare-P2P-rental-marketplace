export type Tool = {
  id: number;
  name: string;
  description: string;
  price: number;
  rate: string;
  category: string;
  image: string;
  owner: string;
  ownerId: number;
};

export type ToolPhoto = {
  id: string;
  url: string; 
  alt?: string;
};

export type BrowseFilters = {
  query?: string;
  location?: string;
  onlyPopular?: boolean;
  priceCap?: number;
  page?: number;
};

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  location: string;
  bio: string;
  memberSince: string;
  rating: number;
  totalRentals: number;
  totalListings: number;
  verified?: boolean;
  verifiedAt?: string;
};
