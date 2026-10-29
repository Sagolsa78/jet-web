import { z } from 'zod';

export const enquirySchema = z.object({
  // Step 1: Destination
  destination: z.string().min(1, 'Please enter a destination or select "Help me choose"'),
  
  // Step 2: Logistics
  departureCity: z.string().min(1, 'Departure city is required'),
  travelDate: z.string().optional(),
  travelMonth: z.string().min(1, 'Please specify a travel month or date'),
  
  // Step 3: Travellers
  adults: z.number().min(1, 'At least one adult is required'),
  children: z.number().min(0),
  childAges: z.array(z.string()).optional(),
  
  // Step 4: Budget
  budgetRange: z.string().min(1, 'Please select a budget range'),
  budgetIncludes: z.string().optional(),
  
  // Step 5: Preferences
  travelStyle: z.string().min(1, 'Please select a travel style'),
  interests: z.string().optional(),
  accommodationExpectations: z.string().optional(),
  notes: z.string().optional(),
  
  // Step 6: Contact
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number is required'),
  contactChannel: z.enum(['email', 'whatsapp', 'phone']),
  honeypot: z.string().optional(),
  consent: z.boolean().refine(value => value, {
    message: 'You must agree to the privacy policy',
  }),
});

export type EnquiryFormData = z.infer<typeof enquirySchema>;

export const callbackLeadSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name (at least 2 characters)'),
  phone: z
    .string()
    .trim()
    .min(10, 'Please enter a valid phone number (at least 10 digits)')
    .regex(/^[+]?[0-9\s\-()]{10,18}$/, 'Please enter a valid contact phone number'),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
  destination: z.string().optional(),
  packageId: z.string().optional(),
  packageTitle: z.string().optional(),
  travelMonth: z.string().optional(),
  travellers: z.number().int().min(1).optional(),
  budget: z.string().optional(),
  notes: z.string().optional(),
  source: z.enum(['header', 'package_card', 'package_detail', 'exit_popup', 'website']).optional(),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must agree to be contacted regarding your enquiry',
  }),
  honeypot: z.string().optional(),
});

export type CallbackLeadFormData = z.infer<typeof callbackLeadSchema>;