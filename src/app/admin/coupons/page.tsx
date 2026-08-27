import React from 'react';
import Link from 'next/link';
import { dbConnect } from '@/lib/mongoose';
import Coupon from '@/models/Coupon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default async function AdminCoupons() {
  await dbConnect();
  
  const coupons = await Coupon.find().sort({ createdAt: -1 });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Coupons</h2>
          <p className="text-muted-foreground mt-2">Manage discount codes and offers.</p>
        </div>
        <Link href="/admin/coupons/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Coupon
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Coupons</CardTitle>
        </CardHeader>
        <CardContent>
          {coupons.length === 0 ? (
            <p className="text-muted-foreground">No coupons found. Create one to get started.</p>
          ) : (
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Code</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Discount</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Usage</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {coupons.map((coupon) => (
                    <tr key={coupon._id.toString()} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <td className="p-4 align-middle font-medium">{coupon.code}</td>
                      <td className="p-4 align-middle">
                        {coupon.discountType === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                      </td>
                      <td className="p-4 align-middle">
                        {coupon.usageCount} / {coupon.maxUses || '∞'}
                      </td>
                      <td className="p-4 align-middle">
                        {coupon.isActive ? (
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-800">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="p-4 align-middle text-right">
                        <Link href={`/admin/coupons/${coupon._id.toString()}`} className="text-blue-600 hover:underline">
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
