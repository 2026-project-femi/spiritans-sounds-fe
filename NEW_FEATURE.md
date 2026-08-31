TREASURES UNVEILER PUBLICATION AUTHOR PUBLISHING & SALES DASHBOARD
Project Objective
Create an integrated Author Publishing, Book Sales and Royalty Management System within the existing Spiritans Sound website:
www.spiritanssound.com
The system should allow Spiritans Sound to receive and publish eBooks on behalf of authors, while giving every approved author a secure personal dashboard where they can transparently monitor their book sales, deductions and earnings.
The system must be designed around transparency, simplicity, security and accountability.
Spiritans Sound will remain the publisher/platform administrator. Authors will not directly publish books to the website. All books must be submitted to and approved by the Spiritans Sound publishing administrator before publication.

1. AUTHOR BOOK SUBMISSION
   Create a dedicated "Publish Your Book" page.
   The page should explain briefly:
   • Spiritans Sound accepts selected eBooks for publication.
   • Authors submit their materials to Spiritans Sound.
   • Spiritans Sound reviews and publishes approved books.
   • Authors receive access to an Author Dashboard after their book is approved and published.
   • Authors can monitor sales and earnings transparently.
   Submission Form
   The author should provide:
   • Full name
   • Email address
   • Phone number
   • Country
   • Author/publication name
   • Book title
   • Book category/genre
   • Short book description
   • Short author biography
   • Book PDF upload
   • Book cover upload
   • Selling price
   • Bank/payment details where required
   • Confirmation that the author owns or has permission to publish the submitted material
   • Acceptance of the submission terms
   After submission, display:
   "Thank you. Your book submission has been received and is awaiting review by the Spiritans Sound Publishing Team."
   Send an automatic confirmation email to the author.
2. ADMIN PUBLISHING DASHBOARD
   Create a secure Administrator Dashboard for Spiritans Sound.
   The administrator should be able to:
   Author Management
   • View all authors
   • Search authors
   • Approve/reject author applications
   • Create author accounts
   • Suspend/deactivate accounts
   • Reset author passwords
   • Assign authors to books
   • Identify authors as:
   ◦ Standard Author
   ◦ Young Creator/Mentored Author
   Book Management
   For every book:
   • Book title
   • Author
   • Cover
   • PDF/eBook file
   • Description
   • Author biography
   • Category
   • Price
   • Publication date
   • Status:
   ◦ Draft
   ◦ Under Review
   ◦ Approved
   ◦ Published
   ◦ Suspended
   ◦ Archived
   The administrator must have the ability to edit book information, change prices, unpublish a book or temporarily suspend sales.

3. AUTHOR ACCOUNT
   Once a book has been approved for publication, create a secure author account.
   Each author receives:
   Email/Username + Password
   The author should be able to log in from:
   www.spiritanssound.com/author-login
   Do not allow authors to access the administrator dashboard.

4. AUTHOR DASHBOARD
   The Author Dashboard should be clean, simple and mobile-friendly.
   At the top display:
   Welcome, [Author Name]
   Then show summary cards:
   SALES
   • Total Books Sold
   • Total Gross Sales
   • Payment Processing Fees
   • Spiritans Sound Commission
   • Author Net Earnings
   • Amount Already Paid
   • Outstanding Balance
   Example:
   Books Sold: 47
   Gross Sales: ₦235,000
   Payment Fees: ₦8,000
   Spiritans Sound Commission: ₦34,050
   Author Earnings: ₦192,950
   Paid to Author: ₦150,000
   Balance: ₦42,950
   These figures must be generated automatically from actual transactions.

5. SALES TRANSACTION TABLE
   Create a detailed sales history.
   Columns:
   • Date
   • Transaction ID
   • Book
   • Customer/payment reference
   • Sale price
   • Payment method
   • Payment processing fee
   • Spiritans Sound commission
   • Author earnings
   • Transaction status
   Possible statuses:
   • Successful
   • Pending
   • Refunded
   • Failed
   • Chargeback
   Authors should be able to filter sales by:
   • Date
   • Month
   • Year
   • Book
   • Transaction status
   Allow authors to download their sales statement as PDF or CSV.

6. MULTIPLE BOOKS
   An author may publish more than one book.
   The dashboard should therefore have a:
   "My Books"
   section.
   For each book display:
   • Cover
   • Title
   • Price
   • Publication date
   • Total copies sold
   • Gross revenue
   • Author earnings
   • Current status
   Clicking a book should open a detailed sales report for that particular title.

7. AUTOMATIC FINANCIAL CALCULATION
   The system must distinguish between:
   A. Gross Book Sale
   The actual amount paid by the customer.
   B. Payment Processing Fee
   The actual amount charged by the payment provider.
   C. Treasures Unveiler Commission
   The percentage retained by Spiritans Sound under the applicable author agreement.
   D. Author Net Earnings
   The amount remaining for the author.
   Do NOT simply display one combined deduction.
   The author should be able to see exactly how their money was calculated.
   Example
   Book price:
   ₦5,000
   Payment processing fee:
   ₦175
   Amount after payment processing:
   ₦4,825
   Spiritans Sound commission:
   15% = ₦723.75
   Author earning:
   ₦4,101.25
   The exact calculation should be stored against the transaction.

