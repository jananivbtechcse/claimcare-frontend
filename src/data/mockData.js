
export const users = [
  { userId: 1, fullName: "Janani", email: "janani@gmail.com", phoneNumber: "9876543210", role: "Patient", createdAt: "2024-01-01" },
  { userId: 2, fullName: "Dr. Kumar", email: "kumar@gmail.com", phoneNumber: "9123456780", role: "HealthcareProvider", createdAt: "2024-01-02" },
  { userId: 3, fullName: "Rahul Sharma", email: "rahul@gmail.com", phoneNumber: "9000000001", role: "Patient", createdAt: "2024-01-05" },
  { userId: 4, fullName: "Dr. Meena", email: "meena@gmail.com", phoneNumber: "9000000002", role: "HealthcareProvider", createdAt: "2024-01-10" },
  { userId: 5, fullName: "Arun Kumar", email: "arun@gmail.com", phoneNumber: "9000000003", role: "Patient", createdAt: "2024-01-12" },
  { userId: 6, fullName: "Admin User", email: "admin@claimcare.com", phoneNumber: "9000000004", role: "Admin", createdAt: "2024-01-15" },


  { userId: 7, fullName: "LIC India", email: "support@lic.com", phoneNumber: "1800123456", role: "InsuranceCompany", createdAt: "2024-01-18" },
  { userId: 8, fullName: "Star Health", email: "care@starhealth.in", phoneNumber: "18004252255", role: "InsuranceCompany", createdAt: "2024-01-20" },
  { userId: 9, fullName: "HDFC ERGO", email: "support@hdfc.com", phoneNumber: "18002666400", role: "InsuranceCompany", createdAt: "2024-01-22" },
  { userId: 10, fullName: "ICICI Lombard", email: "support@icici.com", phoneNumber: "18002666", role: "InsuranceCompany", createdAt: "2024-01-25" }
];



export const patients = [
  { patientId: 1, userId: 1, gender: "Female", address: "Chennai", symptoms: "Fever, Cold" },
  { patientId: 2, userId: 3, gender: "Male", address: "Bangalore", symptoms: "Headache" },
  { patientId: 3, userId: 5, gender: "Male", address: "Hyderabad", symptoms: "Back Pain" }
];



export const healthcareProviders = [
  { providerId: 1, userId: 2, hospitalName: "Apollo Hospital", licenseNumber: "LIC12345", address: "Chennai" },
  { providerId: 2, userId: 4, hospitalName: "Global Health Clinic", licenseNumber: "LIC67890", address: "Bangalore" }
];



export const insuranceCompanies = [
  { insuranceCompanyId: 1, userId: 7, registrationNumber: "REG123", address: "Delhi", isActive: true },
  { insuranceCompanyId: 2, userId: 8, registrationNumber: "REG456", address: "Chennai", isActive: true },
  { insuranceCompanyId: 3, userId: 9, registrationNumber: "REG789", address: "Mumbai", isActive: true },
  { insuranceCompanyId: 4, userId: 10, registrationNumber: "REG321", address: "Bangalore", isActive: false }
];



export const invoices = [
  { invoiceId: 1, invoiceNumber: "INV-001", patientId: 1, totalAmount: 5000, status: "Pending" },
  { invoiceId: 2, invoiceNumber: "INV-002", patientId: 2, totalAmount: 3000, status: "Paid" },
  { invoiceId: 3, invoiceNumber: "INV-003", patientId: 3, totalAmount: 7000, status: "Pending" }
];



export const claims = [
  { claimId: 1, claimNumber: "CLM-001", patientId: 1, invoiceId: 1, totalAmount: 5000, claimAmount: 4000, status: "Pending" },
  { claimId: 2, claimNumber: "CLM-002", patientId: 2, invoiceId: 2, totalAmount: 3000, claimAmount: 2500, status: "Approved" },
  { claimId: 3, claimNumber: "CLM-003", patientId: 3, invoiceId: 3, totalAmount: 7000, claimAmount: 6000, status: "Rejected" }
];


export const payments = [
  { paymentId: 1, claimId: 1, paymentAmount: 4000, paymentType: "UPI", transactionReference: "TXN123" },
  { paymentId: 2, claimId: 2, paymentAmount: 2500, paymentType: "Card", transactionReference: "TXN456" },
  { paymentId: 3, claimId: 3, paymentAmount: 6000, paymentType: "BankTransfer", transactionReference: "TXN789" }
];