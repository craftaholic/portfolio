/**
 * Product status labels and CSS class mappings
 */

export type ProductStatus = 'mature' | 'wip' | 'archived';

export const STATUS_LABELS: Record<ProductStatus, string> = {
  mature: 'Mature',
  wip: 'In Progress',
  archived: 'Archived',
};

export const STATUS_CLASSES: Record<ProductStatus, string> = {
  mature: 'status-mature',
  wip: 'status-wip',
  archived: 'status-archived',
};