8. FLEXIBLE COMMISSION SYSTEM
   Do not hard-code the commission permanently into the website.
   Create an administrator-controlled commission system.
   For example:
   Standard Author: 15%
   Young Creator/Mentored Author: 0%
   The administrator should be able to change the applicable rate where necessary.
   The system should record the commission rate applicable to each transaction at the time of sale, so that changing the rate in the future does NOT alter historical transactions.
   This is extremely important for accurate accounting.

9. YOUNG CREATORS — 0% TREASURES UNVEILER COMMISSION
   Create a special author category:
   Young Creator / Mentored Author
   Authors formally participating in Treasures’ Unveiler youth mentoring/development programme should automatically receive:
   Treasures Unveiler Commission: 0%
   Only applicable third-party payment-processing charges should be deducted from their sales.
   This reflects Treasures Unveiler’s NGO mission of empowering young creators.
   The administrator should be able to assign or remove this status.

10. PAYMENT PROCESSING
    Integrate the website with the selected payment gateway(s), such as Paystack and/or Stripe.
    The system must capture the actual payment-processing fee associated with each transaction, rather than assuming that every transaction has the same fee.
    Where the payment provider supplies transaction and fee information through its API/webhooks, retrieve and store this information automatically.
    Do not present payment-provider charges as Spiritans Sound charges.
    They must appear separately in the author's sales statement.

11. CUSTOMER BOOK PURCHASE
    Create a simple book sales page.
    Each book page should display:
    • Book cover
    • Title
    • Author
    • Short description
    • Author biography
    • Price
    • "Buy Now" button
    • Secure payment
    • Download/access instructions after successful payment
    After successful payment: 1. Confirm payment. 2. Record transaction. 3. Calculate applicable fees. 4. Calculate Spiritans Sound commission. 5. Calculate author's earnings. 6. Give the customer secure access to the eBook. 7. Update the author's dashboard automatically.

12. SECURE EBOOK DELIVERY
    Do NOT expose the PDF's direct public URL.
    The eBook should be stored securely.
    After payment, the customer should receive controlled access to the purchased book.
    Where technically possible:
    • Use expiring download links.
    • Prevent directory/public-file browsing.
    • Record downloads.
    • Limit excessive downloads.
    • Protect the original uploaded PDF.
    The author should NOT be able to see customer personal/payment information beyond what is legally and operationally necessary.

13. AUTHOR PAYOUT SYSTEM
    Create an Earnings & Payments section.
    Display:
    • Total earnings
    • Available for payment
    • Previous payments
    • Payment date
    • Amount
    • Payment reference
    • Payment status
    Statuses:
    • Pending
    • Processing
    • Paid
    • Failed
    The system should allow Spiritans Sound to operate either:
    Option A — Manual payout
    Admin reviews earnings and makes author payments manually.
    Option B — Automated payout
    Integrate an appropriate payout system later.
    Build the architecture so that automated payouts can be added without redesigning the entire system.

14. PAYMENT THRESHOLD
    Create an administrator setting for:
    Minimum Author Payout Threshold
    Example:
    ₦10,000
    If an author's balance has not reached the threshold, the amount remains in their account and carries forward.
    The administrator should be able to change this threshold.

15. REFUNDS AND CHARGEBACKS
    If a customer receives a refund:
    • Reverse the corresponding sale.
    • Update the author's earnings.
    • Mark the transaction as refunded.
    • Ensure the author is not paid twice for a reversed transaction.
    All financial adjustments should be recorded in the transaction history.
    Do not delete financial transactions.
    Use statuses and adjustment records so that there is a complete audit trail.

16. MONTHLY AUTHOR STATEMENT
    Automatically generate a monthly statement for each author.
    The statement should contain:
    Spiritans Sound Author Sales Statement
    Author: [Name]
    Period: August 2026
    Book | Copies Sold | Gross Sales | Payment Fees | Spiritans Sound Commission | Author Earnings
    At the bottom:
    Total Author Earnings
    Amount Paid
    Outstanding Balance
    Allow the author to download the statement as PDF.

17. AUTHOR NOTIFICATIONS
    Send automatic emails for:
    • Account created
    • Book approved
    • Book published
    • First sale
    • New sale
    • Payment made
    • Monthly statement available
    • Refund/chargeback
    • Book temporarily suspended
    Authors should be able to manage notification preferences where appropriate.

