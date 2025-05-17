"use client"

import type React from "react"

import { useProfileForm } from "@/features/setting/hooks/useProfileForm"
import { ProfileFormView } from "@/features/setting/ui/ProfileFormView"

interface ProfileFormProps {
  profile: any
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const formProps = useProfileForm(profile)
  return <ProfileFormView {...formProps} profile={profile} />
}
