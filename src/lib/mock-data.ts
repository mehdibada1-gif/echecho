
import type { Event, User, LeaderboardEntry, Testimonial, Blog, Organization } from './types';

export const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'Alice',
    email: 'alice@example.com',
    role: 'citizen',
    country: 'it',
    ecoPoints: 1250,
    badges: ['RecyclingHero', 'TreePlanter'],
    profileImage: 'https://picsum.photos/seed/user1/100/100',
    contributions: 'Organized 3 recycling drives and planted 20 trees.',
    ecoProfileDescription: "Meet Alice, a sustainability champion from Italy! With 1250 EcoPoints and badges like RecyclingHero and TreePlanter, they're making a real difference. She has significantly contributed to organizing recycling drives and planting trees. Join her in creating a greener future!",
  },
  {
    id: 'user2',
    name: 'Bob',
    email: 'bob@example.com',
    role: 'citizen',
    country: 'nl',
    ecoPoints: 800,
    badges: ['CleanupCrew'],
    profileImage: 'https://picsum.photos/seed/user2/100/100',
    contributions: 'Participated in 5 beach cleanups.',
  },
];

export const mockEvents: Event[] = [
  {
    id: 'event1',
    title: 'Milan Park Cleanup',
    description: 'Join us for a community cleanup at Parco Sempione.',
    category: 'cleanup',
    location: { latitude: 45.4722, longitude: 9.1772 },
    address: 'Piazza Sempione, 20154 Milano MI, Italy',
    country: 'it',
    date: new Date('2024-08-15T09:00:00'),
    endDate: new Date('2024-08-15T12:00:00'),
    cost: 0,
    createdBy: 'user1',
    participants: ['user2'],
    impact: { plasticCollectedKg: 50 },
    beforePhotos: ['https://picsum.photos/seed/event1before/400/300'],
    afterPhotos: ['https://picsum.photos/seed/event1after/400/300'],
  },
  {
    id: 'event2',
    title: 'Amsterdam Canal Gardening',
    description: 'Planting flowers along the canals to beautify the city.',
    category: 'gardening',
    location: { latitude: 52.379189, longitude: 4.899431 },
    address: 'Amsterdam, Netherlands',
    country: 'nl',
    date: new Date('2024-08-20T10:00:00'),
    endDate: new Date('2024-08-20T13:00:00'),
    cost: 15,
    createdBy: 'user2',
    participants: ['user1'],
    impact: { treesPlanted: 150 },
    beforePhotos: ['https://picsum.photos/seed/event2before/400/300'],
    afterPhotos: ['https://picsum.photos/seed/event2after/400/300'],
  },
  {
    id: 'event3',
    title: 'Stockholm Recycling Workshop',
    description: 'A workshop on advanced recycling techniques and waste reduction.',
    category: 'recycling',
    location: { latitude: 59.3293, longitude: 18.0686 },
    address: 'Stockholm, Sweden',
    country: 'se',
    date: new Date('2024-09-01T14:00:00'),
    endDate: new Date('2024-09-01T16:00:00'),
    cost: 5,
    createdBy: 'user1',
    participants: [],
    impact: {},
    beforePhotos: ['https://picsum.photos/seed/event3before/400/300'],
    afterPhotos: [],
  },
  {
    id: 'event4',
    title: 'Beirut Coastal Cleanup',
    description: 'A large-scale cleanup operation along the coast of Beirut.',
    category: 'cleanup',
    location: { latitude: 33.8938, longitude: 35.5018 },
    address: 'Beirut, Lebanon',
    country: 'lb',
    date: new Date('2024-09-05T08:00:00'),
    endDate: new Date('2024-09-05T12:00:00'),
    cost: 0,
    createdBy: 'user2',
    participants: [],
    impact: { plasticCollectedKg: 200 },
    beforePhotos: ['https://picsum.photos/seed/event4before/400/300'],
    afterPhotos: [],
  },
];

export const mockLeaderboard: LeaderboardEntry[] = [
    { rank: 1, user: { name: 'Elena Rossi', profileImage: 'https://picsum.photos/seed/lb1/40/40', country: 'it' }, ecoPoints: 2300 },
    { rank: 2, user: { name: 'Lars Andersen', profileImage: 'https://picsum.photos/seed/lb2/40/40', country: 'se' }, ecoPoints: 2150 },
    { rank: 3, user: { name: 'Fatima Al-Sayed', profileImage: 'https://picsum.photos/seed/lb3/40/40', country: 'lb' }, ecoPoints: 1980 },
    { rank: 4, user: { name: 'Sven van der Berg', profileImage: 'https://picsum.photos/seed/lb4/40/40', country: 'nl' }, ecoPoints: 1800 },
    { rank: 5, user: { name: 'Youssef Hamidi', profileImage: 'https://picsum.photos/seed/lb5/40/40', country: 'ma' }, ecoPoints: 1750 },
    { rank: 6, user: { name: 'Amira Bouazizi', profileImage: 'https://picsum.photos/seed/lb6/40/40', country: 'tn' }, ecoPoints: 1600 },
];

