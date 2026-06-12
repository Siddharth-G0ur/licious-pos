# Licious Retail POS — Product Flow Documentation

> This document describes the complete interaction flows of the Licious Retail Store POS prototype as it exists today. It covers both the store operator (POS) side and the customer-facing microsite side. The technical section at the end describes how the prototype is built for demo purposes only — actual implementation decisions are for engineering to determine.

---

## Table of Contents

1. [Overview](#1-overview)
2. [User Roles](#2-user-roles)
3. [Store Operator Flow](#3-store-operator-flow)
   - 3.1 CTO Queue
   - 3.2 Creating a New Order
   - 3.3 Order Management
4. [Customer Microsite Flow](#4-customer-microsite-flow)
5. [Order Status Lifecycle](#5-order-status-lifecycle)
6. [Prototype Notes](#6-prototype-notes)

---

## 1. Overview

This prototype models the **CTO (Customer-To-Order)** flow at a Licious retail store. A store operator creates orders on behalf of walk-in or remote customers, sends a payment link, and manages the order through to delivery. Customers receive a link that opens a mobile microsite where they pay and track their order.

The prototype runs as a single web app at `localhost:7824`. The POS and the customer microsite are both served from the same app but operate on different URL paths.

| Path | What it is |
|---|---|
| `/` | Store operator POS (CTO Queue + Order creation) |
| `/pay/:orderId` | Customer microsite for a specific order |

---

## 2. User Roles

### Store Operator
The person at the Licious retail store. Uses the POS to:
- Create CTO orders on behalf of customers
- Send payment links via SMS and WhatsApp
- Track and manage orders through packing, dispatch, and delivery

### Customer
Receives a payment link (SMS/WhatsApp) and uses the mobile microsite to:
- Select a delivery address
- Review their order and pay
- Track delivery status in real time
- Rate the experience after delivery

---

## 3. Store Operator Flow

### 3.1 CTO Queue

The queue is the home screen of the POS. It has three panels:

**Left nav bar** — vertical icon-based navigation (placeholder in prototype; only CTO Orders is active).

**Queue panel (middle)** — lists all CTO orders for the current store session. At the top is a row of filter tabs:

| Tab | Shows |
|---|---|
| All | Every order regardless of status |
| Unpaid | Link Sent, Link Opened, Payment Pending |
| Paid | Paid, Packing, Ready for Pickup |
| In Transit | Out for Delivery |

Each order card in the list shows: masked phone number, order ID, time ago, status badge, and order value. Clicking a card selects it and loads it in the detail panel.

**Detail panel (right)** — shows the full order when one is selected: order ID, full phone number, time, status badge, status stepper, item table with subtotal/delivery/total breakdown, delivery address (once confirmed), logistics info (if booked), payment info (if paid), and an action button that changes based on current status.

At the top right of the header is a 3×3 grid menu with placeholder entries for Inventory and Order History. A new order is started by clicking the "New CTO Order" button in the queue panel header.

---

### 3.2 Creating a New Order

Creating an order is a 4-step full-page flow that overlays the queue. The operator can abort at any point before Step 4.

#### Step 1 — Customer Detail

A centered card with:

- **Phone input** — accepts a 10-digit mobile number. A clear (×) button appears once any digit is entered. The Submit button is disabled until exactly 10 digits are entered.
- **Order type radio** — In-Store or Remote. Remote is pre-selected. (In this prototype, both types proceed to the same catalog flow.)
- **Order As Guest** — skips phone entry and proceeds directly to the catalog with no customer on record.
- **Submit** — validates the phone and advances to Step 2.

When Submit is pressed with a known phone number, the system checks a local customer database. If the customer has a previous order on record, a "Use last order as template" option appears, allowing the operator to pre-fill the cart with that order's items and skip directly to the cart step.

#### Step 2 — Products + Cart

Split into a catalog (left) and a cart panel (right).

**Subheader bar** (spans full width):
- Customer phone number (masked, e.g. ••••8734)
- Customer name (editable inline, shows "New User" if not found)
- Token number input field
- Order History button (placeholder)
- Abort Order (×) — clears the flow and returns to the queue

**Catalog (left side):**
- "All Items" title with a search pill in the top-right corner
- Category filter tabs as horizontal scrollable pills with product category image + label. Categories: All, Chicken, Mutton, Fish & Seafood, Eggs, Ready to Cook, Meat Masala
- "All" is the first tab and shows everything
- Product grid: each card shows a product image, PLU code, name, and price per unit/kg
- Tapping a product with unit-based pricing (e.g. eggs) adds it directly to the cart, incrementing quantity on repeat taps
- Tapping a product with kg-based pricing opens the **Weight Modal**

**Weight Modal:**
- Shows product name and per-kg rate
- A numeric input pre-filled with 1.000 kg; a live price updates as the operator types
- Confirm adds the item to the cart (or updates the weight if the item is already in the cart)

**Cart (right side):**
- Step indicator: ① ② showing current position (Step 2 = building cart)
- "New Order" title, "Clear Cart" red text link top-right
- Empty state: "Scan barcode to add items"
- Each cart item row: product name | weight input (inline editable for kg items) | calculated price | trash icon to remove
- Cart footer: item count | shipping charge | total (in red bold) | "Proceed to Pay" button (disabled when cart is empty)
- **Shipping:** ₹49 for orders under ₹1,000. Free for orders ₹1,000 and above. ₹0 when cart is empty. This applies to both In-Store and Remote order types in the prototype — shipping logic per order type is to be confirmed for production.

#### Step 3 — Order Payment

The catalog stays on the left (operator can still add/remove items). The right panel switches to a payment review:

- Step indicator advances to ②
- Bill summary: item total, shipping charges (with dashed separator), net payable amount in red
- "Proceed to Pay (Via send link)" button — triggers the link generation

When the button is pressed, a 2.2-second simulated API call runs (loading state on button), then the order is created in the system and the flow advances to Step 4.

#### Step 4 — Success Screen

A centered card confirming the link was sent:

- Green checkmark icon
- "Order Confirmation Link successfully sent via SMS and WhatsApp"
- Summary pill: Phone number | Amount
- **Resend Link** button — triggers a toast notification ("Payment link resent!")
- **View Orders** button — closes the create flow and returns to the queue (the new order appears at the top of the queue with status "Payment Pending")
- **Demo · Preview customer flow** — a small, muted text link at the bottom of the card (below a hairline separator) that opens the customer microsite for this order in a new tab. This is a demo aid and is not part of the production design.

---

### 3.3 Order Management

Once an order is in the queue, the operator manages it from the detail panel. The action button in the detail panel changes at each stage.

#### Status Progression and Actions

| Current Status | Action Button | Result |
|---|---|---|
| Payment Pending / Link Sent / Link Opened | Cancel Order | Opens cancel confirmation modal → sets status to Cancelled |
| Paid | Mark as Packing | Sets status to Packing |
| Packing | Mark Ready for Pickup | Sets status to Ready for Pickup |
| Ready for Pickup | Confirm Handover to Delivery | Opens the OTP handover modal |
| Out for Delivery (manual mode only) | Mark as Delivered | Sets status to Delivered |
| Out for Delivery (Shiprocket booked) | — no button — | Delivery is handled externally |

#### Handover OTP Modal

When the operator clicks "Confirm Handover to Delivery":

- A modal appears over the detail panel with a 4-digit OTP input
- The OTP is entered one digit at a time; focus auto-advances between fields and auto-backtracks on delete
- Entering the correct OTP (demo: 1234) sets the order to Out for Delivery and shows a success toast
- Entering a wrong OTP shows an inline error: "Incorrect OTP. Try 1234 for demo."
- The modal can be dismissed by clicking the backdrop or Cancel

#### Status Stepper

The detail panel shows a horizontal stepper tracking the order's position across these stages:
`Link Sent → Paid → Packing → Ready for Pickup → Out for Delivery → Delivered`

"Payment Pending" maps visually to the "Link Sent" position on the stepper.

#### Shiprocket Integration (simulated)

When an order reaches Out for Delivery with a successful Shiprocket booking, the detail panel shows a **Logistics section** with: Shiprocket AWB number, courier partner name, and pickup ETA. There is no action button — the operator has no further action; delivery is tracked externally through Shiprocket.

If an order has `sr.status = 'failed'`, a red warning bar appears in the detail panel:
> "Shiprocket booking failed — auto-retry exhausted"

With two actions:
- **Retry** — simulates a re-booking attempt (1.4s delay), sets `sr.status = 'ok'` with a generated AWB number, and shows a success toast
- **Manual Delivery** — opens the Manual Delivery modal

#### Manual Delivery Modal

When the operator selects Manual Delivery:
- A modal with an ETA time input appears
- Submitting sets the order to Out for Delivery with `sr.status = 'manual'` and the entered ETA
- Orders in manual delivery mode show a "Mark as Delivered" button (since there is no external partner to track)

#### Cancel Order

Only available when the order is unpaid (statuses: Payment Pending, Link Sent, Link Opened).
- Opens a confirmation modal
- Confirming sets status to Cancelled
- Cancelled orders remain visible in the queue (shown in the "All" tab)

---

## 4. Customer Microsite Flow

The customer receives a link in the format `/pay/:orderId`. Opening the link on any device loads a mobile-optimised microsite (max width 440px, centred on desktop).

If the order ID in the URL does not match any known order, the microsite shows a "Link not found" error state.

The microsite resets to the start of its own flow each time the page loads (address select), regardless of where it was when last viewed.

### 4.1 Address Selection

**Header:** Licious logo (left) | order summary pill showing item count and total (right). No cart emoji.

Below the header:
- Page title: "Deliver to" with subtitle "Choose a saved address or add a new one"
- A list of saved address cards (3 pre-loaded: Home, Office, Parents). Each card shows a radio button, address label in red caps, first line of address in bold, and second line in grey.
- Selecting a card highlights it with a red border and fills the radio dot
- "Add New Address" button at the bottom (dashed red border)
- Fixed footer with "Continue to Checkout" CTA — disabled until an address is selected

### 4.2 Add New Address (optional path)

If the customer taps "Add New Address":
- A back button appears at the top
- A form with fields: Flat / House No., Area / Street, Pincode, City (pincode and city in a 2-column grid)
- "Save Address" button at the bottom — saves the new address, selects it, and navigates to Checkout

### 4.3 Checkout

Shows the selected delivery address in a box with a "Change" link (navigates back to address select).

Below it:
- Order items list with name, quantity, and price per item
- Bill summary: item total | delivery charge (or "Free" in green) | dashed divider | "Total" in bold

Fixed footer with "Pay ₹[amount]" CTA.

### 4.4 Payment Processing

Tapping Pay:
- Screen transitions to a processing state: a red spinning loader, "Redirecting to Razorpay…", "Please wait while we set up your payment"
- After 2 seconds this auto-transitions to the payment success screen

### 4.5 Post-Payment: Delivery Tracker

When the payment success screen mounts:

**Payment Successful modal (auto-dismisses in 2 seconds):**
- Dark semi-transparent overlay
- Centred white card with a CSS checkmark in a green circle, "Payment Successful" heading, "Your order has been confirmed" subtext
- No user action required; the modal fades out automatically

**After modal dismissal — Delivery Tracker:**

- Section title: "Order Status" with the order ID shown as a pill below it
- A 3-stage vertical stepper:

| Stage | Label | Shown when active |
|---|---|---|
| 1 | Order is getting packed | "Estimated time: X mins" in red below the label |
| 2 | Order is out for delivery | "Estimated arrival: X mins" in red below the label |
| 3 | Order delivered successfully | — |

Stepper visual states:
- **Completed stage** — green filled dot with white checkmark, green connecting line
- **Active stage** — red filled dot with a pulsing red ring animation; label in black bold
- **Pending stage** — empty grey dot, grey connecting line; label in light grey

The active stage advances in real time as the store operator updates the order status on the POS (changes sync via localStorage across browser tabs).

Below the tracker, the order summary and bill breakdown remain visible (same as checkout screen, now showing "Total paid" with the amount in green).

**ETA countdown:** Starts at 35 minutes when payment is confirmed and counts down by 1 minute every real minute.

### 4.6 Delivered Screen

When the store operator marks the order as Delivered, the microsite auto-transitions to the Delivered screen (detected via cross-tab localStorage sync).

The Delivered screen shows:
- A CSS checkmark icon in a green circle (pop-in animation)
- "Delivered!" heading
- Red underline divider
- "Your order was delivered successfully. Thank you for shopping with Licious!"
- "What you ordered" section listing all items and their prices

**Rating:**
- "Rate your experience" label
- 5 hollow star characters (Unicode ★); hovering highlights them in gold; clicking locks in the rating
- Stars fill gold up to the selected rating

**Conditional feedback question (appears after a star is selected):**

| Rating | Question shown |
|---|---|
| 1–3 | "What could be better?" with placeholder "Let us know how we can improve…" |
| 4–5 | "What did you like?" with placeholder "Freshness, packaging, delivery speed…" |

The question swaps instantly if the customer changes their star rating before submitting.

**Mark as Done button** — appears below the textarea. Tapping it:
- Hides the rating and feedback form
- Replaces it with: "Thank you for your feedback!" (green) and "Your response helps us serve you better." (grey)

The Licious logo appears faintly at the bottom of the screen throughout.

**Demo simulator panel** — a fixed dark pill at the bottom of the screen during the payment-success screen. Allows testers to advance the order status (Order getting packed → Out for delivery → Delivered) without switching to the POS tab. Only visible during active demo sessions; not part of the customer-facing design.

---

## 5. Order Status Lifecycle

```
Payment Pending
      │
      ▼
  Link Sent  ──────► Cancelled
      │
      ▼
 Link Opened
      │
      ▼
    Paid
      │
      ▼
   Packing
      │
      ▼
Ready for Pickup
      │
      ▼  (OTP verified)
Out for Delivery
      │
      ▼
  Delivered
```

**Status visibility on the customer microsite:**

| POS Status | Tracker Stage Active |
|---|---|
| Payment Pending / Link Sent / Link Opened / Paid / Packing | Stage 1 — Order is getting packed |
| Out for Delivery | Stage 2 — Order is out for delivery |
| Delivered | Stage 3 — Order delivered successfully (+ auto-transition to Delivered screen) |

---

## 6. Prototype Notes

This prototype is built for **demonstration and product alignment purposes only**. The following describes what is simulated and what would require real engineering decisions in production.

### What is simulated

| Feature | How it works in prototype | What production would need |
|---|---|---|
| SMS / WhatsApp link delivery | Shown as confirmed on screen; no message is actually sent | Integration with an SMS/WhatsApp gateway |
| Payment processing | A 2-second loading screen transitions automatically to payment success | Razorpay or equivalent payment gateway integration |
| Customer phone lookup | A hardcoded local database (`CUSTOMER_DB`) | Real customer database lookup via API |
| Shiprocket booking | Simulated success/failure with a random AWB number | Actual Shiprocket API integration |
| OTP for handover | Fixed demo OTP: 1234 | OTP generation and delivery service |
| ETA countdown | Counts down at 1-minute real-time intervals from 35 mins | Real logistics ETA from delivery partner |
| Cross-tab sync | Uses browser localStorage to keep the POS and microsite in sync within the same browser | Real-time push (e.g. WebSockets, polling, or push notifications) |
| Feedback submission | Stored in local React state; lost on page refresh | Backend to collect and store ratings and feedback |

### What is not implemented

- Product variant selection (choosing between related cut/weight variants after weight entry)
- In-Store vs Remote order type distinction (both currently follow the same flow)
- Back navigation from the product catalog back to the customer detail step
- Customer name lookup (always shows "New User")
- Inventory and Order History views (grid menu items are placeholders)
- Real Shiprocket booking flow (retry works in simulation only)
- Token number (field exists in the subheader but has no logic attached)

### Prototype tech stack

The prototype runs on Vite + React 18. State is managed with Zustand (three stores: order management, create flow, microsite). Orders and the order counter are persisted to `localStorage` so the queue survives page refreshes within the same browser session. All other state is in-memory and resets on reload.

This stack was chosen for speed of prototyping. The actual production stack is to be determined by engineering.
