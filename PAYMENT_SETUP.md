# Payment System Setup Guide

## Overview
This guide explains how to set up the Razorpay payment integration for the HR Resume Analysis system.

## Prerequisites
1. Razorpay account (https://razorpay.com)
2. Django backend running with payment models
3. Next.js frontend running

## Setup Steps

### 1. Razorpay Account Setup
1. Sign up for a Razorpay account
2. Go to Settings > API Keys
3. Generate a new API key pair
4. Note down your Key ID and Key Secret

### 2. Frontend Environment Configuration
1. Copy `env.example` to `.env.local`
2. Update the Razorpay key:
   ```bash
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_KEY_HERE
   ```

### 3. Django Backend Configuration
1. Update `hr_resume/hr_resume/settings.py`:
   ```python
   # Razorpay Configuration
   RAZORPAY_KEY_ID = 'rzp_test_YOUR_ACTUAL_KEY_HERE'
   RAZORPAY_KEY_SECRET = 'YOUR_ACTUAL_SECRET_HERE'
   ```

### 4. Test the Integration
1. Start Django backend: `python manage.py runserver`
2. Start Next.js frontend: `npm run dev`
3. Navigate to `/company-admin/payment-plans`
4. Select a plan and test payment

## Payment Flow
1. **User selects plan** → Frontend shows plan details
2. **User clicks "Select Plan"** → Confirmation modal appears
3. **User clicks "Proceed to Payment"** → Frontend creates order via Django API
4. **Razorpay window opens** → User completes payment
5. **Payment success** → Frontend verifies payment with Django
6. **Credits added** → Company receives credits for global resume views

## Testing
- Use Razorpay test mode for development
- Test cards: 4111 1111 1111 1111
- Test UPI: success@razorpay

## Troubleshooting
- **Payment window not opening**: Check Razorpay script loading in browser console
- **API errors**: Verify Django backend is running and URLs are correct
- **Signature verification fails**: Check Razorpay keys in both frontend and backend

## Production Deployment
1. Switch to Razorpay live mode
2. Update environment variables with live keys
3. Configure webhook URLs in Razorpay dashboard
4. Test with small amounts first
