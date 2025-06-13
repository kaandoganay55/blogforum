import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import Link from 'next/link';

export default async function ProfilePage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/login');
  }

  await connectDB();

  const posts = await Post.find({ author: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Profilim</h1>
          <div className="flex items-center gap-4">
            {session.user.image && (
              <img
                src={session.user.image}
                alt={session.user.name || ''}
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <h2 className="text-xl font-semibold">{session.user.name}</h2>
              <p className="text-gray-500">{session.user.email}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Gönderilerim</h2>
          <div className="grid gap-6">
            {posts.map((post: any) => (
              <div key={post._id} className="border rounded-lg p-6">
                <Link href={`/post/${post.slug}`}>
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                </Link>
                <p className="text-gray-600 mb-4">{post.content.substring(0, 200)}...</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{post.category}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="mt-4 flex gap-4">
                  <Link
                    href={`/post/${post.slug}/edit`}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    Düzenle
                  </Link>
                  <button
                    onClick={async () => {
                      if (confirm('Bu gönderiyi silmek istediğinizden emin misiniz?')) {
                        await fetch(`/api/posts/${post._id}`, {
                          method: 'DELETE',
                        });
                        window.location.reload();
                      }
                    }}
                    className="text-red-500 hover:text-red-600"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 