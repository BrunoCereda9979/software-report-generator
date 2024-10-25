import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ApiResponse } from "@/types/software";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';


// Extend RequestInit to create our custom options
interface FetchOptions extends Omit<RequestInit, 'method' | 'body'> {
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: Record<string, any>;  // Changed from 'object' to be more specific
}

export async function fetchApi<T>(
  endpoint: string,
  options: Partial<FetchOptions> = {}
): Promise<ApiResponse<T>> {
  const {
    method = 'GET',
    headers = {},
    body,
    ...restOptions
  } = options;

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`;

  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...restOptions,
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, fetchOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }

    return { data, error: null };
  } catch (error) {
    console.error('API call failed:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}