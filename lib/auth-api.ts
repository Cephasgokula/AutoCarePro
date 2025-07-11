import { supabase } from "./supabase-client"
import bcrypt from "bcryptjs"

export interface AuthUser {
  id: string
  name: string
  email: string
  phone: string
}

export async function signUp(
  name: string,
  email: string,
  password: string,
  phone: string,
): Promise<{ user: AuthUser | null; error: string | null }> {
  try {
    // Check if user already exists
    const { data: existingUser } = await supabase.from("users").select("id").eq("email", email).single()

    if (existingUser) {
      return { user: null, error: "User with this email already exists" }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Insert new user
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          name,
          email,
          phone,
          password_hash: passwordHash,
        },
      ])
      .select("id, name, email, phone")
      .single()

    if (error) {
      return { user: null, error: error.message }
    }

    return { user: data, error: null }
  } catch (error) {
    return { user: null, error: "Failed to create account" }
  }
}

export async function signIn(
  email: string,
  password: string,
): Promise<{ user: AuthUser | null; error: string | null }> {
  try {
    // Get user with password hash
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, name, email, phone, password_hash")
      .eq("email", email)
      .single()

    if (userError || !userData) {
      return { user: null, error: "Invalid email or password" }
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, userData.password_hash)

    if (!isValidPassword) {
      return { user: null, error: "Invalid email or password" }
    }

    // Return user without password hash
    const { password_hash, ...user } = userData
    return { user, error: null }
  } catch (error) {
    return { user: null, error: "Failed to sign in" }
  }
}

export async function updateProfile(
  userId: string,
  updates: Partial<Pick<AuthUser, "name" | "phone">>,
): Promise<{ user: AuthUser | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from("users")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select("id, name, email, phone")
      .single()

    if (error) {
      return { user: null, error: error.message }
    }

    return { user: data, error: null }
  } catch (error) {
    return { user: null, error: "Failed to update profile" }
  }
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<{ success: boolean; error: string | null }> {
  try {
    // Get current password hash
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("password_hash")
      .eq("id", userId)
      .single()

    if (userError || !userData) {
      return { success: false, error: "User not found" }
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, userData.password_hash)

    if (!isValidPassword) {
      return { success: false, error: "Current password is incorrect" }
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 12)

    // Update password
    const { error: updateError } = await supabase
      .from("users")
      .update({
        password_hash: newPasswordHash,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    return { success: true, error: null }
  } catch (error) {
    return { success: false, error: "Failed to change password" }
  }
}
