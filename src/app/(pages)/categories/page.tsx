import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

import {
  SareeIcon,
  KurtiIcon,
  LehengaIcon,
  JewelleryIcon,
  DupattaIcon,
  SalwarIcon,
  ArrowRightIcon,
} from '../../_components/Icons'

import classes from './CategoriesPage.module.scss'

export const dynamic = 'force-dynamic'

const categories = [
  {
    title: 'Sarees',
    slug: 'sarees',
    tagline: 'Handwoven Silks & Timeless Drapes',
    count: '60+ Designs',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&q=85&auto=format&fit=crop',
    Icon: SareeIcon,
    items: ['Banarasi Silk', 'Kanjeevaram', 'Chanderi', 'Georgette', 'Cotton Silk'],
  },
  {
    title: 'Kurtis',
    slug: 'kurtis',
    tagline: 'Casual & Festive Anarkali Sets',
    count: '45+ Designs',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=700&q=85&auto=format&fit=crop',
    Icon: KurtiIcon,
    items: ['Anarkali Kurtis', 'Straight Cuts', 'Palazzo Sets', 'Hand-block Printed', 'Embroidered'],
  },
  {
    title: 'Lehengas',
    slug: 'lehengas',
    tagline: 'Bridal & Grand Celebration Ensembles',
    count: '30+ Designs',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=700&q=85&auto=format&fit=crop',
    Icon: LehengaIcon,
    items: ['Bridal Velvet', 'Silk Brocade', 'Party Wear', 'Mirror Work', 'Semi-Stitched'],
  },
  {
    title: 'Jewellery',
    slug: 'accessories',
    tagline: 'Antique Temple & Kundan Jewellery',
    count: '40+ Pieces',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=700&q=85&auto=format&fit=crop',
    Icon: JewelleryIcon,
    items: ['Temple Jhumkas', 'Kundan Chokers', 'Bangles', 'Nose Rings', 'Maang Tikka'],
  },
  {
    title: 'Dupattas',
    slug: 'dupattas',
    tagline: 'Embroidered Phulkari & Bandhani Stoles',
    count: '25+ Designs',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=700&q=85&auto=format&fit=crop',
    Icon: DupattaIcon,
    items: ['Phulkari Silk', 'Bandhani Zari', 'Chiffon Printed', 'Velvet Heavy', 'Linen'],
  },
  {
    title: 'Salwar Sets',
    slug: 'salwar-sets',
    tagline: 'Everyday Grace & Designer Suits',
    count: '35+ Designs',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=700&q=85&auto=format&fit=crop',
    Icon: SalwarIcon,
    items: ['Patiala Suits', 'Chanderi Suits', 'Palazzo Suits', 'Straight Suits', 'Sharara Sets'],
  },
]

export default function CategoriesPage() {
  return (
    <div className={classes.page}>
      <div className={classes.hero}>
        <h1 className={classes.heroTitle}>Boutique Collections</h1>
        <p className={classes.heroSubtitle}>
          Explore our handcrafted Indian ethnic fashion categorized by traditional ateliers and modern silhouettes
        </p>
      </div>

      <div className={classes.container}>
        <div className={classes.categoriesGrid}>
          {categories.map(cat => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className={classes.categoryCard}
            >
              <div className={classes.imageWrap}>
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  sizes="(max-width:768px) 100vw, 33vw"
                  className={classes.image}
                />
                <div className={classes.overlay} />
                <span className={classes.countBadge}>{cat.count}</span>
              </div>

              <div className={classes.cardContent}>
                <div className={classes.iconTitleRow}>
                  <div className={classes.iconWrap}>
                    <cat.Icon size={24} />
                  </div>
                  <div>
                    <h2 className={classes.cardTitle}>{cat.title}</h2>
                    <p className={classes.cardTagline}>{cat.tagline}</p>
                  </div>
                </div>

                <div className={classes.subItems}>
                  {cat.items.map(sub => (
                    <span key={sub} className={classes.subItemChip}>
                      {sub}
                    </span>
                  ))}
                </div>

                <div className={classes.exploreLink}>
                  <span>Explore {cat.title}</span>
                  <ArrowRightIcon size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'All Categories | Aarkali Boutique',
  description:
    'Browse all boutique categories: Sarees, Kurtis, Lehengas, Jewellery, Dupattas, and Salwar Sets with free shipping above ₹999.',
}
