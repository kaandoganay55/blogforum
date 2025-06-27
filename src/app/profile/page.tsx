import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import Link from 'next/link';
import ProfileClient from '@/components/ProfileClient';
import UserStats from '@/components/UserStats';
import SpotlightCard from '@/components/SpotlightCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Plus, 
  User, 
  Mail, 
  Calendar, 
  FileText,
  TrendingUp,
  Eye,
  Heart,
  MessageSquare,
  Clock,
  Settings,
  Share2,
  Award,
  Target,
  Zap,
  Crown,
  Sparkles,
  ChevronRight,
  BarChart3,
  PenTool,
  BookOpen,
  Users,
  Star,
  Trophy,
  Flame,
  ArrowRight,
  Edit3,
  Camera,
  MapPin,
  Link as LinkIcon,
  Globe
} from 'lucide-react';

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
  views?: number;
  likesCount?: number;
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
    updatedAt: post.updatedAt?.toISOString() || new Date().toISOString(),
    views: post.views || 0,
    likesCount: post.likes?.length || 0,
  }));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Bugün';
    if (diffDays === 2) return 'Dün';
    if (diffDays <= 7) return `${diffDays} gün önce`;
    
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const totalViews = serializedPosts.reduce((sum, post) => sum + (post.views || 0), 0);
  const totalLikes = serializedPosts.reduce((sum, post) => sum + (post.likesCount || 0), 0);
  const avgViewsPerPost = serializedPosts.length > 0 ? Math.round(totalViews / serializedPosts.length) : 0;

  return (
    <div className="min-h-screen relative">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-pink-950/20"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section with Enhanced Profile Info */}
        <div className="mb-12">
          <SpotlightCard 
            className="w-full group/profile"
            spotlightColor="rgba(99, 102, 241, 0.15)"
          >
            <div className="p-8 md:p-12">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
                {/* Enhanced Avatar Section */}
                <div className="relative group/avatar">
                  <div className="relative">
                    <Avatar className="w-32 h-32 border-4 border-white/50 dark:border-gray-800/50 shadow-2xl group-hover/avatar:scale-105 transition-all duration-300">
                      <AvatarImage 
                        src={session.user.image || ''} 
                        alt={session.user.name || 'Profile'}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white text-4xl font-bold">
                        {session.user.name?.charAt(0)?.toUpperCase() || <User className="w-12 h-12" />}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Status Indicator */}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white dark:border-gray-800 rounded-full flex items-center justify-center animate-pulse">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    
                    {/* Crown Badge */}
                    <div className="absolute -top-3 -right-3 p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg animate-bounce">
                      <Crown className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  
                  {/* Camera Edit Button */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 shadow-lg border-2 border-gray-200 dark:border-gray-700"
                        >
                          <Camera className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Profil fotoğrafını değiştir</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {/* Enhanced Profile Information */}
                <div className="flex-1 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="space-y-4">
                      {/* Name and Verification */}
                      <div className="flex items-center gap-3">
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white group-hover/profile:text-transparent group-hover/profile:bg-gradient-to-r group-hover/profile:from-blue-600 group-hover/profile:to-purple-600 group-hover/profile:bg-clip-text transition-all duration-300">
                          {session.user.name}
                        </h1>
                        <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 px-3 py-1">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Pro User
                        </Badge>
                      </div>
                      
                      {/* Contact Info */}
                      <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{session.user.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>İstanbul, Türkiye</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Ocak 2024'ten beri</span>
                        </div>
                      </div>
                      
                      {/* Bio */}
                      <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl leading-relaxed">
                        🚀 Teknoloji tutkunu, içerik üreticisi ve topluluk lideri. 
                        Yazılım geliştirme, AI ve modern teknolojiler hakkında paylaşımlar yapıyorum.
                      </p>
                      
                      {/* Social Links */}
                      <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" className="rounded-full">
                          <Globe className="w-4 h-4 mr-2" />
                          Website
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-full">
                          <LinkIcon className="w-4 h-4 mr-2" />
                          LinkedIn
                        </Button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                        <Link href="/post/create">
                          <Plus className="w-4 h-4 mr-2" />
                          Yeni İçerik
                        </Link>
                      </Button>
                      
                      <Button variant="outline" className="border-2 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <Settings className="w-4 h-4 mr-2" />
                        Ayarlar
                      </Button>
                      
                      <Button variant="outline" className="border-2 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <Share2 className="w-4 h-4 mr-2" />
                        Paylaş
                      </Button>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { icon: FileText, label: 'İçerik', value: serializedPosts.length, color: 'blue' },
                      { icon: Eye, label: 'Görüntüleme', value: totalViews.toLocaleString(), color: 'purple' },
                      { icon: Heart, label: 'Beğeni', value: totalLikes, color: 'red' },
                      { icon: Trophy, label: 'Başarı', value: '12', color: 'yellow' }
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 transition-transform duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            stat.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                            stat.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30' :
                            stat.color === 'red' ? 'bg-red-100 dark:bg-red-900/30' :
                            'bg-yellow-100 dark:bg-yellow-900/30'
                          }`}>
                            <stat.icon className={`w-5 h-5 ${
                              stat.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                              stat.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                              stat.color === 'red' ? 'text-red-600 dark:text-red-400' :
                              'text-yellow-600 dark:text-yellow-400'
                            }`} />
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                              {stat.value}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {stat.label}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </SpotlightCard>
        </div>

        {/* Main Content with Tabs */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 p-1 h-14">
            <TabsTrigger value="posts" className="flex items-center gap-2 text-base font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <FileText className="w-4 h-4" />
              İçerikler
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 text-base font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4" />
              Analitik
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2 text-base font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <Award className="w-4 h-4" />
              Başarılar
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2 text-base font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <Zap className="w-4 h-4" />
              Aktivite
            </TabsTrigger>
          </TabsList>

          {/* Posts Tab */}
          <TabsContent value="posts" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {serializedPosts.length === 0 ? (
                  <SpotlightCard className="text-center group/empty" spotlightColor="rgba(99, 102, 241, 0.1)">
                    <div className="p-12 space-y-6">
                      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center group-hover/empty:scale-110 transition-transform duration-300">
                        <PenTool className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                          İlk İçeriğinizi Oluşturun! 🚀
                        </h3>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                          Düşüncelerinizi paylaşmaya başlayın ve topluluğumuzla etkileşime geçin.
                        </p>
                      </div>
                      <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                        <Link href="/post/create">
                          <Plus className="w-5 h-5 mr-2" />
                          İlk İçeriği Oluştur
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </SpotlightCard>
                ) : (
                  <ProfileClient posts={serializedPosts} />
                )}
              </div>

              {/* Enhanced Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                <UserStats />
                
                {/* Performance Overview */}
                <SpotlightCard className="group/performance" spotlightColor="rgba(168, 85, 247, 0.15)">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Performans Özeti
                      </h3>
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        { label: 'Ortalama Okunma', value: `${avgViewsPerPost}`, trend: '+12%', color: 'blue' },
                        { label: 'Etkileşim Oranı', value: '8.5%', trend: '+5%', color: 'green' },
                        { label: 'Follower Artışı', value: '+23', trend: '+15%', color: 'purple' }
                      ].map((metric, index) => (
                        <div key={metric.label} className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                          <div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</div>
                            <div className="text-xl font-bold text-gray-900 dark:text-white">{metric.value}</div>
                          </div>
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            metric.color === 'green' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                            metric.color === 'blue' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                            'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                          }`}>
                            <TrendingUp className="w-3 h-3" />
                            {metric.trend}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </SpotlightCard>

                {/* Quick Actions */}
                <SpotlightCard className="group/actions" spotlightColor="rgba(34, 197, 94, 0.15)">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Hızlı İşlemler
                      </h3>
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        { icon: Plus, label: 'Yeni İçerik Oluştur', href: '/post/create', color: 'blue' },
                        { icon: BookOpen, label: 'Taslakları Görüntüle', href: '/drafts', color: 'purple' },
                        { icon: BarChart3, label: 'Detaylı Analitik', href: '/analytics', color: 'green' },
                        { icon: Users, label: 'Takipçileri Gör', href: '/followers', color: 'pink' }
                      ].map((action) => (
                        <Button
                          key={action.label}
                          asChild
                          variant="ghost"
                          className="w-full justify-start h-12 hover:bg-white/60 dark:hover:bg-gray-800/60 group/action"
                        >
                          <Link href={action.href}>
                            <action.icon className="w-5 h-5 mr-3 group-hover/action:scale-110 transition-transform duration-200" />
                            {action.label}
                            <ChevronRight className="w-4 h-4 ml-auto group-hover/action:translate-x-1 transition-transform duration-200" />
                          </Link>
                        </Button>
                      ))}
                    </div>
                  </div>
                </SpotlightCard>
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Toplam Görüntüleme', value: totalViews.toLocaleString(), icon: Eye, color: 'blue', change: '+23%' },
                { title: 'Ortalama Okunma Süresi', value: '4.2 dk', icon: Clock, color: 'green', change: '+8%' },
                { title: 'Toplam Beğeni', value: totalLikes.toLocaleString(), icon: Heart, color: 'red', change: '+15%' },
                { title: 'Yorum Sayısı', value: '127', icon: MessageSquare, color: 'purple', change: '+12%' },
                { title: 'Paylaşım Sayısı', value: '34', icon: Share2, color: 'yellow', change: '+25%' },
                { title: 'Takipçi Sayısı', value: '1.2K', icon: Users, color: 'indigo', change: '+18%' }
              ].map((stat, index) => (
                <SpotlightCard key={stat.title} className="group/stat" spotlightColor={`rgba(${index * 40 + 100}, ${index * 30 + 120}, ${255 - index * 20}, 0.15)`}>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl ${
                        stat.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                        stat.color === 'green' ? 'bg-green-100 dark:bg-green-900/30' :
                        stat.color === 'red' ? 'bg-red-100 dark:bg-red-900/30' :
                        stat.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30' :
                        stat.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                        'bg-indigo-100 dark:bg-indigo-900/30'
                      } group-hover/stat:scale-110 group-hover/stat:rotate-6 transition-all duration-300`}>
                        <stat.icon className={`w-6 h-6 ${
                          stat.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                          stat.color === 'green' ? 'text-green-600 dark:text-green-400' :
                          stat.color === 'red' ? 'text-red-600 dark:text-red-400' :
                          stat.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                          stat.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-indigo-600 dark:text-indigo-400'
                        }`} />
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-medium">
                        <TrendingUp className="w-3 h-3" />
                        {stat.change}
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</div>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'İlk Gönderi', description: 'İlk içeriğinizi yayınladınız', icon: Star, unlocked: true, date: 'Ocak 2024' },
                { title: 'Popüler Yazar', description: '100+ beğeni aldınız', icon: Flame, unlocked: true, date: 'Şubat 2024' },
                { title: 'Topluluk Lideri', description: '50+ takipçiye ulaştınız', icon: Crown, unlocked: false, progress: 80 },
                { title: 'Viral İçerik', description: '1000+ görüntüleme aldınız', icon: TrendingUp, unlocked: false, progress: 45 },
                { title: 'Sadık Okuyucu', description: '30 gün art arda aktif', icon: Trophy, unlocked: true, date: 'Mart 2024' },
                { title: 'İçerik Ustası', description: '50+ gönderi yayınladınız', icon: Award, unlocked: false, progress: 20 }
              ].map((achievement) => (
                <SpotlightCard key={achievement.title} className={`group/achievement ${achievement.unlocked ? 'border-yellow-200 dark:border-yellow-800' : ''}`} spotlightColor={achievement.unlocked ? "rgba(234, 179, 8, 0.15)" : "rgba(156, 163, 175, 0.1)"}>
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${achievement.unlocked ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-gray-100 dark:bg-gray-800'} group-hover/achievement:scale-110 transition-transform duration-300`}>
                        <achievement.icon className={`w-6 h-6 ${achievement.unlocked ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-400'}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-lg font-bold mb-2 ${achievement.unlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                          {achievement.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {achievement.description}
                        </p>
                        {achievement.unlocked ? (
                          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                            Tamamlandı • {achievement.date}
                          </Badge>
                        ) : (
                          <div className="space-y-2">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${achievement.progress}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              %{achievement.progress} tamamlandı
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <SpotlightCard className="group/activity" spotlightColor="rgba(99, 102, 241, 0.15)">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Son Aktiviteler</h3>
                <div className="space-y-6">
                  {[
                    { action: 'Yeni gönderi yayınladı', target: '"React ile Modern UI Tasarımı"', time: '2 saat önce', icon: FileText, color: 'blue' },
                    { action: 'Gönderi beğendi', target: '"JavaScript ES2024 Özellikleri"', time: '5 saat önce', icon: Heart, color: 'red' },
                    { action: 'Yorum yaptı', target: '"Next.js 14 ile Full Stack Geliştirme"', time: '1 gün önce', icon: MessageSquare, color: 'green' },
                    { action: 'Profil güncellendi', target: 'Bio ve sosyal linkler', time: '3 gün önce', icon: Edit3, color: 'purple' },
                    { action: 'Yeni takipçi', target: '@johndoe', time: '1 hafta önce', icon: Users, color: 'yellow' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 hover:bg-white/60 dark:hover:bg-gray-800/60 rounded-lg transition-all duration-200">
                      <div className={`p-2 rounded-lg ${
                        activity.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                        activity.color === 'red' ? 'bg-red-100 dark:bg-red-900/30' :
                        activity.color === 'green' ? 'bg-green-100 dark:bg-green-900/30' :
                        activity.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30' :
                        'bg-yellow-100 dark:bg-yellow-900/30'
                      }`}>
                        <activity.icon className={`w-4 h-4 ${
                          activity.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                          activity.color === 'red' ? 'text-red-600 dark:text-red-400' :
                          activity.color === 'green' ? 'text-green-600 dark:text-green-400' :
                          activity.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                          'text-yellow-600 dark:text-yellow-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="text-gray-900 dark:text-white">
                          <span className="font-medium">{activity.action}</span>
                          {activity.target && (
                            <span className="text-blue-600 dark:text-blue-400 ml-1">
                              {activity.target}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SpotlightCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 