export interface StrapiError {
  status: number;
  name: string;
  message: string;
  details: Record<string, string>;
}
