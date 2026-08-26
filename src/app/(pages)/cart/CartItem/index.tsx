'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { Media } from '../../../_components/Media'
import { Price } from '../../../_components/Price'
import { RemoveFromCartButton } from '../../../_components/RemoveFromCartButton'
import { XIcon } from '../../../_components/Icons'

import classes from './index.module.scss'

export const CartItem = ({ product, title, metaImage, qty, addItemToCart }) => {
  const [quantity, setQuantity] = useState(qty)

  const itemTitle = title || product?.title || product?.name || 'Boutique Product'
  const imageUrl = typeof metaImage === 'string' ? metaImage : (metaImage?.url || product?.image || product?.meta?.image?.url)
  const itemPrice = typeof product?.price === 'number' ? product.price : 0

  const decrementQty = () => {
    const updatedQty = quantity > 1 ? quantity - 1 : 1
    setQuantity(updatedQty)
    addItemToCart({ product, quantity: Number(updatedQty) })
  }

  const incrementQty = () => {
    const updatedQty = quantity + 1
    setQuantity(updatedQty)
    addItemToCart({ product, quantity: Number(updatedQty) })
  }

  const enterQty = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10)
    const updatedQty = isNaN(val) || val < 1 ? 1 : val
    setQuantity(updatedQty)
    addItemToCart({ product, quantity: Number(updatedQty) })
  }

  return (
    <li className={classes.item} key={itemTitle}>
      {/* Product Image */}
      <Link href={`/products/${product.slug || product.id}`} className={classes.mediaWrapper}>
        {imageUrl ? (
          typeof imageUrl === 'string' ? (
            <Image src={imageUrl} alt={itemTitle} fill sizes="100px" className={classes.image} />
          ) : (
            <Media className={classes.media} imgClassName={classes.image} resource={imageUrl} fill />
          )
        ) : (
          <div className={classes.fallbackImage}>
            <span>Aarkali</span>
          </div>
        )}
      </Link>

      {/* Item Details */}
      <div className={classes.itemDetails}>
        <div className={classes.titleWrapper}>
          <h4 className={classes.title}>
            <Link href={`/products/${product.slug || product.id}`}>{itemTitle}</Link>
          </h4>
          <div className={classes.unitPrice}>
            {itemPrice > 0 ? (
              <span>₹{itemPrice.toLocaleString('en-IN')}</span>
            ) : (
              <Price product={product} button={false} />
            )}
          </div>
        </div>

        {/* Quantity Controls */}
        <div className={classes.quantityControl}>
          <span className={classes.qtyLabel}>Qty:</span>
          <div className={classes.qtyStepper}>
            <button
              type="button"
              className={classes.qtyBtn}
              onClick={decrementQty}
              aria-label="Decrease quantity"
            >
              &minus;
            </button>
            <input
              type="number"
              min="1"
              max="99"
              className={classes.quantityInput}
              value={quantity}
              onChange={enterQty}
              aria-label="Quantity"
            />
            <button
              type="button"
              className={classes.qtyBtn}
              onClick={incrementQty}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Item Subtotal & Delete */}
      <div className={classes.subtotalWrapper}>
        <div className={classes.itemTotal}>
          {itemPrice > 0 ? (
            <span>₹{(itemPrice * quantity).toLocaleString('en-IN')}</span>
          ) : (
            <Price product={product} button={false} quantity={quantity} />
          )}
        </div>
        <RemoveFromCartButton product={product} className={classes.removeBtn} />
      </div>
    </li>
  )
}

export default CartItem
