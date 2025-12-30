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
  await prisma.experience.deleteMany()
  await prisma.education.deleteMany()
  await prisma.socialLink.deleteMany()
  await prisma.siteConfig.deleteMany()

  // ========== SITE CONFIG ==========
  const siteConfigs = [
    { key: 'job_title', value: 'Ingénieur Logiciel' },
    { key: 'job_title_en', value: 'Software Engineer' },
    { key: 'looking_for', value: 'Stage de 4 mois (Avril - Juillet 2026)' },
    { key: 'looking_for_en', value: '4-month internship (April - July 2026)' },
    { key: 'location', value: 'Paris, France' },
    { key: 'email', value: 'cheng.boris@hotmail.com' },
    { key: 'phone', value: '07 88 58 60 61' },
    { key: 'website', value: 'borischeng.fr' },
  ]

  for (const config of siteConfigs) {
    await prisma.siteConfig.create({ data: config })
  }
  console.log('Site config created')

  // ========== SOCIAL LINKS (URLs correctes) ==========
  const socialLinks = [
    { platform: 'github', url: 'https://github.com/Baollu', order: 1 },
    { platform: 'linkedin', url: 'https://www.linkedin.com/in/boris-cheng-8010992a1/', order: 2 },
    { platform: 'email', url: 'mailto:cheng.boris@hotmail.com', order: 3 },
  ]

  for (const link of socialLinks) {
    await prisma.socialLink.create({ data: link })
  }
  console.log('Social links created')

  // ========== EXPERIENCES ==========
  const experiences = [
    {
      title: 'Développeur Full Stack',
      company: 'Davensi',
      location: 'Paris',
      type: 'stage',
      startDate: new Date('2025-10-01'),
      endDate: new Date('2026-03-31'),
      description: `• Conception de services backend en Go pour l'interconnexion avec des API externes
• Mise en place des tests unitaires en Go
• Maintenance et développement des interfaces web en VueJs et mobile en React Native`,
      skills: ['Go', 'Vue.js', 'React Native', 'API REST', 'Tests unitaires'],
      order: 1,
    },
    {
      title: 'Développeur Full Stack',
      company: 'Une Robe Un Soir',
      location: 'Paris',
      type: 'stage',
      startDate: new Date('2024-08-01'),
      endDate: new Date('2024-11-30'),
      description: `• Développement d'outils internes en Node.js pour l'automatisation des flux logistiques (préparation des commandes du jour) et la génération des rapports KPI
• Maintenance et ajout de nouvelles fonctionnalités sur le site web de l'entreprise en NodeJS`,
      skills: ['Node.js', 'JavaScript', 'Automatisation', 'KPI'],
      order: 2,
    },
  ]

  for (const exp of experiences) {
    await prisma.experience.create({ data: exp })
  }
  console.log('Experiences created')

  // ========== EDUCATION ==========
  const educations = [
    {
      title: 'Expert en Ingénierie Logicielle (Titre Niveau 7)',
      school: 'Epitech Paris',
      location: 'Paris',
      startDate: new Date('2023-09-01'),
      endDate: new Date('2028-06-30'),
      description: 'Formation en informatique axée sur la pratique et les projets',
      order: 1,
    },
    {
      title: 'Bac Pro Cuisine',
      school: 'Lycée Jean Drouant',
      location: 'Paris',
      startDate: new Date('2019-09-01'),
      endDate: new Date('2021-06-30'),
      description: null,
      order: 2,
    },
  ]

  for (const edu of educations) {
    await prisma.education.create({ data: edu })
  }
  console.log('Education created')

  // ========== PROJECT CATEGORIES ==========
  const projectCategories = [
    { key: '1A', label: '1ère année', order: 1 },
    { key: '2A', label: '2ème année', order: 2 },
    { key: '3A', label: '3ème année', order: 3 },
    { key: 'EXTRA', label: 'Hors programme', order: 4 },
    { key: 'PERSONAL', label: 'Personnel', order: 5 },
  ]

  for (const cat of projectCategories) {
    await prisma.projectCategory.create({ data: cat })
  }
  console.log('Project categories created')

  // ========== SKILL CATEGORIES ==========
  const skillCategories = [
    { key: 'languages', label: 'Langages', order: 1 },
    { key: 'frameworks', label: 'Frameworks', order: 2 },
    { key: 'database', label: 'Bases de données', order: 3 },
    { key: 'devops', label: 'Outils & DevOps', order: 4 },
    { key: 'spoken', label: 'Langues', order: 5 },
  ]

  for (const cat of skillCategories) {
    await prisma.skillCategory.create({ data: cat })
  }
  console.log('Skill categories created')

  // ========== PROJECTS ==========
  const projects = [
    {
      title: 'R-Type',
      slug: 'r-type',
      description: `Développement d'un moteur de jeu complet avec architecture ECS et gestion réseau multijoueur en C++.
      
Architecture Cross-Platform: Support complet Linux/Windows via CMake et gestionnaire de paquets.`,
      shortDesc: 'Moteur de jeu ECS multijoueur en C++',
      tags: ['C++', 'ECS', 'Network', 'CMake', 'Cross-Platform'],
      category: '3A',
      order: 1,
      featured: true,
    },
    {
      title: 'Robocar',
      slug: 'robocar',
      description: `Développement d'une voiture autonome contrôlée par capteurs (vitesse, distance).
      
• Implémentation d'une IA pour la détection de lignes et le suivi de trajectoire
• Tests virtuels via le simulateur Webots (C / C++)
• Construction mécanique : soudure, assemblage et intégration des composants électroniques`,
      shortDesc: 'Voiture autonome avec IA embarquée',
      tags: ['C', 'C++', 'IA', 'Webots', 'Électronique'],
      category: '3A',
      order: 2,
      featured: true,
    },
    {
      title: 'AREA',
      slug: 'area',
      description: `Développement d'une application web et mobile d'automatisation de tâches type Action-Réaction.
      
• Conception d'un moteur d'événements en Python gérant WebHooks, CronJobs et appels API externes
• Implémentation native du protocole OAuth2 et gestion de l'authentification
• Interfaces développées en Next.js et Flutter, avec une base de données PostgreSQL, le tout conteneurisé sous Docker`,
      shortDesc: 'Plateforme d\'automatisation type IFTTT',
      tags: ['Python', 'Next.js', 'Flutter', 'PostgreSQL', 'Docker', 'OAuth2'],
      category: '3A',
      order: 3,
      featured: true,
    },
    {
      title: 'Bot Trade',
      slug: 'bot-trade',
      description: `Trading Algorithmique avec système temps réel.
      
• Moteur de Trading Temps Réel : Conception d'un système à faible latence en Go, capable de traiter des flux financiers massifs
• Architecture de Données : Implémentation d'un pipeline hybride alliant vitesse (Redis) et fiabilité (PostgreSQL)
• Intelligence Artificielle : Intégration de modèles prédictifs (Python/ONNX) pour l'analyse automatisée des tendances de marché`,
      shortDesc: 'Trading algorithmique temps réel en Go',
      tags: ['Go', 'Redis', 'PostgreSQL', 'Python', 'ONNX', 'IA'],
      category: '3A',
      order: 4,
      featured: true,
    },
    {
      title: 'Arcade',
      slug: 'arcade',
      description: 'Plateforme de jeux arcade modulaire avec système de plugins dynamique en C++.',
      shortDesc: 'Plateforme de jeux arcade modulaire',
      tags: ['C++', 'Design Patterns', 'SDL', 'SFML'],
      category: '2A',
      order: 1,
      featured: false,
    },
    {
      title: 'Raytracer',
      slug: 'raytracer',
      description: 'Moteur de rendu 3D par ray tracing implémenté en C++ pour générer des images photoréalistes.',
      shortDesc: 'Moteur de rendu 3D',
      tags: ['C++', '3D', 'Rendering', 'Math'],
      category: '2A',
      order: 2,
      featured: false,
    },
    {
      title: 'Epytodo',
      slug: 'epytodo',
      description: 'Application web de gestion de tâches développée en JavaScript avec une API REST.',
      shortDesc: 'Application TodoList en JavaScript',
      tags: ['JavaScript', 'Express', 'REST API', 'MySQL'],
      category: '1A',
      order: 1,
      featured: false,
    },
    {
      title: 'My Navy',
      slug: 'my-navy',
      description: 'Jeu de bataille navale en réseau développé en C avec communication par sockets entre deux joueurs.',
      shortDesc: 'Bataille navale multijoueur en C',
      tags: ['C', 'Sockets', 'Network'],
      category: '1A',
      order: 2,
      featured: false,
    },
    {
      title: 'Portfolio',
      slug: 'portfolio',
      description: 'Site portfolio personnel développé avec Next.js, TypeScript et Prisma pour la gestion de contenu.',
      shortDesc: 'Portfolio personnel avec CMS intégré',
      tags: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Tailwind'],
      category: 'PERSONAL',
      order: 1,
      featured: false,
    },
  ]

  for (const project of projects) {
    await prisma.project.create({ data: project })
  }
  console.log('Projects created')

  // ========== SKILLS (basés sur le CV exactement) ==========
  const skills = [
    // Langages (comme sur le CV)
    { title: 'C', category: 'languages', order: 1 },
    { title: 'C++', category: 'languages', order: 2 },
    { title: 'Golang', category: 'languages', order: 3 },
    { title: 'Python', category: 'languages', order: 4 },
    { title: 'TypeScript', category: 'languages', order: 5 },
    { title: 'Flutter', category: 'languages', order: 6 },

    // Frameworks (comme sur le CV)
    { title: 'Next.js', category: 'frameworks', order: 1 },
    { title: 'Vue.js', category: 'frameworks', order: 2 },
    { title: 'Node.js', category: 'frameworks', order: 3 },

    // Bases de données (comme sur le CV)
    { title: 'PostgreSQL', category: 'database', order: 1 },
    { title: 'SQLite', category: 'database', order: 2 },
    { title: 'Redis', category: 'database', order: 3 },

    // DevOps (comme sur le CV)
    { title: 'GitHub', category: 'devops', order: 1 },
    { title: 'Docker', category: 'devops', order: 2 },
    { title: 'GitHub Actions', category: 'devops', order: 3 },
    { title: 'Ansible', category: 'devops', order: 4 },

    // Langues parlées
    { title: 'Anglais (B2)', category: 'spoken', order: 1 },
    { title: 'Chinois (B1)', category: 'spoken', order: 2 },
  ]

  for (const skill of skills) {
    await prisma.skill.create({ data: skill })
  }
  console.log('Skills created')

  // ========== ABOUT SECTIONS ==========
  const aboutSections = [
    {
      key: 'intro',
      title: 'Qui suis-je ?',
      content: `Je m'appelle Boris CHENG, étudiant en 3ème année à Epitech Paris. Passionné par le développement logiciel, je me spécialise dans le développement Full-Stack avec une appétence particulière pour les architectures backend robustes et les interfaces utilisateur modernes.

Mon parcours atypique, de la cuisine au code, m'a appris l'importance de la rigueur, de la créativité et de la persévérance.`,
      order: 1,
    },
    {
      key: 'journey',
      title: 'Mon parcours',
      content: `Après un Bac Pro Cuisine au Lycée Jean Drouant, j'ai découvert ma passion pour l'informatique et rejoint Epitech en 2023.

Ce virage peut sembler surprenant, mais la cuisine et le code partagent beaucoup : la précision, la créativité, la gestion du stress et le travail en équipe. Ces compétences transférables m'ont permis de m'adapter rapidement à ce nouveau domaine.`,
      order: 2,
    },
    {
      key: 'experience',
      title: 'Expérience professionnelle',
      content: `J'ai eu l'opportunité de réaliser deux stages significatifs :

Chez Davensi (2025-2026), je développe des services backend en Go et des interfaces en Vue.js et React Native.

Chez Une Robe Un Soir (2024), j'ai créé des outils d'automatisation en Node.js pour optimiser les flux logistiques.`,
      order: 3,
    },
    {
      key: 'interests',
      title: 'Centres d\'intérêt',
      content: `🏐 Volley-ball : 2 ans de compétition en club et universitaire (STAPS), poste de Libéro/Passeur. Le sport m'a appris la discipline et l'esprit d'équipe.

🍳 Cuisine : Ma première passion. Gastronomie mondiale et défis culinaires (création de recettes).

✈️ Voyage : Curieux de découvrir le patrimoine historique et architectural du monde.

🎮 Jeux vidéo : Passion qui m'a naturellement mené vers le développement.`,
      order: 4,
    },
    {
      key: 'goal',
      title: 'Mon objectif',
      content: `Je recherche un stage de 4 mois (Avril - Juillet 2026) à Paris pour continuer à développer mes compétences en développement Full-Stack.

Mon ambition à long terme est de devenir un développeur polyvalent, maîtrisant aussi bien le backend que le frontend, avec des compétences solides en DevOps et une ouverture vers l'IA.`,
      order: 5,
    },
  ]

  for (const section of aboutSections) {
    await prisma.aboutSection.create({ data: section })
  }
  console.log('About sections created')

  console.log('✅ Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
