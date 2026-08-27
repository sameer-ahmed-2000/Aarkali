'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function CouponForm({ initialData = null }: { initialData?: any }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    code: initialData?.code || '',
    description: initialData?.description || '',
    discountType: initialData?.discountType || 'percentage',
    value: initialData?.value || 0,
    minOrderAmount: initialData?.minOrderAmount || 0,
    maxUses: initialData?.maxUses || '',
    isActive: initialData?.isActive ?? true,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const url = initialData ? `/api/admin/coupons/${initialData._id}` : '/api/admin/coupons';
      const method = initialData ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) throw new Error(await res.text());
      
      router.push('/admin/coupons');
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Failed to save coupon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Coupon' : 'Create Coupon'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Coupon Code</label>
            <input 
              required name="code" value={formData.code} onChange={handleChange} 
              className="w-full p-2 border rounded" placeholder="e.g. SUMMER20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea 
              name="description" value={formData.description} onChange={handleChange} 
              className="w-full p-2 border rounded" rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Discount Type</label>
              <select 
                name="discountType" value={formData.discountType} onChange={handleChange} 
                className="w-full p-2 border rounded"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
                <option value="freeShipping">Free Shipping</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Discount Value</label>
              <input 
                type="number" name="value" value={formData.value} onChange={handleChange} 
                className="w-full p-2 border rounded" required min="0"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Min Order Amount (Optional)</label>
              <input 
                type="number" name="minOrderAmount" value={formData.minOrderAmount} onChange={handleChange} 
                className="w-full p-2 border rounded" min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Uses (Optional)</label>
              <input 
                type="number" name="maxUses" value={formData.maxUses} onChange={handleChange} 
                className="w-full p-2 border rounded" min="1"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <input 
              type="checkbox" id="isActive" name="isActive" 
              checked={formData.isActive} onChange={handleChange} 
            />
            <label htmlFor="isActive" className="text-sm font-medium leading-none cursor-pointer">
              Is Active
            </label>
          </div>
          <div className="pt-4 flex justify-end">
            <Button type="button" variant="outline" className="mr-2" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Coupon'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
