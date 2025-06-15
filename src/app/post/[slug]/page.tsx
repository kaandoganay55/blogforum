import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { notFound } from 'next/navigation';
import type { PostType } from '@/types/post';
import Post from '@/components/Post';
import connectDB from '@/lib/mongodb';
import PostModel from '@/models/Post';

interface Props {
  params: {
    slug: string;
  };
}

async function getPost(slug: string): Promise<PostType | null> {
  await connectDB();
  const post = await PostModel.findOne({ slug })
    .populate('author', 'name email')
    .populate('comments.author', 'name email');
  
  if (!post) return null;

  // Convert MongoDB document to PostType
  return {
    _id: post._id.toString(),
    title: post.title,
    content: post.content,
    category: post.category,
    slug: post.slug,
    author: {
      _id: post.author._id.toString(),
      name: post.author.name,
      email: post.author.email,
    },
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };
}

export default async function PostPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Post post={post} session={session} />
    </div>
  );
} 