import { z } from "zod"
// Schema definitions with proper validation - UPDATED to match backend
export const scheduleSchema = z.object({
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),
    delivery_method: z.enum(["delivery", "pickup"]).default("delivery"),
    delivery_address: z.string().min(1, "Delivery address is required"),
    // Removed special_instructions from here - it goes to root level
})

export const personalDetailsSchema = z.object({
    user_id: z.string().min(1, "User ID is required"),
    first_name: z.string().min(1, "First name is required").min(2, "First name must be at least 2 characters"),
    last_name: z.string().min(1, "Last name is required").min(2, "Last name must be at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
    // Updated to match backend validation
    phone_number: z.string().min(3, "Phone number is required"),
    // Updated to match backend validation
    date_of_birth: z.string().datetime("Date of birth must be a valid ISO date"),
})

export const paymentMethodSchema = z.object({
    type: z.enum(["gcash"]).default("gcash"),
    // Simplified to match backend - only gcash_number
    gcash_number: z.string().min(1, "GCash number is required")
        .regex(/^\+63\d{10}$/, "Please enter a valid Philippine GCash number"),
})

export const agreementsSchema = z.object({
    terms_accepted: z.boolean().refine(val => val === true, "You must accept the terms and conditions"),
    damage_policy: z.boolean().refine(val => val === true, "You must accept the damage policy"),
    cancellation_policy: z.boolean().refine(val => val === true, "You must accept the cancellation policy"),
})

// Main schema - all fields are required for final submission
export const rentalBookingSchema = z.object({
    costume_id: z.string().min(1, "Costume ID is required"),
    schedule: scheduleSchema,
    personal_details: personalDetailsSchema,
    payment_method: paymentMethodSchema,
    agreements: agreementsSchema,
    // Add special_instructions at root level to match backend
    special_instructions: z.string().optional().default(""),
})

// Partial schema for step-by-step validation (optional fields for intermediate steps)
export const partialScheduleSchema = scheduleSchema.partial()
export const partialPersonalDetailsSchema = personalDetailsSchema.partial()
export const partialPaymentMethodSchema = paymentMethodSchema.partial()
export const partialAgreementsSchema = agreementsSchema.partial()

export const partialRentalBookingSchema = z.object({
    costume_id: z.string().optional(),
    schedule: partialScheduleSchema.optional(),
    personal_details: partialPersonalDetailsSchema.optional(),
    payment_method: partialPaymentMethodSchema.optional(),
    agreements: partialAgreementsSchema.optional(),
})

// Type exports
export type ScheduleData = z.infer<typeof scheduleSchema>
export type PersonalDetailsData = z.infer<typeof personalDetailsSchema>
export type PaymentMethodData = z.infer<typeof paymentMethodSchema>
export type AgreementsData = z.infer<typeof agreementsSchema>
export type RentalBookingFormData = z.infer<typeof rentalBookingSchema>
export type PartialRentalBookingFormData = z.infer<typeof partialRentalBookingSchema>

// Type for booking steps
export type BookingStep = "schedule" | "personal" | "payment" | "summary"

// Interface for booking step configuration
export interface BookingStepConfig {
    id: BookingStep
    title: string
    description: string
    isCompleted: boolean
    isActive: boolean
}

export interface CostumeRentalInfo {
    id: string
    name: string
    price: number
    image?: string
    description?: string
    category?: string
    size?: string
    [key: string]: any
}

export interface RentalCalculation {
    dailyRate: number
    numberOfDays: number
    subtotal: number
    securityDeposit: number
    tax: number
    total: number

}

