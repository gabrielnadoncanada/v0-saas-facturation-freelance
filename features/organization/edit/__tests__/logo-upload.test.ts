import { describe, it, expect, vi, beforeEach } from 'vitest';
import { uploadLogoAction } from '../actions/uploadLogo.action';
import { deleteLogoAction } from '../actions/deleteLogo.action';

// Mock the dependencies
vi.mock('@/shared/utils/getSessionUser', () => ({
  getSessionUser: vi.fn(() => ({
    supabase: {
      storage: {
        from: vi.fn(() => ({
          upload: vi.fn(() => ({ data: { path: 'test-path' }, error: null })),
          getPublicUrl: vi.fn(() => ({ data: { publicUrl: 'https://test-url.com/logo.png' } })),
          remove: vi.fn(() => ({ error: null })),
        })),
      },
    },
    organization: {
      id: 'test-org-id',
      name: 'Test Organization',
      logo_url: 'https://test-url.com/old-logo.png',
    },
  })),
}));

vi.mock('@/shared/services/supabase/crud', () => ({
  updateRecord: vi.fn(() => Promise.resolve({})),
}));

vi.mock('@/shared/utils/withAction', () => ({
  withAction: vi.fn((fn) => fn()),
}));

describe('Logo Upload Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('uploadLogoAction', () => {
    it('should upload a logo successfully', async () => {
      const formData = new FormData();
      const mockFile = new File(['test'], 'logo.png', { type: 'image/png' });
      formData.append('logo', mockFile);

      const result = await uploadLogoAction(formData);

      expect(result).toBe('https://test-url.com/logo.png');
    });

    it('should throw error for non-image files', async () => {
      const formData = new FormData();
      const mockFile = new File(['test'], 'document.pdf', { type: 'application/pdf' });
      formData.append('logo', mockFile);

      await expect(uploadLogoAction(formData)).rejects.toThrow('Le fichier doit être une image');
    });

    it('should throw error for files larger than 2MB', async () => {
      const formData = new FormData();
      // Create a mock file larger than 2MB
      const largeFile = new File(['x'.repeat(3 * 1024 * 1024)], 'large-logo.png', { type: 'image/png' });
      formData.append('logo', largeFile);

      await expect(uploadLogoAction(formData)).rejects.toThrow('Le fichier ne doit pas dépasser 2MB');
    });
  });

  describe('deleteLogoAction', () => {
    it('should delete a logo successfully', async () => {
      const result = await deleteLogoAction();

      expect(result).toBeNull();
    });
  });
}); 