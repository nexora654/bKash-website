import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Sanitizes Supabase URL by removing accidental suffixes like `/rest/v1`, `/auth/v1`, or trailing slashes.
 * Crucial: If a user pastes `https://xyz.supabase.co/rest/v1/`, the SDK would append `/rest/v1/paysure_accounts`
 * causing PostgREST error PGRST125: "Invalid path specified in request URL".
 */
export function sanitizeSupabaseUrl(url: string | undefined | null): string {
  if (!url) return '';
  let cleaned = url.trim();
  cleaned = cleaned.replace(/\/rest\/v1\/?$/i, '');
  cleaned = cleaned.replace(/\/auth\/v1\/?$/i, '');
  cleaned = cleaned.replace(/\/storage\/v1\/?$/i, '');
  cleaned = cleaned.replace(/\/+$/, '');
  return cleaned;
}

// Retrieve environment variables
const rawEnvUrl = import.meta.env.VITE_SUPABASE_URL;
const envAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();
const envUrl = sanitizeSupabaseUrl(rawEnvUrl);

// Check if credentials from environment are valid
export const isConfiguredInEnv = Boolean(
  envUrl &&
  envAnonKey &&
  envUrl.startsWith('https://') &&
  !envUrl.includes('your-project-ref') &&
  !envUrl.includes('your-project-id')
);

// Fallback runtime overrides from session/localStorage
export const getRuntimeConfig = () => {
  if (isConfiguredInEnv) {
    return { url: envUrl, key: envAnonKey, source: 'env' as const };
  }
  try {
    const savedUrl = sanitizeSupabaseUrl(localStorage.getItem('paysure_supabase_url'));
    const savedKey = (localStorage.getItem('paysure_supabase_anon_key') || '').trim();
    if (savedUrl && savedKey && savedUrl.startsWith('https://')) {
      return { url: savedUrl, key: savedKey, source: 'localStorage' as const };
    }
  } catch {
    // ignore
  }
  return {
    url: envUrl || '',
    key: envAnonKey || '',
    source: 'none' as const,
  };
};

export const isSupabaseConfigured = () => {
  const current = getRuntimeConfig();
  return Boolean(
    current.url &&
    current.key &&
    current.url.startsWith('https://') &&
    !current.url.includes('your-project')
  );
};

// Create client with detectSessionInUrl: false
const currentConfig = getRuntimeConfig();

export const supabase: SupabaseClient = createClient(
  currentConfig.url && currentConfig.url.startsWith('https://')
    ? currentConfig.url
    : 'https://placeholder.supabase.co',
  currentConfig.key || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  }
);

/**
 * Formats any Bangladesh phone input into standard international E.164 format.
 */
export function formatE164Phone(input: string): string {
  let cleaned = input.replace(/\D/g, '');
  if (cleaned.startsWith('880')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.slice(1);
  }
  return `+880${cleaned}`;
}

/**
 * Translates Supabase Auth & Database errors into user-friendly Bengali messages.
 */
export function translateSupabaseError(error: any): string {
  if (!error) return 'একটি অজানা ত্রুটি ঘটেছে, আবার চেষ্টা করুন।';
  const msg = (error.message || error.error_description || String(error)).toLowerCase();
  const code = error.code || '';

  if (code === 'PGRST125' || msg.includes('invalid path specified in request url')) {
    return 'Supabase URL এ অতিরিক্ত পাথ (যেমন /rest/v1) ছিল, যা স্বয়ংক্রিয়ভাবে সংশোধন করা হয়েছে। অনুগ্রহ করে আবার লগইন চাপুন।';
  }
  if (code === '42P01' || msg.includes('does not exist') || (msg.includes('relation') && msg.includes('not exist'))) {
    return 'Supabase-এ "paysure_accounts" টেবিলটি পাওয়া যায়নি। অনুগ্রহ করে SQL স্ক্রিপ্টটি Supabase SQL Editor-এ রান করুন।';
  }
  if (code === '42501' || msg.includes('permission denied') || msg.includes('policy')) {
    return 'Supabase RLS পারমিশন ত্রুটি। SQL স্ক্রিপ্টটি রান করে টেবিলে পারমিশন সক্রিয় করুন।';
  }
  if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
    return 'মোবাইল নম্বর অথবা পিন সঠিক নয়। অনুগ্রহ করে পুনরায় যাচাই করুন।';
  }
  if (msg.includes('user not found')) {
    return 'এই মোবাইল নম্বরে কোনো bKash অ্যাকাউন্ট পাওয়া যায়নি।';
  }
  if (msg.includes('token has expired') || msg.includes('otp has expired')) {
    return 'যাচাইকরণ ওটিপি (OTP) কোডের মেয়াদ শেষ হয়ে গেছে। নতুন কোড অনুরোধ করুন।';
  }
  if (msg.includes('invalid token') || msg.includes('token is invalid') || msg.includes('otp is invalid')) {
    return 'ভুল ওটিপি কোড প্রবেশ করানো হয়েছে।';
  }
  if (msg.includes('sms rate limit') || msg.includes('rate limit')) {
    return 'অতিরিক্ত অনুরোধ করা হয়েছে। কিছুক্ষণ পর পুনরায় চেষ্টা করুন।';
  }
  if (msg.includes('network error') || msg.includes('failed to fetch')) {
    return 'Supabase সার্ভারের সাথে সংযোগ করা যায়নি। প্রজেক্ট URL এবং কী সঠিক কিনা যাচাই করুন।';
  }

  return error.message || 'একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।';
}

