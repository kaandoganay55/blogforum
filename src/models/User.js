import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId;
    },
  },
  image: {
    type: String,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  // Gamification özellikleri
  xp: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 1,
  },
  badges: [{
    id: String,
    name: String,
    description: String,
    icon: String,
    earnedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  streak: {
    current: {
      type: Number,
      default: 0,
    },
    longest: {
      type: Number,
      default: 0,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  stats: {
    totalPosts: {
      type: Number,
      default: 0,
    },
    totalLikes: {
      type: Number,
      default: 0,
    },
    totalComments: {
      type: Number,
      default: 0,
    },
    totalViews: {
      type: Number,
      default: 0,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system',
    },
    notifications: {
      email: {
        type: Boolean,
        default: true,
      },
      push: {
        type: Boolean,
        default: true,
      },
    },
  },
}, {
  timestamps: true,
});

// XP'ye göre level hesaplama
userSchema.methods.calculateLevel = function() {
  const xp = this.xp;
  // Her level 100 XP daha fazla gerektirir (1->100, 2->300, 3->600...)
  let level = 1;
  let requiredXP = 0;
  
  while (requiredXP <= xp) {
    requiredXP += level * 100;
    if (requiredXP <= xp) {
      level++;
    }
  }
  
  this.level = level;
  return level;
};

// Rozet kazanma kontrolü
userSchema.methods.checkAndAwardBadges = function() {
  const newBadges = [];
  const existingBadgeIds = this.badges.map(b => b.id);
  
  // İlk gönderi rozeti
  if (this.stats.totalPosts >= 1 && !existingBadgeIds.includes('first_post')) {
    newBadges.push({
      id: 'first_post',
      name: 'İlk Adım',
      description: 'İlk gönderini yayınladın!',
      icon: '🌟',
    });
  }
  
  // Aktif yazar rozeti
  if (this.stats.totalPosts >= 10 && !existingBadgeIds.includes('active_writer')) {
    newBadges.push({
      id: 'active_writer',
      name: 'Aktif Yazar',
      description: '10 gönderi yayınladın!',
      icon: '✍️',
    });
  }
  
  // Popüler yazar rozeti
  if (this.stats.totalLikes >= 50 && !existingBadgeIds.includes('popular_writer')) {
    newBadges.push({
      id: 'popular_writer',
      name: 'Popüler Yazar',
      description: '50 beğeni topladın!',
      icon: '❤️',
    });
  }
  
  // Sosyal kullanıcı rozeti
  if (this.stats.totalComments >= 25 && !existingBadgeIds.includes('social_user')) {
    newBadges.push({
      id: 'social_user',
      name: 'Sosyal Kullanıcı',
      description: '25 yorum yaptın!',
      icon: '💬',
    });
  }
  
  // Streak master rozeti
  if (this.streak.longest >= 7 && !existingBadgeIds.includes('streak_master')) {
    newBadges.push({
      id: 'streak_master',
      name: 'Streak Master',
      description: '7 gün üst üste aktif oldun!',
      icon: '🔥',
    });
  }
  
  // Yeni rozetleri ekle
  if (newBadges.length > 0) {
    this.badges.push(...newBadges);
  }
  
  return newBadges;
};

// XP ekleme
userSchema.methods.addXP = function(amount, reason = '') {
  this.xp += amount;
  this.calculateLevel();
  
  // İstatistikleri güncelle
  switch (reason) {
    case 'post':
      this.stats.totalPosts += 1;
      break;
    case 'like':
      this.stats.totalLikes += 1;
      break;
    case 'comment':
      this.stats.totalComments += 1;
      break;
  }
  
  // Streak güncelle
  this.updateStreak();
  
  // Rozetleri kontrol et
  return this.checkAndAwardBadges();
};

// Streak güncelleme
userSchema.methods.updateStreak = function() {
  const now = new Date();
  const lastActive = new Date(this.streak.lastActive);
  const timeDiff = Math.floor((now - lastActive) / (1000 * 60 * 60 * 24));
  
  if (timeDiff === 0) {
    // Aynı gün - streak değişmez
    return;
  } else if (timeDiff === 1) {
    // Ardışık gün - streak artar
    this.streak.current += 1;
    if (this.streak.current > this.streak.longest) {
      this.streak.longest = this.streak.current;
    }
  } else if (timeDiff > 1) {
    // Streak kırıldı
    this.streak.current = 1;
  }
  
  this.streak.lastActive = now;
};

export default mongoose.models.User || mongoose.model('User', userSchema); 