/**
 * Utility to check if a Payload RichText object or string actually contains non-whitespace text.
 */
export function hasTextContent(data: any): boolean {
  if (!data) return false;

  if (typeof data === 'string') {
    return data.trim().length > 0;
  }

  if (typeof data === 'object') {
    if (!data.root || !Array.isArray(data.root.children)) {
      return false;
    }

    const checkNodes = (nodes: any[]): boolean => {
      for (const node of nodes) {
        if (node.type === 'text' && typeof node.text === 'string' && node.text.trim().length > 0) {
          return true;
        }
        if (Array.isArray(node.children) && node.children.length > 0) {
          if (checkNodes(node.children)) return true;
        }
      }
      return false;
    };

    return checkNodes(data.root.children);
  }

  return false;
}
