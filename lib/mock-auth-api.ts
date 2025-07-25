import { mockUser, type AuthUser } from "./mock-data"

export type { AuthUser } from "./mock-data"

export async function signUp(
  name: string,
  email: string,
  password: string,
  phone: string,
): Promise<{ user: AuthUser | null; error: string | null }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // For demo purposes, always return success with mock user data
  const newUser: AuthUser = {
    id: `user-${Date.now()}`,
    name,
    email,
    phone
  }
  
  return { user: newUser, error: null }
}

export async function signIn(
  email: string,
  password: string,
): Promise<{ user: AuthUser | null; error: string | null }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600))
  
  // For demo purposes, always return the mock user
  // In a real app, you would validate credentials
  return { user: mockUser, error: null }
}

export async function updateProfile(
  userId: string,
  updates: Partial<Pick<AuthUser, "name" | "phone">>,
): Promise<{ user: AuthUser | null; error: string | null }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Return updated mock user
  const updatedUser: AuthUser = {
    ...mockUser,
    ...updates
  }
  
  return { user: updatedUser, error: null }
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<{ success: boolean; error: string | null }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700))
  
  // For demo purposes, always return success
  return { success: true, error: null }
}