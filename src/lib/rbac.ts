import { Role, User, ContentItem } from './types';
import { useBrandLens } from './store';

export const RBAC = {
  // Navigation visibility
  canAccessInbox: (role: Role): boolean => role === 'REVIEWER' || role === 'BRAND_ADMIN',
  canAccessSettings: (role: Role): boolean => role === 'BRAND_ADMIN',
  
  // Dashboard capabilities
  canCreateContent: (role: Role): boolean => role === 'CREATOR',
  canViewItemOnDashboard: (role: Role, item: ContentItem, userId: string): boolean => {
    if (role === 'CREATOR') {
      return item.author.id === userId || item.author.email === userId;
    }
    if (role === 'VIEWER') {
      return item.status === 'APPROVED' || item.status === 'PUBLISHED';
    }
    return true; // REVIEWER and BRAND_ADMIN view all items
  },

  // Workspace editing and decision authority
  canEditDocument: (role: Role): boolean => role === 'CREATOR',
  canDecideFindings: (role: Role): boolean => role === 'CREATOR',
  canSubmitForReview: (role: Role): boolean => role === 'CREATOR',

  // Review & publication authority
  canRequestChanges: (role: Role): boolean => role === 'REVIEWER',
  canApproveStage1: (role: Role): boolean => role === 'REVIEWER',
  canApproveStage2: (role: Role): boolean => role === 'BRAND_ADMIN',
  canPublish: (role: Role): boolean => role === 'BRAND_ADMIN',

  // Governance & Brand Kit authority
  canEditBrandKit: (role: Role): boolean => role === 'BRAND_ADMIN',
};

export function useRole() {
  const { currentUser } = useBrandLens();
  const role = currentUser.role;

  return {
    role,
    user: currentUser,
    isCreator: role === 'CREATOR',
    isReviewer: role === 'REVIEWER',
    isBrandAdmin: role === 'BRAND_ADMIN',
    isViewer: role === 'VIEWER',

    // Specific permissions
    canAccessInbox: RBAC.canAccessInbox(role),
    canAccessSettings: RBAC.canAccessSettings(role),
    canCreateContent: RBAC.canCreateContent(role),
    canEditDocument: RBAC.canEditDocument(role),
    canDecideFindings: RBAC.canDecideFindings(role),
    canSubmitForReview: RBAC.canSubmitForReview(role),
    canRequestChanges: RBAC.canRequestChanges(role),
    canApproveStage1: RBAC.canApproveStage1(role),
    canApproveStage2: RBAC.canApproveStage2(role),
    canPublish: RBAC.canPublish(role),
    canEditBrandKit: RBAC.canEditBrandKit(role),
    canViewItem: (item: ContentItem) => RBAC.canViewItemOnDashboard(role, item, currentUser.id),
  };
}
