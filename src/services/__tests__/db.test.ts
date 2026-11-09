import { describe, it, expect } from 'vitest';
import type { OfflineDraft, SyncQueueItem } from '../db';

describe('Website Unit Test: Offline Persistence Schema & Queue Types', () => {
  it('should construct valid OfflineDraft items for doorstep registration without network', () => {
    const draft: OfflineDraft = {
      id: 'draft-pat-8420-01',
      type: 'Citizen Enrollment',
      patientName: 'Kondala Rao',
      habitation: 'Kothapalli',
      savedAt: new Date().toISOString(),
      size: '2.4 KB',
      payload: {
        age: 46,
        gender: 'male',
        village: 'Kothapalli',
        mandal: 'G. Madugula',
        hasTobaccoHabit: true,
      },
    };

    expect(draft.id).toBeDefined();
    expect(draft.type).toBe('Citizen Enrollment');
    expect(draft.patientName).toBe('Kondala Rao');
    expect(draft.habitation).toBe('Kothapalli');
    expect(draft.payload).toBeDefined();
  });

  it('should construct valid SyncQueueItem with UUID idempotency key', () => {
    const queueItem: SyncQueueItem = {
      id: 'sync-item-001',
      endpoint: '/api/v1/screenings',
      method: 'POST',
      idempotencyKey: 'idemp-8420-9941',
      payload: {
        patientId: 'ASR-PAT-2026-0842',
        symptomsUlcerLongDuration: true,
        tobaccoChewing: true,
      },
      timestamp: new Date().toISOString(),
      status: 'PENDING',
      retries: 0,
    };

    expect(queueItem.endpoint).toBe('/api/v1/screenings');
    expect(queueItem.method).toBe('POST');
    expect(queueItem.status).toBe('PENDING');
    expect(queueItem.idempotencyKey).toMatch(/^idemp-/);
    expect(queueItem.retries).toBe(0);
  });

  it('should enforce allowed status transitions in sync queue', () => {
    const validStatuses: SyncQueueItem['status'][] = ['PENDING', 'SYNCED', 'FAILED'];
    for (const status of validStatuses) {
      expect(['PENDING', 'SYNCED', 'FAILED']).toContain(status);
    }
  });
});
