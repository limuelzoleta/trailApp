import { Timestamp } from "firebase/firestore"

export interface User {
    id: string,
    email: string
    displayName?: string
}

export interface UserCredential {
    email: string,
    password: string,
    name: string
}

export interface UserPreference {
    minVolumeToPlayAudio: number,
    theme: string,
    iosVoiceProfile: string | null,
    androidVoiceProfile: string | null,
    speechRate: number
}

export interface Comment {
    content: string,
    id?: string,
    speak?: boolean,
    textEdited?: boolean
    createdTime?: Timestamp,
    updatedTime?: Timestamp
}