'use client'

import React, { Fragment, useState } from 'react'
import Image from 'next/image'

import { Category, Product } from '../../../payload/payload-types'
import { AddToCartButton } from '../../_components/AddToCartButton'
import { Gutter } from '../../_components/Gutter'
import { Media } from '../../_components/Media'
import { Price } from '../../_components/Price'
import { useWishlist } from '../../_providers/Wishlist'
import {
  StarIcon,
  TruckIcon,
  RefreshIcon,
  ShieldIcon,
  CreditCardIcon,
  HeartIcon,
  HeartFilledIcon,
  CheckIcon,
} from '../../_components/Icons'

import classes from './index.module.scss'

export const ProductHero: React.FC<{
  product: Product
}> = ({ product }) => {
  const { title, categories, meta: { image: metaImage, description } = {} } = product
  const { addItem, removeItem, isInWishlist } = useWishlist()
  const [selectedSize, setSelectedSize] = useState('M')

  const wishlisted = isInWishlist(product.id)

  const toggleWishlist = () => {
    if (wishlisted) {
      removeItem(product.id)
    } else {
      addItem({
        id: product.id,
        name: product.title,
        price: typeof product.priceJSON === 'string' ? JSON.parse(product.priceJSON)?.unit_amount / 100 : 2999,
        category: (categories?.[0] as Category)?.title,
      })
    }
  }

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

  return (
    <Gutter className={classes.productHero}>
      {/* Media Gallery Wrap */}
      <div className={classes.mediaWrapper}>
        {metaImage && typeof metaImage !== 'string' ? (
          <Media imgClassName={classes.image} resource={metaImage} fill />
        ) : (
          <Image
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&q=85&auto=format&fit=crop"
            alt={title || 'Aarkali Boutique Product'}
            fill
            priority
            sizes="(max-width: 900px) 100vw, 50vw"
            className={classes.image}
          />
        )}
      </div>

      {/* Product Details */}
      <div className={classes.details}>
        {/* Categories & Rating */}
        <div className={classes.categoryWrapper}>
          <div className={classes.categories}>
            {categories?.map((category, index) => {
              const { title: categoryTitle } = category as Category
              const titleToUse = categoryTitle || 'Ethnic Wear'
              const isLast = index === categories.length - 1

              return (
                <span key={index} className={classes.category}>
                  {titleToUse} {!isLast && <Fragment>·&nbsp;</Fragment>}
                </span>
              )
            })}
          </div>

          <div className={classes.ratingBadge}>
            <div className={classes.stars}>
              {[1, 2, 3, 4, 5].map(i => (
                <StarIcon key={i} size={13} filled color="var(--boutique-gold-500)" />
              ))}
            </div>
            <span className={classes.ratingCount}>4.8 (86 reviews)</span>
          </div>
        </div>

        <h1 className={classes.title}>{title}</h1>

        <div className={classes.priceRow}>
          <Price product={product} button={false} />
          <span className={classes.stockBadge}>
            <CheckIcon size={13} /> In Stock &amp; Ready to Ship
          </span>
        </div>

        {/* Size Selection */}
        <div className={classes.sizeSection}>
          <div className={classes.sizeHeader}>
            <span className={classes.sizeLabel}>Select Size: <strong>{selectedSize}</strong></span>
            <button className={classes.sizeGuideBtn} type="button">Size Guide</button>
          </div>
          <div className={classes.sizeOptions}>
            {sizes.map(size => (
              <button
                key={size}
                type="button"
                className={[classes.sizeBtn, selectedSize === size && classes.sizeBtnActive].filter(Boolean).join(' ')}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        {description && (
          <div className={classes.description}>
            <p>{description}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className={classes.actions}>
          <AddToCartButton product={product} className={classes.addToCartButton} />
          <button
            type="button"
            className={[classes.wishlistBtn, wishlisted && classes.wishlistBtnActive].filter(Boolean).join(' ')}
            onClick={toggleWishlist}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {wishlisted ? <HeartFilledIcon size={20} color="hsl(350,70%,55%)" /> : <HeartIcon size={20} />}
            <span>{wishlisted ? 'Saved' : 'Wishlist'}</span>
          </button>
        </div>

        {/* Boutique Reassurances */}
        <div className={classes.perksBox}>
          <div className={classes.perkItem}>
            <TruckIcon size={18} />
            <div>
              <strong>Free Express Shipping</strong>
              <p>On orders above ₹999 across India</p>
            </div>
          </div>

          <div className={classes.perkItem}>
            <CreditCardIcon size={18} />
            <div>
              <strong>Cash on Delivery Available</strong>
              <p>Pay at your doorstep with cash or UPI</p>
            </div>
          </div>

          <div className={classes.perkItem}>
            <RefreshIcon size={18} />
            <div>
              <strong>7-Day Hassle-Free Returns</strong>
              <p>Complimentary size exchanges</p>
            </div>
          </div>

          <div className={classes.perkItem}>
            <ShieldIcon size={18} />
            <div>
              <strong>100% Authentic Handcrafted</strong>
              <p>Direct from traditional Indian artisans</p>
            </div>
          </div>
        </div>
      </div>
    </Gutter>
  )
}
