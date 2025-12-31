/**
 * Window interface extensions for global functions
 */

interface JournalOverlayData {
  date: string;
  title: string;
  content: string;
}

interface Window {
  openJournalOverlay?: (data: JournalOverlayData) => void;
  openJournalTimeline?: () => void;
}
