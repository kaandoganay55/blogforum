import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import Link from 'next/link';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';

export default async function Home() {
  try {
    const session = await getServerSession(authOptions);
    await connectDB();

    const posts = await Post.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                ForumHub'a Hoş Geldiniz
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Düşüncelerinizi paylaşın, tartışın ve yeni fikirler keşfedin.
              </p>
              {!session ? (
                <div className="flex justify-center gap-4">
                  <Link
                    href="/register"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Kayıt Ol
                  </Link>
                  <Link
                    href="/login"
                    className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Giriş Yap
                  </Link>
                </div>
              ) : (
                <Link
                  href="/post/create"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Yeni Gönderi Oluştur
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Son Gönderiler</h2>
            
            {posts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <p className="text-gray-600 mb-4">Henüz hiç gönderi yok.</p>
                {session ? (
                  <Link
                    href="/post/create"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    İlk gönderiyi siz oluşturun
                  </Link>
                ) : (
                  <p className="text-gray-600">
                    Gönderi oluşturmak için{' '}
                    <Link href="/login" className="text-blue-600 hover:text-blue-700">
                      giriş yapın
                    </Link>
                    .
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((post: any) => (
                  <article
                    key={post._id.toString()}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          {post.author?.name}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {post.category}
                      </span>
                    </div>
                    <Link href={`/post/${post.slug}`}>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 line-clamp-3 mb-4">
                      {post.content}
                    </p>
                    <Link
                      href={`/post/${post.slug}`}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Devamını Oku →
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Bir hata oluştu
          </h1>
          <p className="text-gray-600">
            Lütfen daha sonra tekrar deneyin.
          </p>
        </div>
      </div>
    );
  }
}