18. ADMIN FINANCIAL DASHBOARD
    The administrator should have a complete financial overview.
    Display:
    • Total books
    • Total authors
    • Total sales
    • Total gross revenue
    • Total payment-processing fees
    • Total Spiritans Sound commission
    • Total author earnings
    • Total paid to authors
    • Outstanding author liabilities
    Include charts for:
    • Sales by month
    • Revenue by book
    • Revenue by author
    • Best-selling books
    • Young Creator sales
    • Standard Author sales

19. AUDIT TRAIL
    Every important financial or administrative action should be recorded.
    Examples:
    • Book uploaded
    • Book approved
    • Price changed
    • Book published
    • Sale recorded
    • Refund processed
    • Commission changed
    • Author category changed
    • Author payment made
    Record:
    • Date/time
    • User/admin responsible
    • Action
    • Previous value
    • New value
    Financial records should never simply be deleted.

20. SECURITY
    Implement:
    • Secure password hashing
    • Password reset
    • Email verification
    • Role-based permissions
    • Admin/Author separation
    • Secure sessions
    • HTTPS
    • Protection against unauthorized book downloads
    • Protection against SQL injection
    • Protection against common web attacks
    • Rate limiting for login attempts
    • Automatic logout/session expiry
    Consider two-factor authentication for administrators.

21. USER ROLES
    Create at least these roles:
    Super Administrator
    Full access.
    Publishing Administrator
    Can manage authors, books and publishing.
    Finance Administrator
    Can view sales, financial reports and author payments.
    Author
    Can view only their own books, sales and earnings.
    Customer
    Can purchase and access books they have purchased.

22. WEBSITE PAGES
    Create the following pages:
    Public
    • Books
    • Book Details
    • Author Profile
    • Publish Your Book
    • Publishing Terms
    • FAQ
    • Contact
    Author
    • Author Login
    • Author Dashboard
    • My Books
    • Sales
    • Earnings
    • Payments
    • Statements
    • Profile
    • Change Password
    Admin
    • Admin Dashboard
    • Authors
    • Books
    • Submissions
    • Orders/Sales
    • Payments
    • Payouts
    • Reports
    • Commission Settings
    • Young Creators
    • Audit Logs
    • Website Settings

23. AUTHOR TERMS AND TRANSPARENCY
    Create a dedicated Author Publishing Terms page.
    It should clearly explain:
    • Spiritans Sound publishes approved books on behalf of authors.
    • Authors retain ownership/copyright of their works unless a separate written agreement states otherwise.
    • Payment-processing fees are separate from Spiritans Sound's commission.
    • Standard authors are subject to the agreed Spiritans Sound commission.
    • Young Creators/Mentored Authors are exempt from Spiritans Sound's commission.
    • Authors can monitor their sales through their dashboard.
    • Refunds and chargebacks may affect reported earnings.
    • Author payments follow the stated payout schedule and threshold.
    • The terms may be updated with appropriate notice.
    The final legal wording should be reviewed before publication.

24. DESIGN
    The dashboard should look professional but remain simple.
    Use the existing Spiritans Sound branding.
    The system should be:
    • Mobile responsive
    • Desktop responsive
    • Tablet responsive
    • Fast
    • Accessible
    • Easy for authors who are not technically sophisticated
    The dashboard should feel like a professional publishing platform rather than a complicated accounting application.

25. IMPORTANT FINANCIAL PRINCIPLE
    The system must maintain this distinction throughout:
    CUSTOMER PAYMENT
    ↓
    PAYMENT PROCESSING FEE
    ↓
    AMOUNT AVAILABLE FOR DISTRIBUTION
    ↓
    SPIRITANS SOUND COMMISSION
    ↓
    AUTHOR EARNINGS
    ↓
    AUTHOR PAYOUT
    Every transaction must have an immutable record of these values.
    The author should never have to guess:
    "How much did my book actually make?"
    The dashboard should answer that question immediately.

26. FUTURE EXPANSION
    Build the system so that it can later support:
    • Paperback sales
    • Audiobooks
    • Multiple currencies
    • International authors
    • Discount codes
    • Promotional campaigns
    • Book bundles
    • Affiliate/referral sales
    • Author profile pages
    • Author ranking/bestseller lists
    • Pre-orders
    • Subscription/membership options
    • VAT/tax reporting
    • Advanced analytics
    • Multiple payment gateways
    Do not overcomplicate Version 1, but ensure the database and architecture can support these features later.

FINAL REQUIREMENT
Do not build this as a simple static author page.
Build it as a proper publishing and royalty-management system integrated into the existing Spiritans Sound website.
The most important principles are:
Transparency.
Accurate accounting.
Author ownership.
Secure digital delivery.
Simple author experience.
NGO-based empowerment of Young Creators.
Clear separation between payment-processing fees and Spiritans Sound commission.
Before going live, provide a complete test environment and demonstrate at least five sample transactions, including: 1. Standard author — successful sale 2. Standard author — multiple sales 3. Young Creator — successful sale with 0% Spiritans Sound commission 4. Refunded transaction 5. Author payout
The administrator must be able to reconcile every figure shown on the Author Dashboard against the underlying transaction records.
