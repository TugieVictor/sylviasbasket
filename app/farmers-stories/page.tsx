'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiHeart, FiTrendingUp, FiUsers, FiArrowRight } from 'react-icons/fi'
import { GiFarmer, GiPlantSeed } from 'react-icons/gi'

const FarmersStoriesPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const stories = [
    {
      name: 'Joseph Kimani Njuguna',
      location: 'Gathiriga-Gatundu South, Kiambu County',
      farmName: 'Kimstle Organics Farm',
      story: 'I started my journey into organic farming in 2003 when I joined the Kenya Institute of Organic Farming (KIOF) and in 2021, we officially launched the commercial side of my farm, Kimstle Organics Farm. We practice organic farming because we want our family, farm workers, and neighbors to eat safe and healthy food. We want our customers to enjoy the same, as it is important to us to avoid exposing anyone to harsh chemicals. Through our farm, we have been able to produce almost 70% of what our family consumes and have become a hub for organic tomatoes and other vegetables for neighborhood customers, institutions and other individual customers around Nairobi.',
      image: '/images/farmers_stories/Joseph_kimani.jpg',
      color: 'from-harvest-500 to-clay-600'
    },
    {
      name: 'Ruth Oloo',
      location: 'Near Bondo Town, Siaya County',
      farmName: 'Pawpaw Farm',
      story: 'I started growing pawpaw about three years ago, just behind my house, mainly for my family to enjoy. I grow the trees under rain fed conditions, using farm manure to keep the soil fertile. As the pawpaws began to yield more than we could eat, I started giving the extra fruit to friends and family. Through this little network, I was introduced to Sylvia\'s Basket—and it has been smiles ever since!',
      image: '/images/farmers_stories/ruth_oloo.jpg',
      color: 'from-accent-500 to-sage-600'
    },
    {
      name: 'Daniel Musimbi',
      location: 'Shimba Hills, Kwale County',
      farmName: 'Organic Fruit Farm',
      story: 'I have been practicing organic farming for over five years, growing mainly fruits such as oranges, tangerines, coconuts, pawpaws, lemons, limes, mangoes and passions. For me, organic farming is more than a method—it is a way to care for the soil, improve fertility, and protect the health of my family and community by avoiding harmful chemicals.',
      image: '/images/farmers_stories/daniel_musembi.jpg',
      color: 'from-primary-500 to-earth-600'
    },
    {
      name: 'Fred Odhiambo',
      location: 'Rongo, Migori County',
      farmName: 'Diverse Organic Farm',
      story: 'I have been practicing organic farming for several years and I grow a variety of crops including ginger, turmeric, pineapples, maize and other nutritious produce. All these are cultivated using natural compost, manure, and eco-friendly methods. I believe that healthy soil produces healthy food, which in turn creates healthy wealth for our families and community.',
      image: '/images/farmers_stories/fred_odhiambo.jpg',
      color: 'from-sage-500 to-accent-600'
    },
    {
      name: 'Eunice Kihago Gimode',
      location: 'Mulundu-Sabatia, Vihiga County',
      farmName: 'Organic Banana Farm',
      story: 'We have been practicing organic farming mainly for health reasons. We want to avoid the adverse effects of chemicals and pesticides, ensuring that the food we grow is safe and nutritious for our family, our workers, and our customers. For the past ten years, the ripening bananas and matoke we supply to Sylvia\'s Basket have been fully organic, grown with care using natural compost and sustainable farming practices.',
      image: '/images/farmers_stories/eunice_kihago.jpg',
      color: 'from-harvest-600 to-clay-700'
    },
    {
      name: 'Harun Mwangi',
      location: 'Githunguri, Kiambu County',
      farmName: 'Sustainable Mixed Farm',
      story: 'On our farm we grow a variety of crops—orange sweet potatoes, arrowroots, matoke, pumpkins and hass avocados. We chose to practice organic farming because it is not only better for the environment but also sustainable and cost-effective in the long run. By avoiding harmful chemicals and synthetic inputs, our farming methods are safe for both the farmers and the land. This ensures that our crops are grown in a healthy, toxin-free environment, producing food that is more nutritious for consumers.',
      image: '/images/farmers_stories/harun_mwangi.jpg',
      color: 'from-clay-500 to-harvest-600'
    },
    {
      name: 'Harriet Ng\'ok',
      location: 'Sotik, Bomet County',
      farmName: 'Community Organic Farm',
      story: 'We have been practicing organic farming for the past five years. We believe that organic farming is essential for providing high-value, nutritious food for our families and the wider community. On our farm, we grow a wide variety of produce including plantains, matoke, sweet bananas, vegetables, maize, onions, avocados, pumpkins, and even indigenous medicinal plants. All of our crops are cultivated using natural methods that maintain soil fertility and avoid harmful chemicals, ensuring that the food we provide is safe, healthy, and flavorful.',
      image: '/images/farmers_stories/harriet_ngok.jpg',
      color: 'from-accent-600 to-sage-700'
    },
    {
      name: 'Jane Kiarie',
      location: 'Lari, Kiambu County',
      farmName: 'Regenerative Agriculture Farm',
      story: 'I began practicing organic farming in 2019, and through the Ministry of Agriculture, I was introduced to SNV Netherlands Development Organisation and the World Vegetable Centre, where I received training in regenerative agriculture and Good Agricultural Practices (GAPs). I grow my vegetables organically because it improves soil health, supports crop rotation, and produces high-nutritional-value food for my family and community. Organic methods have also given me access to reliable markets, increased my income, and allowed me to meet the growing demand for safe, chemical-free food as more people become conscious of what they eat.',
      image: '/images/farmers_stories/jane_kiarie.jpg',
      color: 'from-primary-600 to-accent-700'
    },
  ]

  const testimonials = [
    {
      quote: "We practice organic farming because we want our family, farm workers, and neighbors to eat safe and healthy food. Organic farming has enabled us to protect the environment by reducing chemical pollution.",
      author: "Joseph Kimani Njuguna",
      role: "Kimstle Organics Farm, Kiambu County"
    },
    {
      quote: "Through Sylvia's Basket—it has been smiles ever since! What started as pawpaws for my family has opened doors to markets I never imagined.",
      author: "Ruth Oloo",
      role: "Pawpaw Farm, Siaya County"
    },
    {
      quote: "I believe that healthy soil produces healthy food, which in turn creates healthy wealth for our families and community.",
      author: "Fred Odhiambo",
      role: "Diverse Organic Farm, Migori County"
    },
  ]

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center pt-32 pb-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/happy_african_child.jpg"
            alt="Happy African child - the future we're building"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-harvest-900/90 via-clay-900/85 to-sage-900/90"></div>
        </div>
        <div className="container-custom relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <span className="text-overline text-white">Real Stories, Real Impact</span>
            <h1 className="text-display text-white mt-3 mb-6">
              Stories from{' '}
              <span className="text-harvest-300">Our Farmers</span>
            </h1>
            <p className="text-subtitle text-white">
              <span className="font-bold">Real people</span>. <span className="font-bold">Real change</span>. <span className="font-bold">Real impact</span> on communities across Kenya and Africa.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-white to-harvest-50">
        <div className="container-custom">
          <motion.div
            className="max-w-4xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            {/* Main Intro */}
            <div className="text-center mb-12">
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-6">
                <span className="text-highlight font-semibold">Every farmer has a story</span>. Behind each harvest is a journey of <span className="text-gradient-warm font-bold">learning, perseverance, and transformation</span>.
              </p>
              <p className="text-lg text-gray-600">
                These stories demonstrate the power of organic farming to <span className="font-semibold text-accent-700">change lives</span>, <span className="font-semibold text-sage-700">strengthen communities</span>, and <span className="font-semibold text-harvest-700">build a more sustainable future</span>.
              </p>
            </div>

            {/* Bridge Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-harvest-100">
                <div className="text-3xl font-bold text-harvest-600 mb-2">8</div>
                <p className="text-sm font-semibold text-gray-700">Farmers Featured</p>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-sage-100">
                <div className="text-3xl font-bold text-sage-600 mb-2">6</div>
                <p className="text-sm font-semibold text-gray-700">Counties Represented</p>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-accent-100">
                <div className="text-3xl font-bold text-accent-600 mb-2">15+</div>
                <p className="text-sm font-semibold text-gray-700">Years Experience</p>
              </div>
            </div>

            {/* Intro to Stories */}
            <div className="mt-12 text-center">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-4">
                Meet the Farmers
              </h2>
              <p className="text-lg text-gray-600">
                From Kiambu to Kwale, from Siaya to Bomet—discover the faces and voices behind Kenya's organic farming movement
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Farmer Stories - Magazine Style */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {stories.map((story, index) => {
              const isEven = index % 2 === 0

              return (
                <motion.div
                  key={index}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={fadeInUp}
                  className="relative"
                >
                  <div className={`grid grid-cols-1 lg:grid-cols-5 gap-8 items-start ${!isEven ? 'lg:flex-row-reverse' : ''}`}>
                    {/* Image Side - Smaller for better quality */}
                    <motion.div
                      className={`lg:col-span-2 ${!isEven ? 'lg:order-2' : 'lg:order-1'}`}
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-xl">
                        <img
                          src={story.image}
                          alt={story.name}
                          className="w-full h-full object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent"></div>

                        {/* Farm Name Badge */}
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className={`px-4 py-2 bg-gradient-to-r ${story.color} rounded-lg shadow-lg backdrop-blur-sm`}>
                            <span className="text-xs font-bold text-white uppercase tracking-wider">{story.farmName}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Content Side */}
                    <div className={`lg:col-span-3 ${!isEven ? 'lg:order-1' : 'lg:order-2'} space-y-4`}>
                      {/* Location Badge */}
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-harvest-100 to-clay-100 rounded-full">
                        <svg className="w-3.5 h-3.5 text-harvest-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-xs font-semibold text-harvest-800">{story.location}</span>
                      </div>

                      {/* Name */}
                      <h3 className="text-3xl md:text-4xl font-display font-bold text-gray-900 leading-tight">
                        {story.name}
                      </h3>

                      {/* Divider */}
                      <div className={`w-20 h-1 bg-gradient-to-r ${story.color} rounded-full`}></div>

                      {/* Full Story */}
                      <div className="flex items-start">
                        <blockquote className="text-base md:text-lg text-gray-700 leading-relaxed italic border-l-4 border-harvest-300 pl-4">
                          "{story.story}"
                        </blockquote>
                      </div>

                      {/* Bottom accent */}
                      <div className={`inline-block px-4 py-1.5 bg-gradient-to-r ${story.color} rounded-full`}>
                        <span className="text-xs font-bold text-white uppercase tracking-wider">Organic Farmer</span>
                      </div>
                    </div>
                  </div>

                  {/* Separator Line */}
                  {index < stories.length - 1 && (
                    <div className="mt-20 border-t border-gray-200"></div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-gradient-to-br from-harvest-600 via-clay-600 to-sage-700 text-white">
        <div className="container-custom">
          <motion.div
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="text-overline text-white">Testimonials</span>
            <h2 className="text-hero text-white mt-3 mb-6">
              In Their Own Words
            </h2>
            <p className="text-subtitle text-white">
              Hear what farmers are saying about <span className="font-bold">their experience</span>
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20"
              >
                <div className="text-4xl mb-4 opacity-50">"</div>
                <p className="text-lg leading-relaxed mb-6">
                  {testimonial.quote}
                </p>
                <div className="border-t border-white/20 pt-4">
                  <p className="font-semibold text-lg">{testimonial.author}</p>
                  <p className="text-sm opacity-90">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Impact Numbers */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            className="max-w-4xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="text-center mb-12">
              <span className="text-kicker text-harvest-600">By the Numbers</span>
              <h2 className="text-hero text-gray-900 mt-3 mb-6">
                Collective Impact
              </h2>
              <p className="text-subtitle text-gray-700">
                Together, our farmers are creating <span className="text-gradient-accent font-bold">lasting change</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-8 bg-gradient-to-br from-primary-50 to-white rounded-2xl border border-primary-200 shadow-lg"
              >
                <div className="text-5xl font-display font-bold text-primary-600 mb-2">
                  1,000+
                </div>
                <p className="text-lg text-gray-700">Farmers Empowered</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-8 bg-gradient-to-br from-harvest-50 to-white rounded-2xl border border-harvest-200 shadow-lg"
              >
                <div className="text-5xl font-display font-bold text-harvest-600 mb-2">
                  90%
                </div>
                <p className="text-lg text-gray-700">Youth Participation</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-8 bg-gradient-to-br from-earth-50 to-white rounded-2xl border border-earth-200 shadow-lg"
              >
                <div className="text-5xl font-display font-bold text-earth-700 mb-2">
                  50+
                </div>
                <p className="text-lg text-gray-700">Partner Farmers</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Message from Sylvia */}
      <section className="section-padding bg-gradient-to-br from-accent-600 via-sage-600 to-accent-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="/images/sylvia-hero_3.jpg"
            alt="Sylvia Kuria with farmers"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-accent-900/80 to-sage-900/80"></div>
        </div>
        <div className="container-custom relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="mb-8">
              <div className="w-40 h-40 mx-auto mb-6 bg-white p-2 rounded-full shadow-2xl">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl">
                  <img
                    src="/images/sylvia-hero_2.jpg"
                    alt="Sylvia Kuria"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-cursive font-bold mb-4">
                A Message from Sylvia
              </h2>
            </div>
            <blockquote className="text-xl md:text-2xl leading-relaxed italic mb-6">
              "Every farmer has a unique story and immense potential. My vision is to train and support as many farmers as possible so we can leave a lasting legacy for our children - one of healthy food, thriving communities, and a restored planet."
            </blockquote>
            <p className="text-lg font-semibold">
              - Sylvia Kuria, Founder & CEO
            </p>
          </motion.div>
        </div>
      </section>

      {/* Video Testimonials Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            className="max-w-6xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="text-center mb-12">
              <span className="text-kicker text-harvest-600">Watch & Listen</span>
              <h2 className="text-hero text-gray-900 mt-3 mb-6">
                Video Testimonials
              </h2>
              <p className="text-subtitle text-gray-600">
                Hear directly from farmers whose <span className="text-gradient-warm font-bold">lives have been transformed</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Video 1 - Moya Moja */}
              <motion.div
                variants={fadeInUp}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="aspect-video bg-gray-100">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/xL3rzsk3DO0"
                    title="Moya Moja"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1">Moya Moja</h3>
                  <p className="text-sm text-gray-600">Farm visit experience and organic farming insights</p>
                </div>
              </motion.div>

              {/* Video 2 - Elephant Vert East Africa */}
              <motion.div
                variants={fadeInUp}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="aspect-video bg-gray-100">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/wtSGEnezhlY"
                    title="Elephant Vert East Africa"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1">Elephant Vert East Africa</h3>
                  <p className="text-sm text-gray-600">Partnership in sustainable agriculture solutions</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding gradient-earth">
        <div className="container-custom">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="text-kicker text-harvest-600">Join the Movement</span>
            <h2 className="text-hero text-gray-900 mt-3 mb-6">
              Your Story Could Be Next
            </h2>
            <p className="text-subtitle text-gray-700 mb-10">
              Join our <span className="text-gradient-accent font-bold">community of farmers</span> and be part of the <span className="text-gradient-warm font-bold">organic farming revolution</span> in Kenya
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/our-work">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="gradient-primary text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-shadow flex items-center gap-2"
                >
                  Learn About Our Programs
                  <FiArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link href="/get-involved">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-primary-700 px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-shadow flex items-center gap-2 border-2 border-primary-200"
                >
                  <FiHeart className="w-5 h-5" />
                  Get Involved
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default FarmersStoriesPage
