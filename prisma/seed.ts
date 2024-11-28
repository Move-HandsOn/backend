import { PrismaClient } from '@prisma/client';
import * as bcrypt from "bcrypt";
import { EEventType } from '../src/events/dto/create-event.dto';
import { toZonedTime } from 'date-fns-tz';

const prisma = new PrismaClient();

const timeZone = 'America/Sao_Paulo';

interface CategoryCreate {
  id: number;
  category_name: string;
}
interface GroupCreate {
  id: string,
  name: string,
  description: string,
  group_image: string,
  group_type: string,
  category_id: number
};

interface UserCreate {
  id: string;
  name: string;
  email: string;
  password: string;
  profile_image?: string | null;
  bio?: string | null;
  gender: string;
};
interface GroupMemberCreate {
  group_id: string;
  user_id: string;
}

interface FollowerCreate {
  follower_id: string;
  followed_id: string;
}

interface NotificationCreate {
  event_type: string;
  message: string;
  user_id: string;
  follower_id?: string;
  followed_id?: string;
  comment_id?: string;
  like_id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ActivityCreate {
  id: string;
  duration: number;
  activity_date: Date;
  description: string | null;
  post_type: string;
  category_id: number;
  user_id: string;
  group_id?: string | null;
  createdAt: Date;
}

interface MediaCreate {
  id: string;
  media_url: string;
  activity_id?: string;
  group_id?: string;
  user_id?: string;
  createdAt: Date;
}

export interface CommentCreate {
  id: string;
  comment_text: string;
  user_id: string;
  activity_id: string;
  created_at: Date;
}

export interface LikeCreate {
  id: string;
  user_id: string;
  activity_id?: string;
  comment_id?: string;
}

export type CreateEvent = {
  name: string;
  event_date: string;
  address: string;
  is_recurring?: boolean;
  recurrence_interval?: number;
  start_time: string;
  end_time: string;
  description?: string;
  event_type: EEventType;
  group_id?: string;
  user_id: string
};

const categoryList: CategoryCreate[] = [
  { id: 1, category_name: 'corrida' },
  { id: 2, category_name: 'caminhada' },
  { id: 3, category_name: 'ciclismo' },
  { id: 4, category_name: 'trilha' },
  { id: 5, category_name: 'futebol' },
  { id: 6, category_name: 'basquete' },
  { id: 7, category_name: 'volei' },
  { id: 8, category_name: 'tenis' },
  { id: 9, category_name: 'natacao' },
  { id: 10, category_name: 'musculacao' },
  { id: 11, category_name: 'crossfit' },
]

const groupsList: GroupCreate[] = [
  {
    id: "5b4c98a7-d9b8-4b3a-90a4-8e2e4f5d6b7c",
    name: "Corrida",
    description: "Para corredores de todos os níveis compartilharem dicas, rotas e motivação.",
    group_image: "https://nxtsdipismqpeplgkcya.supabase.co/storage/v1/object/public/move/1732553140162-243990280.jpg",
    group_type: "public",
    category_id: 1
  },
  {
    id: "7a1d63b4-c8e4-4c8b-a2b3-6e3f7b9d1c2e",
    name: "Caminhada",
    description: "Grupo para quem ama caminhar e explorar trilhas urbanas e naturais.",
    group_image: "https://nxtsdipismqpeplgkcya.supabase.co/storage/v1/object/public/move/assets/caminhada.jpeg",
    group_type: "public",
    category_id: 2
  },
  {
    id: "8b2f34c5-a4d2-4c3f-91b4-d4e5f6a7b8c9",
    name: "Ciclismo",
    description: "Para os apaixonados por pedal, seja na cidade ou nas montanhas.",
    group_image: "https://nxtsdipismqpeplgkcya.supabase.co/storage/v1/object/public/move/assets/ciclismo.jpg",
    group_type: "public",
    category_id: 3
  },
  {
    id: "9c3e45a6-b1d2-4c4f-82a5-b3e4f5d6a7b8",
    name: "Trilha",
    description: "Comunidade para aventureiros que adoram explorar trilhas e a natureza.",
    group_image: "https://nxtsdipismqpeplgkcya.supabase.co/storage/v1/object/public/move/assets/trilha.jpg",
    group_type: "public",
    category_id: 4
  },
  {
    id: "ad4f56b7-c2e1-4d5a-83b6-c4f3e5d6a7b9",
    name: "Futebol",
    description: "Grupo para jogadores e fãs de futebol trocarem dicas e marcar partidas.",
    group_image: "https://nxtsdipismqpeplgkcya.supabase.co/storage/v1/object/public/move/assets/futebol.jpg",
    group_type: "public",
    category_id: 5
  },
  {
    id: "be5d67c8-d3f1-4e6b-94c7-d5e3f6a7b8b0",
    name: "Basquete",
    description: "Para quem ama o basquete, seja na quadra ou apenas assistindo.",
    group_image: "https://nxtsdipismqpeplgkcya.supabase.co/storage/v1/object/public/move/1732553140162-570221375.jpg",
    group_type: "public",
    category_id: 6
  },
  {
    id: "cf6e78d9-e4f2-4f7c-a5d8-e6f4b5c7d9a1",
    name: "Vôlei",
    description: "Grupo para os apaixonados por vôlei compartilharem dicas e marcarem jogos.",
    group_image: "https://nxtsdipismqpeplgkcya.supabase.co/storage/v1/object/public/move/assets/volei.jpeg",
    group_type: "public",
    category_id: 7
  },
  {
    id: "d07f89ea-f5a3-4e8d-b6e9-f7e5c6d8b9c2",
    name: "Tênis",
    description: "Para tenistas de todos os níveis discutirem estratégias e marcarem jogos.",
    group_image: "https://nxtsdipismqpeplgkcya.supabase.co/storage/v1/object/public/move/assets/tenis.jpeg",
    group_type: "public",
    category_id: 8
  },
  {
    id: "e18f9afb-f6a4-4f9e-c7f0-a8d6e7c9b1d3",
    name: "Natação",
    description: "Comunidade para nadadores trocarem experiências e dicas sobre natação.",
    group_image: "https://nxtsdipismqpeplgkcya.supabase.co/storage/v1/object/public/move/assets/natacao.jpg",
    group_type: "public",
    category_id: 9
  },
  {
    id: "f29f0b0c-f7a5-4f0f-d8a1-b9e7f8d0c2e4",
    name: "Musculação",
    description: "Para quem ama academia, dicas de treinos e motivação para evoluir.",
    group_image:"https://nxtsdipismqpeplgkcya.supabase.co/storage/v1/object/public/move/assets/academia.webp",
    group_type: "public",
    category_id: 10
  },
  {
    id: "01a1c1d2-f8b6-5f1f-e9b2-c0f8d1e3b4d5",
    name: "Crossfit",
    description: "Para os fãs de Crossfit, trocando dicas de treinos e superação pessoal.",
    group_image: "https://nxtsdipismqpeplgkcya.supabase.co/storage/v1/object/public/move/assets/crossfit.png",
    group_type: "public",
    category_id: 11
  }
];

const usersList: UserCreate[] = [
  {
    id: "394051cf-c21f-40f1-8028-1cdf35ff6418",
    name: "Ana Souza",
    email: "ana.souza@example.com",
    password: "hashed_password_1",
    profile_image: "https://nxtsdipismqpeplgkcya.supabase.co/storage/v1/object/public/move/assets/ana.jpg",
    bio: "Apaixonada por esportes e desafios ao ar livre.",
    gender: "female",
  },
  {
    id: "8b2e3aad-3384-4358-99f3-e88ecf25b720",
    name: "Carlos Lima",
    email: "carlos.lima@example.com",
    password: "hashed_password_2",
    profile_image: "https://nxtsdipismqpeplgkcya.supabase.co/storage/v1/object/public/move/assets/carlos.jpg",
    bio: "Entusiasta de ciclismo e corridas.",
    gender: "male",
  },
  {
    id: "a5a00d08-8170-4019-848e-76679eab24c9",
    name: "Bruna Martins",
    email: "bruna.martins@example.com",
    password: "hashed_password_3",
    profile_image: "https://nxtsdipismqpeplgkcya.supabase.co/storage/v1/object/public/move/assets/bruna.jpg",
    bio: "Amante de natação e trilhas.",
    gender: "female",
  },
  {
    id: "d00f5934-48ae-417f-9e7b-db33600c5143",
    name: "Diego Oliveira",
    email: "diego.oliveira@example.com",
    password: "hashed_password_4",
    profile_image: "https://nxtsdipismqpeplgkcya.supabase.co/storage/v1/object/public/move/assets/diego.webp",
    bio: "Focado em musculação e treinos funcionais.",
    gender: "male",
  },
  {
    id: "f65bc5f9-e2c3-4e1e-bf99-e98eae7c49e6",
    name: "Fernanda Silva",
    email: "fernanda.silva@example.com",
    password: "hashed_password_5",
    profile_image: "https://nxtsdipismqpeplgkcya.supabase.co/storage/v1/object/public/move/assets/fernanda.jpg",
    bio: "Jogadora de vôlei e fã de esportes coletivos.",
    gender: "female",
  },
  {
    id: "fb38c8e5-c7d2-4413-b3ae-b43cfa3b3502",
    name: "Lucas Pereira",
    email: "lucas.pereira@example.com",
    password: "hashed_password_6",
    profile_image: "https://nxtsdipismqpeplgkcya.supabase.co/storage/v1/object/public/move/assets/lucas.jpeg",
    bio: "Praticante de crossfit e escalada.",
    gender: "male",
  },
];

const groupMembers = [
  { group_id: '5b4c98a7-d9b8-4b3a-90a4-8e2e4f5d6b7c', user_id: '394051cf-c21f-40f1-8028-1cdf35ff6418' },
  { group_id: '7a1d63b4-c8e4-4c8b-a2b3-6e3f7b9d1c2e', user_id: '8b2e3aad-3384-4358-99f3-e88ecf25b720' },
  { group_id: '8b2f34c5-a4d2-4c3f-91b4-d4e5f6a7b8c9', user_id: 'a5a00d08-8170-4019-848e-76679eab24c9' },
  { group_id: '9c3e45a6-b1d2-4c4f-82a5-b3e4f5d6a7b8', user_id: '394051cf-c21f-40f1-8028-1cdf35ff6418' },
  { group_id: 'ad4f56b7-c2e1-4d5a-83b6-c4f3e5d6a7b9', user_id: 'a5a00d08-8170-4019-848e-76679eab24c9' },
  { group_id: 'be5d67c8-d3f1-4e6b-94c7-d5e3f6a7b8b0', user_id: '8b2e3aad-3384-4358-99f3-e88ecf25b720' },
];

const followRelations: FollowerCreate[] = [
  { follower_id: "394051cf-c21f-40f1-8028-1cdf35ff6418", followed_id: "8b2e3aad-3384-4358-99f3-e88ecf25b720" },
  { follower_id: "8b2e3aad-3384-4358-99f3-e88ecf25b720", followed_id: "a5a00d08-8170-4019-848e-76679eab24c9" },
  { follower_id: "a5a00d08-8170-4019-848e-76679eab24c9", followed_id: "394051cf-c21f-40f1-8028-1cdf35ff6418" },
  { follower_id: "394051cf-c21f-40f1-8028-1cdf35ff6418", followed_id: "a5a00d08-8170-4019-848e-76679eab24c9" },
  { follower_id: "8b2e3aad-3384-4358-99f3-e88ecf25b720", followed_id: "394051cf-c21f-40f1-8028-1cdf35ff6418" },
  { follower_id: "a5a00d08-8170-4019-848e-76679eab24c9", followed_id: "8b2e3aad-3384-4358-99f3-e88ecf25b720" },
];

const activitiesList: ActivityCreate[] = [
  {
    id: "fcbf0d2b-30be-4c76-b55a-d2be497c3ad1",
    duration: 60,
    activity_date: new Date('2024-11-27T08:00:00Z'),
    description: "Corrida matinal no parque.",
    post_type: "profile",
    category_id: 1,
    user_id: "394051cf-c21f-40f1-8028-1cdf35ff6418",
    createdAt: new Date(),
  },
  {
    id: "abe6bcf9-56c4-47c4-bde1-b7b785cf5416",
    duration: 4500,
    activity_date: new Date('2024-11-27T09:00:00Z'),
    description: "Treino de musculação na academia.",
    post_type: "profile",
    category_id: 10,
    user_id: "8b2e3aad-3384-4358-99f3-e88ecf25b720",
    createdAt: new Date(),
  },
  {
    id: "2c3e892a-9514-46d1-8f89-fcc1b6d60fe7",
    duration: 12000,
    activity_date: new Date('2024-11-28T10:00:00Z'),
    description: "Caminhada em grupo no parque central.",
    post_type: "group",
    category_id: 2,
    user_id: "394051cf-c21f-40f1-8028-1cdf35ff6418",
    group_id: "5b4c98a7-d9b8-4b3a-90a4-8e2e4f5d6b7c",
    createdAt: new Date(),
  },
  {
    id: "fbc8b82c-0db2-4eac-b9b6-b5f2c9112f67",
    duration: 9000,
    activity_date: new Date('2024-11-29T11:00:00Z'),
    description: "Jogo de futebol entre membros do grupo.",
    post_type: "group",
    category_id: 5,
    user_id: "8b2e3aad-3384-4358-99f3-e88ecf25b720",
    group_id: "ad4f56b7-c2e1-4d5a-83b6-c4f3e5d6a7b9",
    createdAt: new Date(),
  },
  {
    id: "8b22e879-e5c5-4c5a-b762-d27fcbf12a3d",
    duration: 3000,
    activity_date: new Date('2024-11-29T14:00:00Z'),
    description: "Ciclismo pelas ruas da cidade.",
    post_type: "profile",
    category_id: 3,
    user_id: "a5a00d08-8170-4019-848e-76679eab24c9",
    createdAt: new Date(),
  },
  {
    id: "7ad7ad07-0e65-4731-b4d9-40789e49ac2f",
    duration: 7500,
    activity_date: new Date('2024-11-30T08:30:00Z'),
    description: "Treino de basquete com os amigos.",
    post_type: "profile",
    category_id: 6,
    user_id: "d00f5934-48ae-417f-9e7b-db33600c5143",
    createdAt: new Date(),
  },
  {
    id: "d47760b1-b9e1-4207-9db1-f31b01b29d88",
    duration: 5000,
    activity_date: new Date('2024-11-30T15:00:00Z'),
    description: "Trilha nas montanhas.",
    post_type: "group",
    category_id: 4,
    user_id: "394051cf-c21f-40f1-8028-1cdf35ff6418",
    group_id: "5b4c98a7-d9b8-4b3a-90a4-8e2e4f5d6b7c",
    createdAt: new Date(),
  },
  {
    id: "75ed44b3-67c2-4cc3-9318-d4d91c1b0b8f",
    duration: 6000,
    activity_date: new Date('2024-12-01T09:00:00Z'),
    description: "Jogo de vôlei no clube.",
    post_type: "group",
    category_id: 7,
    user_id: "8b2e3aad-3384-4358-99f3-e88ecf25b720",
    group_id: "ad4f56b7-c2e1-4d5a-83b6-c4f3e5d6a7b9",
    createdAt: new Date(),
  },
  {
    id: "1a6f5ab6-6f68-41fc-b71b-c9e33f28998d",
    duration: 9000,
    activity_date: new Date('2024-12-02T16:00:00Z'),
    description: "Tennis com os amigos.",
    post_type: "profile",
    category_id: 8,
    user_id: "394051cf-c21f-40f1-8028-1cdf35ff6418",
    createdAt: new Date(),
  },
  {
    id: "c9f1595e-cb1c-4e3e-b951-8c6b77f01575",
    duration: 8000,
    activity_date: new Date('2024-12-02T18:00:00Z'),
    description: "Atividade de natação no clube.",
    post_type: "profile",
    category_id: 9,
    user_id: "8b2e3aad-3384-4358-99f3-e88ecf25b720",
    createdAt: new Date(),
  },
];

const activityMediaList: MediaCreate[] = [
   // Atividade 1 - Corrida
  {
    id: "a3e4e20f-879e-48f4-b96e-df16fc4462d7",
    media_url: "https://nxtsdipismqpeplgkcya.supabase.co/storage/v1/object/public/move/assets/corrida-matinal.jpeg",
    activity_id: "fcbf0d2b-30be-4c76-b55a-d2be497c3ad1",
    createdAt: new Date(),
  },
  // Atividade 2 - Musculação
  {
    id: "a7f8d6c8-6a9b-4f12-9804-9e5cfedb5c88",
    media_url: "https://nxtsdipismqpeplgkcya.supabase.co/storage/v1/object/public/move/assets/musculacao-academia.jpeg",
    activity_id: "abe6bcf9-56c4-47c4-bde1-b7b785cf5416",
    createdAt: new Date(),
  },

  // Atividade 3 - Caminhada
  {
    id: "d5c72f72-eaf8-4303-b2d5-9b0b5f6f4c73",
    media_url: "https://nxtsdipismqpeplgkcya.supabase.co/storage/v1/object/public/move/assets/caminhada-parque.jpg",
    activity_id: "2c3e892a-9514-46d1-8f89-fcc1b6d60fe7",
    createdAt: new Date(),
  },
  // Atividade 4 - Futebol
  {
    id: "fe035dd3-4320-47cc-91a1-530b8e1f6ca7",
    media_url: "https://nxtsdipismqpeplgkcya.supabase.co/storage/v1/object/public/move/assets/jogo-futebol-2.jpeg",
    activity_id: "fbc8b82c-0db2-4eac-b9b6-b5f2c9112f67",
    createdAt: new Date(),
  },
  {
    id: "3f48d4d2-8e9a-4b4e-bb8c-2c5a3b51e9f3",
    media_url: "https://nxtsdipismqpeplgkcya.supabase.co/storage/v1/object/public/move/assets/jogo%20futebol.jpg",
    activity_id: "fbc8b82c-0db2-4eac-b9b6-b5f2c9112f67",
    createdAt: new Date(),
  },
  // Atividade 5 - Ciclismo
  {
    id: "745c8407-4baf-4319-aac1-e4a3b5fd8b68",
    media_url: "https://nxtsdipismqpeplgkcya.supabase.co/storage/v1/object/public/move/assets/ciclismo-amigos.jpeg",
    activity_id: "8b22e879-e5c5-4c5a-b762-d27fcbf12a3d",
    createdAt: new Date(),
  },
  {
    id: "6d9a6827-e21f-42b9-8492-5e47b52ec191",
    media_url: "https://nxtsdipismqpeplgkcya.supabase.co/storage/v1/object/public/move/assets/ciclismo-amigos-.jpg",
    activity_id: "8b22e879-e5c5-4c5a-b762-d27fcbf12a3d",
    createdAt: new Date(),
  },
  // Atividade 6 - Basquete
  {
    id: "c91e5f50-dc07-48a6-8186-2b57725c3f98",
    media_url: "https://nxtsdipismqpeplgkcya.supabase.co/storage/v1/object/public/move/assets/basquete-amigos.jpeg",
    activity_id: "7ad7ad07-0e65-4731-b4d9-40789e49ac2f",
    createdAt: new Date(),
  },
  // Atividade 7 - Vôlei
  {
    id: "932a9c9b-df0a-47da-b02d-e2b96331a1b9",
    media_url: "https://nxtsdipismqpeplgkcya.supabase.co/storage/v1/object/public/move/assets/volei-amigos.webp",
    activity_id: "75ed44b3-67c2-4cc3-9318-d4d91c1b0b8f",
    createdAt: new Date(),
  },
  // Atividade 8 - Tennis
  {
    id: "9e17a6f7-44b7-469f-a5da-7fe7a831a61e",
    media_url: "https://nxtsdipismqpeplgkcya.supabase.co/storage/v1/object/public/move/assets/tenis.jpeg",
    activity_id: "1a6f5ab6-6f68-41fc-b71b-c9e33f28998d",
    createdAt: new Date(),
  },
  // Atividade 9 - Natação
  {
    id: "34d7c65b-f35a-4c72-84c0-bf64d72b81fc",
    media_url: "https://nxtsdipismqpeplgkcya.supabase.co/storage/v1/object/public/move/assets/natacao-criancas.jpeg",
    activity_id: "c9f1595e-cb1c-4e3e-b951-8c6b77f01575",
    createdAt: new Date(),
  },
];

const activityLikes: LikeCreate[] = [
  {
    id: "l1",
    user_id: "394051cf-c21f-40f1-8028-1cdf35ff6418",  // Usuário 1
    activity_id: "fcbf0d2b-30be-4c76-b55a-d2be497c3ad1", // Atividade: Corrida matinal
  },
  {
    id: "l2",
    user_id: "8b2e3aad-3384-4358-99f3-e88ecf25b720",  // Usuário 2
    activity_id: "abe6bcf9-56c4-47c4-bde1-b7b785cf5416", // Atividade: Treino de musculação
  },
  {
    id: "l3",
    user_id: "a5a00d08-8170-4019-848e-76679eab24c9",  // Usuário 3
    activity_id: "2c3e892a-9514-46d1-8f89-fcc1b6d60fe7", // Atividade: Caminhada em grupo
  },
  {
    id: "l4",
    user_id: "d00f5934-48ae-417f-9e7b-db33600c5143",  // Usuário 4
    activity_id: "fbc8b82c-0db2-4eac-b9b6-b5f2c9112f67", // Atividade: Jogo de futebol
  },
  {
    id: "l5",
    user_id: "394051cf-c21f-40f1-8028-1cdf35ff6418",  // Usuário 1
    activity_id: "8b22e879-e5c5-4c5a-b762-d27fcbf12a3d", // Atividade: Ciclismo
  }
];

const activityComments: CommentCreate[] = [
  {
    id: "c1",
    comment_text: "Adoro correr pela manhã! É uma ótima forma de começar o dia.",
    user_id: "8b2e3aad-3384-4358-99f3-e88ecf25b720",  // Usuário 2
    activity_id: "fcbf0d2b-30be-4c76-b55a-d2be497c3ad1", // Atividade: Corrida matinal
    created_at: new Date('2024-11-27T08:15:00Z')
  },
  {
    id: "c2",
    comment_text: "Amo musculação! Sempre me sinto mais forte depois de um treino.",
    user_id: "394051cf-c21f-40f1-8028-1cdf35ff6418",  // Usuário 1
    activity_id: "abe6bcf9-56c4-47c4-bde1-b7b785cf5416", // Atividade: Treino de musculação
    created_at: new Date('2024-11-27T09:10:00Z')
  },
  {
    id: "c3",
    comment_text: "Caminhada no parque é sempre revigorante. Vamos mais vezes!",
    user_id: "a5a00d08-8170-4019-848e-76679eab24c9",  // Usuário 3
    activity_id: "2c3e892a-9514-46d1-8f89-fcc1b6d60fe7", // Atividade: Caminhada em grupo
    created_at: new Date('2024-11-28T10:30:00Z')
  },
  {
    id: "c4",
    comment_text: "Jogo de futebol com a galera, sempre bom para a diversão e saúde!",
    user_id: "d00f5934-48ae-417f-9e7b-db33600c5143",  // Usuário 4
    activity_id: "fbc8b82c-0db2-4eac-b9b6-b5f2c9112f67", // Atividade: Jogo de futebol
    created_at: new Date('2024-11-29T11:30:00Z')
  },
  {
    id: "c5",
    comment_text: "Ótimo pedal! As ruas estão mais tranquilas no final de semana.",
    user_id: "394051cf-c21f-40f1-8028-1cdf35ff6418",  // Usuário 1
    activity_id: "8b22e879-e5c5-4c5a-b762-d27fcbf12a3d", // Atividade: Ciclismo
    created_at: new Date('2024-11-29T14:15:00Z')
  }
];

const commentLikes: LikeCreate[] = [
  {
    id: "lc1",
    user_id: "394051cf-c21f-40f1-8028-1cdf35ff6418",  // Usuário 1
    comment_id: "c1",  // Curtindo comentário da Corrida matinal
  },
  {
    id: "lc2",
    user_id: "a5a00d08-8170-4019-848e-76679eab24c9",  // Usuário 3
    comment_id: "c2",  // Curtindo comentário de Musculação
  },
  {
    id: "lc3",
    user_id: "8b2e3aad-3384-4358-99f3-e88ecf25b720",  // Usuário 2
    comment_id: "c3",  // Curtindo comentário de Caminhada
  },
  {
    id: "lc4",
    user_id: "d00f5934-48ae-417f-9e7b-db33600c5143",  // Usuário 4
    comment_id: "c4",  // Curtindo comentário de Futebol
  },
  {
    id: "lc5",
    user_id: "394051cf-c21f-40f1-8028-1cdf35ff6418",  // Usuário 1
    comment_id: "c5",  // Curtindo comentário de Ciclismo
  }
];

const events: CreateEvent[] = [
  {
    name: "Corrida Matinal no Parque",
    event_date: toZonedTime(new Date(Date.now() - 24 * 60 * 60 * 1000), timeZone).toISOString(), // Ontem
    address: "Parque Ibirapuera, São Paulo",
    start_time: toZonedTime(new Date(new Date().setHours(6, 0, 0, 0)), timeZone).toISOString(),
    end_time: toZonedTime(new Date(new Date().setHours(8, 0, 0, 0)), timeZone).toISOString(),
    description: "Encontro para corrida em grupo.",
    event_type: EEventType.GROUP,
    group_id: "5b4c98a7-d9b8-4b3a-90a4-8e2e4f5d6b7c",
    user_id: "394051cf-c21f-40f1-8028-1cdf35ff6418", // Membro do grupo
  },
  {
    name: "Treino Funcional na Praia",
    event_date: toZonedTime(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), timeZone).toISOString(), // 2 dias atrás
    address: "Praia de Copacabana, Rio de Janeiro",
    start_time: toZonedTime(new Date(new Date().setHours(7, 0, 0, 0)), timeZone).toISOString(),
    end_time: toZonedTime(new Date(new Date().setHours(9, 0, 0, 0)), timeZone).toISOString(),
    description: "Treino funcional ao ar livre.",
    event_type: EEventType.PROFILE,
    user_id: "8b2e3aad-3384-4358-99f3-e88ecf25b720", // Usuário 2
  },
  {
    name: "Ciclismo na Serra",
    event_date: toZonedTime(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), timeZone).toISOString(), // 3 dias atrás
    address: "Serra da Mantiqueira, SP",
    start_time: toZonedTime(new Date(new Date().setHours(8, 0, 0, 0)), timeZone).toISOString(),
    end_time: toZonedTime(new Date(new Date().setHours(12, 0, 0, 0)), timeZone).toISOString(),
    description: "Pedalada em grupo na serra.",
    event_type: EEventType.GROUP,
    group_id: "7a1d63b4-c8e4-4c8b-a2b3-6e3f7b9d1c2e",
    user_id: "8b2e3aad-3384-4358-99f3-e88ecf25b720", // Membro do grupo
  },
  {
    name: "Caminhada Ecológica",
    event_date: toZonedTime(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), timeZone).toISOString(), // 4 dias atrás
    address: "Floresta da Tijuca, RJ",
    start_time: toZonedTime(new Date(new Date().setHours(9, 0, 0, 0)), timeZone).toISOString(),
    end_time: toZonedTime(new Date(new Date().setHours(12, 0, 0, 0)), timeZone).toISOString(),
    description: "Caminhada para apreciar a natureza.",
    event_type: EEventType.PROFILE,
    user_id: "a5a00d08-8170-4019-848e-76679eab24c9", // Usuário 3
  },
  {
    name: "Torneio de Vôlei",
    event_date: toZonedTime(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), timeZone).toISOString(), // 5 dias atrás
    address: "Ginásio Poliesportivo, SP",
    start_time: toZonedTime(new Date(new Date().setHours(14, 0, 0, 0)), timeZone).toISOString(),
    end_time: toZonedTime(new Date(new Date().setHours(18, 0, 0, 0)), timeZone).toISOString(),
    description: "Torneio de vôlei amador.",
    event_type: EEventType.GROUP,
    group_id: "8b2f34c5-a4d2-4c3f-91b4-d4e5f6a7b8c9",
    user_id: "a5a00d08-8170-4019-848e-76679eab24c9", // Membro do grupo
  },
  {
    name: "Yoga ao Nascer do Sol",
    event_date: toZonedTime(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), timeZone).toISOString(), // 6 dias atrás
    address: "Praça da Liberdade, Belo Horizonte",
    start_time: toZonedTime(new Date(new Date().setHours(6, 30, 0, 0)), timeZone).toISOString(),
    end_time: toZonedTime(new Date(new Date().setHours(8, 0, 0, 0)), timeZone).toISOString(),
    description: "Sessão de yoga ao ar livre.",
    event_type: EEventType.PROFILE,
    user_id: "394051cf-c21f-40f1-8028-1cdf35ff6418", // Usuário 1
  },
  {
    name: "Trilha do Pico do Jaraguá",
    event_date: toZonedTime(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), timeZone).toISOString(), // 2 dias atrás
    address: "Pico do Jaraguá, SP",
    start_time: toZonedTime(new Date(new Date().setHours(8, 0, 0, 0)), timeZone).toISOString(),
    end_time: toZonedTime(new Date(new Date().setHours(11, 0, 0, 0)), timeZone).toISOString(),
    description: "Trilha com paisagens incríveis.",
    event_type: EEventType.GROUP,
    group_id: "9c3e45a6-b1d2-4c4f-82a5-b3e4f5d6a7b8",
    user_id: "394051cf-c21f-40f1-8028-1cdf35ff6418", // Membro do grupo
  },
  {
    name: "Aula de Natação",
    event_date: toZonedTime(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), timeZone).toISOString(), // Ontem
    address: "Clube Pinheiros, São Paulo",
    start_time: toZonedTime(new Date(new Date().setHours(18, 0, 0, 0)), timeZone).toISOString(),
    end_time: toZonedTime(new Date(new Date().setHours(19, 0, 0, 0)), timeZone).toISOString(),
    description: "Aula de natação avançada.",
    event_type: EEventType.PROFILE,
    user_id: "8b2e3aad-3384-4358-99f3-e88ecf25b720", // Usuário 2
  },
  {
    name: "Treino de Crossfit",
    event_date: toZonedTime(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), timeZone).toISOString(), // 7 dias atrás
    address: "Box Crossfit SP, São Paulo",
    start_time: toZonedTime(new Date(new Date().setHours(7, 0, 0, 0)), timeZone).toISOString(),
    end_time: toZonedTime(new Date(new Date().setHours(8, 30, 0, 0)), timeZone).toISOString(),
    description: "Treino intenso para todos os níveis.",
    event_type: EEventType.PROFILE,
    user_id: "a5a00d08-8170-4019-848e-76679eab24c9", // Usuário 3
  },
];


