"use server";

import { UserRole } from '@/types';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function updateUserRole(formData: FormData) {
  const supabase = await createClient();
  const userId = formData.get('userId') as string;
  const newRole = formData.get('newRole') as UserRole;

  await supabase
    .from('user_profiles')
    .update({ role: newRole })
    .eq('id', userId);

  redirect('/users'); 
}
