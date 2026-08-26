'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { Gutter } from '../../_components/Gutter'
import {
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  WhatsAppIcon,
  TruckIcon,
  RefreshIcon,
  ShieldIcon,
  CreditCardIcon,
  CheckIcon,
  ArrowRightIcon,
  HeartIcon,
  SparkleIcon,
} from '../../_components/Icons'
import { STORE_NAME, STORE_PHONE, STORE_EMAIL } from '../../constants'

import classes from './StaticContentPage.module.scss'

export function StaticContentPage({ slug }: { slug: string }) {
  const [activeFaq, setActiveFaq] = useState<number | null>(0)
  const [contactSubmitted, setContactSubmitted] = useState(false)

  // ─── ABOUT US ─────────────────────────────────────────────────────────────
  if (slug === 'about') {
    return (
      <div className={classes.page}>
        <div className={classes.hero}>
          <p className={classes.heroTag}>Our Heritage</p>
          <h1 className={classes.heroTitle}>The Story of Aarkali</h1>
          <p className={classes.heroSubtitle}>
            Preserving centuries of Indian textile craftsmanship, handcrafted with passion for modern celebrations.
          </p>
        </div>

        <Gutter className={classes.container}>
          <div className={classes.storySection}>
            <div className={classes.storyText}>
              <h2 className={classes.sectionHeading}>Woven with Devotion &amp; Grace</h2>
              <p>
                Founded with a deep reverence for India&apos;s rich handloom traditions, <strong>Aarkali Boutique</strong> brings together master weavers, zari artisans, and contemporary designers to celebrate timeless ethnic couture.
              </p>
              <p>
                Every saree, kurti, and bridal lehenga in our collection begins in traditional weaving clusters across Varanasi, Kanchipuram, Chanderi, and Jaipur. We eliminate middlemen to ensure our artisan partners receive fair compensation while delivering authentic luxury directly to your doorstep.
              </p>
              <div className={classes.statsGrid}>
                <div className={classes.statItem}>
                  <span className={classes.statNum}>100%</span>
                  <span className={classes.statLabel}>Authentic Handloom</span>
                </div>
                <div className={classes.statItem}>
                  <span className={classes.statNum}>500+</span>
                  <span className={classes.statLabel}>Artisan Partners</span>
                </div>
                <div className={classes.statItem}>
                  <span className={classes.statNum}>10,000+</span>
                  <span className={classes.statLabel}>Happy Customers</span>
                </div>
              </div>
            </div>

            <div className={classes.storyImageWrap}>
              <Image
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=85&auto=format&fit=crop"
                alt="Aarkali Handloom Weaving"
                fill
                className={classes.storyImage}
              />
            </div>
          </div>

          <div className={classes.valuesGrid}>
            <div className={classes.valueCard}>
              <SparkleIcon size={28} color="var(--boutique-gold-500)" />
              <h3>Pure Materials</h3>
              <p>We source only pure mulberry silk, organic hand-block cotton, and certified zari for lasting heirloom quality.</p>
            </div>
            <div className={classes.valueCard}>
              <ShieldIcon size={28} color="var(--boutique-gold-500)" />
              <h3>Direct from Artisans</h3>
              <p>Empowering traditional weaving families across India through sustainable, fair-trade partnerships.</p>
            </div>
            <div className={classes.valueCard}>
              <HeartIcon size={28} color="var(--boutique-gold-500)" />
              <h3>Curated with Love</h3>
              <p>Every piece is individually inspected by our stylists for flawless stitching, color fastness, and drape.</p>
            </div>
          </div>

          <div className={classes.ctaBanner}>
            <h2>Experience the Elegance</h2>
            <p>Explore our latest festive and bridal drops crafted for your special moments.</p>
            <Link href="/products" className={classes.primaryBtn}>
              Browse Collections <ArrowRightIcon size={16} />
            </Link>
          </div>
        </Gutter>
      </div>
    )
  }

  // ─── CONTACT US ───────────────────────────────────────────────────────────
  if (slug === 'contact') {
    return (
      <div className={classes.page}>
        <div className={classes.hero}>
          <p className={classes.heroTag}>We&apos;re Here to Help</p>
          <h1 className={classes.heroTitle}>Contact Our Atelier</h1>
          <p className={classes.heroSubtitle}>
            Have questions about sizing, custom orders, or order status? Reach out to our styling consultants.
          </p>
        </div>

        <Gutter className={classes.container}>
          <div className={classes.contactGrid}>
            {/* Contact Information Cards */}
            <div className={classes.contactInfoCol}>
              <h2 className={classes.sectionHeading}>Get in Touch</h2>
              <p className={classes.contactDesc}>
                Our customer support team and boutique stylists are available Monday to Saturday, 9:00 AM – 8:00 PM IST.
              </p>

              <div className={classes.contactCardsList}>
                <a href={`tel:${STORE_PHONE}`} className={classes.contactMethodCard}>
                  <div className={classes.contactIconWrap}><PhoneIcon size={22} /></div>
                  <div>
                    <strong>Call Us Directly</strong>
                    <p>{STORE_PHONE}</p>
                  </div>
                </a>

                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className={classes.contactMethodCard}>
                  <div className={classes.contactIconWrap}><WhatsAppIcon size={22} /></div>
                  <div>
                    <strong>WhatsApp Styling Consultation</strong>
                    <p>Instant chat with our ethnic fashion advisors</p>
                  </div>
                </a>

                <a href={`mailto:${STORE_EMAIL}`} className={classes.contactMethodCard}>
                  <div className={classes.contactIconWrap}><MailIcon size={22} /></div>
                  <div>
                    <strong>Email Support</strong>
                    <p>{STORE_EMAIL}</p>
                  </div>
                </a>

                <div className={classes.contactMethodCard}>
                  <div className={classes.contactIconWrap}><MapPinIcon size={22} /></div>
                  <div>
                    <strong>Boutique Atelier</strong>
                    <p>No. 42 Silk Weaver Avenue, Tamil Nadu, India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Inquiry Form */}
            <div className={classes.contactFormCol}>
              <div className={classes.formCard}>
                <h3 className={classes.formTitle}>Send Us a Message</h3>
                {contactSubmitted ? (
                  <div className={classes.successMsg}>
                    <CheckIcon size={24} color="var(--color-success-500)" />
                    <h4>Thank you for contacting Aarkali!</h4>
                    <p>Our concierge team will review your inquiry and get back to you within 2-4 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={e => { e.preventDefault(); setContactSubmitted(true) }} className={classes.form}>
                    <div className={classes.formRow}>
                      <div className={classes.formGroup}>
                        <label>Your Name *</label>
                        <input type="text" required placeholder="e.g. Priya Sharma" className={classes.formInput} />
                      </div>
                      <div className={classes.formGroup}>
                        <label>Email Address *</label>
                        <input type="email" required placeholder="e.g. priya@example.com" className={classes.formInput} />
                      </div>
                    </div>

                    <div className={classes.formRow}>
                      <div className={classes.formGroup}>
                        <label>Phone Number</label>
                        <input type="tel" placeholder="e.g. +91 98765 43210" className={classes.formInput} />
                      </div>
                      <div className={classes.formGroup}>
                        <label>Subject</label>
                        <select className={classes.formSelect}>
                          <option>Order &amp; Tracking Inquiry</option>
                          <option>Sizing &amp; Tailoring Consultation</option>
                          <option>Returns &amp; Exchanges</option>
                          <option>Bulk / Bridal Orders</option>
                          <option>Other Feedback</option>
                        </select>
                      </div>
                    </div>

                    <div className={classes.formGroup}>
                      <label>Message *</label>
                      <textarea rows={5} required placeholder="How can we assist you today?" className={classes.formTextarea} />
                    </div>

                    <button type="submit" className={classes.submitBtn}>
                      Send Message <ArrowRightIcon size={16} />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Gutter>
      </div>
    )
  }

  // ─── FAQ ──────────────────────────────────────────────────────────────────
  if (slug === 'faq') {
    const FAQ_ITEMS = [
      {
        q: 'How long does delivery take across India?',
        a: 'Standard orders are dispatched within 24-48 hours and delivered within 3-5 business days across all Indian pin codes. Same-Day / Priority dispatch orders are processed within 12 hours.',
      },
      {
        q: 'Is Cash on Delivery (COD) available?',
        a: 'Yes, we offer Cash on Delivery across India with no extra processing fees. You can pay with cash or UPI QR code at your doorstep.',
      },
      {
        q: 'What is your return and exchange policy?',
        a: 'We offer a 7-day hassle-free return and complimentary size exchange policy. Simply initiate a request under Track Order or Contact Us, and our courier partner will arrange doorstep reverse pickup.',
      },
      {
        q: 'Are your sarees and silk garments authentic?',
        a: 'All our silk sarees and handloom garments are sourced directly from traditional artisan clusters and carry Silk Mark / Handloom Mark quality authenticity guarantees.',
      },
      {
        q: 'Do sarees come with blouse fabric?',
        a: 'Yes, all our sarees include an attached matching unstitched blouse piece (0.8 meter) woven from the same luxury silk or coordinate fabric.',
      },
      {
        q: 'How do I track my order status in real time?',
        a: 'You can enter your Order ID or Tracking ID (e.g. TRK...) on our dedicated Track Order page for live timeline updates from dispatch to doorstep delivery.',
      },
    ]

    return (
      <div className={classes.page}>
        <div className={classes.hero}>
          <p className={classes.heroTag}>Help Center</p>
          <h1 className={classes.heroTitle}>Frequently Asked Questions</h1>
          <p className={classes.heroSubtitle}>
            Find quick answers regarding orders, shipping, sizing, returns, and artisan authentications.
          </p>
        </div>

        <Gutter className={classes.container}>
          <div className={classes.faqList}>
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = activeFaq === index
              return (
                <div key={index} className={[classes.faqItem, isOpen && classes.faqItemOpen].filter(Boolean).join(' ')}>
                  <button
                    type="button"
                    className={classes.faqQuestion}
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                  >
                    <span>{item.q}</span>
                    <span className={classes.faqIcon}>{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className={classes.faqAnswer}>
                      <p>{item.a}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className={classes.faqHelpBox}>
            <h3>Still have questions?</h3>
            <p>Our boutique styling team is always available to assist you personally.</p>
            <div className={classes.helpActions}>
              <Link href="/contact" className={classes.primaryBtn}>Contact Support</Link>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className={classes.whatsappBtn}>
                <WhatsAppIcon size={18} /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </Gutter>
      </div>
    )
  }

  // ─── RETURNS & RETURN POLICY ──────────────────────────────────────────────
  if (slug === 'returns' || slug === 'return-policy') {
    return (
      <div className={classes.page}>
        <div className={classes.hero}>
          <p className={classes.heroTag}>Customer Care</p>
          <h1 className={classes.heroTitle}>7-Day Returns &amp; Exchanges</h1>
          <p className={classes.heroSubtitle}>
            We want you to love your ethnic attire. If the fit isn&apos;t perfect, our exchange process is seamless.
          </p>
        </div>

        <Gutter className={classes.container}>
          <div className={classes.policyContent}>
            <div className={classes.policyStepGrid}>
              <div className={classes.policyStep}>
                <span className={classes.stepNum}>1</span>
                <h3>Initiate Request</h3>
                <p>Contact us via WhatsApp or Email within 7 days of receiving your package with your Order ID.</p>
              </div>
              <div className={classes.policyStep}>
                <span className={classes.stepNum}>2</span>
                <h3>Doorstep Pickup</h3>
                <p>Our courier partner will arrange a complimentary pickup from your address within 48 hours.</p>
              </div>
              <div className={classes.policyStep}>
                <span className={classes.stepNum}>3</span>
                <h3>Exchange / Refund</h3>
                <p>Once inspected, your replacement size is dispatched immediately, or 100% refund is processed.</p>
              </div>
            </div>

            <div className={classes.policyGuidelines}>
              <h2>Return Guidelines &amp; Conditions</h2>
              <ul className={classes.guidelinesList}>
                <li>Items must be unused, unwashed, with all original brand tags and dust bags intact.</li>
                <li>Sarees with unstitched blouse pieces must have the blouse fabric attached and uncut.</li>
                <li>Custom-tailored / bespoke altered garments are non-returnable unless defective.</li>
                <li>Refunds for prepaid orders are credited back to the original payment source within 3-5 bank days.</li>
                <li>For COD orders, refunds are transferred securely via UPI or Bank NEFT.</li>
              </ul>
            </div>
          </div>
        </Gutter>
      </div>
    )
  }

  // ─── SIZE GUIDE ───────────────────────────────────────────────────────────
  if (slug === 'size-guide') {
    return (
      <div className={classes.page}>
        <div className={classes.hero}>
          <p className={classes.heroTag}>Fitting &amp; Measurement</p>
          <h1 className={classes.heroTitle}>Ethnic Sizing Guide</h1>
          <p className={classes.heroSubtitle}>
            Accurate body measurements to help you find your perfect ethnic silhouette.
          </p>
        </div>

        <Gutter className={classes.container}>
          <div className={classes.sizeGuideContent}>
            <div className={classes.tableCard}>
              <h2>Women&apos;s Kurti &amp; Suit Size Chart (Inches)</h2>
              <table className={classes.fullSizeTable}>
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>Bust (in)</th>
                    <th>Waist (in)</th>
                    <th>Hip (in)</th>
                    <th>Kurta Length (in)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td><strong>XS (36)</strong></td><td>32" – 33"</td><td>26" – 27"</td><td>36" – 37"</td><td>44"</td></tr>
                  <tr><td><strong>S (38)</strong></td><td>34" – 35"</td><td>28" – 29"</td><td>38" – 39"</td><td>44"</td></tr>
                  <tr><td><strong>M (40)</strong></td><td>36" – 37"</td><td>30" – 31"</td><td>40" – 41"</td><td>45"</td></tr>
                  <tr><td><strong>L (42)</strong></td><td>38" – 39"</td><td>32" – 33"</td><td>42" – 43"</td><td>45"</td></tr>
                  <tr><td><strong>XL (44)</strong></td><td>40" – 41"</td><td>34" – 35"</td><td>44" – 45"</td><td>46"</td></tr>
                  <tr><td><strong>XXL (46)</strong></td><td>42" – 43"</td><td>36" – 37"</td><td>46" – 47"</td><td>46"</td></tr>
                </tbody>
              </table>
            </div>

            <div className={classes.sareeDimensions}>
              <h2>Saree &amp; Dupatta Dimensions</h2>
              <div className={classes.dimGrid}>
                <div className={classes.dimCard}>
                  <h3>Standard Saree</h3>
                  <p><strong>Length:</strong> 5.5 Meters</p>
                  <p><strong>Width:</strong> 44 – 46 Inches</p>
                  <p><strong>Blouse Piece:</strong> 0.8 Meter (Unstitched)</p>
                </div>
                <div className={classes.dimCard}>
                  <h3>Standard Dupatta</h3>
                  <p><strong>Length:</strong> 2.4 – 2.5 Meters</p>
                  <p><strong>Width:</strong> 36 – 40 Inches</p>
                </div>
                <div className={classes.dimCard}>
                  <h3>Lehenga Skirt</h3>
                  <p><strong>Waist:</strong> Up to 42 – 44 Inches (Semi-stitched)</p>
                  <p><strong>Length:</strong> 42 – 44 Inches</p>
                  <p><strong>Flare:</strong> 3.5 – 5.0 Meters</p>
                </div>
              </div>
            </div>
          </div>
        </Gutter>
      </div>
    )
  }

  // ─── SHIPPING POLICY ──────────────────────────────────────────────────────
  if (slug === 'shipping-policy') {
    return (
      <div className={classes.page}>
        <div className={classes.hero}>
          <p className={classes.heroTag}>Delivery Information</p>
          <h1 className={classes.heroTitle}>Shipping &amp; Delivery Policy</h1>
          <p className={classes.heroSubtitle}>
            Fast, secure, and insured express delivery across all 28 states and union territories in India.
          </p>
        </div>

        <Gutter className={classes.container}>
          <div className={classes.policyContent}>
            <div className={classes.shippingCardsGrid}>
              <div className={classes.shippingCard}>
                <TruckIcon size={28} color="var(--boutique-gold-500)" />
                <h3>Free Shipping on ₹999+</h3>
                <p>All orders above ₹999 enjoy free doorstep delivery. Standard shipping fee of ₹99 applies on smaller orders.</p>
              </div>
              <div className={classes.shippingCard}>
                <CreditCardIcon size={28} color="var(--boutique-gold-500)" />
                <h3>Cash on Delivery</h3>
                <p>Available on orders up to ₹25,000 across 25,000+ PIN codes with zero additional payment surcharge.</p>
              </div>
              <div className={classes.shippingCard}>
                <ShieldIcon size={28} color="var(--boutique-gold-500)" />
                <h3>Insured Transit</h3>
                <p>Every shipment is packed in tamper-proof boutique boxes with live SMS and WhatsApp tracking.</p>
              </div>
            </div>

            <div className={classes.policyGuidelines}>
              <h2>Estimated Delivery Times</h2>
              <ul className={classes.guidelinesList}>
                <li><strong>Metro Cities (Chennai, Bangalore, Mumbai, Delhi, Hyderabad, Kolkata):</strong> 2 to 3 business days.</li>
                <li><strong>Tier-2 &amp; Tier-3 Cities:</strong> 3 to 5 business days.</li>
                <li><strong>North-East &amp; Remote Locations:</strong> 5 to 7 business days.</li>
              </ul>
            </div>
          </div>
        </Gutter>
      </div>
    )
  }

  // ─── PRIVACY POLICY & TERMS ───────────────────────────────────────────────
  return (
    <div className={classes.page}>
      <div className={classes.hero}>
        <p className={classes.heroTag}>Legal &amp; Trust</p>
        <h1 className={classes.heroTitle}>{slug === 'terms' ? 'Terms of Service' : 'Privacy Policy'}</h1>
        <p className={classes.heroSubtitle}>
          {STORE_NAME} is committed to transparent customer policies and bank-grade data security.
        </p>
      </div>

      <Gutter className={classes.container}>
        <div className={classes.legalContent}>
          <h2>1. Overview</h2>
          <p>
            This website is operated by {STORE_NAME}. Throughout the site, the terms &ldquo;we&rdquo;, &ldquo;us&rdquo; and &ldquo;our&rdquo; refer to {STORE_NAME}. We offer this website, including all information, tools, and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, and policies stated here.
          </p>

          <h2>2. Data Protection &amp; Security</h2>
          <p>
            Your personal information is encrypted via 256-bit SSL protocols. We never store credit card or net banking details on our servers. All transactions are securely processed via Razorpay.
          </p>

          <h2>3. Intellectual Property</h2>
          <p>
            All content on this site including photography, logo designs, textiles catalog, and brand typography is the exclusive property of {STORE_NAME}.
          </p>

          <h2>4. Contact Us</h2>
          <p>
            If you have questions regarding these terms, please contact us at <a href={`mailto:${STORE_EMAIL}`}>{STORE_EMAIL}</a> or call {STORE_PHONE}.
          </p>
        </div>
      </Gutter>
    </div>
  )
}