async function createMedia({ id, media_url, activity_id, group_id, user_id }: MediaCreate) {
  await prisma.media.create({
    data: {
      id,
      media_url,
      activity_id,
      group_id,
      user_id,
    }
  })
}

async function createCategory({ id, category_name }: CategoryCreate ){
  await prisma.category.upsert({
    where: { id },
    update: {},
    create: {
      id,
      category_name
    }
  })
}

async function createGroup({id, name, description, group_image, group_type, category_id}: GroupCreate){
  await prisma.group.upsert({
    where: { id },
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

  await createMedia({
    id,
    createdAt: new Date(),
    media_url:  group_image
  })
}

async function createUser({ id, name, email, password, bio, gender, profile_image }: UserCreate) {
  await prisma.user.upsert({
    where: { id },
    update: {},
    create: {
      id,
      name,
      email,
      password: bcrypt.hashSync(password, 10),
      created_at: new Date(),
      bio,
      gender,
      profile_image
    },
  });

  await createMedia({
    id,
    createdAt: new Date(),
    user_id: id,
    media_url: profile_image
  })
}

async function addUserGroup({ group_id, user_id }: GroupMemberCreate) {
  await prisma.groupMember.upsert({
    where: {
      group_id_user_id: {
        user_id,
        group_id
      }
    },
    update: {},
    create: {
      group_id,
      user_id
    },
  });
}

async function followUser({ follower_id, followed_id }: FollowerCreate) {
  const follow = await prisma.follower.create({
    data: {
      follower_id,
      followed_id,
    },
    select: {
      follower: {
        select: {
          name: true
        }
      }
    }
  });

  const notification: NotificationCreate = {
    event_type: "new_follower",
    message: `${follow.follower.name} segiu você.`,
    user_id: followed_id,
    follower_id,
    followed_id,
  };

  await prisma.notification.create({
    data: notification,
  });
}

async function createActivity({ id, description, duration, activity_date, category_id, post_type, user_id, group_id, createdAt }: ActivityCreate) {
  await prisma.activity.create({
    data: {
      id,
      description,
      duration,
      activity_date,
      category_id,
      post_type,
      user_id,
      group_id,
      created_at: createdAt,
    },
  });
}

async function createComment({ id, user_id, activity_id, comment_text, created_at }: CommentCreate) {
  const comment = await prisma.comment.create({
    data: {
      id,
      comment_text,
      user_id,
      created_at,
      activity_id
    }
  })

  const activity = await prisma.activity.findFirst({
    where: {
      id: activity_id
    },
    select: {
      user: {
        select: {
          id: true,
          name: true,
        }
      }
    }
  })

  const notification: NotificationCreate = {
    event_type: "comment_on_activity",
    message: `${activity.user.name} comentou na sua atividade.`,
    user_id: activity.user.id,
    comment_id: comment.id
  };

  await prisma.notification.create({
    data: notification,
  });
}

async function createLike({ id, user_id, comment_id, activity_id }: LikeCreate){
  const like = await prisma.like.create({
    data: {
      id,
      user_id,
      comment_id,
      activity_id
    },
    include: {
      user: {
        select: {
          name: true,
        }
      }
    }
  });

  if(comment_id) {
    const comment = await prisma.comment.findFirst({
      where: {
        id: comment_id
      },
      select: {
        user: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    const notification: NotificationCreate = {
      event_type: "like_on_comment",
      message: `${like.user.name} curtiu seu comentário.`,
      user_id: comment.user.id,
      like_id: like.id
    };

    await prisma.notification.create({
      data: notification,
    });
  } else {
    const activity = await prisma.activity.findFirst({
      where: {
        id: activity_id
      },
      select: {
        user: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    const notification: NotificationCreate = {
      event_type: "like_on_activity",
      message: `${like.user.name} curtiu sua atividade.`,
      user_id: activity.user.id,
      like_id: like.id
    };

    await prisma.notification.create({
      data: notification,
    });
  }
}

async function CreateEvent(event: CreateEvent) {
  await prisma.event.create({
    data: event,
  })
}

async function main() {
  await Promise.all(categoryList.map(async (category) => {
    await createCategory(category)
  }))

  await Promise.all(groupsList.map(async (group) => {
    await createGroup(group);
  }));

  await Promise.all(usersList.map(async (user) => {
    await createUser(user)
  }))

  await Promise.all(groupMembers.map(async (request) => {
    await addUserGroup(request)
  }))

  await Promise.all(followRelations.map(async (follow) => {
    await followUser(follow)
  }))

  await Promise.all(activitiesList.map(async (activity) => {
    await createActivity(activity)
  }))

  await Promise.all(activityMediaList.map(async (media) => {
    await createMedia(media)
  }))

  await Promise.all(activityLikes.map(async (like) => {
    await createLike(like)
  }))

  await Promise.all(activityComments.map(async (comment) => {
    await createComment(comment)
  }))

  await Promise.all(commentLikes.map(async (like) => {
    await createLike(like)
  }))

  await Promise.all(events.map(async (event) => {
    await CreateEvent(event)
  }))
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