export const mockTestimonials: Testimonial[] = [
    {
        name: "Elena Rossi",
        country: "it",
        avatar: "https://picsum.photos/seed/lb1/100/100",
        quote: "EcoEcho helped me find and organize cleanups in my city. It's amazing to see the direct impact we can have on our environment together. It's more than an app, it's a community."
    },
    {
        name: "Sven van der Berg",
        country: "nl",
        avatar: "https://picsum.photos/seed/lb4/100/100",
        quote: "I love the gamification with EcoPoints and badges! It's a fun way to stay motivated. I've connected with so many like-minded people through the events."
    },
    {
        name: "Fatima Al-Sayed",
        country: "lb",
        avatar: "https://picsum.photos/seed/lb3/100/100",
        quote: "As an event organizer, this platform is a game-changer. It simplifies everything from promotion to tracking participation. We've seen a huge increase in volunteers."
    }
];

export const mockBlogs: Blog[] = [
    {
        id: 'blog1',
        title: '10 Simple Ways to Reduce Your Carbon Footprint Today',
        category: 'Lifestyle',
        image: 'https://picsum.photos/seed/blog1/400/300',
        excerpt: 'Start making a difference with these easy-to-implement tips for a greener lifestyle. From your diet to your daily commute, small changes can have a big impact.',
        author: 'Alice',
        createdBy: 'user1',
        date: new Date('2024-07-28'),
        content: `
<p>Reducing your carbon footprint is one of the most effective ways to combat climate change. While the challenge can seem daunting, making small, sustainable changes in your daily life can collectively make a huge difference. Here are ten simple yet powerful ways you can start today:</p>
<ol>
  <li><strong>Mind Your Commute:</strong> Transportation is a major source of greenhouse gas emissions. Whenever possible, opt for walking, biking, or using public transport. If you must drive, consider carpooling or switching to an electric vehicle.</li>
  <li><strong>Eat Less Meat:</strong> The meat industry, particularly beef production, has a significant environmental impact. Try incorporating more plant-based meals into your diet. Starting with "Meatless Mondays" is a great first step.</li>
  <li><strong>Reduce, Reuse, Recycle:</strong> This classic mantra is more important than ever. Minimize your consumption, choose reusable products over single-use items, and properly recycle materials like paper, glass, and plastic.</li>
  <li><strong>Conserve Water:</strong> Saving water reduces the energy needed to process and deliver it to your home. Take shorter showers, fix any leaks, and only run your dishwasher and washing machine with full loads.</li>
  <li><strong>Switch to Renewable Energy:</strong> Check if your utility provider offers an option to switch to a green power plan sourced from wind or solar. You can also consider installing solar panels on your home.</li>
  <li><strong>Be an Energy-Efficient Household:</strong> Unplug electronics when not in use, switch to LED light bulbs, and use energy-efficient appliances. These small actions reduce your electricity consumption and your bills.</li>
  <li><strong>Shop Local and Seasonal:</strong> Buying produce from local farmers' markets reduces the carbon emissions associated with long-distance food transportation. Eating seasonal food also supports sustainable farming practices.</li>
  <li><strong>Compost Your Food Scraps:</strong> When food waste ends up in landfills, it produces methane, a potent greenhouse gas. Composting food scraps turns them into nutrient-rich soil for your garden instead.</li>
  <li><strong>Avoid Fast Fashion:</strong> The fashion industry is a major polluter. Choose quality clothing that will last longer, shop from sustainable brands, and donate or repair clothes instead of throwing them away.</li>
  <li><strong>Plant a Tree (or a Garden):</strong> Trees are carbon-sucking powerhouses. Planting trees in your community or starting a small garden helps absorb CO2 from the atmosphere and provides a habitat for wildlife.</li>
</ol>
<p>By integrating these habits into your routine, you contribute to a healthier planet. Every action, no matter how small, is a step in the right direction. What change will you make today?</p>
        `
    },
    {
        id: 'blog2',
        title: 'The Ultimate Guide to Community Gardening',
        category: 'Community',
        image: 'https://picsum.photos/seed/blog2/400/300',
        excerpt: 'Learn how to start a community garden in your neighborhood. This guide covers everything from finding a plot to organizing volunteers and choosing the right plants.',
        author: 'Bob',
        createdBy: 'user2',
        date: new Date('2024-07-25'),
        content: `
<h2>Why Start a Community Garden?</h2>
<p>Community gardens are vibrant spaces that offer a multitude of benefits. They provide fresh, healthy produce, create green spaces in urban areas, foster social connections, and offer educational opportunities for all ages. It's a hands-on way to beautify your neighborhood and promote a sustainable food system.</p>
<h2>Step-by-Step Guide</h2>
<h3>1. Form a Group</h3>
<p>You can't do it alone! Gather a few like-minded neighbors who are passionate about the idea. Form a small committee to handle planning and decision-making.</p>
<h3>2. Find a Suitable Plot</h3>
<p>Look for unused land in your area. This could be a vacant lot, a park space, or a rooftop. You'll need to get permission from the landowner, which might be the city or a private owner. Ensure the site gets at least six hours of direct sunlight per day.</p>
<h3>3. Plan Your Garden</h3>
<p>Decide on the layout. Will you have individual plots for families or a communal garden where everyone works together and shares the harvest? Plan for pathways, a water source, and a composting area.</p>
<h3>4. Gather Your Resources</h3>
<p>You'll need soil, seeds, tools, and a water source. You can often get donations from local businesses, or you can apply for grants. Start with a fundraising event to get the community involved and invested from the beginning.</p>
<h3>5. Prepare the Soil</h3>
<p>Good soil is the foundation of a healthy garden. Test the soil for contaminants, especially in urban areas. You may need to bring in raised beds and fresh, organic soil.</p>
<h3>6. Plant and Maintain</h3>
<p>Choose plants that are well-suited to your climate and season. Create a schedule for watering, weeding, and pest control. Organize regular workdays to keep the garden thriving.</p>
<h3>7. Harvest and Celebrate!</h3>
<p>The best part! Enjoy the fruits (and vegetables) of your labor. Host a harvest festival to celebrate your success with the entire community. It's a great way to share your bounty and inspire more people to get involved.</p>
`
    },
    {
        id: 'blog3',
        title: 'Understanding the Circular Economy',
        category: 'Education',
        image: 'https://picsum.photos/seed/blog3/400/300',
        excerpt: 'What is the circular economy and why is it crucial for a sustainable future? We break down the key concepts and show how you can participate.',
        author: 'Alice',
        createdBy: 'user1',
        date: new Date('2024-07-22'),
        content: `
<h2>From Linear to Circular</h2>
<p>For centuries, our economy has operated on a linear model: we take resources, make products, use them, and then throw them away. This "take-make-waste" system is unsustainable, leading to resource depletion and massive amounts of waste.</p>
<p>The circular economy offers a transformative alternative. It's a model of production and consumption that involves sharing, leasing, reusing, repairing, refurbishing, and recycling existing materials and products for as long as possible. In this way, the life cycle of products is extended.</p>
<h3>The Core Principles:</h3>
<ul>
  <li><strong>Design out waste and pollution:</strong> From the very beginning, products should be designed to be disassembled and reused.</li>
  <li><strong>Keep products and materials in use:</strong> We should move away from a consumer society to a "user" society. This means more leasing, sharing, and repairing to extend a product's life.</li>
  <li><strong>Regenerate natural systems:</strong> The model should not only protect the environment but actively improve it. For example, by returning biological materials to the soil through composting.</li>
</ul>
<h2>How You Can Participate</h2>
<p>The shift to a circular economy isn't just for big corporations. Individuals can play a huge role:</p>
<ul>
  <li><strong>Buy Less, Choose Well:</strong> Opt for high-quality, durable products over cheap, disposable ones.</li>
  <li><strong>Repair, Don't Replace:</strong> Learn basic repair skills for clothing, electronics, and furniture. Support local repair shops.</li>
  <li><strong>Embrace Secondhand:</strong> Shop at thrift stores, consignment shops, and online marketplaces for pre-loved items.</li>
  <li><strong>Support Circular Businesses:</strong> Choose companies that offer take-back programs, use recycled materials, or have a circular business model.</li>
</ul>
<p>By embracing these principles, we can collectively build a more sustainable and resilient future for everyone.</p>
`
    }
];

export const mockOrganizations: Organization[] = [
    {
        id: 'user1', // Org ID is the same as the owner's ID for simplicity in this mock data
        name: 'Green Italia',
        description: 'A non-profit dedicated to promoting green initiatives across Italy.',
        website: 'https://green-italia.example.com',
        ownerId: 'user1',
    }
];
