function FAQ() {
  const faqs = [
    { q: 'How do I create an account?', a: 'Click on Register in the top navigation, fill in your details, and choose your role (Buyer or Seller).' },
    { q: 'How do I place an order?', a: 'Browse products, add items to cart, proceed to checkout, enter shipping details, and confirm your order.' },
    { q: 'What payment methods are accepted?', a: 'We accept Credit/Debit Cards via Stripe and Cash on Delivery (COD).' },
    { q: 'How do I track my order?', a: 'Go to Order History from your profile to see the status and tracking information for all your orders.' },
    { q: 'Can I cancel my order?', a: 'Yes, orders in "Pending" or "Confirmed" status can be cancelled from the order details page.' },
    { q: 'How do I request a return?', a: 'Once your order is delivered, go to the order details and click "Request Return" with a reason.' },
    { q: 'How do I apply a coupon?', a: 'During checkout, enter your coupon code in the "Coupon Code" field and click "Apply".' },
    { q: 'How do I become a seller?', a: 'During registration, select "Seller" as your role. You can then access the Seller Dashboard.' },
    { q: 'How are sellers verified?', a: 'All sellers are reviewed by our admin team. Inappropriate listings can be reported via Contact Us.' },
    { q: 'How do I contact support?', a: 'Visit the Contact Us page or email us at support@shopez.com. We respond within 24 hours.' },
    { q: 'Is my payment information secure?', a: 'Yes, we use industry-standard encryption. Payment details are processed securely through Stripe.' },
    { q: 'How long does delivery take?', a: 'Estimated delivery time is shown at checkout. Typically 5-7 business days.' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-800 dark:text-white">Frequently Asked Questions</h1>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm divide-y divide-slate-200 dark:divide-slate-700">
        {faqs.map((faq, i) => (
          <details key={i} className="p-4 md:p-5 group">
            <summary className="font-medium cursor-pointer text-slate-800 dark:text-slate-200 group-open:text-brand-600 dark:group-open:text-brand-400 text-sm sm:text-base">{faq.q}</summary>
            <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{faq.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

export default FAQ;