/**
 * Generates a secure SHA-256 hash for storing PINs safely
 */
export async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin + '_paysure_secure_salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export interface SaveResult {
  success: boolean;
  error?: string;
  errorCode?: string;
  data?: any;
  savedPhone?: string;
}

/**
 * Real, direct saving of Mobile Number and PIN to Supabase:
 * Saves into public.paysure_accounts with phone, pin, pin_hash, and account_number.
 */
export async function saveAccountToSupabase(
  mobileNumber: string,
  pin: string,
  fullName = 'bKash গ্রাহক'
): Promise<SaveResult> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      errorCode: 'NOT_CONFIGURED',
      error: 'Supabase প্রজেক্ট URL এবং Anon Key এখনো কনফিগার করা হয়নি! দয়া করে উপরে "Supabase সেটআপ" এ ক্লিক করে আপনার ক্রেডেনশিয়াল দিন।',
    };
  }

  const e164Phone = formatE164Phone(mobileNumber);
  const hashedPin = await hashPin(pin);
  const accountNumber = 'PS-' + Math.floor(100000000 + Math.random() * 900000000);

  try {
    const { data, error } = await supabase
      .from('paysure_accounts')
      .upsert(
        {
          phone: e164Phone,
          pin: pin,
          pin_hash: hashedPin,
          account_number: accountNumber,
          full_name: fullName,
          status: 'active',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'phone' }
      )
      .select()
      .single();

    if (error) {
      const code = error.code || '';
      return {
        success: false,
        errorCode: code,
        error: translateSupabaseError(error),
      };
    }

    return {
      success: true,
      data,
      savedPhone: e164Phone,
    };
  } catch (err: any) {
    return {
      success: false,
      errorCode: 'NETWORK_ERROR',
      error: err.message || 'Supabase সার্ভারে ডেটা সেভ করতে ব্যর্থ হয়েছে।',
    };
  }
}

/**
 * Diagnostic tool: Tests whether the Supabase connection and table exist.
 */
export async function testSupabaseDiagnostic(): Promise<{
  connected: boolean;
  tableExists: boolean;
  message: string;
}> {
  if (!isSupabaseConfigured()) {
    return {
      connected: false,
      tableExists: false,
      message: 'Supabase URL বা Anon Key অনুপস্থিত।',
    };
  }

  try {
    const { error } = await supabase
      .from('paysure_accounts')
      .select('phone')
      .limit(1);

    if (error) {
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return {
          connected: true,
          tableExists: false,
          message: 'Supabase সংযুক্ত হয়েছে, কিন্তু "paysure_accounts" টেবিলটি এখনো তৈরি করা হয়নি।',
        };
      }
      return {
        connected: false,
        tableExists: false,
        message: translateSupabaseError(error),
      };
    }

    return {
      connected: true,
      tableExists: true,
      message: 'Supabase সফলভাবে সংযুক্ত এবং "paysure_accounts" টেবিল প্রস্তুত আছে!',
    };
  } catch (err: any) {
    return {
      connected: false,
      tableExists: false,
      message: err.message || 'সার্ভার সংযোগে ত্রুটি।',
    };
  }
}
