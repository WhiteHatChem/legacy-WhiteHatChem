// Return filename without extension
export function filename(path: string): string {
  return path.replace(/^.*[\\\/]/, '').split('.').slice(0, -1).join('.');
}