import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Tüm alanları doldurun' },
        { status: 400 }
      );
    }

    await connectDB();

    // Email kontrolü
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'Bu email adresi zaten kullanılıyor' },
        { status: 400 }
      );
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni kullanıcı oluştur
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: 'Kullanıcı başarıyla oluşturuldu' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Kayıt hatası:', error);
    return NextResponse.json(
      { message: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
} 