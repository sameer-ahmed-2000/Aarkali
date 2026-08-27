import React from 'react';
import { CouponForm } from '../_components/CouponForm';

export default function NewCouponPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Create Coupon</h2>
      </div>
      <CouponForm />
    </div>
  );
}
