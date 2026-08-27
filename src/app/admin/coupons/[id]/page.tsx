import React from 'react';
import { dbConnect } from '@/lib/mongoose';
import Coupon from '@/models/Coupon';
import { CouponForm } from '../_components/CouponForm';
import { notFound } from 'next/navigation';

export default async function EditCouponPage({ params }: { params: { id: string } }) {
  await dbConnect();
  
  const coupon = await Coupon.findById(params.id);
  if (!coupon) return notFound();

  // Convert mongoose doc to lean plain object for client component
  const couponData = JSON.parse(JSON.stringify(coupon));

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Edit Coupon</h2>
      </div>
      <CouponForm initialData={couponData} />
    </div>
  );
}
