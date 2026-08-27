import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongoose';
import Product from '@/models/Product';
import { CATALOG_PRODUCTS } from '@/app/constants/catalog';
import Category from '@/models/Category';

export async function GET() {
  try {
    await dbConnect();
    
    // Optional: Clear existing products
    // await Product.deleteMany({});
    
    const seededProducts = [];

    for (const item of CATALOG_PRODUCTS) {
      // Find or create category (if needed, skipping for now to keep it simple, or we can use strings if model allows)
      // Wait, Product.ts uses ObjectId for categories: `categories: [{ type: Types.ObjectId, ref: 'Category' }]`
      // We will create the category if it doesn't exist.
      let cat = await Category.findOne({ title: item.categoryLabel });
      if (!cat) {
        cat = await Category.create({ title: item.categoryLabel, slug: item.category });
      }

      const product = await Product.findOneAndUpdate(
        { sku: item.sku }, // Or slug
        {
          title: item.name,
          slug: item.slug,
          sku: item.sku,
          price: item.price,
          salePrice: item.isSale ? item.price : undefined, 
          // Note: catalog.ts has price as sale price and originalPrice as original.
          // Mongoose Product.ts has price and salePrice. 
          // Let's set price = originalPrice, salePrice = price if isSale
          stock: item.inStock ? 50 : 0,
          categories: [cat._id],
          isFeatured: item.badge === 'Bestseller' || item.badge === 'Premium',
          status: 'published',
          publishedOn: new Date(),
          layout: [
            {
              type: 'image',
              url: item.image,
              additionalImages: item.additionalImages || []
            },
            {
              type: 'details',
              shortDescription: item.shortDescription,
              description: item.description,
              highlights: item.highlights,
              fabric: item.fabric,
              craft: item.craft,
              care: item.care,
              sizes: item.sizes
            }
          ]
        },
        { upsert: true, new: true }
      );
      
      seededProducts.push(product);
    }
    
    return NextResponse.json({ message: 'Seed successful', count: seededProducts.length, products: seededProducts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
