import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Post from '@/models/Post';
import LikeButton from '@/components/LikeButton';

interface UserProfileProps {
  params: { id: string };
}

export default async function UserProfile({ params }: UserProfileProps) {
  try {
    const session = await getServerSession(authOptions);
    await connectDB();

    // Kullanıcı bilgilerini getir
    const user = await User.findById(params.id).select('-password').lean() as any;
    if (!user) {
      notFound();
    }

    // Kullanıcının postlarını getir
    const posts = await Post.find({ author: params.id })
      .populate('author', 'name email image')
      .sort({ createdAt: -1 })
      .lean();

    // İstatistikleri hesapla
    const totalPosts = posts.length;
    const totalLikes = posts.reduce((total: number, post: any) => total + (post.likes?.length || 0), 0);
    const totalComments = posts.reduce((total: number, post: any) => total + (post.comments?.length || 0), 0);

    const isOwnProfile = session?.user?.id === params.id;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-400/10 to-pink-400/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="relative container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-medium transition-colors cursor-pointer"
            >
              ← Ana Sayfaya Dön
            </Link>

            {/* Profile Header */}
            <div className="glass rounded-3xl card-shadow p-8 mb-8 fade-in">
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-32 h-32 rounded-3xl shadow-xl border-4 border-white object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-xl border-4 border-white">
                      <span className="text-5xl font-bold text-white">
                        {user.name?.charAt(0)?.toUpperCase() || '👤'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center lg:text-left">
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">
                    {user.name}
                  </h1>
                  <p className="text-xl text-gray-600 mb-4">
                    📧 {user.email}
                  </p>

                  {/* Bio */}
                  {user.bio && (
                    <p className="text-gray-700 mb-4 text-lg leading-relaxed max-w-2xl">
                      {user.bio}
                    </p>
                  )}

                  {/* Additional Info */}
                  <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-6">
                    {user.location && (
                      <div className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-2xl">
                        <span className="text-blue-800">📍 {user.location}</span>
                      </div>
                    )}
                    {user.website && (
                      <a
                        href={user.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-2xl hover:bg-green-200 transition-colors cursor-pointer"
                      >
                        <span className="text-green-800">🌐 Website</span>
                      </a>
                    )}
                    <div className="flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-2xl">
                      <span className="text-purple-800">
                        📅 {new Date(user.joinedAt || user.createdAt).toLocaleDateString('tr-TR', {
                          month: 'long',
                          year: 'numeric'
                        })} tarihinden beri üye
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
                    <div className="text-center p-4 bg-blue-50 rounded-2xl">
                      <div className="text-2xl font-bold text-blue-600">{totalPosts}</div>
                      <div className="text-sm text-gray-600">Gönderi</div>
                    </div>
                    <div className="text-center p-4 bg-pink-50 rounded-2xl">
                      <div className="text-2xl font-bold text-pink-600">{totalLikes}</div>
                      <div className="text-sm text-gray-600">Beğeni</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-2xl">
                      <div className="text-2xl font-bold text-green-600">{totalComments}</div>
                      <div className="text-sm text-gray-600">Yorum</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {!isOwnProfile && session && (
                  <div className="flex flex-col gap-3">
                    <button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold cursor-pointer">
                      👥 Takip Et
                    </button>
                    <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-2xl hover:bg-gray-200 transition-all duration-300 font-semibold cursor-pointer">
                      💬 Mesaj Gönder
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Posts Section */}
            <div className="glass rounded-3xl card-shadow p-8 slide-up">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-800">
                  📝 {isOwnProfile ? 'Gönderilerim' : `${user.name}'in Gönderileri`}
                </h2>
                <div className="text-lg text-gray-600">
                  Toplam: <span className="font-semibold text-blue-600">{totalPosts}</span>
                </div>
              </div>

              {posts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-6">📝</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {isOwnProfile ? 'Henüz hiç gönderi yok' : 'Bu kullanıcının henüz gönderisi yok'}
                  </h3>
                  <p className="text-gray-600 mb-8 text-lg">
                    {isOwnProfile ? 'İlk gönderiyi oluşturun ve toplulukla paylaşın! 🚀' : 'Yakında yeni gönderiler paylaşabilir! 🚀'}
                  </p>
                  {isOwnProfile && (
                    <Link
                      href="/post/create"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold cursor-pointer btn-hover"
                    >
                      ✍️ İlk Gönderiyi Oluştur
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {posts.map((post: any, index: number) => (
                    <article
                      key={post._id.toString()}
                      className="group glass rounded-3xl card-shadow p-6 hover:scale-105 transition-all duration-300 fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {/* Post Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {post.author?.name?.charAt(0)?.toUpperCase() || '👤'}
                          </div>
                          <div>
                            <span className="font-medium text-gray-800 text-sm">
                              {post.author?.name}
                            </span>
                            <div className="text-xs text-gray-500">
                              📅 {new Date(post.createdAt).toLocaleDateString('tr-TR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </div>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-xs rounded-full font-medium">
                          🏷️ {post.category}
                        </span>
                      </div>

                      {/* Post Content */}
                      <Link href={`/post/${post.slug}`} className="block cursor-pointer">
                        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                          {post.title}
                        </h3>
                      </Link>
                      
                      <p className="text-gray-600 line-clamp-3 mb-4 text-sm leading-relaxed">
                        {post.content}
                      </p>

                      {/* Post Stats */}
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            📊 {post.content.length} karakter
                          </span>
                          <span className="flex items-center gap-1">
                            💬 {post.comments?.length || 0} yorum
                          </span>
                          <span className="flex items-center gap-1">
                            ❤️ {post.likes?.length || 0} beğeni
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between">
                        <LikeButton 
                          postId={post._id.toString()} 
                          initialLikesCount={post.likes?.length || 0}
                          size="sm"
                        />
                        
                        <Link
                          href={`/post/${post.slug}`}
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold group-hover:gap-3 transition-all duration-300 cursor-pointer"
                        >
                          📖 Devamını Oku
                          <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('User profile error:', error);
    notFound();
  }
} 