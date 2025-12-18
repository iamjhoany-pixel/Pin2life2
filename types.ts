
export interface ActionPlan {
  goal: string;
  weeklyPlan: {
    day: string;
    actions: string[];
  }[];
  firstSteps: string[];
  suggestedHabits: string[];
}

export interface User {
  email: string;
  isLoggedIn: boolean;
}

export enum AppState {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  PROCESSING = 'PROCESSING',
  RESULT = 'RESULT'
}
