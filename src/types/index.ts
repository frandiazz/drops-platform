export interface Profile {
  id: string;
  stage_name?: string;
  email?: string;
  role?: 'creator' | 'admin';
  socials?: string;
  instagram?: string;
  tiktok?: string;
  twitter?: string;
  avatar_url?: string;
  bio?: string;
  commission_rate?: number;
}

export interface UserMeta {
  stage_name?: string;
  avatar_url?: string;
  bio?: string;
  socials?: string;
  instagram?: string;
  tiktok?: string;
  twitter?: string;
}

export interface ContentPack {
  id: string;
  creator_id: string;
  title: string;
  description?: string;
  price: number;
  subscription_price?: number | null;
  type?: 'one_time' | 'subscription';
  content_type?: 'one_time' | 'subscription';
  delivery_type?: 'download' | 'telegram' | 'both' | null;
  telegram_link?: string | null;
  media_urls: string[];
  is_active: boolean;
  created_at: string;
  creator_name?: string;
  avatar_url?: string;
}

export interface Sale {
  id: string;
  creator_id?: string;
  buyer_email: string;
  content_id: string;
  amount: number;
  payment_status: 'pending' | 'completed' | 'failed';
  mp_payment_id?: string;
  access_token?: string;
  created_at: string;
  creator_earnings?: string;
  commission?: string;
  commission_rate?: number;
  payment_method?: string;
  content?: { title: string };
}

export interface Subscription {
  id: string;
  creator_id?: string;
  buyer_email: string;
  content_id: string;
  status: 'pending' | 'active' | 'cancelled' | 'expired';
  mp_preapproval_id?: string;
  access_token?: string;
  amount?: number;
  current_period_end?: string;
  created_at: string;
}

export interface Withdrawal {
  id: string;
  creator_id?: string;
  amount: number;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  created_at: string;
  approved_at?: string;
  paid_at?: string;
  rejected_at?: string;
  creator_name?: string;
  creator_email?: string;
}

export interface Application {
  id: string;
  name: string;
  email: string;
  instagram?: string;
  tiktok?: string;
  twitter?: string;
  other_social?: string;
  status: 'pending' | 'approved' | 'rejected';
  age?: string;
  photo_urls?: string[];
  invite_token?: string;
  created_at: string;
  reviewed_at?: string;
}

export type WithdrawalStatus = Withdrawal['status'];
export type SaleStatus = Sale['payment_status'];
export type SubscriptionStatus = Subscription['status'];
export type ApplicationStatus = Application['status'];
