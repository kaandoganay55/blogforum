export interface PostType {
  _id: string;
  title: string;
  content: string;
  category: string;
  slug: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
} 