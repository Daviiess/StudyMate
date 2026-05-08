export function formatTime(dateInput) {
  const date = new Date(dateInput);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',   
    day: 'numeric',   
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
 }
export const formatTimeAgo = (dateString) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInMs = now - past;
  
  const diffInMins = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMins < 1) return 'just now';
  if (diffInMins < 60) return `${diffInMins}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays === 1) return 'yesterday';
  return `${diffInDays} days ago`;
};
export const formatFileSize = (bytes) => {
    if(bytes === undefined || bytes === null) return 'N/A';
    const units = ['B' , 'KB' , 'MB' , 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while(size >= 1024 && unitIndex < units.length - 1){
        size /= 1024;
        unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
}
export const truncateTitle = (title, maxLength = 20) => {
  if (title?.length <= maxLength) return title;
  return title?.substring(0, maxLength) + "...";
};