import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Clear the db
  await prisma.contact.deleteMany()
  await prisma.project.deleteMany()
  await prisma.skill.deleteMany()
  await prisma.projectCategory.deleteMany()
  await prisma.skillCategory.deleteMany()
  await prisma.aboutSection.deleteMany()

  // Project category
  const projectCategories = [
    { key: '1A', label: '1re année', order: 1 },
    { key: '2A', label: '2e année', order: 2 },
    { key: '3A', label: '3e année', order: 3 },
    { key: 'HORS', label: 'Hors programme', order: 4 },
    { key: 'PERSO', label: 'Personnel', order: 5 },
  ]

  for (const cat of projectCategories) {
    await prisma.projectCategory.create({ data: cat })
  }
  console.log('Projects categories create')

  // skills categories
  const skillCategories = [
    { key: 'web', label: 'Developement Web', order: 1 },
    { key: 'devops', label: 'DevOps', order: 2 },
    { key: 'bases', label: 'Langages & Outils', order: 3 },
    { key: 'soft', label: 'Soft Skills', order: 4 },
  ]

  for (const cat of skillCategories) {
    await prisma.skillCategory.create({ data: cat })
  }
  console.log('Projects caterogies create')

  // Projets
  const projects = [
    {
      title: 'Popeys',
      slug: 'popeys',
      description: 'Projet d\'apprentissage de Docker et Docker Compose pour la conteneurisation d\'applications.',
      shortDesc: 'Apprentissage Docker et Docker Compose',
      tags: ['Docker', 'DevOps'],
      category: '1A',
      order: 1,
      featured: false,
    },
    {
      title: 'Chocolatine',
      slug: 'chocolatine',
      description: 'Mise en place d\'un pipeline CI/CD avec GitHub Actions pour automatiser les tests et déploiements.',
      shortDesc: 'Pipeline CI/CD avec GitHub Actions',
      tags: ['GitHub Actions', 'CI/CD'],
      category: '1A',
      order: 2,
      featured: false,
    },
    {
      title: 'Epytodo',
      slug: 'epytodo',
      description: 'Application web de gestion de tâches développée en JavaScript avec une API REST.',
      shortDesc: 'Application TodoList en JavaScript',
      tags: ['JavaScript', 'Express', 'REST API'],
      category: '1A',
      order: 3,
      featured: true,
    },
    {
      title: 'My Navy',
      slug: 'my-navy',
      description: 'Jeu de bataille navale en réseau développé en C avec communication socket entre deux joueurs.',
      shortDesc: 'Bataille navale multijoueur en C',
      tags: ['C', 'Sockets', 'Network'],
      category: '1A',
      order: 4,
      featured: false,
    },
    {
      title: 'Arcade',
      slug: 'arcade',
      description: 'Plateforme de jeux arcade modulaire avec système de plugins dynamiques en C++.',
      shortDesc: 'Plateforme de jeux arcade modulaire',
      tags: ['C++', 'Design Patterns', 'SDL'],
      category: '2A',
      order: 1,
      featured: true,
    },
    {
      title: 'Raytracer',
      slug: 'raytracer',
      description: 'Moteur de rendu 3D par lancer de rayons implémenté en C++ pour générer des images photoréalistes.',
      shortDesc: 'Moteur de rendu 3D',
      tags: ['C++', '3D', 'Rendering'],
      category: '2A',
      order: 2,
      featured: true,
    },
    {
      title: 'Portfolio',
      slug: 'portfolio',
      description: 'Site portfolio personnel développé avec Next.js, TypeScript et Prisma pour la gestion de contenu.',
      shortDesc: 'Portfolio personnel avec CMS intégré',
      tags: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'],
      category: 'PERSO',
      order: 1,
      featured: true,
    },
  ]

  for (const project of projects) {
    await prisma.project.create({ data: project })
  }
  console.log('Projets créés')

  const skills = [
    { title: 'HTML5', category: 'web', rating: 4, order: 1 },
    { title: 'CSS3', category: 'web', rating: 4, order: 2 },
    { title: 'JavaScript', category: 'web', rating: 4, order: 3 },
    { title: 'TypeScript', category: 'web', rating: 4, order: 4 },
    { title: 'React', category: 'web', rating: 3, order: 5 },
    { title: 'Next.js', category: 'web', rating: 4, order: 6 },
    { title: 'Express', category: 'web', rating: 4, order: 7 },
    { title: 'Node.js', category: 'web', rating: 4, order: 8 },

    { title: 'Docker', category: 'devops', rating: 4, order: 1 },
    { title: 'Docker Compose', category: 'devops', rating: 4, order: 2 },
    { title: 'GitHub Actions', category: 'devops', rating: 4, order: 3 },
    { title: 'Jenkins', category: 'devops', rating: 3, order: 4 },
    { title: 'Ansible', category: 'devops', rating: 3, order: 5 },

    { title: 'C', category: 'bases', rating: 5, order: 1 },
    { title: 'C++', category: 'bases', rating: 5, order: 2 },
    { title: 'Python', category: 'bases', rating: 3, order: 3 },
    { title: 'Git', category: 'bases', rating: 4, order: 4 },
    { title: 'GitHub', category: 'bases', rating: 4, order: 5 },
    { title: 'PostgreSQL', category: 'bases', rating: 3, order: 6 },
    { title: 'Prisma', category: 'bases', rating: 4, order: 7 },

    { title: 'Travail d\'équipe', category: 'soft', rating: 5, order: 1 },
    { title: 'Communication', category: 'soft', rating: 5, order: 2 },
    { title: 'Adaptabilité', category: 'soft', rating: 5, order: 3 },
    { title: 'Apprentissage continu', category: 'soft', rating: 5, order: 4 },
    { title: 'Résolution de problèmes', category: 'soft', rating: 5, order: 5 },
  ]

  for (const skill of skills) {
    await prisma.skill.create({ data: skill })
  }
  console.log('Skills create')

  const aboutSections = [
    {
      key: 'intro',
      title: 'Mon histoire',
      content: 'Je m\'appelle Boris CHENG et je suis passionné par plusieurs domaines : la cuisine, le sport, la programmation et les jeux vidéo.\n\nEnfant, je passais beaucoup de temps à regarder des émissions culinaires, ce qui m\'a naturellement orienté vers la gastronomie.',
      order: 1,
    },
    {
      key: 'cuisine',
      title: 'Parcours Cuisine',
      content: 'J\'ai commencé par un bac professionnel cuisine, une formation où je me sentais comme chez moi. J\'aimais créer de nouveaux plats, expérimenter et apprendre de mes erreurs.\n\nMes stages m\'ont montré une autre réalité du métier, notamment dans la restauration étoilée où la pression est constante.',
      order: 2,
    },
    {
      key: 'sports',
      title: 'Parcours Sport',
      content: 'Après le bac, j\'ai rejoint une faculté de sport (STAPS à Paris) où j\'ai étudié pendant deux ans. J\'y ai rencontré des personnes formidables et vécu de très bons moments.\n\nPour moi, le sport incarne cette idée : échouer, apprendre et se relever.',
      order: 3,
    },
    {
      key: 'coding',
      title: 'Parcours Coding',
      content: 'J\'ai longtemps hésité avant d\'entrer à Epitech. C\'est mon frère, diplômé d\'Epitech, qui m\'a encouragé : "au pire, tente ta chance un an".\n\nJ\'ai alors décidé de me lancer dans la programmation. Les débuts ont été exigeants mais j\'ai découvert que j\'aimais coder.',
      order: 4,
    },
    {
      key: 'objectif',
      title: 'Mon objectif',
      content: 'Grâce à mon parcours à Epitech, j\'ai eu l\'opportunité de découvrir de nombreux domaines dans la tech.\n\nMon objectif est de continuer à apprendre et à me perfectionner dans trois axes : le développement web, le DevOps et l\'intelligence artificielle.\n\nÀ terme, mon ambition est de me lancer en freelance.',
      order: 5,
    },
  ]

  for (const section of aboutSections) {
    await prisma.aboutSection.create({ data: section })
  }
  console.log('Sections About créées')

  console.log('Seeding terminé avec succès!')
}

main()
  .catch((e) => {
    console.error('Erreur lors du seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
