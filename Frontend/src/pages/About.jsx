function About() {
  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-800 dark:text-white">About ShopEZ</h1>
      <div className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-xl shadow-sm space-y-6">
        <section>
          <h2 className="text-lg sm:text-xl font-semibold mb-3 text-slate-800 dark:text-white">Our Story</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
            ShopEZ was founded with a simple mission: make online shopping effortless and accessible for everyone.
            We connect buyers with trusted sellers, offering a wide range of products at competitive prices.
            Whether you&apos;re looking for the latest gadgets, fashion trends, or everyday essentials, ShopEZ has you covered.
          </p>
        </section>
        <section>
          <h2 className="text-lg sm:text-xl font-semibold mb-3 text-slate-800 dark:text-white">Why Choose Us</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: 'Secure Shopping', desc: 'Your transactions are protected with industry-standard encryption.' },
              { title: 'Fast Delivery', desc: 'We partner with reliable couriers to ensure timely delivery.' },
              { title: 'Easy Returns', desc: 'Hassle-free return policy within 7 days of delivery.' },
              { title: '24/7 Support', desc: 'Our customer support team is always ready to help.' },
              { title: 'Best Prices', desc: 'Competitive pricing with regular discounts and offers.' },
              { title: 'Trusted Sellers', desc: 'All sellers are verified to ensure product quality.' },
            ].map((f) => (
              <div key={f.title} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                <h3 className="font-semibold mb-1 text-slate-800 dark:text-white">{f.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-lg sm:text-xl font-semibold mb-3 text-slate-800 dark:text-white">Contact Us</h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">Have questions? Reach out to us at <a href="mailto:support@shopez.com" className="text-brand-600 dark:text-brand-400">support@shopez.com</a></p>
        </section>
      </div>
    </div>
  );
}

export default About;
