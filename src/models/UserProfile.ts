import type { UserProfileDto } from "./Accounts";
import type { TaskDto } from "./Tasks";
import type { ProjectDto } from "./Projects";
import type { ContractsDto } from "./Contracts";
import type { InvoicesDto } from "./Invoices";
import type { FreelancerDetailsData } from "./Ui";
import type { NavigateFunction } from "react-router-dom";

type UserRole = "Client" | "Freelancer";

interface ForeignLanguageDto {
  language: string;
}
interface BaseUpdateProfile {
  addressCountry?: string;
  addressStreet?: string;
  addressStreetNumber?: string;
  addressCity?: string;
  addressZip?: string;
  bio?: string;
  image?: string;
}
interface BaseProfileDto {
  id: number;
  user: UserProfileDto;
  address: AddressDto;
  bio: string;
  project?: ProjectDto[];
  contracts?: ContractsDto[];
  invoices?: InvoicesDto[];
  image: string;
  isVerified: boolean;
}

interface FreelancerData {
  programmingLanguages: string[];
  foreignLanguages: string[];
  experience: string;
  rate: number;
  currency: string;
  portfolioUrl: string;
}

interface CreateFreelancerProfileRequest {
  address: AddressData;
  user: UserData;
  freelancer: FreelancerData;
}

interface FreelancerProfileDto extends BaseProfileDto {
  tasks: TaskDto[];
  skills: SkillDto[];
  foreignLanguages: ForeignLanguageDto[];
  isAvailable: boolean;
  experience: string;
  rate: number;
  currency: string;
  rating: number;
  portfolioUrl: string;
}

interface UpdateFreelancerProfileRequest extends BaseUpdateProfile {
  programingLanguages?: string[];
  areas?: string[];
  foreignLanguages?: string[];
  experience?: string;
  rate: number;
  currency?: string;
  rating: number;
  portfolioUrl?: string;
}

interface AddressData {
  addressCountry: string;
  addressStreet: string;
  addressStreetNumber: string;
  addressCity: string;
  addressZip: string;
}

interface UserData {
  bio: string;
  image: string;
}
interface CreateClientProfileRequest {
  address: AddressData;
  user: UserData;
}
interface AddressDto {
  id: number;
  country: string;
  city: string;
  street: string;
  streetNumber: string;
  zipCode: string;
}

interface PatchUserProfileAddressRequest {
  profileId: number;
  address: AddressDto;
}

interface PatchFreelancerProfielRequest {
  profileId: number;
  freelancerData: FreelancerDetailsData;
}

interface ClientProfileDto extends BaseProfileDto {}

interface UpdateClientProfileRequest extends BaseUpdateProfile {}

interface SkillDto {
  id?: number;
  programmingLanguage: string;
  area: string;
}

interface GetSkillsResult {
  skills: SkillDto[];
}
interface VerifyFaceResult {
  isMatch: boolean;
  similarity: number;
}
interface FaceVerificationRequest {
  faceBase64Image: string;
}
interface VerifyFacePayload {
  faceVerificationRequest: FaceVerificationRequest;
  role: UserRole;
  profile: FreelancerProfileDto | ClientProfileDto;
}

interface VerifyFaceRequest {
  faceVerificationRequest: FaceVerificationRequest;
  profile: ClientProfileDto | FreelancerProfileDto;
  navigate: NavigateFunction;
}

export type {
  CreateClientProfileRequest,
  ClientProfileDto,
  UpdateClientProfileRequest,
  CreateFreelancerProfileRequest,
  FreelancerProfileDto,
  UpdateFreelancerProfileRequest,
  SkillDto,
  ForeignLanguageDto,
  AddressData,
  UserData,
  FreelancerData,
  VerifyFaceResult,
  VerifyFacePayload,
  FaceVerificationRequest,
  AddressDto,
  PatchFreelancerProfielRequest,
  PatchUserProfileAddressRequest,
  GetSkillsResult,
  UserRole,
  VerifyFaceRequest,
};
