// app/users/page.tsx
import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';
import React from 'react';

export default async function UsersPage() {
  const supabase = await createClient();

  const { data: users, error } = await supabase
    .from('user_profiles')
    .select('id, email, username, avatar_url, "createdAt"')
    .order('createdAt', { ascending: false });

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Lỗi khi tải danh sách người dùng: {error.message}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Danh sách tài khoản</h1>
      <div className="grid grid-cols-1 gap-4">
        {users?.map((user) => (
          <div key={user.id} className="flex items-center gap-4 p-4 border rounded-lg shadow-sm">
            {user.avatar_url ? (
              <Image
                src={user.avatar_url}
                alt={user.username}
                width={50}
                height={50}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-[50px] h-[50px] bg-gray-300 rounded-full flex items-center justify-center text-white">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-semibold">{user.username}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-xs text-gray-400">
                Tham gia: {new Date(user.createdAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
