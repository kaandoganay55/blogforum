'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

interface CommentsProps {
  postId: string;
}

export default function Comments({ postId }: CommentsProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Yorumları yükle
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/posts/${postId}/comments`);
        const data = await response.json();
        
        if (response.ok) {
          setComments(data.comments || []);
        }
      } catch (error) {
        console.error('Yorumlar yüklenirken hata:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) {
      fetchComments();
    }
  }, [postId]);

  // Yeni yorum ekle
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      alert('Yorum yapmak için giriş yapmalısınız');
      return;
    }

    if (!newComment.trim()) {
      alert('Yorum içeriği boş olamaz');
      return;
    }

    if (newComment.length > 1000) {
      alert('Yorum en fazla 1000 karakter olabilir');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment }),
      });

      const data = await response.json();

      if (response.ok) {
        setComments(data.comments || []);
        setNewComment('');
      } else {
        alert(data.message || 'Yorum eklenirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Yorum ekleme hatası:', error);
      alert('Yorum eklenirken bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getCharacterCount = () => {
    return newComment.length;
  };

  const getCharacterColor = () => {
    const count = getCharacterCount();
    if (count > 900) return 'text-red-500';
    if (count > 700) return 'text-orange-500';
    return 'text-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Yorum Başlığı */}
      <div className="flex items-center gap-3">
        <h3 className="text-xl font-bold text-gray-800">
          💬 Yorumlar
        </h3>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
          {comments.length}
        </span>
      </div>

      {/* Yorum Formu */}
      {session ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="glass rounded-2xl p-6 border border-white/20">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                {session.user?.name?.charAt(0)?.toUpperCase() || '👤'}
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Yorumunuzu yazın..."
                  className="w-full h-24 p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                  disabled={isSubmitting}
                />
                <div className="flex justify-between items-center mt-3">
                  <span className={`text-sm ${getCharacterColor()}`}>
                    {getCharacterCount()}/1000 karakter
                  </span>
                  <button
                    type="submit"
                    disabled={isSubmitting || !newComment.trim() || newComment.length > 1000}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Gönderiliyor...
                      </div>
                    ) : (
                      '💬 Yorum Yap'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="glass rounded-2xl p-6 border border-white/20 text-center">
          <p className="text-gray-600 mb-4">
            Yorum yapmak için giriş yapmalısınız
          </p>
          <a
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 cursor-pointer"
          >
            🔑 Giriş Yap
          </a>
        </div>
      )}

      {/* Yorumlar Listesi */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💭</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Henüz yorum yok
            </h3>
            <p className="text-gray-500">
              İlk yorumu yapan siz olun!
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="glass rounded-2xl p-6 border border-white/20">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {comment.author?.name?.charAt(0)?.toUpperCase() || '👤'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-800">
                      {comment.author?.name || 'Anonim'}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 