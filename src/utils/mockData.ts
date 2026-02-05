import { User, Project, UpsellFeature } from '../types';

export const mockUser: User = {
  id: '1',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@example.com',
  avatarUrl: 'https://images.pexels.com/photos/1081685/pexels-photo-1081685.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
  joinedDate: '2024-01-15'
};

export const mockProjects: Project[] = [
  {
    id: '1',
    storyId: 'story_001',
    title: "Sarah's Life Story",
    description: "My journey from childhood to motherhood",
    lastUpdated: '2024-12-19',
    progress: 65,
    totalQuestions: 72,
    answeredQuestions: 47,
    coverImage: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    isPurchased: true,
    purchaseDate: '2024-11-15',
    status: 'active',
    role: 'Mom',
    storytellerName: 'Sarah'
  },
  {
    id: '3',
    storyId: 'story_003',
    title: "Grandma's Recipe Collection",
    description: "Family recipes with their special stories",
    lastUpdated: '2024-12-18',
    progress: 85,
    totalQuestions: 72,
    answeredQuestions: 61,
    coverImage: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    isPurchased: true,
    purchaseDate: '2024-10-20',
    status: 'active',
    role: 'Grandma',
    storytellerName: 'Dorothy'
  }
];

export const upsellFeatures: UpsellFeature[] = [
  {
    id: '1',
    title: 'Premium AI Features',
    description: 'Professional voice cloning, extended audio library, and priority support',
    price: '$35',
    features: ['AI voice training', 'Natural narration', 'Multiple voice styles', 'Professional quality'],
    ctaText: 'Unlock AI Features',
    popular: true,
    icon: 'mic'
  },
  {
    id: '2',
    title: 'Hardcover Print',
    description: 'Premium linen cover • Photo-quality printing • Heirloom quality',
    price: '$79',
    features: ['Premium linen cover', 'Photo-quality printing', 'Heirloom quality', 'Fast shipping'],
    ctaText: 'Order Hardcover',
    icon: 'book-open'
  },
  {
    id: '3',
    title: 'Recipe Stories',
    description: 'Add family recipes with their special stories',
    price: '$8',
    features: ['Recipe organization', 'Story integration', 'Photo galleries', 'Print-ready format'],
    ctaText: 'Add Recipe Stories',
    icon: 'chef-hat'
  }
];

export const testCredentials = {
  email: 'sarah.johnson@example.com',
  password: 'demo123'
};