/**
 * Jeto Vacations — Digital Proposal Data Contract & TypeScript Models
 * Aligned with Database Migration 001_proposals_schema.sql (Supabase / PostgreSQL)
 */

export type ProposalStatus =
  | 'draft'
  | 'published'
  | 'accepted'
  | 'revision_requested'
  | 'expired'
  | 'revoked';

export interface ProposalConsultant {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  avatarUrl?: string;
  role: 'consultant' | 'senior_consultant' | 'manager' | 'admin';
}

export interface ProposalItineraryDay {
  id?: string;
  dayNumber: number;
  title: string;
  description: string;
  hotelName?: string;
  hotelTier?: string;
  roomType?: string;
  mealPlan?: string;
  transfers?: string;
  activities: string[];
  imageUrl?: string;
}

export interface PaymentMilestone {
  percentage: number;
  description: string;
  dueCondition: string;
}

export interface ClientProposalView {
  id: string;
  token: string;
  clientName: string;
  destinationName: string;
  destinationSlug: string;
  packageTitle: string;
  travelStyle: string;
  departureCity: string;
  travelMonth: string;
  paxAdults: number;
  paxChildren: number;
  totalDays: number;
  totalNights: number;
  currency: string;
  basePricePerPerson: number;
  totalPrice: number;
  flightsIncluded: boolean;
  priceBasis: string;
  pricingNotes?: string;
  inclusions: string[];
  exclusions: string[];
  cancellationPolicy?: string;
  paymentMilestones: PaymentMilestone[];
  status: ProposalStatus;
  expiresAt: string;
  createdAt: string;
  consultant: {
    fullName: string;
    phone: string;
    whatsappNumber: string;
    avatarUrl?: string;
  };
  itinerary: ProposalItineraryDay[];
}

export interface CreateProposalPayload {
  consultantId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  departureCity: string;
  travelMonth: string;
  paxAdults: number;
  paxChildren: number;
  destinationName: string;
  destinationSlug: string;
  packageSlug?: string;
  packageTitle: string;
  travelStyle: string;
  totalDays: number;
  totalNights: number;
  currency: string;
  basePricePerPerson: number;
  totalPrice: number;
  flightsIncluded: boolean;
  priceBasis?: string;
  pricingNotes?: string;
  inclusions: string[];
  exclusions: string[];
  cancellationPolicy?: string;
  paymentMilestones: PaymentMilestone[];
  internalNotes?: string;
  expiresInDays?: number; // defaults to 30
  itinerary: Omit<ProposalItineraryDay, 'id'>[];
}
