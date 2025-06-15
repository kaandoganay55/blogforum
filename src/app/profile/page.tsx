import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import Link from 'next/link';
import ProfileClient from '@/components/ProfileClient';

interface PostData {
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

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  await connectDB();

  const posts = await Post.find({ author: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  // Convert ObjectId to string for client component
  const serializedPosts: PostData[] = posts.map((post: any) => ({
    _id: post._id.toString(),
    title: post.title,
    content: post.content,
    category: post.category,
    slug: post.slug,
    author: {
      _id: session.user.id,
      name: session.user.name || '',
      email: session.user.email || ''
    },
    createdAt: post.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: post.updatedAt?.toISOString() || new Date().toISOString()
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-400/10 to-pink-400/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="relative container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="glass rounded-3xl card-shadow p-8 mb-8 fade-in">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || 'Profil'}
                    className="w-24 h-24 rounded-3xl shadow-xl border-4 border-white"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-xl border-4 border-white">
                    <span className="text-3xl font-bold text-white">
                      {session.user.name?.charAt(0)?.toUpperCase() || '👤'}
                    </span>
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                  👋 Merhaba, {session.user.name}!
                </h1>
                <p className="text-xl text-gray-600 mb-4">
                  📧 {session.user.email}
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="bg-blue-100 px-4 py-2 rounded-2xl">
                    <span className="text-blue-800 font-semibold">
                      📝 {serializedPosts.length} Gönderi
                    </span>
                  </div>
                  <div className="bg-green-100 px-4 py-2 rounded-2xl">
                    <span className="text-green-800 font-semibold">
                      👤 Aktif Üye
                    </span>
                  </div>
                  <div className="bg-purple-100 px-4 py-2 rounded-2xl">
                    <span className="text-purple-800 font-semibold">
                      📅 {new Date().getFullYear()} Yılından Beri
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Link
                  href="/post/create"
                  className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-2xl hover:from-green-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold cursor-pointer btn-hover"
                >
                  ✍️ Yeni Gönderi
                </Link>
              </div>
            </div>
          </div>

          {/* Posts Section */}
          <div className="glass rounded-3xl card-shadow p-8 slide-up">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                🔥 Gönderilerim
              </h2>
              <div className="text-lg text-gray-600">
                Toplam: <span className="font-semibold text-blue-600">{serializedPosts.length}</span>
              </div>
            </div>

            {serializedPosts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-6">📝</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Henüz hiç gönderi yok
                </h3>
                <p className="text-gray-600 mb-8 text-lg">
                  İlk gönderiyi oluşturun ve toplulukla paylaşın! 🚀
                </p>
                <Link
                  href="/post/create"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold cursor-pointer btn-hover"
                >
                  ✍️ İlk Gönderiyi Oluştur
                </Link>
              </div>
            ) : (
              <ProfileClient posts={serializedPosts} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 