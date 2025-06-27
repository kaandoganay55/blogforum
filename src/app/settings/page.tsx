import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sun, Moon, Bell, Mail, User as UserIcon, Lock, Save, Check } from 'lucide-react';
import SpotlightCard from '@/components/SpotlightCard';

interface UserType {
  _id: string;
  name: string;
  email: string;
  image?: string;
}

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  await connectDB();
  const userDataRaw = await User.findById(session.user.id).lean();
  const userData = Array.isArray(userDataRaw) ? userDataRaw[0] : userDataRaw;
  if (!userData) redirect('/login');
  const user: UserType = {
    _id: typeof userData._id === 'string' ? userData._id : String(userData._id),
    name: userData.name || '',
    email: userData.email || '',
    image: userData.image || undefined,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-8">Ayarlar</h1>
        <SpotlightCard className="mb-8">
          <div className="p-6 flex items-center gap-6">
            <Avatar className="w-20 h-20 border-4 border-blue-200 dark:border-blue-900">
              <AvatarImage src={user.image} />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-3xl font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</div>
              <div className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {user.email}
              </div>
            </div>
          </div>
        </SpotlightCard>

        {/* Hesap Bilgileri */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Hesap Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Ad Soyad</label>
                <Input type="text" name="name" defaultValue={user.name} autoComplete="name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">E-posta</label>
                <Input type="email" name="email" defaultValue={user.email} autoComplete="email" />
              </div>
              <Button type="submit" className="mt-2">
                <Save className="w-4 h-4 mr-2" /> Kaydet
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Şifre Değiştir */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Şifre Değiştir</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Mevcut Şifre</label>
                <Input type="password" name="currentPassword" autoComplete="current-password" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Yeni Şifre</label>
                <Input type="password" name="newPassword" autoComplete="new-password" />
              </div>
              <Button type="submit" className="mt-2">
                <Lock className="w-4 h-4 mr-2" /> Şifreyi Güncelle
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Tema ve Bildirim Tercihleri */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Tema ve Bildirimler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="font-medium">Tema:</span>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Sun className="w-4 h-4" /> Açık
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Moon className="w-4 h-4" /> Koyu
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-medium">Bildirimler:</span>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Bell className="w-4 h-4" /> E-posta
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Bell className="w-4 h-4" /> Push
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 