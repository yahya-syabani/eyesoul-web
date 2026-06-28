/**
 * Simple utility to extract text from Payload v3 Lexical JSON
 * Safely handles nulls, strings, and complex nested nodes.
 */
export function extractLexicalText(node: any): string {
  if (!node) return "";
  if (typeof node === "string") return node;
  if (node.text) return node.text;
  if (Array.isArray(node.children)) {
    return node.children.map(extractLexicalText).join(" ");
  }
  if (node.root) {
    return extractLexicalText(node.root);
  }
  return "";
}
