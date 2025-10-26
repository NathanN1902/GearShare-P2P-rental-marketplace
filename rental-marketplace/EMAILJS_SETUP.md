# EmailJS Setup Guide

This guide will help you set up EmailJS to send automated booking notification emails to tool owners.

## Step 1: Create a Free EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

## Step 2: Add an Email Service

1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the instructions to connect your email account
5. Copy the **Service ID** (e.g., "service_abc123")

## Step 3: Create an Email Template

1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"
3. Use the following template structure:

**Subject:**
```
New Booking Request for {{tool_name}}
```

**Content:**
```
Hello {{owner_name}},

You have received a new booking request for your tool: {{tool_name}}

Booking Details:
- Renter Name: {{renter_name}}
- Renter Email: {{renter_email}}
- Start Date: {{start_date}}
- End Date: {{end_date}}
- Duration: {{days}} day(s)
- Price per Day: ${{price_per_day}}
- Total Price: ${{total_price}}

Please contact the renter at {{renter_email}} to confirm the booking.

Best regards,
GearShare Team
```

4. Save the template and copy the **Template ID** (e.g., "template_xyz789")

## Step 4: Get Your Public Key

1. Go to "Account" → "General"
2. Find your **Public Key** (e.g., "a1b2c3d4e5f6g7h8")

## Step 5: Update the Code

Open `src/features/tool/pages/ToolDetails.tsx` and update these lines (around line 10-12):

```typescript
const EMAILJS_SERVICE_ID = "service_YOUR_ID"; // Replace with your Service ID
const EMAILJS_TEMPLATE_ID = "template_YOUR_ID"; // Replace with your Template ID
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY"; // Replace with your Public Key
```

Replace with your actual IDs:
```typescript
const EMAILJS_SERVICE_ID = "service_abc123"; // Your actual Service ID
const EMAILJS_TEMPLATE_ID = "template_xyz789"; // Your actual Template ID
const EMAILJS_PUBLIC_KEY = "a1b2c3d4e5f6g7h8"; // Your actual Public Key
```

## Step 6: Update Owner Email (Optional)

In the same file, find this line (around line 137):

```typescript
to_email: "owner@example.com", // TODO: Replace with actual owner email
```

You can either:
- Hardcode a specific email for testing
- Later implement a system where each tool owner has their own email stored in the tool data

## How It Works

When a user submits a booking request:

1. The booking data is saved to `localStorage` (stored in the browser)
2. An email is automatically sent to the owner via EmailJS
3. The email contains all the booking details
4. The owner can then contact the renter to confirm

## Free Tier Limits

EmailJS free tier includes:
- 200 emails per month
- All features included
- No credit card required

This should be more than enough for an MVP!

## Troubleshooting

If emails aren't sending:
1. Check browser console for errors
2. Verify all IDs are correct
3. Make sure your email service is properly connected in EmailJS dashboard
4. Check your spam folder

## Alternative: Skip Email for Now

If you want to test without setting up email:
- The booking system still works!
- Bookings are saved to localStorage
- You'll just see a message saying "Email notification failed"
- You can set up EmailJS later when you're ready
