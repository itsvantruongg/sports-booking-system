"use client";
import Link from "next/link";

export default function OwnerChangePasswordPage() {
  return (
    <div className="bg-background min-h-screen flex items-center justify-center font-body text-on-surface p-4 relative overflow-hidden">
      {/* Decorative Ambient Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>
      <main className="w-full max-w-md relative z-10">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <h1 className="font-display font-black text-4xl tracking-tighter text-primary">KINETIC</h1>
          <p className="font-body text-on-surface-variant text-sm mt-2">Partner Security Update</p>
        </div>
        {/* Main Card */}
        <div className="bg-surface-container-lowest rounded-xl shadow-[0_12px_40px_rgba(25,27,37,0.06)] p-8 sm:p-10 relative overflow-hidden">
          {/* Context Icon */}
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <span className="material-symbols-outlined text-[120px] text-primary" data-icon="lock" data-weight="fill">lock</span>
          </div>
          {/* Header */}
          <div className="mb-8 relative z-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface-container-low text-primary mb-4">
              <span className="material-symbols-outlined" data-icon="shield_lock">shield_lock</span>
            </div>
            <h2 className="font-headline text-2xl font-bold tracking-tight text-on-surface mb-2">Update Required</h2>
            <p className="font-body text-on-surface-variant">For your security, please create a new password to access your Kinetic Partner Portal.</p>
          </div>
          {/* Form */}
          <form action="#" className="space-y-6 relative z-10" method="POST">
            {/* Current Password (Read-Only/Pre-filled) */}
            <div>
              <label className="block font-label text-sm font-medium text-on-surface mb-2" htmlFor="current-password">System Temporary Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-on-surface-variant/50 text-xl" data-icon="key">key</span>
                </div>
                <input className="block w-full pl-11 pr-4 py-3 bg-surface-container text-on-surface-variant font-body rounded-lg border-none focus:ring-0 cursor-not-allowed text-sm" disabled={true} id="current-password" name="current-password" readOnly={true} type="password" value="temp-pass-12345" />
              </div>
            </div>
            {/* New Password */}
            <div>
              <label className="block font-label text-sm font-medium text-on-surface mb-2" htmlFor="new-password">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-primary text-xl" data-icon="lock_reset">lock_reset</span>
                </div>
                <input className="block w-full pl-11 pr-4 py-3 bg-surface text-on-surface font-body rounded-lg border-2 border-transparent focus:border-outline-variant/30 focus:bg-surface-bright focus:ring-0 transition-all duration-200 text-sm shadow-sm placeholder:text-outline" id="new-password" name="new-password" placeholder="Enter new password" required type="password" />
              </div>
              {/* Password Requirements Hint */}
              <p className="mt-2 text-xs text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]" data-icon="info">info</span>
                Must be at least 8 characters.
              </p>
            </div>
            {/* Confirm New Password */}
            <div>
              <label className="block font-label text-sm font-medium text-on-surface mb-2" htmlFor="confirm-password">Confirm New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-primary text-xl" data-icon="lock_open">lock_open</span>
                </div>
                <input className="block w-full pl-11 pr-4 py-3 bg-surface text-on-surface font-body rounded-lg border-2 border-transparent focus:border-outline-variant/30 focus:bg-surface-bright focus:ring-0 transition-all duration-200 text-sm shadow-sm placeholder:text-outline" id="confirm-password" name="confirm-password" placeholder="Re-enter new password" required type="password" />
              </div>
            </div>
            {/* Submit Action */}
            <div className="pt-4">
              <button className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold rounded-full hover:shadow-[0_12px_40px_rgba(0,62,199,0.25)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300" type="submit">
                <span>Update &amp; Continue</span>
                <span className="material-symbols-outlined text-xl" data-icon="arrow_forward">arrow_forward</span>
              </button>
            </div>
          </form>
          {/* Support Link */}
          <div className="mt-8 text-center relative z-10">
            <a className="inline-flex items-center gap-1 font-label text-sm text-on-surface-variant hover:text-primary transition-colors" href="#">
              <span className="material-symbols-outlined text-[16px]" data-icon="help">help</span>
              Need help accessing your account?
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}