export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      images: {
        Row: {
          content_type: string
          created_at: string | null
          height: number
          id: string
          prompt: string
          series_id: string
          title: string
          url: string
          width: number
        }
        Insert: {
          content_type: string
          created_at?: string | null
          height: number
          id?: string
          prompt: string
          series_id: string
          title: string
          url: string
          width: number
        }
        Update: {
          content_type?: string
          created_at?: string | null
          height?: number
          id?: string
          prompt?: string
          series_id?: string
          title?: string
          url?: string
          width?: number
        }
        Relationships: [
          {
            foreignKeyName: "images_series_id_fkey"
            columns: ["series_id"]
            referencedRelation: "series"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          google_access_token: string | null
          google_refresh_token: string | null
          id: string
        }
        Insert: {
          google_access_token?: string | null
          google_refresh_token?: string | null
          id: string
        }
        Update: {
          google_access_token?: string | null
          google_refresh_token?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      series: {
        Row: {
          created_at: string | null
          id: string
          prompt: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          prompt: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          prompt?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      videos: {
        Row: {
          created_at: string | null
          description: string
          id: string
          series_id: string
          status: string
          thumbnail_url: string
          title: string
          updated_at: string | null
          video_url: string | null
          youtube_comments: number | null
          youtube_description: string | null
          youtube_likes: number | null
          youtube_playlist_id: string | null
          youtube_title: string | null
          youtube_uploaded_at: string | null
          youtube_video_id: string | null
          youtube_views: number | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          series_id: string
          status: string
          thumbnail_url: string
          title: string
          updated_at?: string | null
          video_url?: string | null
          youtube_comments?: number | null
          youtube_description?: string | null
          youtube_likes?: number | null
          youtube_playlist_id?: string | null
          youtube_title?: string | null
          youtube_uploaded_at?: string | null
          youtube_video_id?: string | null
          youtube_views?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          series_id?: string
          status?: string
          thumbnail_url?: string
          title?: string
          updated_at?: string | null
          video_url?: string | null
          youtube_comments?: number | null
          youtube_description?: string | null
          youtube_likes?: number | null
          youtube_playlist_id?: string | null
          youtube_title?: string | null
          youtube_uploaded_at?: string | null
          youtube_video_id?: string | null
          youtube_views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "videos_series_id_fkey"
            columns: ["series_id"]
            referencedRelation: "series"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buckets_owner_fkey"
            columns: ["owner"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

