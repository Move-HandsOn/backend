import { Group, PrismaClient } from '@prisma/client';
import { group } from 'console';

const prisma = new PrismaClient();

interface GroupCreate {
  id: string,
  name: string,
  description: string,
  group_image: string,
  group_type: string,
  category_id: number
};

const groupsList: GroupCreate[] = [
  {
    id: "5b4c98a7-d9b8-4b3a-90a4-8e2e4f5d6b7c",
    name: "Corrida",
    description: "Para corredores de todos os níveis compartilharem dicas, rotas e motivação.",
    group_image: "https://images.unsplash.com/photo-1596460456678-760115935178?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    group_type: "public",
    category_id: 1
  },
  {
    id: "7a1d63b4-c8e4-4c8b-a2b3-6e3f7b9d1c2e",
    name: "Caminhada",
    description: "Grupo para quem ama caminhar e explorar trilhas urbanas e naturais.",
    group_image: "https://images.unsplash.com/photo-1629741153337-96bb44c544d9?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    group_type: "public",
    category_id: 2
  },
  {
    id: "8b2f34c5-a4d2-4c3f-91b4-d4e5f6a7b8c9",
    name: "Ciclismo",
    description: "Para os apaixonados por pedal, seja na cidade ou nas montanhas.",
    group_image: "https://images.unsplash.com/photo-1508842442050-9abc5a27dc14?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    group_type: "public",
    category_id: 3
  },
  {
    id: "9c3e45a6-b1d2-4c4f-82a5-b3e4f5d6a7b8",
    name: "Trilha",
    description: "Comunidade para aventureiros que adoram explorar trilhas e a natureza.",
    group_image: "https://images.unsplash.com/photo-1715312889999-1898f3f8fbbc?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    group_type: "public",
    category_id: 4
  },
  {
    id: "ad4f56b7-c2e1-4d5a-83b6-c4f3e5d6a7b9",
    name: "Futebol",
    description: "Grupo para jogadores e fãs de futebol trocarem dicas e marcar partidas.",
    group_image: "https://images.unsplash.com/photo-1634111852748-a75bb4adb649?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    group_type: "public",
    category_id: 5
  },
  {
    id: "be5d67c8-d3f1-4e6b-94c7-d5e3f6a7b8b0",
    name: "Basquete",
    description: "Para quem ama o basquete, seja na quadra ou apenas assistindo.",
    group_image: "https://images.unsplash.com/photo-1622991688971-9da04912bb69?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    group_type: "public",
    category_id: 6
  },
  {
    id: "cf6e78d9-e4f2-4f7c-a5d8-e6f4b5c7d9a1",
    name: "Vôlei",
    description: "Grupo para os apaixonados por vôlei compartilharem dicas e marcarem jogos.",
    group_image: "https://images.unsplash.com/photo-1562552052-f6dda78e2a4d?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    group_type: "public",
    category_id: 7
  },
  {
    id: "d07f89ea-f5a3-4e8d-b6e9-f7e5c6d8b9c2",
    name: "Tênis",
    description: "Para tenistas de todos os níveis discutirem estratégias e marcarem jogos.",
    group_image: "https://images.unsplash.com/photo-1530915365347-e35b749a0381?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    group_type: "public",
    category_id: 8
  },
  {
    id: "e18f9afb-f6a4-4f9e-c7f0-a8d6e7c9b1d3",
    name: "Natação",
    description: "Comunidade para nadadores trocarem experiências e dicas sobre natação.",
    group_image: "https://images.unsplash.com/photo-1600965962361-9035dbfd1c50?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    group_type: "public",
    category_id: 9
  },
  {
    id: "f29f0b0c-f7a5-4f0f-d8a1-b9e7f8d0c2e4",
    name: "Musculação",
    description: "Para quem ama academia, dicas de treinos e motivação para evoluir.",
    group_image:"https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    group_type: "public",
    category_id: 10
  },
  {
    id: "01a1c1d2-f8b6-5f1f-e9b2-c0f8d1e3b4d5",
    name: "Crossfit",
    description: "Para os fãs de Crossfit, trocando dicas de treinos e superação pessoal.",
    group_image: "https://images.unsplash.com/photo-1520787497953-1985ca467702?q=80&w=1354&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    group_type: "public",
    category_id: 11
  }
];


async function createGroup({id, name, description, group_image, group_type, category_id}: GroupCreate){
  const group = await prisma.group.upsert({
    where: {id},
    update: {},
    create: {
      id,
      name,
      description,
      created_at: new Date(),
      group_image,
      group_type,
      category_id
    }
  })
  return group
}

async function main() {
  const groups = await Promise.all(groupsList.map(async (group) => {
    const groupCreate = await createGroup(group);
    return groupCreate;
  }));

  console.log(groups);
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
