import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seeding...')

  // Clear the database
  await prisma.contact.deleteMany()
  await prisma.project.deleteMany()
  await prisma.skill.deleteMany()
  await prisma.projectCategory.deleteMany()
  await prisma.skillCategory.deleteMany()
  await prisma.aboutSection.deleteMany()

  // Project categories
  const projectCategories = [
    { key: '1A', label: '1st Year', order: 1 },
    { key: '2A', label: '2nd Year', order: 2 },
    { key: '3A', label: '3rd Year', order: 3 },
    { key: 'EXTRA', label: 'Extra-curricular', order: 4 },
    { key: 'PERSONAL', label: 'Personal', order: 5 },
  ]

  for (const cat of projectCategories) {
    await prisma.projectCategory.create({ data: cat })
  }
  console.log('Project categories created')

  // Skill categories
  const skillCategories = [
    { key: 'web', label: 'Web Development', order: 1 },
    { key: 'devops', label: 'DevOps', order: 2 },
    { key: 'languages', label: 'Languages & Tools', order: 3 },
    { key: 'soft', label: 'Soft Skills', order: 4 },
  ]

  for (const cat of skillCategories) {
    await prisma.skillCategory.create({ data: cat })
  }
  console.log('Skill categories created')

  // Projects
  const projects = [
    {
      title: 'Popeys',
      slug: 'popeys',
      description: 'Docker and Docker Compose learning project for application containerization.',
      shortDesc: 'Docker and Docker Compose learning',
      tags: ['Docker', 'DevOps'],
      category: '1A',
      order: 1,
      featured: false,
    },
    {
      title: 'Chocolatine',
      slug: 'chocolatine',
      description: 'CI/CD pipeline setup with GitHub Actions to automate tests and deployments.',
      shortDesc: 'CI/CD pipeline with GitHub Actions',
      tags: ['GitHub Actions', 'CI/CD'],
      category: '1A',
      order: 2,
      featured: false,
    },
    {
      title: 'Epytodo',
      slug: 'epytodo',
      description: 'Task management web application developed in JavaScript with a REST API.',
      shortDesc: 'TodoList application in JavaScript',
      tags: ['JavaScript', 'Express', 'REST API'],
      category: '1A',
      order: 3,
      featured: true,
    },
    {
      title: 'My Navy',
      slug: 'my-navy',
      description: 'Network battleship game developed in C with socket communication between two players.',
      shortDesc: 'Multiplayer battleship in C',
      tags: ['C', 'Sockets', 'Network'],
      category: '1A',
      order: 4,
      featured: false,
    },
    {
      title: 'Arcade',
      slug: 'arcade',
      description: 'Modular arcade games platform with dynamic plugin system in C++.',
      shortDesc: 'Modular arcade games platform',
      tags: ['C++', 'Design Patterns', 'SDL'],
      category: '2A',
      order: 1,
      featured: true,
    },
    {
      title: 'Raytracer',
      slug: 'raytracer',
      description: '3D ray tracing rendering engine implemented in C++ to generate photorealistic images.',
      shortDesc: '3D rendering engine',
      tags: ['C++', '3D', 'Rendering'],
      category: '2A',
      order: 2,
      featured: true,
    },
    {
      title: 'Portfolio',
      slug: 'portfolio',
      description: 'Personal portfolio website developed with Next.js, TypeScript and Prisma for content management.',
      shortDesc: 'Personal portfolio with integrated CMS',
      tags: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'],
      category: 'PERSONAL',
      order: 1,
      featured: true,
    },
  ]

  for (const project of projects) {
    await prisma.project.create({ data: project })
  }
  console.log('Projects created')

const skills = [
  { title: 'HTML5', category: 'web', order: 1 },
  { title: 'CSS3', category: 'web', order: 2 },
  { title: 'JavaScript', category: 'web', order: 3 },
  { title: 'TypeScript', category: 'web', order: 4 },
  { title: 'React', category: 'web', order: 5 },
  { title: 'Next.js', category: 'web', order: 6 },
  { title: 'Express', category: 'web', order: 7 },
  { title: 'Node.js', category: 'web', order: 8 },

  { title: 'Docker', category: 'devops', order: 1 },
  { title: 'Docker Compose', category: 'devops', order: 2 },
  { title: 'GitHub Actions', category: 'devops', order: 3 },
  { title: 'Jenkins', category: 'devops', order: 4 },
  { title: 'Ansible', category: 'devops', order: 5 },

  { title: 'C', category: 'languages', order: 1 },
  { title: 'C++', category: 'languages', order: 2 },
  { title: 'Python', category: 'languages', order: 3 },
  { title: 'Git', category: 'languages', order: 4 },
  { title: 'GitHub', category: 'languages', order: 5 },
  { title: 'PostgreSQL', category: 'languages', order: 6 },
  { title: 'Prisma', category: 'languages', order: 7 },

  { title: 'Teamwork', category: 'soft', order: 1 },
  { title: 'Communication', category: 'soft', order: 2 },
  { title: 'Adaptability', category: 'soft', order: 3 },
  { title: 'Continuous Learning', category: 'soft', order: 4 },
  { title: 'Problem Solving', category: 'soft', order: 5 },
]

  for (const skill of skills) {
    await prisma.skill.create({ data: skill })
  }
  console.log('Skills created')

  // About sections (will be displayed based on locale)
  const aboutSections = [
    {
      key: 'intro',
      title: 'My Story',
      content: 'My name is Boris CHENG and I am passionate about several fields: cooking, sports, programming and video games.\n\nAs a child, I spent a lot of time watching cooking shows, which naturally led me towards gastronomy.',
      order: 1,
    },
    {
      key: 'cooking',
      title: 'Cooking Journey',
      content: 'I started with a professional cooking diploma, a training where I felt at home. I loved creating new dishes, experimenting and learning from my mistakes.\n\nMy internships showed me another reality of the profession, especially in starred restaurants where pressure is constant.',
      order: 2,
    },
    {
      key: 'sports',
      title: 'Sports Journey',
      content: 'After high school, I joined a sports faculty (STAPS in Paris) where I studied for two years. I met wonderful people there and had great times.\n\nFor me, sports embody this idea: fail, learn and get back up.',
      order: 3,
    },
    {
      key: 'coding',
      title: 'Coding Journey',
      content: 'I hesitated for a long time before entering Epitech. It was my brother, an Epitech graduate, who encouraged me: "at worst, give it a try for a year".\n\nI then decided to dive into programming. The beginnings were demanding but I discovered that I loved coding.',
      order: 4,
    },
    {
      key: 'goal',
      title: 'My Goal',
      content: 'Thanks to my journey at Epitech, I had the opportunity to discover many areas in tech.\n\nMy goal is to continue learning and improving in three areas: web development, DevOps and artificial intelligence.\n\nUltimately, my ambition is to start freelancing.',
      order: 5,
    },
  ]

  for (const section of aboutSections) {
    await prisma.aboutSection.create({ data: section })
  }
  console.log('About sections created')

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
