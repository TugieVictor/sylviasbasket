# Sylvia's Basket - Advocacy Website

A modern, fully dynamic multipage website for Sylvia's Basket - an organic farming and agroecology advocacy organization in Kenya.

## 🌱 About

Sylvia's Basket is dedicated to empowering communities through organic farming and agroecology. This website serves as a platform to share their mission, impact stories, and engage supporters in their advocacy work.

## ✨ Features

- **Modern UI/UX Design** - Beautiful, responsive design with earth-tone color scheme
- **Beautiful Animations** - Smooth animations using Framer Motion throughout the site
- **Fully Responsive** - Works perfectly on all devices (mobile, tablet, desktop)
- **Dynamic Multipage** - Multiple pages with smooth navigation:
  - Homepage - Hero banner, mission, impact stats, and CTAs
  - About - Sylvia's story, vision, mission, and founder profile
  - Our Work - Training programs, partnerships, and gallery
  - Farmers Stories - Testimonials and impact stories
  - News & Blog - Articles, updates, and newsletter signup
  - Get Involved - Donation, volunteer, and partnership opportunities

- **Advocacy-Focused** - Built to drive engagement and action
- **Newsletter Integration** - "When Silence Isn't an Option" newsletter signup
- **SEO Optimized** - Built with Next.js for excellent SEO performance

## 🎨 Design Features

- **Color Scheme**: Earth tones (greens, browns, warm oranges) representing organic farming
- **Typography**: Clean, modern fonts (Inter + Poppins)
- **Animations**: Smooth scroll animations, hover effects, and transitions
- **Engagement Funnel**: Designed to convert visitors into advocates

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher (recommended: 20.x)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd sylvias-basket-website
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser and visit:
```
http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
sylvias-basket-website/
├── app/
│   ├── about/              # About page
│   ├── our-work/           # Our Work page
│   ├── farmers-stories/    # Farmers Stories page
│   ├── news/               # News & Blog page
│   ├── get-involved/       # Get Involved page
│   ├── layout.tsx          # Root layout with Navigation & Footer
│   ├── page.tsx            # Homepage
│   └── globals.css         # Global styles
├── components/
│   ├── Navigation.tsx      # Header navigation component
│   └── Footer.tsx          # Footer component
├── public/                 # Static assets
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

## 🎯 Key Pages

### Homepage
- Hero banner with call-to-action
- Mission statement
- What We Stand For section
- Impact statistics
- Get Involved CTAs

### About
- Sylvia's origin story
- Vision and mission
- Achievements
- Founder profile and roles

### Our Work
- Training programs
- Impact statistics
- Partner organizations
- Gallery showcase

### Farmers Stories
- Individual farmer success stories
- Testimonials
- Collective impact metrics

### News & Blog
- Featured articles
- Recent blog posts
- Newsletter signup ("When Silence Isn't an Option")

### Get Involved
- Donation options
- Volunteer opportunities
- Partnership programs
- Contact form

## 🛠 Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Icons** - Icon library

## 🎨 Color Palette

- **Primary Green**: #22c55e (organic, growth)
- **Earth Tones**: #a88a5c (natural, grounded)
- **Harvest Orange**: #f97316 (warmth, abundance)
- **Neutrals**: Grays for text and backgrounds

## 📱 Responsive Design

The website is fully responsive and optimized for:
- Mobile devices (320px+)
- Tablets (768px+)
- Desktops (1024px+)
- Large screens (1280px+)

## 🔧 Customization

### Colors
Edit colors in `tailwind.config.ts` under the `theme.extend.colors` section.

### Content
Update page content in the respective page files in the `app/` directory.

### Animations
Modify animation settings in component files using Framer Motion's motion components.

## 📄 License

This project is built for Sylvia's Basket by Emit Data Consulting.

## 🤝 Support

For questions or support, contact:
- Email: info@sylviasbasket.org
- Location: Limuru, Kiambu County, Kenya

---

**"When we care for the earth, it cares for us"**

Built with 💚 for sustainable farming
