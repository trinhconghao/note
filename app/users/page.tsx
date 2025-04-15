import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';
import { updateUserRole } from '@/actions/user';

export default async function UsersPage() {
  const supabase = await createClient();

  const { data: users } = await supabase
    .from('user_profiles')
    .select('id, email, username, avatar_url, "createdAt", role')
    .order('createdAt', { ascending: false });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Danh sách tài khoản</h1>
      <div className="grid grid-cols-1 gap-4">
        {users?.map((u) => (
          <div
            key={u.id}
            className="flex items-center gap-4 p-4 border rounded-lg shadow-sm"
          >
            {u.avatar_url ? (
              <Image
                src={u.avatar_url}
                alt={u.username}
                width={50}
                height={50}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-[50px] h-[50px] bg-gray-300 rounded-full flex items-center justify-center text-white">
                {u.username.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <p className="font-semibold">{u.username}</p>
              <p className="text-sm text-gray-500">{u.email}</p>
              <p className="text-xs text-gray-400">
                Tham gia: {new Date(u.createdAt).toLocaleDateString('vi-VN')}
              </p>
            </div>

            <form action={updateUserRole} className="flex items-center gap-2">
              <input type="hidden" name="userId" value={u.id} />
              <select
                name="newRole"
                className="border rounded px-2 py-1 text-sm"
                defaultValue={u.role}
                disabled={user?.id === u.id}
              >
                <option value="USER">USER</option>
                <option value="MODERATOR">MODERATOR</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              <button
                type="submit"
                disabled={user?.id === u.id}
                className="text-xs px-2 py-1 bg-blue-500 text-white rounded"
              >
                Lưu
              </button>
            </form>

          </div>
        ))}
      </div>
    </div>
  );
}
