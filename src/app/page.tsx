import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import Link from 'next/link';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import LikeButton from '@/components/LikeButton';

export default async function Home() {
  try {
    const session = await getServerSession(authOptions);
    await connectDB();

    const posts = await Post.find()
      .populate('author', 'name email')
      .populate('comments.author', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-400/20 to-pink-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
          
          <div className="relative container mx-auto px-4 py-20">
            <div className="max-w-4xl mx-auto text-center fade-in">
              <div className="mb-6">
                <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
                  🚀 Yeni Nesil Forum Deneyimi
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="gradient-text">ForumHub</span>'a 
                <br />
                <span className="text-gray-800">Hoş Geldiniz</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                💭 Düşüncelerinizi paylaşın, 🗣️ tartışın ve ✨ yeni fikirler keşfedin. 
                Topluluk ile birlikte büyüyen bir platform.
              </p>
              
              {!session ? (
                <div className="flex flex-col sm:flex-row justify-center gap-6 slide-up">
                  <Link
                    href="/register"
                    className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 font-semibold text-lg btn-hover"
                  >
                    🎯 Hemen Başla
                  </Link>
                  <Link
                    href="/login"
                    className="group bg-white/80 backdrop-blur-sm text-gray-800 border-2 border-gray-200 px-8 py-4 rounded-2xl hover:bg-white hover:border-blue-300 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold text-lg"
                  >
                    🔑 Giriş Yap
                  </Link>
                </div>
              ) : (
                <div className="slide-up">
                  <Link
                    href="/post/create"
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-blue-600 text-white px-10 py-5 rounded-2xl hover:from-green-600 hover:to-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 font-semibold text-xl btn-hover"
                  >
                    ✍️ Yeni Gönderi Oluştur
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-16 bg-white/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-6 glass rounded-2xl card-shadow">
                  <div className="text-4xl mb-4">👥</div>
                  <div className="text-3xl font-bold text-gray-800 mb-2">1000+</div>
                  <div className="text-gray-600">Aktif Üye</div>
                </div>
                <div className="text-center p-6 glass rounded-2xl card-shadow">
                  <div className="text-4xl mb-4">📝</div>
                  <div className="text-3xl font-bold text-gray-800 mb-2">{posts.length}</div>
                  <div className="text-gray-600">Gönderi</div>
                </div>
                <div className="text-center p-6 glass rounded-2xl card-shadow">
                  <div className="text-4xl mb-4">💬</div>
                  <div className="text-3xl font-bold text-gray-800 mb-2">
                    {posts.reduce((total: number, post: any) => total + (post.comments?.length || 0), 0)}
                  </div>
                  <div className="text-gray-600">Yorum</div>
                </div>
              </div>
              
              {/* Beğeni İstatistikleri */}
              <div className="mt-8">
                <div className="text-center p-6 glass rounded-2xl card-shadow">
                  <div className="text-4xl mb-4 heart-beat">❤️</div>
                  <div className="text-3xl font-bold text-pink-600 mb-2">
                    {posts.reduce((total: number, post: any) => total + (post.likes?.length || 0), 0)}
                  </div>
                  <div className="text-gray-600">Toplam Beğeni</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                🔥 En Son Gönderiler
              </h2>
              <p className="text-xl text-gray-600">
                Topluluğumuzun en güncel paylaşımlarını keşfedin
              </p>
            </div>
            
            {posts.length === 0 ? (
              <div className="text-center py-20 glass rounded-3xl card-shadow fade-in">
                <div className="text-6xl mb-6">📝</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Henüz hiç gönderi yok
                </h3>
                <p className="text-gray-600 mb-8 text-lg">
                  İlk gönderiyi paylaşan siz olun! 🚀
                </p>
                {session ? (
                  <Link
                    href="/post/create"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold btn-hover"
                  >
                    ✍️ İlk Gönderiyi Oluştur
                  </Link>
                ) : (
                  <div className="space-x-4">
                    <Link 
                      href="/login" 
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold"
                    >
                      🔑 Giriş Yap
                    </Link>
                    <Link 
                      href="/register" 
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-300 font-semibold"
                    >
                      🎯 Kayıt Ol
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {posts.map((post: any, index: number) => (
                  <article
                    key={post._id.toString()}
                    className="group glass rounded-3xl card-shadow p-8 hover:scale-105 transition-all duration-300 fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <Link href={`/user/${post.author?._id}`} className="cursor-pointer">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold hover:scale-110 transition-transform duration-200">
                            {post.author?.name?.charAt(0)?.toUpperCase() || '👤'}
                          </div>
                        </Link>
                        <div>
                          <Link 
                            href={`/user/${post.author?._id}`} 
                            className="font-medium text-gray-800 hover:text-blue-600 transition-colors cursor-pointer"
                          >
                            {post.author?.name || 'Anonim'}
                          </Link>
                          <div className="text-sm text-gray-500">
                            📅 {new Date(post.createdAt).toLocaleDateString('tr-TR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                      <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm rounded-full font-medium">
                        🏷️ {post.category}
                      </span>
                    </div>
                    
                    <Link href={`/post/${post.slug}`} className="block">
                      <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>
                    
                    <p className="text-gray-600 line-clamp-3 mb-6 text-lg leading-relaxed">
                      {post.content}
                    </p>

                    {/* Post Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
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
                      <span className="flex items-center gap-1">
                        👁️ 0 görüntülenme
                      </span>
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
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold group-hover:gap-3 transition-all duration-300"
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

        {/* Call to Action Section */}
        {!session && (
          <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-4xl font-bold text-white mb-6">
                🚀 Hemen Katılın!
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Binlerce kullanıcının oluşturduğu muhteşem topluluğa katılın ve 
                fikirlerinizi dünya ile paylaşın.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-3 bg-white text-blue-600 px-10 py-5 rounded-2xl hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 font-bold text-xl"
              >
                🎯 Ücretsiz Kayıt Ol
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center glass rounded-3xl p-12 card-shadow">
          <div className="text-6xl mb-6">⚠️</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Bir hata oluştu
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Lütfen daha sonra tekrar deneyin veya sayfayı yenileyin.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
          >
            🔄 Sayfayı Yenile
          </button>
        </div>
      </div>
    );
  }
}
