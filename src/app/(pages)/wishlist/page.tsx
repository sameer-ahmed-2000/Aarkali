'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { useWishlist } from '../../_providers/Wishlist'
import { useCart } from '../../_providers/Cart'
import {
  HeartIcon,
  HeartFilledIcon,
  XIcon,
  ArrowRightIcon,
} from '../../_components/Icons'

import classes from './Wishlist.module.scss'

export default function WishlistPage() {
  const { items, removeItem, count } = useWishlist()
  const { addItemToCart, isProductInCart } = useCart()

  return (
    <div className={classes.page}>
      <div className={classes.hero}>
        <h1 className={classes.heroTitle}>My Wishlist</h1>
        <p className={classes.heroSubtitle}>
          {count > 0 ? `${count} item${count !== 1 ? 's' : ''} saved for later` : 'Your wishlist is currently empty'}
        </p>
      </div>

      <div className={classes.container}>
        {count === 0 ? (
          <div className={classes.emptyState}>
            <div className={classes.emptyIconWrap}>
              <HeartIcon size={44} color="var(--boutique-gold-500)" />
            </div>
            <h2 className={classes.emptyTitle}>Your wishlist is empty</h2>
            <p className={classes.emptyText}>
              Explore our boutique collections and save your favourite ethnic pieces here.
              They will be waiting for you when you are ready to shop.
            </p>
            <Link href="/products" className={classes.browseBtn}>
              Browse Collections <ArrowRightIcon size={16} />
            </Link>
          </div>
        ) : (
          <>
            <div className={classes.wishlistGrid}>
              {items.map(item => {
                const discount = item.originalPrice
                  ? Math.round((1 - item.price / item.originalPrice) * 100)
                  : 0

                return (
                  <div key={item.id} className={classes.wishlistCard}>
                    <div className={classes.cardImage}>
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="(max-width:768px) 50vw, 25vw"
                          className={classes.productImg}
                        />
                      ) : (
                        <Image
                          src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80&auto=format&fit=crop"
                          alt={item.name}
                          fill
                          sizes="(max-width:768px) 50vw, 25vw"
                          className={classes.productImg}
                        />
                      )}
                      <button
                        className={classes.removeBtn}
                        onClick={() => removeItem(item.id)}
                        aria-label="Remove from wishlist"
                      >
                        <XIcon size={14} />
                      </button>
                    </div>
                    <div className={classes.cardInfo}>
                      {item.category && <p className={classes.cardCategory}>{item.category}</p>}
                      <h3 className={classes.cardName}>{item.name}</h3>
                      <div className={classes.cardPricing}>
                        <span className={classes.cardPrice}>₹{item.price.toLocaleString('en-IN')}</span>
                        {item.originalPrice && (
                          <>
                            <span className={classes.cardOriginal}>₹{item.originalPrice.toLocaleString('en-IN')}</span>
                            <span className={classes.cardDiscount}>{discount}% off</span>
                          </>
                        )}
                      </div>
                      <div className={classes.cardActions}>
                        <Link href={`/products/${item.id}`} className={classes.viewBtn}>
                          View Product
                        </Link>
                        {isProductInCart({ id: item.id } as any) ? (
                          <Link href="/cart" className={`${classes.cartBtn} ${classes.inCartBtn}`}>
                            ✓ In Bag
                          </Link>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              addItemToCart({
                                product: {
                                  id: String(item.id),
                                  title: item.name,
                                  name: item.name,
                                  price: item.price,
                                  image: item.image,
                                  meta: { image: item.image },
                                } as any,
                                quantity: 1,
                              })
                            }}
                            className={classes.cartBtn}
                          >
                            Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className={classes.actions}>
              <Link href="/products" className={classes.continueShopping}>
                ← Continue Shopping
              </Link>
              <Link href="/cart" className={classes.viewCartBtn}>
                View Cart <ArrowRightIcon size={16} />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
